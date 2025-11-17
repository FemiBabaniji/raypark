-- Seed default system templates with multiple widgets
INSERT INTO portfolio_templates (
  community_id,
  name,
  description,
  layout,
  widget_configs,
  is_active,
  created_by
) VALUES
(
  NULL,
  'Blank Portfolio',
  'Start with a clean slate',
  '{
    "left": {"type": "vertical", "widgets": ["identity"]},
    "right": {"type": "vertical", "widgets": []}
  }'::jsonb,
  '[
    {"id": "identity", "type": "identity", "props": {"selectedColor": 3}}
  ]'::jsonb,
  true,
  NULL
),
(
  NULL,
  'Designer Portfolio',
  'Perfect for showcasing design work',
  '{
    "left": {"type": "vertical", "widgets": ["identity", "description-about"]},
    "right": {"type": "vertical", "widgets": ["description-skills", "description-projects"]}
  }'::jsonb,
  '[
    {"id": "identity", "type": "identity", "props": {"selectedColor": 3, "title": "UI/UX Designer"}},
    {"id": "description-about", "type": "description", "props": {"title": "About Me", "content": "I create intuitive digital experiences that delight users and drive business results. With expertise in user research, interaction design, and visual design."}},
    {"id": "description-skills", "type": "description", "props": {"title": "Skills", "content": "Figma, Sketch, Adobe XD, Prototyping, User Research, Wireframing, Visual Design"}},
    {"id": "description-projects", "type": "description", "props": {"title": "Featured Work", "content": "E-commerce Redesign | Mobile Banking App | SaaS Dashboard"}}
  ]'::jsonb,
  true,
  NULL
),
(
  NULL,
  'Developer Portfolio',
  'Perfect for showcasing technical skills',
  '{
    "left": {"type": "vertical", "widgets": ["identity", "description-about"]},
    "right": {"type": "vertical", "widgets": ["description-stack", "description-projects"]}
  }'::jsonb,
  '[
    {"id": "identity", "type": "identity", "props": {"selectedColor": 2, "title": "Full Stack Developer"}},
    {"id": "description-about", "type": "description", "props": {"title": "About Me", "content": "Building scalable web applications with modern technologies. Passionate about clean code and user experience."}},
    {"id": "description-stack", "type": "description", "props": {"title": "Tech Stack", "content": "React, Node.js, TypeScript, PostgreSQL, AWS, Docker"}},
    {"id": "description-projects", "type": "description", "props": {"title": "Projects", "content": "AI Chat Application | E-commerce Platform | Analytics Dashboard"}}
  ]'::jsonb,
  true,
  NULL
),
(
  NULL,
  'Marketing Portfolio',
  'Perfect for showcasing campaigns and results',
  '{
    "left": {"type": "vertical", "widgets": ["identity", "description-about"]},
    "right": {"type": "vertical", "widgets": ["description-metrics", "description-campaigns"]}
  }'::jsonb,
  '[
    {"id": "identity", "type": "identity", "props": {"selectedColor": 1, "title": "Growth Marketing Manager"}},
    {"id": "description-about", "type": "description", "props": {"title": "About Me", "content": "Data-driven marketer with proven track record of scaling startups from 0 to 1M+ users."}},
    {"id": "description-metrics", "type": "description", "props": {"title": "Key Metrics", "content": "200% average ROI | 50K+ qualified leads generated | 10M+ social reach"}},
    {"id": "description-campaigns", "type": "description", "props": {"title": "Featured Campaigns", "content": "Product Launch Campaign | Viral Social Series | Email Nurture Sequence"}}
  ]'::jsonb,
  true,
  NULL
),
(
  NULL,
  'Founder Portfolio',
  'Perfect for showcasing your startup journey',
  '{
    "left": {"type": "vertical", "widgets": ["identity", "description-about"]},
    "right": {"type": "vertical", "widgets": ["description-milestones", "description-vision"]}
  }'::jsonb,
  '[
    {"id": "identity", "type": "identity", "props": {"selectedColor": 4, "title": "Founder & CEO"}},
    {"id": "description-about", "type": "description", "props": {"title": "About Me", "content": "Building the future of remote collaboration. Previously exited startup, now solving team productivity challenges."}},
    {"id": "description-milestones", "type": "description", "props": {"title": "Milestones", "content": "Founded Q1 2023 | 10K active users | Profitable in 12 months | $2M seed funding"}},
    {"id": "description-vision", "type": "description", "props": {"title": "Vision", "content": "Revolutionizing how teams collaborate remotely with AI-powered tools that enhance productivity."}}
  ]'::jsonb,
  true,
  NULL
)
ON CONFLICT DO NOTHING;
