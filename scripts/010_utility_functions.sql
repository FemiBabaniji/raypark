-- Additional utility functions for portfolio management

-- Function to create a complete portfolio with default page
CREATE OR REPLACE FUNCTION create_portfolio_with_page(
    portfolio_name text,
    portfolio_slug text,
    page_title text DEFAULT 'Portfolio',
    page_route text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
    portfolio_id uuid;
    page_id uuid;
    layout_id uuid;
    default_theme_id uuid;
    result jsonb;
BEGIN
    -- Create default theme if none exists for user
    SELECT id INTO default_theme_id
    FROM themes
    WHERE user_id = auth.uid()
    LIMIT 1;
    
    IF default_theme_id IS NULL THEN
        INSERT INTO themes (user_id, name, tokens)
        VALUES (
            auth.uid(),
            'Default Theme',
            '{
                "colors": {
                    "primary": "#3b82f6",
                    "secondary": "#64748b",
                    "accent": "#06b6d4",
                    "background": "#ffffff",
                    "surface": "#f8fafc",
                    "text": "#1e293b"
                },
                "typography": {
                    "fontFamily": "Inter, sans-serif",
                    "headingFont": "Inter, sans-serif"
                },
                "spacing": {
                    "unit": "1rem"
                }
            }'::jsonb
        )
        RETURNING id INTO default_theme_id;
    END IF;
    
    -- Create portfolio
    INSERT INTO portfolios (user_id, name, slug, theme_id, is_public)
    VALUES (auth.uid(), portfolio_name, portfolio_slug, default_theme_id, true)
    RETURNING id INTO portfolio_id;
    
    -- Create default page
    INSERT INTO pages (portfolio_id, key, title, route)
    VALUES (
        portfolio_id,
        'portfolio',
        page_title,
        COALESCE(page_route, '/p/' || portfolio_slug)
    )
    RETURNING id INTO page_id;
    
    -- Page layout will be created automatically by trigger
    
    result = jsonb_build_object(
        'portfolio_id', portfolio_id,
        'page_id', page_id,
        'theme_id', default_theme_id,
        'route', COALESCE(page_route, '/p/' || portfolio_slug)
    );
    
    -- Log the creation
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
        auth.uid(),
        'portfolio',
        portfolio_id,
        'created_with_page',
        result
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to duplicate a page
CREATE OR REPLACE FUNCTION duplicate_page(source_page_id uuid, new_title text, new_route text DEFAULT NULL)
RETURNS uuid AS $$
DECLARE
    new_page_id uuid;
    source_page pages;
    widget_record widget_instances;
    new_widget_id uuid;
    source_layout jsonb;
    new_layout jsonb;
    widget_mapping jsonb := '{}'::jsonb;
BEGIN
    -- Get source page
    SELECT p.* INTO source_page
    FROM pages p
    JOIN portfolios port ON port.id = p.portfolio_id
    WHERE p.id = source_page_id AND port.user_id = auth.uid();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Source page not found or access denied';
    END IF;
    
    -- Create new page
    INSERT INTO pages (portfolio_id, key, title, route)
    VALUES (
        source_page.portfolio_id,
        source_page.key || '_copy',
        new_title,
        new_route
    )
    RETURNING id INTO new_page_id;
    
    -- Duplicate all widget instances
    FOR widget_record IN
        SELECT * FROM widget_instances
        WHERE page_id = source_page_id
    LOOP
        INSERT INTO widget_instances (page_id, widget_type_id, props, enabled)
        VALUES (new_page_id, widget_record.widget_type_id, widget_record.props, widget_record.enabled)
        RETURNING id INTO new_widget_id;
        
        -- Track widget ID mapping for layout update
        widget_mapping = widget_mapping || jsonb_build_object(widget_record.id::text, new_widget_id::text);
    END LOOP;
    
    -- Get source layout and update widget IDs
    SELECT layout INTO source_layout
    FROM page_layouts
    WHERE page_id = source_page_id;
    
    -- Update layout with new widget IDs
    new_layout = jsonb_build_object(
        'left', (
            SELECT jsonb_agg(
                COALESCE(widget_mapping->>elem, elem)
            )
            FROM jsonb_array_elements_text(source_layout->'left') elem
        ),
        'right', (
            SELECT jsonb_agg(
                COALESCE(widget_mapping->>elem, elem)
            )
            FROM jsonb_array_elements_text(source_layout->'right') elem
        )
    );
    
    -- Update the new page's layout
    UPDATE page_layouts
    SET layout = new_layout
    WHERE page_id = new_page_id;
    
    -- Log the duplication
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
        auth.uid(),
        'page',
        new_page_id,
        'duplicated',
        jsonb_build_object(
            'source_page_id', source_page_id,
            'widget_count', jsonb_array_length(jsonb_array_elements(widget_mapping))
        )
    );
    
    RETURN new_page_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get portfolio analytics
