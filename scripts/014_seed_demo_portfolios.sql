-- Comprehensive demo portfolio seeding
-- Creates demo user first, then all associated data

DO $$
DECLARE
  DEMO_USER_UUID uuid := '11111111-1111-1111-1111-111111111111';
  jenny_theme_id uuid;
  jenny_portfolio_id uuid;
  jenny_page_id uuid;
  john_theme_id uuid;
  john_portfolio_id uuid;
  john_page_id uuid;
  widget_type_profile uuid;
  widget_type_education uuid;
  widget_type_work uuid;
  widget_type_projects uuid;
  widget_type_skills uuid;
  widget_type_services uuid;
  widget_type_description uuid;
  widget_type_contact uuid;
  widget_type_testimonials uuid;
  widget_type_gallery uuid;
BEGIN

-- Create demo user first (required for foreign key constraints)
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
VALUES (
  DEMO_USER_UUID,
  'demo@pathwai.com',
  now(),
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create corresponding profile in public.users table
INSERT INTO public.users (id, email, full_name, avatar_url, created_at, updated_at)
VALUES (
  DEMO_USER_UUID,
  'demo@pathwai.com',
  'Demo User',
  '/demo/demo-avatar.png',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Get widget type IDs
SELECT id INTO widget_type_profile FROM public.widget_types WHERE key = 'profile';
SELECT id INTO widget_type_education FROM public.widget_types WHERE key = 'education';
SELECT id INTO widget_type_work FROM public.widget_types WHERE key = 'work_experience';
SELECT id INTO widget_type_projects FROM public.widget_types WHERE key = 'projects';
SELECT id INTO widget_type_skills FROM public.widget_types WHERE key = 'skills';
SELECT id INTO widget_type_services FROM public.widget_types WHERE key = 'services';
SELECT id INTO widget_type_description FROM public.widget_types WHERE key = 'description';
SELECT id INTO widget_type_contact FROM public.widget_types WHERE key = 'contact';
SELECT id INTO widget_type_testimonials FROM public.widget_types WHERE key = 'testimonials';
SELECT id INTO widget_type_gallery FROM public.widget_types WHERE key = 'gallery';

-- JENNY WILSON DEMO PORTFOLIO
jenny_theme_id := gen_random_uuid();
jenny_portfolio_id := gen_random_uuid();
jenny_page_id := gen_random_uuid();

-- Jenny's theme
INSERT INTO public.themes (id, user_id, name, tokens)
VALUES (
  jenny_theme_id,
  DEMO_USER_UUID,
  'Demo – Creative Rose',
  jsonb_build_object(
    'color.profile', 'rose',
    'color.project.web', 'blue',
    'color.project.aiml', 'purple',
    'color.project.mobile', 'green',
    'color.project.devops', 'orange'
  )
);

-- Jenny's portfolio
INSERT INTO public.portfolios (id, user_id, name, slug, theme_id, is_public, is_demo, created_at, updated_at)
VALUES (
  jenny_portfolio_id,
  DEMO_USER_UUID,
  'Jenny Wilson - UX Designer',
  'jenny-wilson',
  jenny_theme_id,
  true,
  true,
  now(),
  now()
);

-- Jenny's page
INSERT INTO public.pages (id, portfolio_id, key, title, route, is_demo, created_at, updated_at)
VALUES (
  jenny_page_id,
  jenny_portfolio_id,
  'home',
  'Home',
  '/demo/jenny-wilson',
  true,
  now(),
  now()
);

-- Jenny's layout
INSERT INTO public.page_layouts (id, page_id, layout, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  jenny_page_id,
  jsonb_build_object(
    'left', jsonb_build_array('profile', 'education'),
    'right', jsonb_build_array('description', 'projects', 'services', 'contact')
  ),
  now(),
  now()
);

-- Jenny's widgets
INSERT INTO public.widget_instances (id, page_id, widget_type_id, props, enabled, created_at, updated_at)
VALUES
  -- Profile widget
  (gen_random_uuid(), jenny_page_id, widget_type_profile, jsonb_build_object(
    'name', 'Jenny Wilson',
    'title', 'UX Designer',
    'subtitle', 'Creating intuitive digital experiences',
    'bio', 'Passionate UX designer with 5+ years of experience creating user-centered digital products. I specialize in design systems, user research, and prototyping.',
    'location', 'San Francisco, CA',
    'profileColor', 'rose',
    'avatar', '/demo/jenny/avatar.png',
    'social', jsonb_build_object(
      'linkedin', 'https://linkedin.com/in/jennywilson',
      'dribbble', 'https://dribbble.com/jennywilson',
      'behance', 'https://behance.net/jennywilson'
    )
  ), true, now(), now()),
  
  -- Education widget
  (gen_random_uuid(), jenny_page_id, widget_type_education, jsonb_build_object(
    'items', jsonb_build_array(
      jsonb_build_object(
        'institution', 'Stanford University',
        'degree', 'Master of Human-Computer Interaction',
        'period', '2016-2018',
        'gpa', '3.8',
        'achievements', jsonb_build_array('Dean''s List', 'UX Research Award')
      ),
      jsonb_build_object(
        'institution', 'UC Berkeley',
        'degree', 'Bachelor of Arts in Psychology',
        'period', '2012-2016',
        'gpa', '3.6',
        'achievements', jsonb_build_array('Magna Cum Laude', 'Psychology Honor Society')
      )
    )
  ), true, now(), now()),
  
  -- Description widget
  (gen_random_uuid(), jenny_page_id, widget_type_description, jsonb_build_object(
    'title', 'About Me',
    'description', 'I''m a passionate UX designer who believes great design should be invisible to users but transformative for businesses. My approach combines user research, data-driven insights, and creative problem-solving.',
    'subdescription', 'I focus on creating design systems that scale, conducting user research that informs decisions, and prototyping solutions that delight users while meeting business objectives.'
  ), true, now(), now()),
  
  -- Projects widget
  (gen_random_uuid(), jenny_page_id, widget_type_projects, jsonb_build_object(
    'cards', jsonb_build_array('web', 'aiml', 'mobile'),
    'projects', jsonb_build_object(
      'web', jsonb_build_object(
        'title', 'E-commerce Redesign',
        'description', 'Complete UX overhaul of a major e-commerce platform',
        'technologies', jsonb_build_array('Figma', 'Principle', 'UserTesting'),
        'role', 'Lead UX Designer',
        'team_size', 4,
        'duration', '6 months',
        'link', 'https://jennywilson.design/ecommerce'
      ),
      'aiml', jsonb_build_object(
        'title', 'AI Assistant Interface',
        'description', 'Designed conversational UI for AI-powered customer service',
        'technologies', jsonb_build_array('Sketch', 'InVision', 'Maze'),
        'role', 'Senior UX Designer',
        'team_size', 3,
        'duration', '4 months',
        'link', 'https://jennywilson.design/ai-assistant'
      ),
      'mobile', jsonb_build_object(
        'title', 'Fitness Tracking App',
        'description', 'Mobile-first design for health and wellness platform',
        'technologies', jsonb_build_array('Figma', 'Framer', 'Hotjar'),
        'role', 'UX/UI Designer',
        'team_size', 2,
        'duration', '3 months',
        'link', 'https://jennywilson.design/fitness-app'
      )
    )
  ), true, now(), now()),
  
  -- Services widget
  (gen_random_uuid(), jenny_page_id, widget_type_services, jsonb_build_object(
    'blurb', 'I offer comprehensive UX design services from research to final implementation.',
    'services', jsonb_build_array(
      jsonb_build_object(
        'name', 'UX Research & Strategy',
        'description', 'User interviews, usability testing, and strategic recommendations',
        'rate', '$150/hour'
      ),
      jsonb_build_object(
        'name', 'UI/UX Design',
        'description', 'Complete interface design from wireframes to high-fidelity mockups',
        'rate', '$120/hour'
      ),
      jsonb_build_object(
        'name', 'Design System Creation',
        'description', 'Scalable design systems and component libraries',
        'rate', '$180/hour'
      )
    )
  ), true, now(), now()),
  
  -- Contact widget
  (gen_random_uuid(), jenny_page_id, widget_type_contact, jsonb_build_object(
    'email', 'jenny@jennywilson.design',
    'phone', '+1 (555) 123-4567',
    'availability', 'Available for freelance projects',
    'timezone', 'PST (UTC-8)',
    'response_time', 'Usually responds within 24 hours'
  ), true, now(), now());

-- JOHN DOE DEMO PORTFOLIO
john_theme_id := gen_random_uuid();
john_portfolio_id := gen_random_uuid();
john_page_id := gen_random_uuid();

-- John's theme
INSERT INTO public.themes (id, user_id, name, tokens)
VALUES (
  john_theme_id,
  DEMO_USER_UUID,
  'Demo – Developer Dark',
  jsonb_build_object(
    'color.profile', 'blue',
    'color.project.web', 'cyan',
    'color.project.aiml', 'purple',
    'color.project.mobile', 'green',
    'color.project.devops', 'orange'
  )
);

-- John's portfolio
INSERT INTO public.portfolios (id, user_id, name, slug, theme_id, is_public, is_demo, created_at, updated_at)
VALUES (
  john_portfolio_id,
  DEMO_USER_UUID,
  'John Doe - Full Stack Developer',
  'john-doe',
  john_theme_id,
  true,
  true,
  now(),
  now()
);

-- John's page
INSERT INTO public.pages (id, portfolio_id, key, title, route, is_demo, created_at, updated_at)
VALUES (
  john_page_id,
  john_portfolio_id,
  'home',
  'Home',
  '/demo/john-doe',
  true,
  now(),
  now()
);

-- John's layout
INSERT INTO public.page_layouts (id, page_id, layout, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  john_page_id,
  jsonb_build_object(
    'left', jsonb_build_array('profile', 'skills', 'education'),
    'right', jsonb_build_array('description', 'work_experience', 'projects', 'services')
  ),
  now(),
  now()
);

-- John's widgets
INSERT INTO public.widget_instances (id, page_id, widget_type_id, props, enabled, created_at, updated_at)
VALUES
  -- Profile widget
  (gen_random_uuid(), john_page_id, widget_type_profile, jsonb_build_object(
    'name', 'John Doe',
    'title', 'Full Stack Developer',
    'subtitle', 'Building scalable web applications',
    'bio', 'Experienced full-stack developer with expertise in React, Node.js, and cloud technologies. Passionate about creating efficient, maintainable code and mentoring junior developers.',
    'location', 'Austin, TX',
    'profileColor', 'blue',
    'avatar', '/demo/john/avatar.png',
    'website', 'https://johndoe.dev',
    'social', jsonb_build_object(
      'linkedin', 'https://linkedin.com/in/johndoe',
      'github', 'https://github.com/johndoe',
      'twitter', 'https://twitter.com/johndoe'
    )
  ), true, now(), now()),
  
  -- Skills widget
  (gen_random_uuid(), john_page_id, widget_type_skills, jsonb_build_object(
    'skills', jsonb_build_array(
      jsonb_build_object('name', 'React', 'proficiency', 5, 'years', 6),
      jsonb_build_object('name', 'Node.js', 'proficiency', 5, 'years', 7),
      jsonb_build_object('name', 'TypeScript', 'proficiency', 4, 'years', 4),
      jsonb_build_object('name', 'PostgreSQL', 'proficiency', 4, 'years', 5),
      jsonb_build_object('name', 'AWS', 'proficiency', 4, 'years', 3),
      jsonb_build_object('name', 'Docker', 'proficiency', 3, 'years', 3)
    )
  ), true, now(), now()),
  
  -- Education widget
  (gen_random_uuid(), john_page_id, widget_type_education, jsonb_build_object(
    'items', jsonb_build_array(
      jsonb_build_object(
        'institution', 'University of Texas at Austin',
        'degree', 'Bachelor of Science in Computer Science',
        'period', '2014-2018',
        'gpa', '3.7',
        'achievements', jsonb_build_array('Dean''s List', 'CS Student Association President')
      )
    )
  ), true, now(), now()),
  
  -- Description widget
  (gen_random_uuid(), john_page_id, widget_type_description, jsonb_build_object(
    'title', 'About Me',
    'description', 'I''m a full-stack developer who loves building products that make a difference. With 7+ years of experience, I''ve worked on everything from startups to enterprise applications.',
    'subdescription', 'I specialize in React and Node.js ecosystems, with strong experience in cloud architecture, database design, and DevOps practices. I''m passionate about clean code, performance optimization, and mentoring other developers.'
  ), true, now(), now()),
  
  -- Work Experience widget
  (gen_random_uuid(), john_page_id, widget_type_work, jsonb_build_object(
    'experiences', jsonb_build_array(
      jsonb_build_object(
        'company', 'StartupXYZ',
        'role', 'Senior Full Stack Developer',
        'period', '2020-Present',
        'location', 'Austin, TX',
        'description', 'Lead developer on core platform serving 1M+ users',
        'achievements', jsonb_build_array(
          'Built microservices architecture handling 10k+ requests/minute',
          'Reduced API response times by 60% through optimization',
          'Mentored 5 junior developers and established code review processes'
        ),
        'technologies', jsonb_build_array('React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker')
      ),
      jsonb_build_object(
        'company', 'TechCorp',
        'role', 'Full Stack Developer',
        'period', '2018-2020',
        'location', 'Austin, TX',
        'description', 'Developed customer-facing web applications and internal tools',
        'achievements', jsonb_build_array(
          'Launched 3 major product features used by 100k+ customers',
          'Improved application performance by 40%',
          'Implemented automated testing reducing bugs by 50%'
        ),
        'technologies', jsonb_build_array('React', 'Express.js', 'MongoDB', 'Redis')
      )
    )
  ), true, now(), now()),
  
  -- Projects widget
  (gen_random_uuid(), john_page_id, widget_type_projects, jsonb_build_object(
    'cards', jsonb_build_array('web', 'aiml', 'mobile', 'devops'),
    'projects', jsonb_build_object(
      'web', jsonb_build_object(
        'title', 'Real-time Collaboration Platform',
        'description', 'Built a Figma-like collaborative design tool with real-time editing',
        'technologies', jsonb_build_array('React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redis'),
        'role', 'Technical Lead',
        'team_size', 3,
        'duration', '8 months',
        'github', 'https://github.com/johndoe/collab-platform',
        'demo', 'https://collab.johndoe.dev'
      ),
      'aiml', jsonb_build_object(
        'title', 'AI Code Review Assistant',
        'description', 'ML-powered tool for automated code review and suggestions',
        'technologies', jsonb_build_array('Python', 'TensorFlow', 'React', 'FastAPI'),
        'role', 'Full Stack Developer',
        'team_size', 2,
        'duration', '4 months',
        'github', 'https://github.com/johndoe/ai-code-review'
      ),
      'mobile', jsonb_build_object(
        'title', 'React Native Expense Tracker',
        'description', 'Cross-platform mobile app for personal finance management',
        'technologies', jsonb_build_array('React Native', 'Expo', 'Node.js', 'MongoDB'),
        'role', 'Solo Developer',
        'team_size', 1,
        'duration', '3 months',
        'github', 'https://github.com/johndoe/expense-tracker'
      ),
      'devops', jsonb_build_object(
        'title', 'Kubernetes CI/CD Pipeline',
        'description', 'Automated deployment pipeline for microservices architecture',
        'technologies', jsonb_build_array('Kubernetes', 'Docker', 'Jenkins', 'AWS', 'Terraform'),
        'role', 'DevOps Engineer',
        'team_size', 2,
        'duration', '2 months',
        'github', 'https://github.com/johndoe/k8s-pipeline'
      )
    )
  ), true, now(), now()),
  
  -- Services widget
  (gen_random_uuid(), john_page_id, widget_type_services, jsonb_build_object(
    'blurb', 'I offer comprehensive full-stack development services for web applications and technical consulting.',
    'services', jsonb_build_array(
      jsonb_build_object(
        'name', 'Full Stack Development',
        'description', 'End-to-end web application development using modern technologies',
        'rate', '$150/hour'
      ),
      jsonb_build_object(
        'name', 'Technical Consulting',
        'description', 'Architecture review, performance optimization, and technical strategy',
        'rate', '$200/hour'
      ),
      jsonb_build_object(
        'name', 'API Development',
        'description', 'RESTful and GraphQL API design and implementation',
        'rate', '$120/hour'
      )
    )
  ), true, now(), now());

-- Create published versions for both portfolios
INSERT INTO public.page_versions (id, page_id, status, snapshot, created_by, published_at, created_at, updated_at)
VALUES
  (gen_random_uuid(), jenny_page_id, 'published', '{}'::jsonb, DEMO_USER_UUID, now(), now(), now()),
  (gen_random_uuid(), john_page_id, 'published', '{}'::jsonb, DEMO_USER_UUID, now(), now(), now());

-- Add demo media assets
INSERT INTO public.media_assets (id, user_id, page_id, kind, path, metadata, is_demo, created_at, updated_at)
VALUES
  (gen_random_uuid(), DEMO_USER_UUID, jenny_page_id, 'image', '/demo/jenny/avatar.png', 
   jsonb_build_object('alt', 'Jenny Wilson headshot'), true, now(), now()),
  (gen_random_uuid(), DEMO_USER_UUID, john_page_id, 'image', '/demo/john/avatar.png', 
   jsonb_build_object('alt', 'John Doe headshot'), true, now(), now());

END $$;
