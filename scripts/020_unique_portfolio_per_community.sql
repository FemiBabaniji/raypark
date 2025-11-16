-- Add unique constraint to enforce one portfolio per user per community
-- This allows users to have:
-- 1. Many portfolios with community_id = NULL (unlinked portfolios)
-- 2. Only ONE portfolio for each specific community

-- PostgreSQL supports partial unique indexes to allow NULL values to be non-unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_community_portfolio
ON public.portfolios(user_id, community_id)
WHERE community_id IS NOT NULL;

-- Add helpful comment
COMMENT ON INDEX idx_unique_user_community_portfolio IS 
'Ensures each user can have only one portfolio per community. NULL community_id values are allowed to be non-unique, enabling unlimited unlinked portfolios.';
