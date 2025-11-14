-- Add composite unique constraint on pages(portfolio_id, route)
-- This ensures each portfolio can have unique routes without global conflicts

DO $$
BEGIN
  -- Check if the constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' 
    AND tablename = 'pages'
    AND indexname = 'pages_portfolio_route_unique'
  ) THEN
    -- Create the composite unique index
    CREATE UNIQUE INDEX pages_portfolio_route_unique
    ON public.pages(portfolio_id, route);
    
    RAISE NOTICE 'Created composite unique index on pages(portfolio_id, route)';
  ELSE
    RAISE NOTICE 'Composite unique index already exists';
  END IF;
END $$;

-- Note: The existing global unique constraint on 'route' column (if any) 
-- may need to be dropped depending on your data model.
-- If you want routes to be unique per portfolio (e.g., all portfolios can have "/"),
-- you would drop the global constraint with:
-- ALTER TABLE public.pages DROP CONSTRAINT IF EXISTS pages_route_key;
