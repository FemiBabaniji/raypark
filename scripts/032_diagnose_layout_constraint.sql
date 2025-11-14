-- Get the exact constraint definition
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE n.nspname = 'public' 
  AND t.relname = 'page_layouts'
  AND c.contype = 'c';

-- Test the exact payload that the app is trying to insert
DO $$
DECLARE
  test_layout JSONB;
BEGIN
  -- This is the exact structure the app sends
  test_layout := '{
    "left": {
      "type": "vertical",
      "widgets": []
    },
    "right": {
      "type": "vertical",
      "widgets": []
    }
  }'::jsonb;
  
  RAISE NOTICE 'Testing layout structure...';
  RAISE NOTICE 'Layout: %', test_layout;
  RAISE NOTICE 'jsonb_typeof(layout): %', jsonb_typeof(test_layout);
  RAISE NOTICE 'jsonb_typeof(layout->''left''): %', jsonb_typeof(test_layout->'left');
  RAISE NOTICE 'jsonb_typeof(layout->''left''->''widgets''): %', jsonb_typeof(test_layout->'left'->'widgets');
  RAISE NOTICE 'jsonb_typeof(layout->''right''): %', jsonb_typeof(test_layout->'right');
  RAISE NOTICE 'jsonb_typeof(layout->''right''->''widgets''): %', jsonb_typeof(test_layout->'right'->'widgets');
  
  -- Test the constraint conditions
  RAISE NOTICE '--- Constraint Tests ---';
  RAISE NOTICE 'layout ? ''left'': %', test_layout ? 'left';
  RAISE NOTICE 'layout->''left'' ? ''widgets'': %', (test_layout->'left') ? 'widgets';
  
  -- Test if this would pass the constraint
  IF jsonb_typeof(test_layout) = 'object' 
     AND jsonb_typeof(test_layout->'left') = 'object'
     AND jsonb_typeof(test_layout->'left'->'widgets') = 'array'
     AND jsonb_typeof(test_layout->'right') = 'object'
     AND jsonb_typeof(test_layout->'right'->'widgets') = 'array' THEN
    RAISE NOTICE '✅ Layout structure PASSES all constraints';
  ELSE
    RAISE NOTICE '❌ Layout structure FAILS constraints';
  END IF;
  
END $$;

-- Check if there are any existing page_layouts that violate the constraint
SELECT 
  id,
  page_id,
  jsonb_typeof(layout) AS layout_type,
  jsonb_typeof(layout->'left') AS left_type,
  jsonb_typeof(layout->'left'->'widgets') AS left_widgets_type,
  jsonb_typeof(layout->'right') AS right_type,
  jsonb_typeof(layout->'right'->'widgets') AS right_widgets_type,
  layout
FROM public.page_layouts
WHERE NOT (
  jsonb_typeof(layout) = 'object'
  AND (
    NOT (layout ? 'left')
    OR (
      jsonb_typeof(layout->'left') = 'object'
      AND (
        NOT (layout->'left' ? 'widgets')
        OR jsonb_typeof(layout->'left'->'widgets') = 'array'
      )
    )
  )
  AND (
    NOT (layout ? 'right')
    OR (
      jsonb_typeof(layout->'right') = 'object'
      AND (
        NOT (layout->'right' ? 'widgets')
        OR jsonb_typeof(layout->'right'->'widgets') = 'array'
      )
    )
  )
);
