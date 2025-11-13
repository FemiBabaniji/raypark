-- Add unique constraint for widget instances
-- This allows ON CONFLICT upserts in saveWidgetLayout

-- First, remove any duplicate rows (keep the most recent one)
DELETE FROM widget_instances a
USING widget_instances b
WHERE a.id < b.id
  AND a.page_id = b.page_id
  AND a.widget_type_id = b.widget_type_id;

-- Add the unique constraint
ALTER TABLE widget_instances
ADD CONSTRAINT widget_instances_page_widget_unique 
UNIQUE (page_id, widget_type_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_widget_instances_page_widget 
ON widget_instances(page_id, widget_type_id);

-- Add comment
COMMENT ON CONSTRAINT widget_instances_page_widget_unique ON widget_instances IS 
  'Ensures only one instance of each widget type per page, enabling upsert operations';
