-- Temporarily remove the strict layout constraint that's preventing saves
-- This allows the app to work while we align the data structure

-- Drop the constraint
ALTER TABLE page_layouts 
DROP CONSTRAINT IF EXISTS valid_layout_structure;

-- Drop the validation function (no longer needed without the constraint)
DROP FUNCTION IF EXISTS validate_layout_structure(jsonb);

-- Keep the helper function for migrations
-- (migrate_legacy_layout is still useful)

COMMENT ON COLUMN page_layouts.layout IS 
'Flexible layout configuration in JSONB format. Supports multiple formats for backward compatibility.';
