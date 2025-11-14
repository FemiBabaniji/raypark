-- Fix infinite recursion in RLS policies for pages table
-- Drop ALL existing conflicting policies

DROP POLICY IF EXISTS "owners can select own pages" ON public.pages;
DROP POLICY IF EXISTS "owners can modify own pages" ON public.pages;
DROP POLICY IF EXISTS "public can read published pages" ON public.pages;
DROP POLICY IF EXISTS "public can read published pages via route" ON public.pages;
DROP POLICY IF EXISTS "read pages of own or public portfolios" ON public.pages;
DROP POLICY IF EXISTS "write pages of own portfolios" ON public.pages;
DROP POLICY IF EXISTS "demo_pages_select" ON public.pages;
DROP POLICY IF EXISTS "pages_select" ON public.pages;
DROP POLICY IF EXISTS "pages_write" ON public.pages;
DROP POLICY IF EXISTS "public_read_pages" ON public.pages;

-- Create clean, non-overlapping policies
-- 1. SELECT: Users can read their own pages OR public portfolio pages
CREATE POLICY "pages_select_policy"
ON public.pages FOR SELECT
USING (
  portfolio_id IN (
    SELECT id FROM public.portfolios 
    WHERE user_id = auth.uid() OR (is_public = true AND is_demo = false)
  )
  OR is_demo = true
);

-- 2. INSERT/UPDATE/DELETE: Users can only modify their own non-demo pages
CREATE POLICY "pages_write_policy"
ON public.pages FOR ALL
USING (
  portfolio_id IN (
    SELECT id FROM public.portfolios WHERE user_id = auth.uid()
  )
  AND is_demo = false
)
WITH CHECK (
  portfolio_id IN (
    SELECT id FROM public.portfolios WHERE user_id = auth.uid()
  )
  AND is_demo = false
);

-- Fix page_layouts policies (remove overlaps)
DROP POLICY IF EXISTS "owners can select own page layouts" ON public.page_layouts;
DROP POLICY IF EXISTS "owners can modify own page layouts" ON public.page_layouts;
DROP POLICY IF EXISTS "page_layouts_all" ON public.page_layouts;
DROP POLICY IF EXISTS "demo_page_layouts_select" ON public.page_layouts;

CREATE POLICY "page_layouts_select_policy"
ON public.page_layouts FOR SELECT
USING (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid() OR p.is_public = true OR pg.is_demo = true
  )
);

CREATE POLICY "page_layouts_write_policy"
ON public.page_layouts FOR ALL
USING (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid() AND pg.is_demo = false
  )
)
WITH CHECK (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid() AND pg.is_demo = false
  )
);

-- Fix widget_instances policies (remove overlaps)
DROP POLICY IF EXISTS "owners can select own widget instances" ON public.widget_instances;
DROP POLICY IF EXISTS "owners can modify own widget instances" ON public.widget_instances;
DROP POLICY IF EXISTS "widget_instances_all" ON public.widget_instances;
DROP POLICY IF EXISTS "demo_widget_instances_select" ON public.widget_instances;

CREATE POLICY "widget_instances_select_policy"
ON public.widget_instances FOR SELECT
USING (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid() OR p.is_public = true OR pg.is_demo = true
  )
);

CREATE POLICY "widget_instances_write_policy"
ON public.widget_instances FOR ALL
USING (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid() AND pg.is_demo = false
  )
)
WITH CHECK (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid() AND pg.is_demo = false
  )
);
