-- Create versioning and publish workflow functions

-- Function to get published page by route
CREATE OR REPLACE FUNCTION get_published_page(page_route text)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
    page_record pages;
    portfolio_record portfolios;
BEGIN
    -- Find the page by route
    SELECT p.* INTO page_record
    FROM pages p
    JOIN portfolios port ON port.id = p.portfolio_id
    WHERE p.route = page_route AND port.is_public = true;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Get the published version snapshot
    SELECT pv.snapshot INTO result
    FROM page_versions pv
    WHERE pv.page_id = page_record.id 
    AND pv.status = 'published'
    ORDER BY pv.created_at DESC
    LIMIT 1;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get draft page (owner only)
CREATE OR REPLACE FUNCTION get_draft_page(page_uuid uuid)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
    page_record pages;
    layout_record page_layouts;
    theme_record themes;
    widgets jsonb[];
    widget_record widget_instances;
BEGIN
    -- Verify ownership
    SELECT p.* INTO page_record
    FROM pages p
    JOIN portfolios port ON port.id = p.portfolio_id
    WHERE p.id = page_uuid AND port.user_id = auth.uid();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Page not found or access denied';
    END IF;
    
    -- Get page layout
    SELECT pl.* INTO layout_record
    FROM page_layouts pl
    WHERE pl.page_id = page_uuid;
    
    -- Get theme
    SELECT t.* INTO theme_record
    FROM themes t
    JOIN portfolios port ON port.theme_id = t.id
    WHERE port.id = page_record.portfolio_id;
    
    -- Get all enabled widget instances with their types
    SELECT array_agg(
        jsonb_build_object(
            'id', wi.id,
            'widget_type_key', wt.key,
            'props', wi.props,
            'enabled', wi.enabled,
            'created_at', wi.created_at,
            'updated_at', wi.updated_at
        )
    ) INTO widgets
    FROM widget_instances wi
    JOIN widget_types wt ON wt.id = wi.widget_type_id
    WHERE wi.page_id = page_uuid AND wi.enabled = true;
    
    -- Compose the result
    result = jsonb_build_object(
        'page', jsonb_build_object(
            'id', page_record.id,
            'key', page_record.key,
            'title', page_record.title,
            'route', page_record.route
        ),
        'theme', COALESCE(
            jsonb_build_object(
                'id', theme_record.id,
                'name', theme_record.name,
                'tokens', theme_record.tokens
            ),
            '{}'::jsonb
        ),
        'layout', COALESCE(layout_record.layout, '{"left": [], "right": []}'::jsonb),
        'widgets', COALESCE(widgets, ARRAY[]::jsonb[])
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to publish a page (creates immutable snapshot)
CREATE OR REPLACE FUNCTION publish_page(page_uuid uuid)
RETURNS uuid AS $$
DECLARE
    version_id uuid;
    page_record pages;
    draft_data jsonb;
    portfolio_record portfolios;
BEGIN
    -- Verify ownership
    SELECT p.* INTO page_record
    FROM pages p
    JOIN portfolios port ON port.id = p.portfolio_id
    WHERE p.id = page_uuid AND port.user_id = auth.uid();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Page not found or access denied';
    END IF;
    
    -- Get the current draft data
    SELECT get_draft_page(page_uuid) INTO draft_data;
    
    -- Create published version snapshot
    INSERT INTO page_versions (page_id, status, snapshot, created_by, published_at)
    VALUES (page_uuid, 'published', draft_data, auth.uid(), now())
    RETURNING id INTO version_id;
    
    -- Log the publish activity
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
        auth.uid(),
        'page',
        page_uuid,
        'published',
        jsonb_build_object('version_id', version_id, 'published_at', now())
    );
    
    -- Notify realtime subscribers
    PERFORM pg_notify(
        'page_published',
        json_build_object(
            'page_id', page_uuid,
            'version_id', version_id,
            'route', page_record.route
        )::text
    );
    
    RETURN version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reorder layout
CREATE OR REPLACE FUNCTION reorder_layout(page_uuid uuid, left_widgets uuid[], right_widgets uuid[])
RETURNS void AS $$
DECLARE
    page_record pages;
