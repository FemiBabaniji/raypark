-- Fix templates to use semantic IDs matching regular page instance logic
-- Templates should use simple widget type references, not compound IDs

UPDATE portfolio_templates
SET 
  widget_configs = '[
    {
      "id": "identity",
      "type": "identity",
      "props": {
        "title": "UI/UX Designer",
        "selectedColor": 4
      }
    },
    {
      "id": "about",
      "type": "description",
      "props": {
        "title": "About Me",
        "content": "I create intuitive digital experiences that delight users and drive business results. Specializing in UI/UX design, prototyping, and user research."
      }
    },
    {
      "id": "skills",
      "type": "description",
      "props": {
        "title": "Design Skills",
        "content": "Figma • Sketch • Adobe XD • Prototyping • User Research • Wireframing • Design Systems"
      }
    },
    {
      "id": "projects",
      "type": "description",
      "props": {
        "title": "Featured Projects",
        "content": "E-commerce Redesign - Modern shopping experience with 40% conversion increase\n\nMobile Banking App - Intuitive financial management for 100K+ users\n\nSaaS Dashboard - B2B analytics platform redesign"
      }
    }
  ]'::jsonb,
  layout = '{
    "left": {
      "type": "vertical",
      "widgets": ["identity", "about"]
    },
    "right": {
      "type": "vertical",
      "widgets": ["skills", "projects"]
    }
  }'::jsonb
WHERE name = 'Designer Portfolio';

UPDATE portfolio_templates
SET 
  widget_configs = '[
    {
      "id": "identity",
      "type": "identity",
      "props": {
        "title": "Full-Stack Developer",
        "selectedColor": 2
      }
    },
    {
      "id": "about",
      "type": "description",
      "props": {
        "title": "About Me",
        "content": "Passionate developer building scalable web applications. Experienced in both frontend and backend development with modern frameworks."
      }
    },
    {
      "id": "stack",
      "type": "description",
      "props": {
        "title": "Tech Stack",
        "content": "React • Node.js • TypeScript • PostgreSQL • AWS • Docker • Next.js • GraphQL"
      }
    },
    {
      "id": "work",
      "type": "description",
      "props": {
        "title": "Recent Work",
        "content": "Real-time Collaboration Tool - WebSocket-based platform for remote teams\n\nE-commerce Platform - Microservices architecture handling 1M+ daily requests\n\nAI Content Generator - OpenAI integration with custom fine-tuning"
      }
    }
  ]'::jsonb,
  layout = '{
    "left": {
      "type": "vertical",
      "widgets": ["identity", "about"]
    },
    "right": {
      "type": "vertical",
      "widgets": ["stack", "work"]
    }
  }'::jsonb
WHERE name = 'Developer Portfolio';

UPDATE portfolio_templates
SET 
  widget_configs = '[
    {
      "id": "identity",
      "type": "identity",
      "props": {
        "title": "Marketing Specialist",
        "selectedColor": 5
      }
    },
    {
      "id": "about",
      "type": "description",
      "props": {
        "title": "About Me",
        "content": "Data-driven marketing professional with expertise in digital strategy, content marketing, and growth hacking."
      }
    },
    {
      "id": "expertise",
      "type": "description",
      "props": {
        "title": "Core Expertise",
        "content": "SEO/SEM • Content Strategy • Social Media Marketing • Email Campaigns • Analytics • A/B Testing • Marketing Automation"
      }
    },
    {
      "id": "campaigns",
      "type": "description",
      "props": {
        "title": "Notable Campaigns",
        "content": "SaaS Launch - Generated 50K leads in first quarter\n\nRebranding Initiative - Increased brand awareness by 300%\n\nInfluencer Partnership - 2M+ impressions across platforms"
      }
    }
  ]'::jsonb,
  layout = '{
    "left": {
      "type": "vertical",
      "widgets": ["identity", "about"]
    },
    "right": {
      "type": "vertical",
      "widgets": ["expertise", "campaigns"]
    }
  }'::jsonb
WHERE name = 'Marketing Portfolio';

UPDATE portfolio_templates
SET 
  widget_configs = '[
    {
      "id": "identity",
      "type": "identity",
      "props": {
        "title": "Founder & CEO",
        "selectedColor": 1
      }
    },
    {
      "id": "vision",
      "type": "description",
      "props": {
        "title": "Vision",
        "content": "Building the future of [industry]. Serial entrepreneur with 3 successful exits, now focused on solving [problem] for [target market]."
      }
    },
    {
      "id": "journey",
      "type": "description",
      "props": {
        "title": "Entrepreneurial Journey",
        "content": "Founded 5 companies • 2 Acquisitions • $10M+ raised • Featured in TechCrunch, Forbes • Mentor at Y Combinator"
      }
    },
    {
      "id": "current",
      "type": "description",
      "props": {
        "title": "Current Venture",
        "content": "Leading [Company Name] - revolutionizing [industry] with innovative solutions. Raised Series A, growing team of 50+, serving 10K+ customers globally."
      }
    }
  ]'::jsonb,
  layout = '{
    "left": {
      "type": "vertical",
      "widgets": ["identity", "vision"]
    },
    "right": {
      "type": "vertical",
      "widgets": ["journey", "current"]
    }
  }'::jsonb
WHERE name = 'Founder Portfolio';

UPDATE portfolio_templates
SET 
  widget_configs = '[
    {
      "id": "identity",
      "type": "identity",
      "props": {
        "title": "",
        "selectedColor": 3
      }
    }
  ]'::jsonb,
  layout = '{
    "left": {
      "type": "vertical",
      "widgets": ["identity"]
    },
    "right": {
      "type": "vertical",
      "widgets": []
    }
  }'::jsonb
WHERE name = 'Blank Portfolio';
