-- Insert system-wide portfolio templates
-- identity widget type: e77c9175-991c-426e-ba9d-8f1ea4628e1b
-- description widget type: 1699f58c-ee78-438e-9828-87c7f0849b17

-- 1. Blank Template
INSERT INTO portfolio_templates (
  id,
  community_id,
  name,
  description,
  layout,
  widget_configs,
  is_active,
  created_by
) VALUES (
  gen_random_uuid(),
  NULL, -- System template
  'Blank Portfolio',
  'Start with a clean slate - just your identity card',
  '{
    "left": [{"id": "identity", "type": "identity"}],
    "right": []
  }'::jsonb,
  '[
    {
      "id": "identity",
      "type": "identity",
      "widget_type_id": "e77c9175-991c-426e-ba9d-8f1ea4628e1b",
      "props": {
        "selectedColor": 0,
        "name": "",
        "handle": "",
        "title": "",
        "avatarUrl": "",
        "email": "",
        "location": "",
        "website": "",
        "bio": ""
      }
    }
  ]'::jsonb,
  true,
  (SELECT id FROM auth.users LIMIT 1) -- Use first user as creator for system templates
);

-- 2. Designer Template
INSERT INTO portfolio_templates (
  id,
  community_id,
  name,
  description,
  layout,
  widget_configs,
  is_active,
  created_by
) VALUES (
  gen_random_uuid(),
  NULL,
  'Designer Portfolio',
  'Perfect for UI/UX designers - showcase your creative work',
  '{
    "left": [
      {"id": "identity", "type": "identity"},
      {"id": "about", "type": "description"}
    ],
    "right": [
      {"id": "skills", "type": "description"},
      {"id": "projects", "type": "description"}
    ]
  }'::jsonb,
  '[
    {
      "id": "identity",
      "type": "identity",
      "widget_type_id": "e77c9175-991c-426e-ba9d-8f1ea4628e1b",
      "props": {
        "selectedColor": 3,
        "name": "",
        "handle": "",
        "title": "UI/UX Designer",
        "avatarUrl": "",
        "email": "",
        "location": "",
        "website": "",
        "bio": ""
      }
    },
    {
      "id": "about",
      "type": "description",
      "widget_type_id": "1699f58c-ee78-438e-9828-87c7f0849b17",
      "props": {
        "title": "About Me",
        "content": "I create intuitive digital experiences that delight users and drive business results. With expertise in user research, wireframing, and prototyping, I bring ideas to life."
      }
    },
    {
      "id": "skills",
      "type": "description",
      "widget_type_id": "1699f58c-ee78-438e-9828-87c7f0849b17",
      "props": {
        "title": "Design Skills",
        "content": "• Figma & Sketch mastery\n• User research & testing\n• Interaction design\n• Design systems\n• Prototyping\n• Accessibility (WCAG)"
      }
    },
    {
      "id": "projects",
      "type": "description",
      "widget_type_id": "1699f58c-ee78-438e-9828-87c7f0849b17",
      "props": {
        "title": "Featured Projects",
        "content": "E-commerce Redesign: Increased conversion by 40%\n\nMobile Banking App: Improved user satisfaction from 3.2 to 4.8 stars\n\nSaaS Dashboard: Streamlined complex workflows"
      }
    }
  ]'::jsonb,
  true,
  (SELECT id FROM auth.users LIMIT 1)
);

-- 3. Developer Template
INSERT INTO portfolio_templates (
  id,
  community_id,
  name,
  description,
  layout,
  widget_configs,
  is_active,
  created_by
) VALUES (
  gen_random_uuid(),
  NULL,
  'Developer Portfolio',
  'Ideal for software engineers - highlight your technical skills',
  '{
    "left": [
      {"id": "identity", "type": "identity"},
      {"id": "about", "type": "description"}
    ],
    "right": [
      {"id": "tech-stack", "type": "description"},
      {"id": "projects", "type": "description"}
    ]
  }'::jsonb,
  '[
    {
      "id": "identity",
      "type": "identity",
      "widget_type_id": "e77c9175-991c-426e-ba9d-8f1ea4628e1b",
      "props": {
        "selectedColor": 1,
        "name": "",
        "handle": "",
        "title": "Full Stack Developer",
        "avatarUrl": "",
        "email": "",
        "location": "",
        "website": "",
        "bio": ""
      }
    },
    {
      "id": "about",
      "type": "description",
      "widget_type_id": "1699f58c-ee78-438e-9828-87c7f0849b17",
      "props": {
        "title": "About Me",
        "content": "Building scalable web applications with modern technologies. Passionate about clean code, performance optimization, and creating exceptional user experiences."
      }
    },
    {
      "id": "tech-stack",
      "type": "description",
      "widget_type_id": "1699f58c-ee78-438e-9828-87c7f0849b17",
      "props": {
        "title": "Tech Stack",
        "content": "Frontend: React, Next.js, TypeScript, Tailwind CSS\n\nBackend: Node.js, Python, PostgreSQL, Redis\n\nCloud: AWS, Vercel, Docker\n\nTools: Git, CI/CD, Testing (Jest, Playwright)"
      }
    },
    {
      "id": "projects",
      "type": "description",
      "widget_type_id": "1699f58c-ee78-438e-9828-87c7f0849b17",
      "props": {
        "title": "Featured Projects",
        "content": "AI Chat Application: Real-time messaging with GPT integration\n\nE-commerce Platform: Scalable marketplace with 50K+ products\n\nAnalytics Dashboard: Processing 1M+ events daily"
      }
    }
  ]'::jsonb,
  true,
  (SELECT id FROM auth.users LIMIT 1)
);

