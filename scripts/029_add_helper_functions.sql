-- Add helper functions for portfolio management

-- 1. Helper function to get current user ID (with caching for policy performance)
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT auth.uid();
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_current_user_id() TO authenticated;

-- 2. Function to ensure a user has a portfolio (creates one if needed)
CREATE OR REPLACE FUNCTION public.ensure_user_portfolio()
RETURNS TABLE(portfolio_id uuid, page_id uuid, is_new boolean)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_portfolio_id uuid;
  v_page_id uuid;
  v_is_new boolean;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Check if user already has a portfolio
  SELECT id INTO v_portfolio_id
  FROM public.portfolios
  WHERE user_id = v_user_id
  LIMIT 1;
  
  IF v_portfolio_id IS NOT NULL THEN
    -- Portfolio exists, get its first page
    SELECT id INTO v_page_id
    FROM public.pages
    WHERE portfolio_id = v_portfolio_id
    ORDER BY created_at
    LIMIT 1;
    
    -- If no page exists, create one
    IF v_page_id IS NULL THEN
      INSERT INTO public.pages (portfolio_id, title, route, is_demo)
      VALUES (v_portfolio_id, 'Home', '/', false)
      RETURNING id INTO v_page_id;
      
      v_is_new := false; -- Portfolio existed, but page was new
    ELSE
      v_is_new := false; -- Both existed
    END IF;
  ELSE
    -- Create new portfolio
    INSERT INTO public.portfolios (user_id, name, slug, is_public, is_demo)
    VALUES (v_user_id, 'My Portfolio', 'my-portfolio-' || substring(gen_random_uuid()::text, 1, 8), false, false)
    RETURNING id INTO v_portfolio_id;
    
    -- Create default page for the portfolio
    INSERT INTO public.pages (portfolio_id, title, route, is_demo)
    VALUES (v_portfolio_id, 'Home', '/', false)
    RETURNING id INTO v_page_id;
    
    v_is_new := true;
  END IF;
  
  -- Return the portfolio and page IDs
  RETURN QUERY SELECT v_portfolio_id, v_page_id, v_is_new;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.ensure_user_portfolio() TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION public.get_current_user_id() IS 'Returns the current authenticated user ID. Used for caching in RLS policies.';
COMMENT ON FUNCTION public.ensure_user_portfolio() IS 'Ensures the current user has a portfolio and page. Creates them if they don''t exist. Returns portfolio_id, page_id, and is_new flag.';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Helper functions created successfully';
  RAISE NOTICE 'Functions available: get_current_user_id(), ensure_user_portfolio()';
END $$;
