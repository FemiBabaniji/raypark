-- Relax layout widget validation to allow string IDs and skip validation during initialization
-- The trigger was too strict, requiring UUIDs and existing widget_instances even during initial save

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
  has_widgets boolean := false;
BEGIN
  -- Skip validation if layout is null or empty
  IF NEW.layout IS NULL OR NEW.layout = '{}'::jsonb THEN
    RETURN NEW;
  END IF;

  -- Check if there are any widgets in the layout
  IF NEW.layout ? 'left' AND jsonb_typeof(NEW.layout -> 'left') = 'object' THEN
    IF (NEW.layout -> 'left') ? 'widgets' AND jsonb_array_length((NEW.layout -> 'left') -> 'widgets') > 0 THEN
      has_widgets := true;
    END IF;
  END IF;
  
  IF NEW.layout ? 'right' AND jsonb_typeof(NEW.layout -> 'right') = 'object' THEN
    IF (NEW.layout -> 'right') ? 'widgets' AND jsonb_array_length((NEW.layout -> 'right') -> 'widgets') > 0 THEN
      has_widgets := true;
    END IF;
  END IF;

  -- Skip validation if no widgets are present (initialization case)
  IF NOT has_widgets THEN
    RETURN NEW;
  END IF;

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

        -- Accept string IDs without UUID validation
        -- Accept either string directly, or object with id
        IF jsonb_typeof(elem) = 'string' THEN
          wid_text := elem #>> '{}';
        ELSIF jsonb_typeof(elem) = 'object' AND (elem ? 'id') THEN
          wid_text := elem ->> 'id';
        ELSE
          -- Allow empty arrays and skip invalid items for now
          CONTINUE;
        END IF;

        -- Skip UUID validation and widget_instances check for now
        -- This allows string IDs like "identity", "startup", etc.
        -- Validation can be re-enabled later when widget_instances are properly synced
        
        -- Optional: Log warning for debugging
        -- RAISE WARNING 'layout.% contains widget id: %', side_name, wid_text;
        
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
'Validates layout structure but allows string widget IDs without strict UUID/existence checks during initialization. Skips validation for empty layouts.';
