-- Add missing widget types that are used in the application but not in the database

-- Check if identity widget type exists, if not create it
INSERT INTO widget_types (key, name, description, schema)
VALUES (
  'identity',
  'Identity',
  'Personal identity and profile information including name, bio, avatar, and social links',
  '{
    "type": "object",
    "properties": {
      "name": {"type": "string"},
      "bio": {"type": "string"},
      "title": {"type": "string"},
      "subtitle": {"type": "string"},
      "avatar": {"type": "string"},
      "handle": {"type": "string"},
      "email": {"type": "string"},
      "location": {"type": "string"},
      "initials": {"type": "string"},
      "linkedin": {"type": "string"},
      "dribbble": {"type": "string"},
      "behance": {"type": "string"},
      "twitter": {"type": "string"},
      "unsplash": {"type": "string"},
      "instagram": {"type": "string"}
    }
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  schema = EXCLUDED.schema;

-- Check if startup widget type exists, if not create it
INSERT INTO widget_types (key, name, description, schema)
VALUES (
  'startup',
  'Startup',
  'Startup questionnaire and information widget for onboarding',
  '{
    "type": "object",
    "properties": {
      "title": {"type": "string"},
      "questions": {"type": "array"},
      "answers": {"type": "object"},
      "completed": {"type": "boolean"}
    }
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  schema = EXCLUDED.schema;

-- Verify all widget types
SELECT key, name FROM widget_types ORDER BY key;
