-- Replace the trigger function to validate nested widgets arrays
-- This aligns the trigger with the CHECK constraint which already supports nested structure

CREATE OR REPLACE FUNCTION public.trg_validate_layout_widget_ids()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  side_name text;
  widgets   jsonb;
  elem      jsonb;
  wid_text  text;
  wid_uuid  uuid;
BEGIN
  -- Validate both sides: 'left' and 'right'
  FOREACH side_name IN ARRAY ARRAY['left','right']
  LOOP
    -- Expect side as an object; proceed only if present and object
    IF NEW.layout ? side_name AND jsonb_typeof(NEW.layout -> side_name) = 'object' THEN
      widgets := (NEW.layout -> side_name) -> 'widgets';

      -- widgets must be an array if present; treat null as empty (allowed by CHECK)
      IF widgets IS NULL THEN
        CONTINUE;
      ELSIF jsonb_typeof(widgets) <> 'array' THEN
        RAISE EXCEPTION 'layout.% must have a widgets array', side_name
          USING HINT = 'Expected {"' || side_name || '": {"widgets": [...]}}';
      END IF;

      -- Iterate over each widget entry
      FOR elem IN
        SELECT value FROM jsonb_array_elements(widgets)
      LOOP
        wid_text := NULL;
        wid_uuid := NULL;

        -- Accept either string UUID directly, or object with id
        IF jsonb_typeof(elem) = 'string' THEN
          wid_text := elem #>> '{}';
        ELSIF jsonb_typeof(elem) = 'object' AND (elem ? 'id') THEN
          wid_text := elem ->> 'id';
        ELSE
          -- Allow empty arrays and skip invalid items for now (can tighten later)
          CONTINUE;
        END IF;

        -- Validate UUID format (NULLIF avoids empty string casting)
        IF wid_text IS NOT NULL AND NULLIF(wid_text, '') IS NOT NULL THEN
          BEGIN
            wid_uuid := wid_text::uuid;
          EXCEPTION WHEN invalid_text_representation THEN
            RAISE EXCEPTION 'layout.% contains non-UUID id: %', side_name, wid_text;
          END;

          -- Confirm existence scoped to page_id
          IF NOT EXISTS (
            SELECT 1
            FROM public.widget_instances wi
            WHERE wi.id = wid_uuid
              AND wi.page_id = NEW.page_id
          ) THEN
            RAISE EXCEPTION 'layout.% references unknown widget id % for page %',
              side_name, wid_uuid, NEW.page_id;
          END IF;
        END IF;
      END LOOP;
    ELSIF NEW.layout ? side_name AND jsonb_typeof(NEW.layout -> side_name) <> 'object' THEN
      -- If side exists, it must be an object (consistent with CHECK)
      RAISE EXCEPTION 'layout.% must be an object when present', side_name;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.trg_validate_layout_widget_ids() IS 
'Validates that widget IDs in layout.left.widgets and layout.right.widgets exist in widget_instances for the page. Supports nested structure with widgets arrays.';
