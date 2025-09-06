-- Seed data for portfolio platform demo

-- Insert sample themes
INSERT INTO themes (id, user_id, name, tokens) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid, -- Placeholder user ID
    'Modern Professional',
    '{
        "colors": {
            "primary": "#2563eb",
            "secondary": "#64748b",
            "accent": "#06b6d4",
            "background": "#ffffff",
            "surface": "#f8fafc",
            "text": "#1e293b",
            "textSecondary": "#64748b"
        },
        "typography": {
            "fontFamily": "Inter, system-ui, sans-serif",
            "headingFont": "Inter, system-ui, sans-serif",
            "sizes": {
                "xs": "0.75rem",
                "sm": "0.875rem",
                "base": "1rem",
                "lg": "1.125rem",
                "xl": "1.25rem",
                "2xl": "1.5rem",
                "3xl": "1.875rem"
            }
        },
        "spacing": {
            "unit": "1rem",
            "scale": [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32]
        },
        "borderRadius": {
            "sm": "0.125rem",
            "base": "0.25rem",
            "md": "0.375rem",
            "lg": "0.5rem",
            "xl": "0.75rem"
        }
    }'::jsonb
),
(
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    '550e8400-e29b-41d4-a716-446655440001'::uuid, -- Placeholder user ID
    'Creative Dark',
    '{
        "colors": {
            "primary": "#8b5cf6",
            "secondary": "#a78bfa",
            "accent": "#06b6d4",
            "background": "#0f172a",
            "surface": "#1e293b",
            "text": "#f1f5f9",
            "textSecondary": "#94a3b8"
        },
        "typography": {
            "fontFamily": "Poppins, system-ui, sans-serif",
            "headingFont": "Poppins, system-ui, sans-serif"
        },
        "spacing": {
            "unit": "1rem"
        }
    }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample portfolios
