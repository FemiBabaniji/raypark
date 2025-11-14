-- Fix RLS policies for authenticated users to create pages
-- The issue: Multiple overlapping policies are blocking INSERT operations

-- Drop ALL existing policies on pages table to start clean
DROP POLICY IF EXISTS "pages_select_policy_old" ON public.pages;
DROP POLICY IF EXISTS "pages_delete_own" ON public.pages;
DROP POLICY IF EXISTS "pages_insert_own" ON public.pages;
DROP POLICY IF EXISTS "pages_write_policy" ON public.pages;
DROP POLICY IF EXISTS "pages_select_policy" ON public.pages;
DROP POLICY IF EXISTS "pages_update_own" ON public.pages;
DROP POLICY IF EXISTS "pages_select_own" ON public.pages;
DROP POLICY IF EXISTS "owners can select own pages" ON public.pages;
DROP POLICY IF EXISTS "owners can modify own pages" ON public.pages;
DROP POLICY IF EXISTS "public can read published pages" ON public.pages;
DROP POLICY IF EXISTS "public can read published pages via route" ON public.pages;
DROP POLICY IF EXISTS "read pages of own or public portfolios" ON public.pages;
DROP POLICY IF EXISTS "write pages of own portfolios" ON public.pages;
DROP POLICY IF EXISTS "demo_pages_select" ON public.pages;

-- Create simplified, correct policies for pages table

-- 1. SELECT: Users can read pages from their own portfolios, public portfolios, or demo pages
CREATE POLICY "pages_select_own"
ON public.pages FOR SELECT
USING (
  portfolio_id IN (
    SELECT id FROM public.portfolios 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "pages_select_public"
ON public.pages FOR SELECT
USING (
  portfolio_id IN (
    SELECT id FROM public.portfolios 
    WHERE is_public = true
  )
);

-- 2. INSERT: Users can insert pages into their own portfolios
CREATE POLICY "pages_insert_own"
ON public.pages FOR INSERT
WITH CHECK (
  portfolio_id IN (
    SELECT id FROM public.portfolios WHERE user_id = auth.uid()
  )
);

-- 3. UPDATE: Users can update pages in their own portfolios
CREATE POLICY "pages_update_own"
ON public.pages FOR UPDATE
USING (
  portfolio_id IN (
    SELECT id FROM public.portfolios WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  portfolio_id IN (
    SELECT id FROM public.portfolios WHERE user_id = auth.uid()
  )
);

-- 4. DELETE: Users can delete pages from their own portfolios
CREATE POLICY "pages_delete_own"
ON public.pages FOR DELETE
USING (
  portfolio_id IN (
    SELECT id FROM public.portfolios WHERE user_id = auth.uid()
  )
);

-- Also fix widget_instances and page_layouts to match

-- Drop existing widget_instances policies
DROP POLICY IF EXISTS "widget_instances_write_policy" ON public.widget_instances;
DROP POLICY IF EXISTS "widget_instances_select_policy" ON public.widget_instances;

-- Widget instances: SELECT
CREATE POLICY "widget_instances_select_policy"
ON public.widget_instances FOR SELECT
USING (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid() OR p.is_public = true
  )
);

-- Widget instances: INSERT
CREATE POLICY "widget_instances_insert_own"
ON public.widget_instances FOR INSERT
WITH CHECK (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid()
  )
);

-- Widget instances: UPDATE
CREATE POLICY "widget_instances_update_own"
ON public.widget_instances FOR UPDATE
USING (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid()
  )
)
WITH CHECK (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid()
  )
);

-- Widget instances: DELETE
CREATE POLICY "widget_instances_delete_own"
ON public.widget_instances FOR DELETE
USING (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid()
  )
);

-- Drop existing page_layouts policies
DROP POLICY IF EXISTS "page_layouts_select_policy" ON public.page_layouts;
DROP POLICY IF EXISTS "page_layouts_write_policy" ON public.page_layouts;

-- Page layouts: SELECT
CREATE POLICY "page_layouts_select_policy"
ON public.page_layouts FOR SELECT
USING (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid() OR p.is_public = true
  )
);

-- Page layouts: INSERT
CREATE POLICY "page_layouts_insert_own"
ON public.page_layouts FOR INSERT
WITH CHECK (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid()
  )
);

-- Page layouts: UPDATE
CREATE POLICY "page_layouts_update_own"
ON public.page_layouts FOR UPDATE
USING (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid()
  )
)
WITH CHECK (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid()
  )
);

-- Page layouts: DELETE
CREATE POLICY "page_layouts_delete_own"
ON public.page_layouts FOR DELETE
USING (
  page_id IN (
    SELECT pg.id FROM public.pages pg
    JOIN public.portfolios p ON p.id = pg.portfolio_id
    WHERE p.user_id = auth.uid()
  )
);

-- Add console logging for debugging
DO $$
BEGIN
  RAISE NOTICE 'RLS policies updated successfully for authenticated users';
  RAISE NOTICE 'Users can now INSERT pages, widget_instances, and page_layouts for their own portfolios';
END $$;
