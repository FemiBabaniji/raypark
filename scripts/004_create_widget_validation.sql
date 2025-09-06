-- Create widget validation functions
-- Function to validate widget props against schema
CREATE OR REPLACE FUNCTION validate_widget_props()
RETURNS TRIGGER AS $$
DECLARE
    widget_schema jsonb;
BEGIN
    -- Get the schema for this widget type
    SELECT schema INTO widget_schema
    FROM widget_types
    WHERE id = NEW.widget_type_id;
    
    IF widget_schema IS NULL THEN
        RAISE EXCEPTION 'Widget type not found: %', NEW.widget_type_id;
    END IF;
    
    -- TODO: Add JSON schema validation here when pg_jsonschema is available
    -- For now, just ensure props is valid JSON
    IF NEW.props IS NULL THEN
        NEW.props = '{}'::jsonb;
    END IF;
    
    -- Log validation attempt
    PERFORM pg_notify('widget_validation', 
        json_build_object(
            'widget_instance_id', NEW.id,
            'widget_type_id', NEW.widget_type_id,
            'validation_status', 'pending_schema_check'
        )::text
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add validation trigger to widget_instances
DROP TRIGGER IF EXISTS validate_widget_props_trigger ON widget_instances;
CREATE TRIGGER validate_widget_props_trigger
    BEFORE INSERT OR UPDATE ON widget_instances
    FOR EACH ROW EXECUTE FUNCTION validate_widget_props();

-- Function to get widget type by key
CREATE OR REPLACE FUNCTION get_widget_type_by_key(widget_key text)
RETURNS widget_types AS $$
DECLARE
    result widget_types;
BEGIN
    SELECT * INTO result
    FROM widget_types
    WHERE key = widget_key;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Widget type not found: %', widget_key;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to create default layout for a page
CREATE OR REPLACE FUNCTION create_default_page_layout(page_uuid uuid)
RETURNS uuid AS $$
DECLARE
    layout_id uuid;
BEGIN
    INSERT INTO page_layouts (page_id, layout)
    VALUES (page_uuid, '{"left": [], "right": []}'::jsonb)
    RETURNING id INTO layout_id;
    
    RETURN layout_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create layout when page is created
CREATE OR REPLACE FUNCTION create_page_layout_trigger()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_default_page_layout(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_page_layout_trigger ON pages;
CREATE TRIGGER create_page_layout_trigger
    AFTER INSERT ON pages
    FOR EACH ROW EXECUTE FUNCTION create_page_layout_trigger();