INSERT INTO portfolios (id, user_id, name, slug, theme_id, is_public) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Jenny Wilson Portfolio',
    'jenny-wilson',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    true
),
(
    '660e8400-e29b-41d4-a716-446655440002'::uuid,
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'John Doe Portfolio',
    'john-doe',
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample pages
INSERT INTO pages (id, portfolio_id, key, title, route) VALUES
(
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    '660e8400-e29b-41d4-a716-446655440001'::uuid,
    'portfolio',
    'Jenny Wilson - UX Designer',
    '/p/jenny-wilson'
),
(
    '770e8400-e29b-41d4-a716-446655440002'::uuid,
    '660e8400-e29b-41d4-a716-446655440002'::uuid,
    'portfolio',
    'John Doe - Full Stack Developer',
    '/p/john-doe'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample page layouts
INSERT INTO page_layouts (id, page_id, layout) VALUES
(
    '880e8400-e29b-41d4-a716-446655440001'::uuid,
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    '{
        "left": ["990e8400-e29b-41d4-a716-446655440001", "990e8400-e29b-41d4-a716-446655440003", "990e8400-e29b-41d4-a716-446655440005"],
        "right": ["990e8400-e29b-41d4-a716-446655440002", "990e8400-e29b-41d4-a716-446655440004", "990e8400-e29b-41d4-a716-446655440006"]
    }'::jsonb
),
(
    '880e8400-e29b-41d4-a716-446655440002'::uuid,
    '770e8400-e29b-41d4-a716-446655440002'::uuid,
    '{
        "left": ["990e8400-e29b-41d4-a716-446655440007", "990e8400-e29b-41d4-a716-446655440009", "990e8400-e29b-41d4-a716-446655440011"],
        "right": ["990e8400-e29b-41d4-a716-446655440008", "990e8400-e29b-41d4-a716-446655440010", "990e8400-e29b-41d4-a716-446655440012"]
    }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample widget instances for Jenny Wilson
INSERT INTO widget_instances (id, page_id, widget_type_id, props, enabled) VALUES
-- Profile widget
(
    '990e8400-e29b-41d4-a716-446655440001'::uuid,
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    (SELECT id FROM widget_types WHERE key = 'profile'),
    '{
        "name": "Jenny Wilson",
        "title": "Senior UX Designer",
        "subtitle": "Creating delightful user experiences",
        "bio": "Passionate UX designer with 8+ years of experience crafting user-centered digital products. I specialize in design systems, user research, and creating intuitive interfaces that solve real problems.",
        "avatar_url": "/professional-headshot.png",
        "location": "San Francisco, CA",
        "email": "jenny@example.com",
        "social_links": {
            "linkedin": "https://linkedin.com/in/jennywilson",
            "github": "https://github.com/jennywilson",
            "twitter": "https://twitter.com/jennywilson"
        }
    }'::jsonb,
    true
),
-- Skills widget
(
    '990e8400-e29b-41d4-a716-446655440002'::uuid,
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    (SELECT id FROM widget_types WHERE key = 'skills'),
    '{
        "category": "Design Skills",
        "skills": [
            {"name": "User Research", "proficiency": 5, "years_experience": 8},
            {"name": "Prototyping", "proficiency": 5, "years_experience": 7},
            {"name": "Design Systems", "proficiency": 4, "years_experience": 5},
            {"name": "Figma", "proficiency": 5, "years_experience": 6},
            {"name": "Adobe Creative Suite", "proficiency": 4, "years_experience": 8}
        ],
        "display_style": "bars"
    }'::jsonb,
    true
),
-- Work experience widget
(
    '990e8400-e29b-41d4-a716-446655440003'::uuid,
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    (SELECT id FROM widget_types WHERE key = 'work_experience'),
    '{
        "company": "TechCorp Inc.",
        "role": "Senior UX Designer",
        "employment_type": "full-time",
        "start_date": "2021-03-01",
        "current": true,
        "location": "San Francisco, CA",
        "description": "Lead UX design for the main product suite, managing a team of 3 designers and collaborating with product managers and engineers to deliver user-centered solutions.",
        "achievements": [
            "Redesigned core user flow, increasing conversion by 35%",
            "Established design system used across 5 product teams",
            "Led user research initiatives that informed product strategy"
        ],
        "skills": ["User Research", "Design Systems", "Team Leadership", "Figma", "Prototyping"]
    }'::jsonb,
    true
),
-- Projects widget
(
    '990e8400-e29b-41d4-a716-446655440004'::uuid,
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    (SELECT id FROM widget_types WHERE key = 'projects'),
    '{
        "title": "E-commerce Mobile App Redesign",
        "description": "Complete redesign of a mobile shopping app, focusing on improving user experience and increasing conversion rates. Conducted extensive user research and usability testing.",
        "technologies": ["Figma", "Principle", "Maze", "UserTesting"],
        "url": "https://dribbble.com/shots/ecommerce-redesign",
        "start_date": "2023-01-01",
        "end_date": "2023-06-01",
        "status": "completed",
        "featured": true,
        "images": ["/project-ecommerce-1.jpg", "/project-ecommerce-2.jpg"],
        "team_size": 4,
        "role": "Lead UX Designer"
    }'::jsonb,
    true
),
-- Education widget
(
    '990e8400-e29b-41d4-a716-446655440005'::uuid,
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    (SELECT id FROM widget_types WHERE key = 'education'),
    '{
        "institution": "Stanford University",
        "degree": "Master of Science",
        "field_of_study": "Human-Computer Interaction",
        "start_date": "2013-09-01",
        "end_date": "2015-06-01",
        "gpa": "3.8",
        "description": "Focused on user-centered design methodologies and emerging interaction paradigms.",
        "achievements": [
            "Thesis on AR/VR interface design patterns",
            "Teaching Assistant for Design Thinking course"
        ]
    }'::jsonb,
    true
),
-- Contact widget
(
    '990e8400-e29b-41d4-a716-446655440006'::uuid,
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    (SELECT id FROM widget_types WHERE key = 'contact'),
    '{
        "title": "Get In Touch",
        "email": "jenny@example.com",
        "availability": "Available for freelance projects",
        "timezone": "PST (UTC-8)",
        "preferred_contact": "email",
        "show_form": true,
        "form_fields": [
            {"name": "name", "type": "text", "required": true, "placeholder": "Your Name"},
            {"name": "email", "type": "email", "required": true, "placeholder": "Your Email"},
            {"name": "message", "type": "textarea", "required": true, "placeholder": "Your Message"}
        ]
    }'::jsonb,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample widget instances for John Doe
