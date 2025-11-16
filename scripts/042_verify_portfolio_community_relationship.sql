-- Comprehensive verification and setup for portfolio-community relationship
-- This script ensures all necessary components are in place

-- 1. Verify communities table exists with proper structure
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'communities') THEN
    RAISE EXCEPTION 'communities table does not exist. Run script 019 first.';
  END IF;
END $$;

-- 2. Verify portfolios.community_id column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'portfolios' AND column_name = 'community_id'
  ) THEN
    ALTER TABLE public.portfolios
    ADD COLUMN community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL;
    RAISE NOTICE 'Added community_id column to portfolios table';
  ELSE
    RAISE NOTICE 'community_id column already exists in portfolios table';
  END IF;
END $$;

-- 3. Ensure foreign key constraint exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'portfolios_community_id_fkey'
    AND table_name = 'portfolios'
  ) THEN
    -- Drop column and re-add with constraint if it exists without constraint
    ALTER TABLE public.portfolios DROP COLUMN IF EXISTS community_id;
    ALTER TABLE public.portfolios
    ADD COLUMN community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL;
    RAISE NOTICE 'Added foreign key constraint for community_id';
  ELSE
    RAISE NOTICE 'Foreign key constraint already exists';
  END IF;
END $$;

-- 4. Create index if not exists
CREATE INDEX IF NOT EXISTS idx_portfolios_community_id ON public.portfolios(community_id);

-- 5. Create unique constraint (one portfolio per user per community)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_community_portfolio
ON public.portfolios(user_id, community_id)
WHERE community_id IS NOT NULL;

-- 6. Verify community_members table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'community_members') THEN
    RAISE EXCEPTION 'community_members table does not exist. Run script 019 first.';
  END IF;
END $$;

-- 7. Ensure BEA and DMZ communities exist
INSERT INTO public.communities (name, code, description, logo_url)
VALUES 
  (
    'Black Entrepreneurship Alliance',
    'bea-founders-connect',
    'A community for Black entrepreneurs and founders',
    '/bea-logo.png'
  ),
  (
    'DMZ Innovation Hub',
    'dmz-innovation-hub',
    'Toronto''s leading tech incubator and startup accelerator',
    '/dmz-logo-white.svg'
  )
ON CONFLICT (code) 
DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  logo_url = EXCLUDED.logo_url,
  updated_at = NOW();

-- 8. Verify community_portfolios view exists
CREATE OR REPLACE VIEW public.community_portfolios AS
SELECT
  p.id AS portfolio_id,
  p.name AS portfolio_name,
  p.slug,
  p.is_public,
  p.user_id,
  p.community_id,
  c.name AS community_name,
  c.code AS community_code,
  u.full_name AS user_name,
  u.avatar_url AS user_avatar,
  p.created_at,
  p.updated_at
FROM public.portfolios p
LEFT JOIN public.communities c ON p.community_id = c.id
LEFT JOIN public.users u ON p.user_id = u.id;

GRANT SELECT ON public.community_portfolios TO authenticated, anon;

-- 9. Create helper function to get portfolios by community
CREATE OR REPLACE FUNCTION public.get_community_portfolios(p_community_id UUID)
RETURNS TABLE (
  portfolio_id UUID,
  portfolio_name TEXT,
  slug TEXT,
  user_id UUID,
  user_name TEXT,
  user_avatar TEXT,
  is_public BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.slug,
    p.user_id,
    u.full_name,
    u.avatar_url,
    p.is_public,
    p.created_at,
    p.updated_at
  FROM public.portfolios p
  LEFT JOIN public.users u ON p.user_id = u.id
  WHERE p.community_id = p_community_id
  AND p.is_public = true
  ORDER BY p.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Display current status
DO $$
DECLARE
  community_count INTEGER;
  portfolio_count INTEGER;
  linked_portfolio_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO community_count FROM public.communities;
  SELECT COUNT(*) INTO portfolio_count FROM public.portfolios;
  SELECT COUNT(*) INTO linked_portfolio_count FROM public.portfolios WHERE community_id IS NOT NULL;
  
  RAISE NOTICE '=== PORTFOLIO-COMMUNITY RELATIONSHIP STATUS ===';
  RAISE NOTICE 'Communities in database: %', community_count;
  RAISE NOTICE 'Total portfolios: %', portfolio_count;
  RAISE NOTICE 'Portfolios linked to communities: %', linked_portfolio_count;
  RAISE NOTICE 'Unlinked portfolios: %', portfolio_count - linked_portfolio_count;
  RAISE NOTICE '==============================================';
END $$;
