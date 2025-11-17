-- Create portfolio_templates table for database-driven templates
CREATE TABLE IF NOT EXISTS portfolio_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  layout JSONB NOT NULL DEFAULT '{"left": {"type": "vertical", "widgets": []}, "right": {"type": "vertical", "widgets": []}}'::jsonb,
  widget_configs JSONB NOT NULL DEFAULT '[]'::jsonb,
  preview_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE portfolio_templates ENABLE ROW LEVEL SECURITY;

-- Allow users to view active templates for their communities or system templates
CREATE POLICY "Users can view active templates"
  ON portfolio_templates FOR SELECT
  USING (
    is_active = true AND (
      community_id IS NULL OR
      community_id IN (
        SELECT community_id FROM community_members WHERE user_id = auth.uid()
      )
    )
  );

-- Allow community admins to manage their templates
CREATE POLICY "Community admins can manage templates"
  ON portfolio_templates FOR ALL
  USING (
    community_id IN (
      SELECT community_id FROM community_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolio_templates_community 
  ON portfolio_templates(community_id) WHERE is_active = true;

-- Insert system templates (community_id = NULL for global templates)
INSERT INTO portfolio_templates (name, description, layout, widget_configs, community_id) VALUES
(
  'Blank Portfolio',
  'Start from scratch with just the identity widget',
  '{"left": {"type": "vertical", "widgets": ["identity"]}, "right": {"type": "vertical", "widgets": []}}'::jsonb,
  '[{"id": "identity", "type": "identity", "props": {"selectedColor": 3}}]'::jsonb,
  NULL
),
(
  'Designer Portfolio',
  'Showcase design work with portfolio gallery and projects',
  '{"left": {"type": "vertical", "widgets": ["identity", "description-1", "description-2"]}, "right": {"type": "vertical", "widgets": ["description-3"]}}'::jsonb,
  '[
    {"id": "identity", "type": "identity", "props": {"selectedColor": 4, "title": "UI/UX Designer"}},
    {"id": "description-1", "type": "description", "props": {"content": "I create intuitive digital experiences that delight users and drive business results. Specializing in UI/UX design, prototyping, and user research."}},
    {"id": "description-2", "type": "description", "props": {"title": "Design Skills", "content": "Figma • Sketch • Adobe XD • Prototyping • User Research • Wireframing • Design Systems"}},
    {"id": "description-3", "type": "description", "props": {"title": "Featured Projects", "content": "E-commerce Redesign - Modern shopping experience with 40% conversion increase\\n\\nMobile Banking App - Intuitive financial management for 100K+ users\\n\\nSaaS Dashboard - B2B analytics platform redesign"}}
  ]'::jsonb,
  NULL
),
(
  'Developer Portfolio',
  'Highlight technical skills, projects, and repositories',
  '{"left": {"type": "vertical", "widgets": ["identity", "description-1"]}, "right": {"type": "vertical", "widgets": ["description-2", "description-3"]}}'::jsonb,
  '[
    {"id": "identity", "type": "identity", "props": {"selectedColor": 2, "title": "Full Stack Developer"}},
    {"id": "description-1", "type": "description", "props": {"content": "Building scalable web applications with modern technologies. Passionate about clean code, user experience, and open source contributions."}},
    {"id": "description-2", "type": "description", "props": {"title": "Tech Stack", "content": "React • Node.js • TypeScript • PostgreSQL • AWS • Docker • GraphQL • REST APIs"}},
    {"id": "description-3", "type": "description", "props": {"title": "Featured Repositories", "content": "AI Chat Application - Real-time chat with AI integration using OpenAI\\n\\nE-commerce Platform - Full-stack shopping solution with Stripe payments\\n\\nAnalytics Dashboard - Data visualization platform with real-time updates"}}
  ]'::jsonb,
  NULL
),
(
  'Marketing Portfolio',
  'Display campaigns, metrics, and brand partnerships',
  '{"left": {"type": "vertical", "widgets": ["identity", "description-1", "description-2"]}, "right": {"type": "vertical", "widgets": ["description-3"]}}'::jsonb,
  '[
    {"id": "identity", "type": "identity", "props": {"selectedColor": 1, "title": "Growth Marketing Manager"}},
    {"id": "description-1", "type": "description", "props": {"content": "Data-driven marketer with proven track record of scaling startups from 0 to 1M+ users through strategic campaigns and growth experiments."}},
    {"id": "description-2", "type": "description", "props": {"title": "Key Metrics", "content": "200% Average ROI • 50K+ Qualified Leads Generated • 10M+ Social Media Reach • 40% Email Conversion Rate"}},
    {"id": "description-3", "type": "description", "props": {"title": "Campaign Highlights", "content": "Product Launch Campaign - Multi-channel strategy resulting in 500% growth\\n\\nViral Social Series - 10M+ impressions in 30 days across platforms\\n\\nEmail Nurture Sequence - 40% conversion rate, 10x industry average"}}
  ]'::jsonb,
  NULL
),
(
  'Founder Portfolio',
  'Present company vision, milestones, and funding',
  '{"left": {"type": "vertical", "widgets": ["identity", "description-1"]}, "right": {"type": "vertical", "widgets": ["description-2", "description-3"]}}'::jsonb,
  '[
    {"id": "identity", "type": "identity", "props": {"selectedColor": 0, "title": "Founder & CEO"}},
    {"id": "description-1", "type": "description", "props": {"content": "Building the future of industry. Previously exited startup, now solving problems for market. Passionate about creating impact through technology."}},
    {"id": "description-2", "type": "description", "props": {"title": "Company Overview", "content": "Revolutionizing how teams collaborate remotely. Our mission is to make distributed work seamless and productive for everyone."}},
    {"id": "description-3", "type": "description", "props": {"title": "Milestones & Funding", "content": "Founded Q1 2023 • 10K Active Users • Profitable in 12 Months • Seed Round: $2M from Top VCs • Series A: Q4 2025"}}
  ]'::jsonb,
  NULL
);
