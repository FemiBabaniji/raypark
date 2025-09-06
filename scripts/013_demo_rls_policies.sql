-- RLS policies for demo data - publicly readable, not editable

-- Portfolios: allow public read of demo portfolios
DROP POLICY IF EXISTS demo_portfolios_select ON public.portfolios;
CREATE POLICY demo_portfolios_select ON public.portfolios
  FOR SELECT
  USING (is_demo = true AND is_public = true);

-- Pages: public read of demo pages
DROP POLICY IF EXISTS demo_pages_select ON public.pages;
CREATE POLICY demo_pages_select ON public.pages
  FOR SELECT
  USING (is_demo = true OR EXISTS (
    SELECT 1 FROM public.portfolios pf
    WHERE pf.id = pages.portfolio_id AND pf.is_demo = true AND pf.is_public = true
  ));

-- Widget instances: inherit via page relationship
DROP POLICY IF EXISTS demo_widget_instances_select ON public.widget_instances;
CREATE POLICY demo_widget_instances_select ON public.widget_instances
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.pages pg 
    WHERE pg.id = widget_instances.page_id
    AND (pg.is_demo = true OR EXISTS (
      SELECT 1 FROM public.portfolios pf 
      WHERE pf.id = pg.portfolio_id AND pf.is_demo = true AND pf.is_public = true
    ))
  ));

-- Media assets: public read for demo assets
DROP POLICY IF EXISTS demo_media_assets_select ON public.media_assets;
CREATE POLICY demo_media_assets_select ON public.media_assets
  FOR SELECT
  USING (is_demo = true OR EXISTS (
    SELECT 1 FROM public.pages pg 
    WHERE pg.id = media_assets.page_id AND pg.is_demo = true
  ));

-- Page layouts: inherit via page relationship
DROP POLICY IF EXISTS demo_page_layouts_select ON public.page_layouts;
CREATE POLICY demo_page_layouts_select ON public.page_layouts
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.pages pg 
    WHERE pg.id = page_layouts.page_id AND pg.is_demo = true
  ));

-- Page versions: inherit via page relationship
DROP POLICY IF EXISTS demo_page_versions_select ON public.page_versions;
CREATE POLICY demo_page_versions_select ON public.page_versions
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.pages pg 
    WHERE pg.id = page_versions.page_id AND pg.is_demo = true
  ));

-- Themes: allow reading demo themes
DROP POLICY IF EXISTS demo_themes_select ON public.themes;
CREATE POLICY demo_themes_select ON public.themes
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.portfolios pf 
    WHERE pf.theme_id = themes.id AND pf.is_demo = true AND pf.is_public = true
  ));

-- Lock demo data from writes (only service role can modify)
DROP POLICY IF EXISTS lock_demo_portfolios ON public.portfolios;
CREATE POLICY lock_demo_portfolios ON public.portfolios
  FOR ALL
  USING (true)
  WITH CHECK (is_demo = false OR current_setting('role') = 'service_role');
