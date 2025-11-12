-- Migration: Enhanced Grid Layout System
-- Supports grid-based positioning within columns while maintaining backward compatibility

-- Enhance page_layouts.layout to support grid positioning within columns
COMMENT ON COLUMN page_layouts.layout IS 
'Layout configuration supporting both vertical stacking and grid positioning:
{
  "left": {
    "type": "vertical" | "grid",
    "columns": 2,  // for grid type
    "gap": 4,      // for grid type
    "widgets": [
      { "id": "uuid", "row": 0, "col": 0, "rowSpan": 1, "colSpan": 1 }
    ]
  },
  "right": {
    "type": "vertical",
    "widgets": ["uuid1", "uuid2"]
  }
}';

-- Add helper function to migrate legacy layouts to new format
CREATE OR REPLACE FUNCTION migrate_legacy_layout(legacy_layout jsonb)
RETURNS jsonb AS $$
DECLARE
  new_layout jsonb;
  left_widgets jsonb;
  right_widgets jsonb;
BEGIN
  -- Extract old format arrays
  left_widgets := legacy_layout->'left';
  right_widgets := legacy_layout->'right';
  
  -- Convert to new format
  new_layout := jsonb_build_object(
    'left', jsonb_build_object(
      'type', 'vertical',
      'widgets', COALESCE(left_widgets, '[]'::jsonb)
    ),
    'right', jsonb_build_object(
      'type', 'vertical',
      'widgets', COALESCE(right_widgets, '[]'::jsonb)
    )
  );
  
  RETURN new_layout;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Migrate existing layouts to new format
UPDATE page_layouts
SET layout = migrate_legacy_layout(layout)
WHERE NOT (
  layout->'left' ? 'type' AND 
  layout->'right' ? 'type'
);

-- Add validation function for layout structure
CREATE OR REPLACE FUNCTION validate_layout_structure(layout_data jsonb)
RETURNS boolean AS $$
BEGIN
  -- Check that left and right exist
  IF NOT (layout_data ? 'left' AND layout_data ? 'right') THEN
    RETURN false;
  END IF;
  
  -- Check that each column has a type
  IF NOT (
    layout_data->'left' ? 'type' AND 
    layout_data->'right' ? 'type'
  ) THEN
    RETURN false;
  END IF;
  
  -- Check that type is valid
  IF NOT (
    layout_data->'left'->>'type' IN ('vertical', 'grid') AND
    layout_data->'right'->>'type' IN ('vertical', 'grid')
  ) THEN
    RETURN false;
  END IF;
  
  -- Check that each column has widgets
  IF NOT (
    layout_data->'left' ? 'widgets' AND 
    layout_data->'right' ? 'widgets'
  ) THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add check constraint to ensure valid layout structure
ALTER TABLE page_layouts
ADD CONSTRAINT valid_layout_structure
CHECK (validate_layout_structure(layout));

-- Create materialized view for fast portfolio loading
CREATE MATERIALIZED VIEW IF NOT EXISTS portfolio_full_view AS
SELECT 
  p.id as portfolio_id,
  p.user_id,
  p.name as portfolio_name,
  p.slug,
  p.is_public,
  p.is_demo,
  p.theme_id,
  p.description,
  pg.id as page_id,
  pg.key as page_key,
  pg.title as page_title,
  pg.route,
  pl.layout,
  json_agg(
    json_build_object(
      'widget_id', wi.id,
      'widget_type', wt.key,
      'widget_name', wt.name,
      'props', wi.props,
      'enabled', wi.enabled
    )
  ) as widgets
FROM portfolios p
LEFT JOIN pages pg ON pg.portfolio_id = p.id
LEFT JOIN page_layouts pl ON pl.page_id = pg.id
LEFT JOIN widget_instances wi ON wi.page_id = pg.id
LEFT JOIN widget_types wt ON wt.id = wi.widget_type_id
GROUP BY p.id, pg.id, pl.id;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS portfolio_full_view_idx 
ON portfolio_full_view(portfolio_id, page_id);

-- Create function to refresh portfolio view
CREATE OR REPLACE FUNCTION refresh_portfolio_view()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY portfolio_full_view;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to auto-refresh view on changes
CREATE OR REPLACE FUNCTION trigger_refresh_portfolio_view()
RETURNS trigger AS $$
BEGIN
  PERFORM refresh_portfolio_view();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS refresh_on_portfolio_change ON portfolios;
CREATE TRIGGER refresh_on_portfolio_change
AFTER INSERT OR UPDATE OR DELETE ON portfolios
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_refresh_portfolio_view();

DROP TRIGGER IF EXISTS refresh_on_widget_change ON widget_instances;
CREATE TRIGGER refresh_on_widget_change
AFTER INSERT OR UPDATE OR DELETE ON widget_instances
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_refresh_portfolio_view();

DROP TRIGGER IF EXISTS refresh_on_layout_change ON page_layouts;
CREATE TRIGGER refresh_on_layout_change
AFTER INSERT OR UPDATE OR DELETE ON page_layouts
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_refresh_portfolio_view();

-- Initial refresh of materialized view
SELECT refresh_portfolio_view();