INSERT INTO widget_instances (id, page_id, widget_type_id, props, enabled) VALUES
-- Profile widget
(
    '990e8400-e29b-41d4-a716-446655440007'::uuid,
    '770e8400-e29b-41d4-a716-446655440002'::uuid,
    (SELECT id FROM widget_types WHERE key = 'profile'),
    '{
        "name": "John Doe",
        "title": "Full Stack Developer",
        "subtitle": "Building scalable web applications",
        "bio": "Experienced full-stack developer with expertise in React, Node.js, and cloud technologies. I love creating efficient, maintainable code and solving complex technical challenges.",
        "avatar_url": "/man-developer.png",
        "location": "Austin, TX",
        "email": "john@example.com",
        "website": "https://johndoe.dev",
        "social_links": {
            "linkedin": "https://linkedin.com/in/johndoe",
            "github": "https://github.com/johndoe",
            "twitter": "https://twitter.com/johndoe"
        }
    }'::jsonb,
    true
),
-- Skills widget
(
    '990e8400-e29b-41d4-a716-446655440008'::uuid,
    '770e8400-e29b-41d4-a716-446655440002'::uuid,
    (SELECT id FROM widget_types WHERE key = 'skills'),
    '{
        "category": "Technical Skills",
        "skills": [
            {"name": "React", "proficiency": 5, "years_experience": 6},
            {"name": "Node.js", "proficiency": 5, "years_experience": 7},
            {"name": "TypeScript", "proficiency": 4, "years_experience": 4},
            {"name": "PostgreSQL", "proficiency": 4, "years_experience": 5},
            {"name": "AWS", "proficiency": 4, "years_experience": 3}
        ],
        "display_style": "circles"
    }'::jsonb,
    true
),
-- Work experience widget
(
    '990e8400-e29b-41d4-a716-446655440009'::uuid,
    '770e8400-e29b-41d4-a716-446655440002'::uuid,
    (SELECT id FROM widget_types WHERE key = 'work_experience'),
    '{
        "company": "StartupXYZ",
        "role": "Senior Full Stack Developer",
        "employment_type": "full-time",
        "start_date": "2020-01-01",
        "current": true,
        "location": "Austin, TX",
        "description": "Lead development of core platform features, architect scalable solutions, and mentor junior developers in a fast-paced startup environment.",
        "achievements": [
            "Built microservices architecture serving 1M+ users",
            "Reduced API response times by 60% through optimization",
            "Mentored 5 junior developers to senior level"
        ],
        "skills": ["React", "Node.js", "PostgreSQL", "AWS", "Docker", "Kubernetes"]
    }'::jsonb,
    true
),
-- Projects widget
(
    '990e8400-e29b-41d4-a716-446655440010'::uuid,
    '770e8400-e29b-41d4-a716-446655440002'::uuid,
    (SELECT id FROM widget_types WHERE key = 'projects'),
    '{
        "title": "Real-time Collaboration Platform",
        "description": "Built a real-time collaboration platform similar to Figma, supporting multiple users editing documents simultaneously with conflict resolution and version history.",
        "technologies": ["React", "Node.js", "Socket.io", "PostgreSQL", "Redis", "AWS"],
        "url": "https://collab-platform.com",
        "github_url": "https://github.com/johndoe/collab-platform",
        "start_date": "2022-06-01",
        "end_date": "2023-03-01",
        "status": "completed",
        "featured": true,
        "team_size": 3,
        "role": "Technical Lead"
    }'::jsonb,
    true
),
-- Education widget
(
    '990e8400-e29b-41d4-a716-446655440011'::uuid,
    '770e8400-e29b-41d4-a716-446655440002'::uuid,
    (SELECT id FROM widget_types WHERE key = 'education'),
    '{
        "institution": "University of Texas at Austin",
        "degree": "Bachelor of Science",
        "field_of_study": "Computer Science",
        "start_date": "2014-08-01",
        "end_date": "2018-05-01",
        "gpa": "3.7",
        "description": "Concentrated in software engineering and database systems.",
        "achievements": [
            "Dean''s List for 6 semesters",
            "President of Computer Science Student Association"
        ]
    }'::jsonb,
    true
),
-- Services widget
(
    '990e8400-e29b-41d4-a716-446655440012'::uuid,
    '770e8400-e29b-41d4-a716-446655440002'::uuid,
    (SELECT id FROM widget_types WHERE key = 'services'),
    '{
        "title": "Development Services",
        "services": [
            {
                "name": "Full Stack Development",
                "description": "End-to-end web application development using modern technologies",
                "price": "Starting at $150/hour",
                "duration": "2-12 weeks",
                "icon": "code",
                "featured": true
            },
            {
                "name": "Technical Consulting",
                "description": "Architecture review, code audits, and technical strategy consulting",
                "price": "Starting at $200/hour",
                "duration": "1-4 weeks",
                "icon": "consulting",
                "featured": false
            },
            {
                "name": "API Development",
                "description": "RESTful and GraphQL API design and implementation",
                "price": "Starting at $120/hour",
                "duration": "1-6 weeks",
                "icon": "api",
                "featured": true
            }
        ],
        "contact_cta": "Get in touch to discuss your project"
    }'::jsonb,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Create published versions for both pages
