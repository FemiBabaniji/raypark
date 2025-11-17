-- Add missing widget types that UI uses but database doesn't have
-- Run this script to fix widget type mismatches

-- Add 'identity' widget type (UI uses this instead of 'profile')
INSERT INTO widget_types (key, name, schema, render_hint, semver)
VALUES (
  'identity',
  'Identity Widget',
  '{
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "handle": { "type": "string" },
      "avatarUrl": { "type": "string" },
      "selectedColor": { "type": "string" },
      "title": { "type": "string" },
      "email": { "type": "string" },
      "location": { "type": "string" },
      "bio": { "type": "string" },
      "linkedin": { "type": "string" },
      "dribbble": { "type": "string" },
      "behance": { "type": "string" },
      "twitter": { "type": "string" },
      "unsplash": { "type": "string" },
      "instagram": { "type": "string" }
    }
  }'::jsonb,
  '{}'::jsonb,
  '1.0.0'
)
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  schema = EXCLUDED.schema;

-- Add 'startup' widget type
INSERT INTO widget_types (key, name, schema, render_hint, semver)
VALUES (
  'startup',
  'Startup Widget',
  '{
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "description": { "type": "string" },
      "logo": { "type": "string" },
      "website": { "type": "string" }
    }
  }'::jsonb,
  '{}'::jsonb,
  '1.0.0'
)
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  schema = EXCLUDED.schema;

-- Add 'meeting-scheduler' widget type
INSERT INTO widget_types (key, name, schema, render_hint, semver)
VALUES (
  'meeting-scheduler',
  'Meeting Scheduler Widget',
  '{
    "type": "object",
    "properties": {
      "mode": { "type": "string", "enum": ["calendly", "manual"] },
      "calendlyUrl": { "type": "string" },
      "title": { "type": "string" },
      "description": { "type": "string" }
    }
  }'::jsonb,
  '{}'::jsonb,
  '1.0.0'
)
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  schema = EXCLUDED.schema;

-- Verify widget types were added
SELECT key, name FROM widget_types WHERE key IN ('identity', 'startup', 'meeting-scheduler');
