-- Final comprehensive fix for widget_instances save issues
-- This script ensures the unique constraint exists and fixes any data issues

-- 1. Remove any duplicate widget instances (keep most recent)
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  WITH duplicates AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY page_id, widget_type_id 
        ORDER BY updated_at DESC NULLS LAST, created_at DESC
      ) as rn
    FROM widget_instances
  )
  DELETE FROM widget_instances
  WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
  );
  
  GET DIAGNOSTICS duplicate_count = ROW_COUNT;
  RAISE NOTICE 'Removed % duplicate widget instance(s)', duplicate_count;
END $$;

-- 2. Drop existing constraint if it exists (idempotent)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'widget_instances_page_widget_unique'
  ) THEN
    ALTER TABLE widget_instances 
    DROP CONSTRAINT widget_instances_page_widget_unique;
    RAISE NOTICE 'Dropped existing constraint widget_instances_page_widget_unique';
  END IF;
END $$;

-- 3. Add the unique constraint
ALTER TABLE widget_instances
ADD CONSTRAINT widget_instances_page_widget_unique 
UNIQUE (page_id, widget_type_id);

-- 4. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_widget_instances_page_type 
ON widget_instances(page_id, widget_type_id);

-- 5. Verify constraint exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'widget_instances_page_widget_unique'
  ) THEN
    RAISE NOTICE '✅ Unique constraint successfully added';
  ELSE
    RAISE EXCEPTION '❌ Failed to add unique constraint';
  END IF;
END $$;

-- 6. Log current state
DO $$
DECLARE
  total_widgets INTEGER;
  unique_combinations INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_widgets FROM widget_instances;
  SELECT COUNT(DISTINCT (page_id, widget_type_id)) INTO unique_combinations FROM widget_instances;
  
  RAISE NOTICE 'Total widget instances: %', total_widgets;
  RAISE NOTICE 'Unique (page_id, widget_type_id) combinations: %', unique_combinations;
  
  IF total_widgets = unique_combinations THEN
    RAISE NOTICE '✅ No duplicates detected';
  ELSE
    RAISE WARNING '⚠️  Found % duplicates', (total_widgets - unique_combinations);
  END IF;
END $$;
