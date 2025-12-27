-- Add the new image widget type to the widget_types catalog
-- This allows users to add individual image widgets to their portfolio

INSERT INTO widget_types (key, name, schema, render_hint, semver) VALUES
(
    'image',
    'Image Widget',
    '{
        "type": "object",
        "properties": {
            "imageUrl": {"type": "string", "format": "uri"},
            "caption": {"type": "string", "maxLength": 300},
            "altText": {"type": "string", "maxLength": 200},
            "author": {"type": "string", "maxLength": 100},
            "handle": {"type": "string", "maxLength": 100},
            "avatarUrl": {"type": "string", "format": "uri"}
        },
        "required": []
    }'::jsonb,
    '{"defaultWidth": 6, "minHeight": 200, "category": "media"}'::jsonb,
    '1.0.0'
)
ON CONFLICT (key) DO UPDATE SET
    name = EXCLUDED.name,
    schema = EXCLUDED.schema,
    render_hint = EXCLUDED.render_hint,
    semver = EXCLUDED.semver;
