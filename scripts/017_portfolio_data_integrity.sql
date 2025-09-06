-- Portfolio system data integrity and performance improvements
-- Run this migration to fix template persistence and improve data consistency

-- 1) per-user slug uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolios_user_slug
  ON public.portfolios (user_id, slug) WHERE slug IS NOT NULL;

-- 2) route uniqueness per portfolio
CREATE UNIQUE INDEX IF NOT EXISTS idx_pages_portfolio_route
  ON public.pages (portfolio_id, route) WHERE route IS NOT NULL;

-- 3) cascades
ALTER TABLE public.pages
  DROP CONSTRAINT IF EXISTS pages_portfolio_id_fkey,
  ADD  CONSTRAINT pages_portfolio_id_fkey
  FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id) ON DELETE CASCADE;

ALTER TABLE public.page_layouts
  DROP CONSTRAINT IF EXISTS page_layouts_page_id_fkey,
  ADD  CONSTRAINT page_layouts_page_id_fkey
  FOREIGN KEY (page_id) REFERENCES public.pages(id) ON DELETE CASCADE;

ALTER TABLE public.widget_instances
  DROP CONSTRAINT IF EXISTS widget_instances_page_id_fkey,
  ADD  CONSTRAINT widget_instances_page_id_fkey
  FOREIGN KEY (page_id) REFERENCES public.pages(id) ON DELETE CASCADE;

-- 4) layout shape check
ALTER TABLE public.page_layouts
  ADD CONSTRAINT page_layouts_layout_shape_chk
  CHECK (
    layout ? 'left'  AND jsonb_typeof(layout->'left')  = 'array' AND
    layout ? 'right' AND jsonb_typeof(layout->'right') = 'array'
  );

-- 5) layout id validator
CREATE OR REPLACE FUNCTION public.validate_layout_widget_ids()
RETURNS trigger AS $$
DECLARE wid uuid;
BEGIN
  FOR wid IN
    SELECT elem::uuid FROM jsonb_array_elements_text(NEW.layout->'left') t(elem)
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.widget_instances wi
                   WHERE wi.id = wid AND wi.page_id = NEW.page_id) THEN
      RAISE EXCEPTION 'layout.left contains invalid widget id % for page %', wid, NEW.page_id;
    END IF;
  END LOOP;

  FOR wid IN
    SELECT elem::uuid FROM jsonb_array_elements_text(NEW.layout->'right') t(elem)
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.widget_instances wi
                   WHERE wi.id = wid AND wi.page_id = NEW.page_id) THEN
      RAISE EXCEPTION 'layout.right contains invalid widget id % for page %', wid, NEW.page_id;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_layout_widget_ids ON public.page_layouts;
CREATE TRIGGER trg_validate_layout_widget_ids
BEFORE INSERT OR UPDATE ON public.page_layouts
FOR EACH ROW EXECUTE FUNCTION public.validate_layout_widget_ids();

-- 6) helper to resolve widget type by key
CREATE OR REPLACE FUNCTION public.get_widget_type_id(widget_key TEXT)
RETURNS UUID AS $$
DECLARE type_id UUID;
BEGIN
  SELECT id INTO type_id FROM public.widget_types WHERE key = widget_key;
  IF type_id IS NULL THEN
    RAISE EXCEPTION 'Widget type with key % not found', widget_key;
  END IF;
  RETURN type_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- 7) RPC: add widget + place it
CREATE OR REPLACE FUNCTION public.add_widget_to_page(
  p_page_id uuid,
  p_widget_key text,
  p_props jsonb,
  p_column text,     -- 'left' | 'right'
  p_position int     -- 0-based, NULL = append
) RETURNS uuid AS $$
DECLARE v_type_id uuid; v_instance_id uuid; v_layout jsonb; v_arr jsonb;
BEGIN
  SELECT id INTO v_type_id FROM public.widget_types WHERE key = p_widget_key;
  IF v_type_id IS NULL THEN RAISE EXCEPTION 'Unknown widget key: %', p_widget_key; END IF;

  INSERT INTO public.widget_instances (page_id, widget_type_id, props, enabled)
  VALUES (p_page_id, v_type_id, COALESCE(p_props, '{}'::jsonb), true)
  RETURNING id INTO v_instance_id;

  SELECT layout INTO v_layout FROM public.page_layouts WHERE page_id = p_page_id FOR UPDATE;
  IF v_layout IS NULL THEN
    INSERT INTO public.page_layouts (page_id, layout)
    VALUES (p_page_id, jsonb_build_object('left','[]'::jsonb,'right','[]'::jsonb))
    ON CONFLICT (page_id) DO NOTHING;
    SELECT layout INTO v_layout FROM public.page_layouts WHERE page_id = p_page_id FOR UPDATE;
  END IF;

  v_arr := v_layout->p_column;
  IF jsonb_typeof(v_arr) <> 'array' THEN
    RAISE EXCEPTION 'Layout column % is not an array', p_column;
  END IF;

  IF p_position IS NULL THEN
    v_arr := v_arr || to_jsonb(v_instance_id::text);
  ELSE
    v_arr := (
      SELECT jsonb_agg(x) FROM (
        SELECT CASE WHEN i = p_position THEN to_jsonb(v_instance_id::text)
                    ELSE (v_arr->i) END AS x
        FROM generate_series(0, jsonb_array_length(v_arr)) AS g(i)
      ) s
    );
  END IF;

  v_layout := jsonb_set(v_layout, ARRAY[p_column], v_arr, false);
  UPDATE public.page_layouts SET layout = v_layout WHERE page_id = p_page_id;

  RETURN v_instance_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8) RPC: remove widget + clean layout
