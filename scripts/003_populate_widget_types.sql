-- Populate widget_types catalog with standard portfolio widgets
-- Insert core widget types with JSON schemas

INSERT INTO widget_types (key, name, schema, render_hint, semver) VALUES
(
    'profile',
    'Profile Widget',
    '{
        "type": "object",
        "properties": {
            "name": {"type": "string", "maxLength": 100},
            "title": {"type": "string", "maxLength": 150},
            "subtitle": {"type": "string", "maxLength": 150},
            "bio": {"type": "string", "maxLength": 500},
            "avatar_url": {"type": "string", "format": "uri"},
            "location": {"type": "string", "maxLength": 100},
            "email": {"type": "string", "format": "email"},
            "phone": {"type": "string", "maxLength": 20},
            "website": {"type": "string", "format": "uri"},
            "social_links": {
                "type": "object",
                "properties": {
                    "linkedin": {"type": "string", "format": "uri"},
                    "github": {"type": "string", "format": "uri"},
                    "twitter": {"type": "string", "format": "uri"},
                    "instagram": {"type": "string", "format": "uri"}
                }
            }
        },
        "required": ["name"]
    }'::jsonb,
    '{"defaultWidth": 12, "minHeight": 200, "category": "personal"}'::jsonb,
    '1.0.0'
),
(
    'education',
    'Education Widget',
    '{
        "type": "object",
        "properties": {
            "institution": {"type": "string", "maxLength": 200},
            "degree": {"type": "string", "maxLength": 150},
            "field_of_study": {"type": "string", "maxLength": 150},
            "start_date": {"type": "string", "format": "date"},
            "end_date": {"type": "string", "format": "date"},
            "gpa": {"type": "string", "maxLength": 10},
            "description": {"type": "string", "maxLength": 500},
            "achievements": {
                "type": "array",
                "items": {"type": "string", "maxLength": 200}
            },
            "logo_url": {"type": "string", "format": "uri"}
        },
        "required": ["institution", "degree"]
    }'::jsonb,
    '{"defaultWidth": 6, "minHeight": 150, "category": "academic"}'::jsonb,
    '1.0.0'
),
(
    'work_experience',
    'Work Experience Widget',
    '{
        "type": "object",
        "properties": {
            "company": {"type": "string", "maxLength": 200},
            "role": {"type": "string", "maxLength": 150},
            "employment_type": {"type": "string", "enum": ["full-time", "part-time", "contract", "internship", "freelance"]},
            "start_date": {"type": "string", "format": "date"},
            "end_date": {"type": "string", "format": "date"},
            "current": {"type": "boolean"},
            "location": {"type": "string", "maxLength": 100},
            "description": {"type": "string", "maxLength": 1000},
            "achievements": {
                "type": "array",
                "items": {"type": "string", "maxLength": 300}
            },
            "skills": {
                "type": "array",
                "items": {"type": "string", "maxLength": 50}
            },
            "company_logo": {"type": "string", "format": "uri"}
        },
        "required": ["company", "role"]
    }'::jsonb,
    '{"defaultWidth": 6, "minHeight": 200, "category": "professional"}'::jsonb,
    '1.0.0'
),
(
    'projects',
    'Projects Widget',
    '{
        "type": "object",
        "properties": {
            "title": {"type": "string", "maxLength": 150},
            "description": {"type": "string", "maxLength": 1000},
            "technologies": {
                "type": "array",
                "items": {"type": "string", "maxLength": 50}
            },
            "url": {"type": "string", "format": "uri"},
            "github_url": {"type": "string", "format": "uri"},
            "demo_url": {"type": "string", "format": "uri"},
            "start_date": {"type": "string", "format": "date"},
            "end_date": {"type": "string", "format": "date"},
            "status": {"type": "string", "enum": ["completed", "in-progress", "planned"]},
            "featured": {"type": "boolean"},
            "images": {
                "type": "array",
                "items": {"type": "string", "format": "uri"}
            },
            "team_size": {"type": "integer", "minimum": 1},
            "role": {"type": "string", "maxLength": 100}
        },
        "required": ["title", "description"]
    }'::jsonb,
    '{"defaultWidth": 6, "minHeight": 250, "category": "portfolio"}'::jsonb,
    '1.0.0'
),
(
    'skills',
    'Skills Widget',
    '{
        "type": "object",
        "properties": {
            "category": {"type": "string", "maxLength": 100},
            "skills": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string", "maxLength": 100},
                        "proficiency": {"type": "integer", "minimum": 1, "maximum": 5},
                        "years_experience": {"type": "integer", "minimum": 0},
                        "certified": {"type": "boolean"}
                    },
                    "required": ["name", "proficiency"]
                }
            },
            "display_style": {"type": "string", "enum": ["bars", "circles", "tags", "list"]}
        },
        "required": ["category", "skills"]
    }'::jsonb,
    '{"defaultWidth": 6, "minHeight": 150, "category": "professional"}'::jsonb,
    '1.0.0'
),
(
    'services',
    'Services Widget',
    '{
        "type": "object",
        "properties": {
            "title": {"type": "string", "maxLength": 150},
            "services": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string", "maxLength": 150},
                        "description": {"type": "string", "maxLength": 500},
                        "price": {"type": "string", "maxLength": 50},
                        "duration": {"type": "string", "maxLength": 50},
                        "icon": {"type": "string", "maxLength": 50},
                        "featured": {"type": "boolean"}
                    },
                    "required": ["name", "description"]
                }
            },
            "contact_cta": {"type": "string", "maxLength": 100}
        },
        "required": ["services"]
    }'::jsonb,
    '{"defaultWidth": 12, "minHeight": 200, "category": "business"}'::jsonb,
    '1.0.0'
),
(
    'gallery',
    'Gallery Widget',
    '{
        "type": "object",
        "properties": {
            "title": {"type": "string", "maxLength": 150},
            "layout": {"type": "string", "enum": ["grid", "masonry", "carousel", "list"]},
            "columns": {"type": "integer", "minimum": 1, "maximum": 6},
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "type": {"type": "string", "enum": ["image", "video"]},
                        "url": {"type": "string", "format": "uri"},
                        "thumbnail_url": {"type": "string", "format": "uri"},
                        "title": {"type": "string", "maxLength": 150},
                        "description": {"type": "string", "maxLength": 300},
                        "alt_text": {"type": "string", "maxLength": 200}
                    },
                    "required": ["type", "url"]
                }
            },
            "show_captions": {"type": "boolean"},
            "lightbox_enabled": {"type": "boolean"}
        },
        "required": ["items"]
    }'::jsonb,
    '{"defaultWidth": 12, "minHeight": 300, "category": "media"}'::jsonb,
    '1.0.0'
),
(
    'description',
    'Description Widget',
    '{
        "type": "object",
        "properties": {
            "title": {"type": "string", "maxLength": 150},
            "content": {"type": "string", "maxLength": 2000},
            "format": {"type": "string", "enum": ["plain", "markdown", "html"]},
            "show_title": {"type": "boolean"},
            "alignment": {"type": "string", "enum": ["left", "center", "right", "justify"]}
        },
        "required": ["content"]
    }'::jsonb,
    '{"defaultWidth": 12, "minHeight": 100, "category": "content"}'::jsonb,
    '1.0.0'
),
(
    'contact',
    'Contact Widget',
    '{
        "type": "object",
        "properties": {
            "title": {"type": "string", "maxLength": 150},
            "email": {"type": "string", "format": "email"},
            "phone": {"type": "string", "maxLength": 20},
            "address": {
                "type": "object",
                "properties": {
                    "street": {"type": "string", "maxLength": 200},
                    "city": {"type": "string", "maxLength": 100},
                    "state": {"type": "string", "maxLength": 100},
                    "zip": {"type": "string", "maxLength": 20},
                    "country": {"type": "string", "maxLength": 100}
                }
            },
            "availability": {"type": "string", "maxLength": 200},
            "timezone": {"type": "string", "maxLength": 50},
            "preferred_contact": {"type": "string", "enum": ["email", "phone", "both"]},
            "show_form": {"type": "boolean"},
            "form_fields": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string", "maxLength": 50},
                        "type": {"type": "string", "enum": ["text", "email", "textarea", "select"]},
                        "required": {"type": "boolean"},
                        "placeholder": {"type": "string", "maxLength": 100}
                    },
                    "required": ["name", "type"]
                }
            }
        },
        "required": []
    }'::jsonb,
    '{"defaultWidth": 6, "minHeight": 200, "category": "contact"}'::jsonb,
    '1.0.0'
),
(
    'testimonials',
    'Testimonials Widget',
    '{
        "type": "object",
        "properties": {
            "title": {"type": "string", "maxLength": 150},
            "testimonials": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "content": {"type": "string", "maxLength": 1000},
                        "author": {"type": "string", "maxLength": 100},
                        "position": {"type": "string", "maxLength": 150},
                        "company": {"type": "string", "maxLength": 150},
                        "avatar_url": {"type": "string", "format": "uri"},
                        "rating": {"type": "integer", "minimum": 1, "maximum": 5},
                        "date": {"type": "string", "format": "date"}
                    },
                    "required": ["content", "author"]
                }
            },
            "display_style": {"type": "string", "enum": ["cards", "quotes", "carousel"]},
            "show_ratings": {"type": "boolean"}
        },
        "required": ["testimonials"]
    }'::jsonb,
    '{"defaultWidth": 12, "minHeight": 200, "category": "social"}'::jsonb,
    '1.0.0'
)
ON CONFLICT (key) DO UPDATE SET
    name = EXCLUDED.name,
    schema = EXCLUDED.schema,
    render_hint = EXCLUDED.render_hint,
    semver = EXCLUDED.semver;
