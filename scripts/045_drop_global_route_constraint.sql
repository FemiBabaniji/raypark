-- Drop the global unique constraint on pages.route
-- This constraint prevents multiple portfolios from having the same route (e.g., "/")
-- We want routes to be unique per portfolio, not globally unique

DO $$
BEGIN
  -- Check if the global route constraint exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pages_route_key'
    AND conrelid = 'public.pages'::regclass
  ) THEN
    -- Drop the global constraint
    ALTER TABLE public.pages DROP CONSTRAINT pages_route_key;
    RAISE NOTICE '✅ Dropped global unique constraint pages_route_key';
  ELSE
    RAISE NOTICE 'ℹ️  Global constraint pages_route_key does not exist (already dropped)';
  END IF;

  -- Verify the composite constraint exists (portfolio_id, route)
  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' 
    AND tablename = 'pages'
    AND indexname = 'pages_portfolio_route_unique'
  ) THEN
    RAISE NOTICE '✅ Composite unique index pages_portfolio_route_unique exists';
  ELSE
    -- Create it if missing
    CREATE UNIQUE INDEX pages_portfolio_route_unique
    ON public.pages(portfolio_id, route);
    RAISE NOTICE '✅ Created composite unique index pages_portfolio_route_unique';
  END IF;

  -- Also verify the (portfolio_id, key) constraint exists
  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' 
    AND tablename = 'pages'
    AND indexname = 'pages_portfolio_id_key_key'
  ) THEN
    RAISE NOTICE '✅ Composite unique constraint pages(portfolio_id, key) exists';
  ELSE
    RAISE NOTICE 'ℹ️  Creating composite unique constraint on pages(portfolio_id, key)';
    CREATE UNIQUE INDEX pages_portfolio_id_key_key
    ON public.pages(portfolio_id, key);
  END IF;
END $$;

-- Explanation:
-- - Each portfolio can now have its own "/" route (or any route)
-- - Routes are unique within a portfolio (portfolio_id, route)
-- - Page keys are unique within a portfolio (portfolio_id, key)
-- - Multiple portfolios can all have a "main" page with route "/"
