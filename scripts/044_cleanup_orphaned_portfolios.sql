-- Clean up orphaned portfolios (portfolios without pages)
-- This helps maintain database integrity

-- Find and delete orphaned portfolios
DELETE FROM portfolios
WHERE id NOT IN (
  SELECT DISTINCT portfolio_id 
  FROM pages
)
AND is_demo = false;

-- Report count
DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % orphaned portfolio(s)', deleted_count;
END $$;
