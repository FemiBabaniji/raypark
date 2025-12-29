-- Add task-manager widget type to database
INSERT INTO widget_types (id, key, name, semver, schema, render_hint, created_at)
VALUES (
  gen_random_uuid(),
  'task-manager',
  'Task Manager',
  '1.0.0',
  '{
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "description": "Widget title"
      },
      "projects": {
        "type": "array",
        "description": "List of task projects",
        "items": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "name": { "type": "string" },
            "cover": {
              "type": "object",
              "properties": {
                "kind": { "type": "string" },
                "gradient": { "type": "string" }
              }
            },
            "tasks": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": { "type": "string" },
                  "title": { "type": "string" },
                  "description": { "type": "string" },
                  "due": { "type": "string", "enum": ["today", "tomorrow", "none"] },
                  "done": { "type": "boolean" },
                  "createdAt": { "type": "string" }
                }
              }
            }
          }
        }
      }
    }
  }'::jsonb,
  '{
    "icon": "calendar",
    "category": "productivity",
    "description": "Manage tasks and projects with swipeable cards"
  }'::jsonb,
  now()
)
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  semver = EXCLUDED.semver,
  schema = EXCLUDED.schema,
  render_hint = EXCLUDED.render_hint;