INSERT INTO page_versions (id, page_id, status, snapshot, created_by, published_at) VALUES
(
    'aa0e8400-e29b-41d4-a716-446655440001'::uuid,
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    'published',
    '{
        "page": {
            "id": "770e8400-e29b-41d4-a716-446655440001",
            "key": "portfolio",
            "title": "Jenny Wilson - UX Designer",
            "route": "/p/jenny-wilson"
        },
        "theme": {
            "id": "550e8400-e29b-41d4-a716-446655440001",
            "name": "Modern Professional",
            "tokens": {}
        },
        "layout": {
            "left": ["990e8400-e29b-41d4-a716-446655440001", "990e8400-e29b-41d4-a716-446655440003", "990e8400-e29b-41d4-a716-446655440005"],
            "right": ["990e8400-e29b-41d4-a716-446655440002", "990e8400-e29b-41d4-a716-446655440004", "990e8400-e29b-41d4-a716-446655440006"]
        },
        "widgets": []
    }'::jsonb,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    now() - interval '1 day'
),
(
    'aa0e8400-e29b-41d4-a716-446655440002'::uuid,
    '770e8400-e29b-41d4-a716-446655440002'::uuid,
    'published',
    '{
        "page": {
            "id": "770e8400-e29b-41d4-a716-446655440002",
            "key": "portfolio",
            "title": "John Doe - Full Stack Developer",
            "route": "/p/john-doe"
        },
        "theme": {
            "id": "550e8400-e29b-41d4-a716-446655440002",
            "name": "Creative Dark",
            "tokens": {}
        },
        "layout": {
            "left": ["990e8400-e29b-41d4-a716-446655440007", "990e8400-e29b-41d4-a716-446655440009", "990e8400-e29b-41d4-a716-446655440011"],
            "right": ["990e8400-e29b-41d4-a716-446655440008", "990e8400-e29b-41d4-a716-446655440010", "990e8400-e29b-41d4-a716-446655440012"]
        },
        "widgets": []
    }'::jsonb,
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    now() - interval '2 hours'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample media assets
INSERT INTO media_assets (id, user_id, page_id, widget_instance_id, kind, path, metadata) VALUES
(
    'bb0e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    '990e8400-e29b-41d4-a716-446655440001'::uuid,
    'image',
    'user/550e8400-e29b-41d4-a716-446655440000/public/professional-headshot.png',
    '{"alt": "Jenny Wilson professional headshot", "width": 400, "height": 400}'::jsonb
),
(
    'bb0e8400-e29b-41d4-a716-446655440002'::uuid,
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '770e8400-e29b-41d4-a716-446655440002'::uuid,
    '990e8400-e29b-41d4-a716-446655440007'::uuid,
    'image',
    'user/550e8400-e29b-41d4-a716-446655440001/public/man-developer.png',
    '{"alt": "John Doe professional photo", "width": 400, "height": 400}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample activity log entries
INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'portfolio',
    '660e8400-e29b-41d4-a716-446655440001'::uuid,
    'created',
    '{"name": "Jenny Wilson Portfolio"}'::jsonb
),
(
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'portfolio',
    '660e8400-e29b-41d4-a716-446655440002'::uuid,
    'created',
    '{"name": "John Doe Portfolio"}'::jsonb
),
(
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'page',
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    'published',
    '{"version_id": "aa0e8400-e29b-41d4-a716-446655440001"}'::jsonb
),
(
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'page',
    '770e8400-e29b-41d4-a716-446655440002'::uuid,
    'published',
    '{"version_id": "aa0e8400-e29b-41d4-a716-446655440002"}'::jsonb
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_portfolios_search ON portfolios USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_pages_search ON pages USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_page_versions_search ON page_versions USING gin(to_tsvector('english', snapshot::text));
