-- Harden the page_layouts and widget_instances system
-- Based on best practices for JSONB layout storage

-- 1. Add validation constraint for layout structure
ALTER TABLE public.page_layouts
  ADD CONSTRAINT page_layouts_layout_is_object
  CHECK (jsonb_typeof(layout) = 'object');

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_layouts_page_id 
  ON public.page_layouts(page_id);

CREATE INDEX IF NOT EXISTS idx_widget_instances_page_id 
  ON public.widget_instances(page_id);

CREATE INDEX IF NOT EXISTS idx_widget_instances_widget_type_id 
  ON public.widget_instances(widget_type_id);

-- 3. Drop old conflicting RLS policies on page_layouts
DROP POLICY IF EXISTS page_layouts_select_policy ON public.page_layouts;
DROP POLICY IF EXISTS page_layouts_write_policy ON public.page_layouts;

-- 4. Create clean RLS policies for page_layouts
CREATE POLICY "page_layouts_read"
ON public.page_layouts
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pages
    JOIN public.portfolios ON pages.portfolio_id = portfolios.id
    WHERE pages.id = page_layouts.page_id
    AND (portfolios.user_id = auth.uid() OR portfolios.is_public = true)
  )
);

CREATE POLICY "page_layouts_write"
ON public.page_layouts
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pages
    JOIN public.portfolios ON pages.portfolio_id = portfolios.id
    WHERE pages.id = page_layouts.page_id
    AND portfolios.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pages
    JOIN public.portfolios ON pages.portfolio_id = portfolios.id
    WHERE pages.id = page_layouts.page_id
    AND portfolios.user_id = auth.uid()
  )
);

-- 5. Update widget_instances RLS policies
DROP POLICY IF EXISTS widget_instances_select_policy ON public.widget_instances;
DROP POLICY IF EXISTS widget_instances_write_policy ON public.widget_instances;

CREATE POLICY "widget_instances_read"
ON public.widget_instances
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pages
    JOIN public.portfolios ON pages.portfolio_id = portfolios.id
    WHERE pages.id = widget_instances.page_id
    AND (portfolios.user_id = auth.uid() OR portfolios.is_public = true)
  )
);

CREATE POLICY "widget_instances_write"
ON public.widget_instances
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pages
    JOIN public.portfolios ON pages.portfolio_id = portfolios.id
    WHERE pages.id = widget_instances.page_id
    AND portfolios.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pages
    JOIN public.portfolios ON pages.portfolio_id = portfolios.id
    WHERE pages.id = widget_instances.page_id
    AND portfolios.user_id = auth.uid()
  )
);

-- 6. Add trigger to auto-set timestamps
CREATE OR REPLACE FUNCTION set_page_layouts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_page_layouts_updated_at ON public.page_layouts;
CREATE TRIGGER trg_set_page_layouts_updated_at
BEFORE UPDATE ON public.page_layouts
FOR EACH ROW
EXECUTE FUNCTION set_page_layouts_updated_at();

CREATE OR REPLACE FUNCTION set_widget_instances_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_widget_instances_updated_at ON public.widget_instances;
CREATE TRIGGER trg_set_widget_instances_updated_at
BEFORE UPDATE ON public.widget_instances
FOR EACH ROW
EXECUTE FUNCTION set_widget_instances_updated_at();

-- 7. Create helper function to load full page layout with widgets
CREATE OR REPLACE FUNCTION get_page_layout_with_widgets(p_page_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'layout', pl.layout,
    'widgets', COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', wi.id,
          'widget_type_id', wi.widget_type_id,
          'widget_key', wt.key,
          'props', wi.props,
          'enabled', wi.enabled
        )
      ) FILTER (WHERE wi.id IS NOT NULL),
      '[]'::jsonb
    )
  )
  INTO result
  FROM public.page_layouts pl
  LEFT JOIN public.widget_instances wi ON wi.page_id = pl.page_id
  LEFT JOIN public.widget_types wt ON wt.id = wi.widget_type_id
  WHERE pl.page_id = p_page_id
  GROUP BY pl.page_id, pl.layout;
  
  RETURN result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_page_layout_with_widgets(uuid) TO authenticated;

COMMENT ON FUNCTION get_page_layout_with_widgets IS 'Loads page layout structure with all associated widget instances in a single query';