-- 4. Marketing Template
INSERT INTO portfolio_templates (
  id,
  community_id,
  name,
  description,
  layout,
  widget_configs,
  is_active,
  created_by
) VALUES (
  gen_random_uuid(),
  NULL,
  'Marketing Portfolio',
  'Built for marketers - demonstrate your campaign success',
  '{
    "left": [
      {"id": "identity", "type": "identity"},
      {"id": "about", "type": "description"}
    ],
    "right": [
      {"id": "metrics", "type": "description"},
      {"id": "campaigns", "type": "description"}
    ]
  }'::jsonb,
  '[
    {
      "id": "identity",
      "type": "identity",
      "widget_type_id": "e77c9175-991c-426e-ba9d-8f1ea4628e1b",
      "props": {
        "selectedColor": 4,
        "name": "",
        "handle": "",
        "title": "Growth Marketing Manager",
        "avatarUrl": "",
        "email": "",
        "location": "",
        "website": "",
        "bio": ""
      }
    },
    {
      "id": "about",
      "type": "description",
      "widget_type_id": "1699f58c-ee78-438e-9828-87c7f0849b17",
      "props": {
        "title": "About Me",
        "content": "Data-driven marketer with proven track record of scaling startups from 0 to 1M+ users. Specialized in performance marketing, content strategy, and growth hacking."
      }
    },
    {
      "id": "metrics",
      "type": "description",
      "widget_type_id": "1699f58c-ee78-438e-9828-87c7f0849b17",
      "props": {
        "title": "Key Achievements",
        "content": "• 200% average ROI on paid campaigns\n• 50K+ qualified leads generated\n• 10M+ social media reach\n• $2M+ ad spend managed\n• 40% reduction in CAC"
      }
    },
    {
      "id": "campaigns",
      "type": "description",
      "widget_type_id": "1699f58c-ee78-438e-9828-87c7f0849b17",
      "props": {
        "title": "Featured Campaigns",
        "content": "Product Launch: 10K signups in first week, 25% conversion\n\nViral Social Series: 5M impressions, 500K engagements\n\nEmail Nurture: Increased MRR by 35% through segmentation"
      }
    }
  ]'::jsonb,
  true,
  (SELECT id FROM auth.users LIMIT 1)
);

-- 5. Founder Template
INSERT INTO portfolio_templates (
  id,
  community_id,
  name,
  description,
  layout,
  widget_configs,
  is_active,
  created_by
) VALUES (
  gen_random_uuid(),
  NULL,
  'Founder Portfolio',
  'For entrepreneurs - share your vision and achievements',
  '{
    "left": [
      {"id": "identity", "type": "identity"},
      {"id": "vision", "type": "description"}
    ],
    "right": [
      {"id": "milestones", "type": "description"},
      {"id": "impact", "type": "description"}
    ]
  }'::jsonb,
  '[
    {
      "id": "identity",
      "type": "identity",
      "widget_type_id": "e77c9175-991c-426e-ba9d-8f1ea4628e1b",
      "props": {
        "selectedColor": 2,
        "name": "",
        "handle": "",
        "title": "Founder & CEO",
        "avatarUrl": "",
        "email": "",
        "location": "",
        "website": "",
        "bio": ""
      }
    },
    {
      "id": "vision",
      "type": "description",
      "widget_type_id": "1699f58c-ee78-438e-9828-87c7f0849b17",
      "props": {
        "title": "Vision & Mission",
        "content": "Building the future of remote collaboration. Our mission is to make distributed teams as effective as co-located ones through innovative technology and thoughtful design."
      }
    },
    {
      "id": "milestones",
      "type": "description",
      "widget_type_id": "1699f58c-ee78-438e-9828-87c7f0849b17",
      "props": {
        "title": "Company Milestones",
        "content": "• Founded Q1 2023\n• $2M seed funding raised\n• 10K active users\n• Profitable in 12 months\n• Team of 15 across 8 countries\n• Featured in TechCrunch, Forbes"
      }
    },
    {
      "id": "impact",
      "type": "description",
      "widget_type_id": "1699f58c-ee78-438e-9828-87c7f0849b17",
      "props": {
        "title": "Impact & Traction",
        "content": "Helping 500+ companies transition to remote-first culture\n\n95% customer satisfaction rate\n\nSaved teams an average of 10 hours/week in meetings\n\nGrowing 20% MoM"
      }
    }
  ]'::jsonb,
  true,
  (SELECT id FROM auth.users LIMIT 1)
);
