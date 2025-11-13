-- Fix layout shape mismatch: migrate from array shape to object shape
-- This script addresses the error "layout.left must be an object when present"

-- ============================================================================
-- Part 1: Update column DEFAULT to use new object shape
-- ============================================================================

ALTER TABLE public.page_layouts
  ALTER COLUMN layout
  SET DEFAULT jsonb_build_object(
    'left',  jsonb_build_object('type', 'vertical', 'widgets', '[]'::jsonb),
    'right', jsonb_build_object('type', 'vertical', 'widgets', '[]'::jsonb)
  );

-- ============================================================================
-- Part 2: Migrate existing rows that still have array shape
-- ============================================================================

-- Update any rows where left or right are arrays (old shape) to object shape
UPDATE public.page_layouts
SET layout = jsonb_build_object(
  'left',
    jsonb_build_object(
      'type', 'vertical',
      'widgets',
        CASE
          WHEN jsonb_typeof(layout->'left') = 'array'  THEN (layout->'left')
          WHEN jsonb_typeof(layout->'left') = 'object' THEN COALESCE(layout->'left'->'widgets', '[]'::jsonb)
          ELSE '[]'::jsonb
        END
    ),
  'right',
    jsonb_build_object(
      'type', 'vertical',
      'widgets',
        CASE
          WHEN jsonb_typeof(layout->'right') = 'array'  THEN (layout->'right')
          WHEN jsonb_typeof(layout->'right') = 'object' THEN COALESCE(layout->'right'->'widgets', '[]'::jsonb)
          ELSE '[]'::jsonb
        END
    )
)
WHERE (layout ? 'left'  AND jsonb_typeof(layout->'left')  <> 'object')
   OR (layout ? 'right' AND jsonb_typeof(layout->'right') <> 'object');

-- ============================================================================
-- Part 3: Update trigger function to use new object shape
-- ============================================================================

-- Replace the create_default_page_layout function with the correct object shape
CREATE OR REPLACE FUNCTION create_default_page_layout(page_uuid uuid)
RETURNS uuid AS $$
DECLARE
    layout_id uuid;
BEGIN
    INSERT INTO page_layouts (page_id, layout)
    VALUES (
      page_uuid, 
      jsonb_build_object(
        'left',  jsonb_build_object('type', 'vertical', 'widgets', '[]'::jsonb),
        'right', jsonb_build_object('type', 'vertical', 'widgets', '[]'::jsonb)
      )
    )
    RETURNING id INTO layout_id;
    
    RETURN layout_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Part 4: Verification query (optional - run manually to check)
-- ============================================================================

-- Verify all layouts now have the correct object shape
-- Uncomment to run manually:
-- SELECT id,
--        jsonb_typeof(layout->'left')  as left_type,
--        jsonb_typeof(layout->'right') as right_type,
--        layout
-- FROM public.page_layouts
-- WHERE (layout ? 'left'  AND jsonb_typeof(layout->'left')  <> 'object')
--    OR (layout ? 'right' AND jsonb_typeof(layout->'right') <> 'object')
-- LIMIT 10;

-- Should return 0 rows after migration