CREATE OR REPLACE FUNCTION get_portfolio_analytics(portfolio_uuid uuid)
RETURNS jsonb AS $$
DECLARE
    analytics jsonb;
    page_count integer;
    widget_count integer;
    published_versions integer;
    last_published timestamptz;
    total_media integer;
BEGIN
    -- Verify ownership
    IF NOT user_owns_portfolio(portfolio_uuid) THEN
        RAISE EXCEPTION 'Portfolio not found or access denied';
    END IF;
    
    -- Count pages
    SELECT COUNT(*) INTO page_count
    FROM pages
    WHERE portfolio_id = portfolio_uuid;
    
    -- Count widgets across all pages
    SELECT COUNT(*) INTO widget_count
    FROM widget_instances wi
    JOIN pages p ON p.id = wi.page_id
    WHERE p.portfolio_id = portfolio_uuid;
    
    -- Count published versions
    SELECT COUNT(*) INTO published_versions
    FROM page_versions pv
    JOIN pages p ON p.id = pv.page_id
    WHERE p.portfolio_id = portfolio_uuid
    AND pv.status = 'published';
    
    -- Get last published date
    SELECT MAX(pv.published_at) INTO last_published
    FROM page_versions pv
    JOIN pages p ON p.id = pv.page_id
    WHERE p.portfolio_id = portfolio_uuid
    AND pv.status = 'published';
    
    -- Count media assets
    SELECT COUNT(*) INTO total_media
    FROM media_assets ma
    JOIN pages p ON p.id = ma.page_id
    WHERE p.portfolio_id = portfolio_uuid;
    
    analytics = jsonb_build_object(
        'portfolio_id', portfolio_uuid,
        'page_count', page_count,
        'widget_count', widget_count,
        'published_versions', published_versions,
        'last_published', last_published,
        'total_media', total_media,
        'generated_at', now()
    );
    
    RETURN analytics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search portfolios by content
CREATE OR REPLACE FUNCTION search_public_portfolios(search_query text, limit_count integer DEFAULT 20)
RETURNS TABLE(
    portfolio_id uuid,
    portfolio_name text,
    portfolio_slug text,
    page_title text,
    page_route text,
    relevance_score real
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        p.id as portfolio_id,
        p.name as portfolio_name,
        p.slug as portfolio_slug,
        pg.title as page_title,
        pg.route as page_route,
        (
            ts_rank(
                to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(pg.title, '')),
                plainto_tsquery('english', search_query)
            ) +
            ts_rank(
                to_tsvector('english', COALESCE(pv.snapshot::text, '')),
                plainto_tsquery('english', search_query)
            )
        ) as relevance_score
    FROM portfolios p
    JOIN pages pg ON pg.portfolio_id = p.id
    JOIN page_versions pv ON pv.page_id = pg.id
    WHERE p.is_public = true
    AND pv.status = 'published'
    AND (
        to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(pg.title, '')) @@ plainto_tsquery('english', search_query)
        OR to_tsvector('english', COALESCE(pv.snapshot::text, '')) @@ plainto_tsquery('english', search_query)
    )
    ORDER BY relevance_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's portfolio list
CREATE OR REPLACE FUNCTION get_user_portfolios()
RETURNS TABLE(
    id uuid,
    name text,
    slug text,
    is_public boolean,
    page_count bigint,
    last_updated timestamptz,
    created_at timestamptz
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.slug,
        p.is_public,
        COUNT(pg.id) as page_count,
        MAX(GREATEST(p.updated_at, pg.updated_at)) as last_updated,
        p.created_at
    FROM portfolios p
    LEFT JOIN pages pg ON pg.portfolio_id = p.id
    WHERE p.user_id = auth.uid()
    GROUP BY p.id, p.name, p.slug, p.is_public, p.created_at
    ORDER BY last_updated DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate and clean widget props
CREATE OR REPLACE FUNCTION clean_widget_props(widget_type_key text, raw_props jsonb)
RETURNS jsonb AS $$
DECLARE
    cleaned_props jsonb := '{}'::jsonb;
    widget_schema jsonb;
    prop_key text;
    prop_value jsonb;
BEGIN
    -- Get widget schema
    SELECT schema INTO widget_schema
    FROM widget_types
    WHERE key = widget_type_key;
    
    IF widget_schema IS NULL THEN
        RAISE EXCEPTION 'Widget type not found: %', widget_type_key;
    END IF;
    
    -- Basic cleaning - remove null values and empty strings
    FOR prop_key, prop_value IN SELECT * FROM jsonb_each(raw_props)
    LOOP
        IF prop_value IS NOT NULL 
           AND prop_value != 'null'::jsonb 
           AND (prop_value->>'value' IS NULL OR prop_value->>'value' != '') THEN
            cleaned_props = cleaned_props || jsonb_build_object(prop_key, prop_value);
        END IF;
    END LOOP;
    
    RETURN cleaned_props;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
