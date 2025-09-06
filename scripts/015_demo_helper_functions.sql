-- Helper function to clone demo portfolios for new users
CREATE OR REPLACE FUNCTION public.clone_demo_portfolio(
  demo_slug text, 
  target_user uuid, 
  target_slug text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  src_portfolio_id uuid;
  new_portfolio_id uuid := gen_random_uuid();
  p_row RECORD;
  new_page_id uuid;
  wt RECORD;
  new_widget_id uuid;
  new_layout_id uuid;
BEGIN
  -- Find source demo portfolio
  SELECT id INTO src_portfolio_id 
  FROM public.portfolios
  WHERE slug = demo_slug AND is_demo = true;
  
  IF src_portfolio_id IS NULL THEN
    RAISE EXCEPTION 'Demo portfolio % not found', demo_slug;
  END IF;

  -- Clone portfolio
  INSERT INTO public.portfolios (id, user_id, name, slug, theme_id, is_public, is_demo)
  SELECT new_portfolio_id, target_user, 
         REPLACE(name, 'Demo Portfolio – ', ''), 
         target_slug, theme_id, false, false
  FROM public.portfolios WHERE id = src_portfolio_id;

  -- Clone pages and their content
  FOR p_row IN
    SELECT * FROM public.pages WHERE portfolio_id = src_portfolio_id
  LOOP
    new_page_id := gen_random_uuid();
    
    -- Clone page
    INSERT INTO public.pages (id, portfolio_id, key, title, route, is_demo)
    VALUES (new_page_id, new_portfolio_id, p_row.key, p_row.title, 
            '/' || target_slug, false);

    -- Clone layout
    INSERT INTO public.page_layouts (id, page_id, layout)
    SELECT gen_random_uuid(), new_page_id, layout
    FROM public.page_layouts WHERE page_id = p_row.id;

    -- Clone widgets
    FOR wt IN
      SELECT * FROM public.widget_instances WHERE page_id = p_row.id
    LOOP
      new_widget_id := gen_random_uuid();
      INSERT INTO public.widget_instances (id, page_id, widget_type_id, props, enabled)
      VALUES (new_widget_id, new_page_id, wt.widget_type_id, wt.props, wt.enabled);
    END LOOP;
    
    -- Create initial draft version
    INSERT INTO public.page_versions (id, page_id, status, snapshot, created_by)
    VALUES (gen_random_uuid(), new_page_id, 'draft', '{}'::jsonb, target_user);
  END LOOP;

  RETURN new_portfolio_id;
END $$;

-- Function to list available demo portfolios
CREATE OR REPLACE FUNCTION public.get_demo_portfolios()
RETURNS TABLE (
  slug text,
  name text,
  description text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    p.slug,
    p.name,
    COALESCE(
      (SELECT props->>'description' 
       FROM public.widget_instances wi 
       JOIN public.widget_types wt ON wi.widget_type_id = wt.id
       JOIN public.pages pg ON wi.page_id = pg.id
       WHERE pg.portfolio_id = p.id AND wt.key = 'description'
       LIMIT 1), 
      'Demo portfolio'
    ) as description
  FROM public.portfolios p
  WHERE p.is_demo = true AND p.is_public = true
  ORDER BY p.name;
$$;
