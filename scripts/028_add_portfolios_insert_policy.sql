-- Add INSERT policy for portfolios table
-- This allows authenticated users to create their own portfolios

-- Drop existing portfolio policies to recreate them cleanly
DROP POLICY IF EXISTS "owners can select own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "owners can modify own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "public can read public portfolios" ON public.portfolios;

-- 1. SELECT: Users can read their own portfolios
CREATE POLICY "portfolios_select_own"
ON public.portfolios FOR SELECT
USING (auth.uid() = user_id);

-- 2. SELECT: Anyone can read public portfolios
CREATE POLICY "portfolios_select_public"
ON public.portfolios FOR SELECT
USING (is_public = true);

-- 3. INSERT: Authenticated users can create portfolios for themselves
CREATE POLICY "portfolios_insert_own"
ON public.portfolios FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. UPDATE: Users can update their own portfolios
CREATE POLICY "portfolios_update_own"
ON public.portfolios FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. DELETE: Users can delete their own portfolios
CREATE POLICY "portfolios_delete_own"
ON public.portfolios FOR DELETE
USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_public ON public.portfolios(is_public);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_public ON public.portfolios(user_id, is_public);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Portfolio RLS policies updated successfully';
  RAISE NOTICE 'Authenticated users can now INSERT, SELECT, UPDATE, and DELETE their own portfolios';
END $$;