BEGIN
    -- Verify ownership
    SELECT p.* INTO page_record
    FROM pages p
    JOIN portfolios port ON port.id = p.portfolio_id
    WHERE p.id = page_uuid AND port.user_id = auth.uid();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Page not found or access denied';
    END IF;
    
    -- Update the layout
    UPDATE page_layouts
    SET layout = jsonb_build_object(
        'left', to_jsonb(left_widgets),
        'right', to_jsonb(right_widgets)
    )
    WHERE page_id = page_uuid;
    
    -- Log the activity
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
        auth.uid(),
        'page_layout',
        page_uuid,
        'reordered',
        jsonb_build_object(
            'left', left_widgets,
            'right', right_widgets
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create widget instance
CREATE OR REPLACE FUNCTION create_widget_instance(page_uuid uuid, widget_type_key text, widget_props jsonb DEFAULT '{}'::jsonb)
RETURNS uuid AS $$
DECLARE
    instance_id uuid;
    widget_type_record widget_types;
    page_record pages;
    current_layout jsonb;
BEGIN
    -- Verify ownership
    SELECT p.* INTO page_record
    FROM pages p
    JOIN portfolios port ON port.id = p.portfolio_id
    WHERE p.id = page_uuid AND port.user_id = auth.uid();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Page not found or access denied';
    END IF;
    
    -- Get widget type
    SELECT * INTO widget_type_record
    FROM widget_types
    WHERE key = widget_type_key;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Widget type not found: %', widget_type_key;
    END IF;
    
    -- Create widget instance
    INSERT INTO widget_instances (page_id, widget_type_id, props)
    VALUES (page_uuid, widget_type_record.id, widget_props)
    RETURNING id INTO instance_id;
    
    -- Add to layout (default to left column)
    SELECT layout INTO current_layout
    FROM page_layouts
    WHERE page_id = page_uuid;
    
    UPDATE page_layouts
    SET layout = jsonb_set(
        current_layout,
        '{left}',
        (current_layout->'left') || to_jsonb(instance_id::text)
    )
    WHERE page_id = page_uuid;
    
    -- Log the activity
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
        auth.uid(),
        'widget_instance',
        instance_id,
        'created',
        jsonb_build_object(
            'widget_type_key', widget_type_key,
            'page_id', page_uuid,
            'props', widget_props
        )
    );
    
    RETURN instance_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update widget props
CREATE OR REPLACE FUNCTION update_widget_props(widget_instance_uuid uuid, new_props jsonb)
RETURNS void AS $$
DECLARE
    widget_record widget_instances;
    old_props jsonb;
BEGIN
    -- Get current widget and verify ownership
    SELECT wi.*, wi.props INTO widget_record, old_props
    FROM widget_instances wi
    JOIN pages p ON p.id = wi.page_id
    JOIN portfolios port ON port.id = p.portfolio_id
    WHERE wi.id = widget_instance_uuid AND port.user_id = auth.uid();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Widget instance not found or access denied';
    END IF;
    
    -- Update props
    UPDATE widget_instances
    SET props = new_props
    WHERE id = widget_instance_uuid;
    
    -- Log the activity
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
        auth.uid(),
        'widget_instance',
        widget_instance_uuid,
        'updated',
        jsonb_build_object(
            'old_props', old_props,
            'new_props', new_props
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete widget instance
CREATE OR REPLACE FUNCTION delete_widget_instance(widget_instance_uuid uuid)
RETURNS void AS $$
DECLARE
    widget_record widget_instances;
    page_uuid uuid;
    current_layout jsonb;
    updated_layout jsonb;
BEGIN
    -- Get widget and verify ownership
    SELECT wi.*, wi.page_id INTO widget_record, page_uuid
    FROM widget_instances wi
    JOIN pages p ON p.id = wi.page_id
    JOIN portfolios port ON port.id = p.portfolio_id
    WHERE wi.id = widget_instance_uuid AND port.user_id = auth.uid();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Widget instance not found or access denied';
    END IF;
    
    -- Remove from layout
    SELECT layout INTO current_layout
    FROM page_layouts
    WHERE page_id = page_uuid;
    
    -- Remove widget ID from both left and right arrays
    updated_layout = jsonb_set(
        jsonb_set(
            current_layout,
            '{left}',
            (
                SELECT jsonb_agg(elem)
                FROM jsonb_array_elements_text(current_layout->'left') elem
                WHERE elem != widget_instance_uuid::text
            )
        ),
        '{right}',
        (
            SELECT jsonb_agg(elem)
            FROM jsonb_array_elements_text(current_layout->'right') elem
            WHERE elem != widget_instance_uuid::text
        )
    );
    
    UPDATE page_layouts
    SET layout = updated_layout
    WHERE page_id = page_uuid;
    
    -- Delete the widget instance
    DELETE FROM widget_instances
    WHERE id = widget_instance_uuid;
    
    -- Log the activity
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
        auth.uid(),
        'widget_instance',
        widget_instance_uuid,
        'deleted',
        jsonb_build_object(
            'page_id', page_uuid,
            'widget_type_id', widget_record.widget_type_id,
            'props', widget_record.props
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
