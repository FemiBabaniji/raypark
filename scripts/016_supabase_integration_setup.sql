-- Themes: encode the 7-color translucent palette
INSERT INTO public.themes (id, user_id, name, tokens)
VALUES (
  gen_random_uuid(),
  null, -- global theme
  'Translucent 7',
  jsonb_build_object(
    'gradients', jsonb_build_array(
      'from-rose-400/40 to-rose-600/60',
      'from-blue-400/40 to-blue-600/60', 
      'from-purple-400/40 to-purple-600/60',
      'from-green-400/40 to-green-600/60',
      'from-orange-400/40 to-orange-600/60',
      'from-teal-400/40 to-teal-600/60',
      'from-neutral-400/40 to-neutral-600/60'
    ),
    'default_card_gradient_index', 0
  )
) ON CONFLICT DO NOTHING;

-- Widget library setup
INSERT INTO public.widget_types (id, key, name, schema_json, render_hint, created_at)
VALUES
  (gen_random_uuid(), 'profile', 'Profile', '{
     "type":"object",
     "properties":{
       "avatarUrl":{"type":"string"},
       "name":{"type":"string"},
       "title":{"type":"string"},
       "subtitle":{"type":"string"},
       "social":{"type":"array","items":{"type":"string"}}
     }
   }', '{"bg":"theme","density":"spacious"}', now()),
  (gen_random_uuid(), 'education', 'Education', '{"type":"object","properties":{"items":{"type":"array"}}}', '{}', now()),
  (gen_random_uuid(), 'work-experience', 'Work Experience', '{"type":"object","properties":{"items":{"type":"array"}}}', '{}', now()),
  (gen_random_uuid(), 'projects', 'Projects', '{"type":"object","properties":{"groups":{"type":"array"}}}', '{}', now()),
  (gen_random_uuid(), 'services', 'Services', '{"type":"object","properties":{"text":{"type":"string"}}}', '{}', now()),
  (gen_random_uuid(), 'description', 'Description', '{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}}}', '{}', now()),
  (gen_random_uuid(), 'gallery', 'Gallery', '{"type":"object","properties":{"groups":{"type":"array"}}}', '{}', now())
ON CONFLICT (key) DO NOTHING;

-- RLS Policies
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner can read own portfolios"
ON public.portfolios FOR SELECT
USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "owner can write own portfolios"
ON public.portfolios FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "owner can update own portfolios"
ON public.portfolios FOR UPDATE USING (user_id = auth.uid());

-- Pages RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read pages of own or public portfolios"
ON public.pages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.portfolios p
    WHERE p.id = pages.portfolio_id AND (p.user_id = auth.uid() OR p.is_public = true)
  )
);

CREATE POLICY "write pages of own portfolios"
ON public.pages FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = pages.portfolio_id AND p.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = pages.portfolio_id AND p.user_id = auth.uid())
);

-- Widget instances RLS
ALTER TABLE public.widget_instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read widgets of own/public portfolios"
ON public.widget_instances FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE pg.id = widget_instances.page_id AND (p.user_id = auth.uid() OR p.is_public = true)
  )
);

CREATE POLICY "write widgets of own portfolios"
ON public.widget_instances FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE pg.id = widget_instances.page_id AND p.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE pg.id = widget_instances.page_id AND p.user_id = auth.uid()
  )
);

-- Page layouts RLS
ALTER TABLE public.page_layouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read/write layout of own portfolios"
ON public.page_layouts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE pg.id = page_layouts.page_id AND p.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE pg.id = page_layouts.page_id AND p.user_id = auth.uid()
  )
);

-- Themes RLS
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read public or own themes"
ON public.themes FOR SELECT
USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "write own themes"
ON public.themes FOR ALL
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Media assets RLS
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read/write own media"
ON public.media_assets FOR ALL
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_pages_portfolio_id ON public.pages(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_page_layouts_page_id ON public.page_layouts(page_id);
CREATE INDEX IF NOT EXISTS idx_widget_instances_page_id ON public.widget_instances(page_id);
CREATE INDEX IF NOT EXISTS idx_widget_instances_widget_type_id ON public.widget_instances(widget_type_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_user_id ON public.media_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_widget_instance_id ON public.media_assets(widget_instance_id);
