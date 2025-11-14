-- Drop any existing problematic constraints
ALTER TABLE public.page_layouts
  DROP CONSTRAINT IF EXISTS valid_layout_structure,
  DROP CONSTRAINT IF EXISTS page_layouts_layout_is_object,
  DROP CONSTRAINT IF EXISTS page_layouts_layout_widgets_shape,
  DROP CONSTRAINT IF EXISTS page_layouts_layout_widgets_shape_right;

-- Ensure layout is an object (not array or primitive)
ALTER TABLE public.page_layouts
  ADD CONSTRAINT page_layouts_layout_is_object
  CHECK (jsonb_typeof(layout) = 'object');

-- Ensure left.widgets is an array if left exists
ALTER TABLE public.page_layouts
  ADD CONSTRAINT page_layouts_left_widgets_valid
  CHECK (
    NOT (layout ? 'left') 
    OR (
      jsonb_typeof(layout->'left') = 'object'
      AND (
        NOT (layout->'left' ? 'widgets')
        OR jsonb_typeof(layout->'left'->'widgets') = 'array'
      )
    )
  );

-- Ensure right.widgets is an array if right exists
ALTER TABLE public.page_layouts
  ADD CONSTRAINT page_layouts_right_widgets_valid
  CHECK (
    NOT (layout ? 'right')
    OR (
      jsonb_typeof(layout->'right') = 'object'
      AND (
        NOT (layout->'right' ? 'widgets')
        OR jsonb_typeof(layout->'right'->'widgets') = 'array'
      )
    )
  );

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_pages_portfolio ON public.pages(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_public ON public.portfolios(user_id, is_public);
CREATE INDEX IF NOT EXISTS idx_page_layouts_page ON public.page_layouts(page_id);
CREATE INDEX IF NOT EXISTS idx_widget_instances_page ON public.widget_instances(page_id);
CREATE INDEX IF NOT EXISTS idx_widget_instances_page_type ON public.widget_instances(page_id, widget_type_id);

-- Set proper defaults for timestamps
ALTER TABLE public.page_layouts
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET DEFAULT now();

ALTER TABLE public.widget_instances
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET DEFAULT now();

-- Update timestamp trigger to use clock_timestamp for accuracy
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := clock_timestamp();
  RETURN NEW;
END;
$$;

-- Apply trigger to both tables
DROP TRIGGER IF EXISTS set_page_layouts_updated_at ON public.page_layouts;
CREATE TRIGGER set_page_layouts_updated_at
  BEFORE UPDATE ON public.page_layouts
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_widget_instances_updated_at ON public.widget_instances;
CREATE TRIGGER set_widget_instances_updated_at
  BEFORE UPDATE ON public.widget_instances
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Helper function to safely extract widget types from layout
CREATE OR REPLACE FUNCTION get_widget_types_from_layout(layout_data JSONB)
RETURNS TEXT[]
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  result TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Extract from left column if it exists and has widgets array
  IF layout_data ? 'left' 
     AND layout_data->'left' ? 'widgets'
     AND jsonb_typeof(layout_data->'left'->'widgets') = 'array' THEN
    result := result || ARRAY(
      SELECT jsonb_array_elements_text(layout_data->'left'->'widgets')
    );
  END IF;
  
  -- Extract from right column if it exists and has widgets array
  IF layout_data ? 'right'
     AND layout_data->'right' ? 'widgets'
     AND jsonb_typeof(layout_data->'right'->'widgets') = 'array' THEN
    result := result || ARRAY(
      SELECT jsonb_array_elements_text(layout_data->'right'->'widgets')
    );
  END IF;
  
  RETURN result;
END;
$$;

-- Update the get_page_layout_with_widgets function to be object-safe
CREATE OR REPLACE FUNCTION get_page_layout_with_widgets(page_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'layout', pl.layout,
    'widgets', COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', wi.id,
        'type', wt.key,
        'props', wi.props,
        'enabled', wi.enabled
      )
    ) FILTER (WHERE wi.id IS NOT NULL), '[]'::jsonb)
  )
  INTO result
  FROM public.page_layouts pl
  LEFT JOIN public.widget_instances wi ON wi.page_id = pl.page_id
  LEFT JOIN public.widget_types wt ON wt.id = wi.widget_type_id
  WHERE pl.page_id = page_id_param
  GROUP BY pl.layout;
  
  RETURN result;
END;
$$;

-- Migrate any existing old-format layouts to new format
UPDATE public.page_layouts
SET layout = jsonb_build_object(
  'left', jsonb_build_object(
    'type', 'vertical',
    'widgets', COALESCE(layout->'left', '[]'::jsonb)
  ),
  'right', jsonb_build_object(
    'type', 'vertical',
    'widgets', COALESCE(layout->'right', '[]'::jsonb)
  )
)
WHERE jsonb_typeof(layout) = 'object'
  AND (
    (layout ? 'left' AND jsonb_typeof(layout->'left') = 'array')
    OR (layout ? 'right' AND jsonb_typeof(layout->'right') = 'array')
    OR NOT (layout ? 'left')
    OR NOT (layout ? 'right')
  );

-- Add comment for documentation
COMMENT ON CONSTRAINT page_layouts_layout_is_object ON public.page_layouts IS 
  'Ensures layout is a JSONB object with structure: { left: { type: "vertical", widgets: [] }, right: { type: "vertical", widgets: [] } }';