CREATE OR REPLACE FUNCTION public.remove_widget_from_page(p_instance_id uuid)
RETURNS void AS $$
DECLARE v_page uuid; v_layout jsonb;
BEGIN
  SELECT page_id INTO v_page FROM public.widget_instances WHERE id = p_instance_id;
  IF v_page IS NULL THEN RETURN; END IF;

  SELECT layout INTO v_layout FROM public.page_layouts WHERE page_id = v_page FOR UPDATE;

  IF v_layout IS NOT NULL THEN
    v_layout := jsonb_set(
      jsonb_set(
        v_layout, '{left}',
        (SELECT COALESCE(jsonb_agg(x),'[]'::jsonb)
         FROM jsonb_array_elements_text(v_layout->'left') e(x)
         WHERE x <> p_instance_id::text)
      ),
      '{right}',
      (SELECT COALESCE(jsonb_agg(x),'[]'::jsonb)
       FROM jsonb_array_elements_text(v_layout->'right') e(x)
       WHERE x <> p_instance_id::text)
    );
    UPDATE public.page_layouts SET layout = v_layout WHERE page_id = v_page;
  END IF;

  DELETE FROM public.widget_instances WHERE id = p_instance_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9) public view for read
CREATE OR REPLACE VIEW public.public_portfolio_by_slug AS
SELECT
  p.slug,
  p.id        AS portfolio_id,
  p.name      AS portfolio_name,
  p.theme_id,
  jsonb_build_object('id', t.id, 'name', t.name, 'tokens', t.tokens) AS theme,
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', pg.id,
        'key', pg.key,
        'title', pg.title,
        'route', pg.route,
        'layout', pl.layout,
        'widgets', (
          SELECT jsonb_agg(to_jsonb(wi.*) || jsonb_build_object('widget_type', to_jsonb(wt.*)))
          FROM public.widget_instances wi
          JOIN public.widget_types wt ON wt.id = wi.widget_type_id
          WHERE wi.page_id = pg.id AND wi.enabled = true
        )
      )
      ORDER BY pg.created_at
    )
    FROM public.pages pg
    LEFT JOIN public.page_layouts pl ON pl.page_id = pg.id
    WHERE pg.portfolio_id = p.id
  ) AS pages
FROM public.portfolios p
LEFT JOIN public.themes t ON t.id = p.theme_id
WHERE p.is_public = true;

-- 10) RLS read policies
ALTER TABLE public.widget_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY read_widget_types ON public.widget_types FOR SELECT USING (true);

CREATE POLICY public_read_portfolios ON public.portfolios FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY public_read_pages ON public.pages FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.portfolios p
  WHERE p.id = pages.portfolio_id AND (p.is_public = true OR auth.uid() = p.user_id)
));

CREATE POLICY public_read_layouts ON public.page_layouts FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.pages pg
  JOIN public.portfolios p ON p.id = pg.portfolio_id
  WHERE pg.id = page_layouts.page_id AND (p.is_public = true OR auth.uid() = p.user_id)
));

CREATE POLICY public_read_widgets ON public.widget_instances FOR SELECT
USING (enabled = true AND EXISTS (
  SELECT 1 FROM public.pages pg
  JOIN public.portfolios p ON p.id = pg.portfolio_id
  WHERE pg.id = widget_instances.page_id AND (p.is_public = true OR auth.uid() = p.user_id)
));

-- 11) indexes
CREATE INDEX IF NOT EXISTS idx_portfolios_user          ON public.portfolios (user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug_public   ON public.portfolios (slug, is_public);
CREATE INDEX IF NOT EXISTS idx_pages_portfolio          ON public.pages (portfolio_id);
CREATE INDEX IF NOT EXISTS idx_layouts_page             ON public.page_layouts (page_id);
CREATE INDEX IF NOT EXISTS idx_widgets_page             ON public.widget_instances (page_id);
CREATE INDEX IF NOT EXISTS idx_widgets_type             ON public.widget_instances (widget_type_id);
