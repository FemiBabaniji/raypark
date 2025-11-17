import type { PortfolioTemplateType } from "@/components/portfolio-template-modal"

export interface TemplateWidget {
  type: string
  props?: Record<string, any>
}

export const PORTFOLIO_TEMPLATES: Record<string, {
  name: string
  widgets: TemplateWidget[]
}> = {
  blank: {
    name: "Blank Portfolio",
    widgets: [],
  },
  designer: {
    name: "Designer Portfolio",
    widgets: [
      {
        type: "description",
        props: {
          content: "I create intuitive digital experiences that delight users and drive business results. Specializing in UI/UX design, prototyping, and user research.",
        },
      },
      {
        type: "description",
        props: {
          title: "Design Skills",
          content: "Figma • Sketch • Adobe XD • Prototyping • User Research • Wireframing • Design Systems",
        },
      },
      {
        type: "description",
        props: {
          title: "Featured Projects",
          content: "E-commerce Redesign - Modern shopping experience with 40% conversion increase\n\nMobile Banking App - Intuitive financial management for 100K+ users\n\nSaaS Dashboard - B2B analytics platform redesign",
        },
      },
    ],
  },
  developer: {
    name: "Developer Portfolio",
    widgets: [
      {
        type: "description",
        props: {
          content: "Building scalable web applications with modern technologies. Passionate about clean code, user experience, and open source contributions.",
        },
      },
      {
        type: "description",
        props: {
          title: "Tech Stack",
          content: "React • Node.js • TypeScript • PostgreSQL • AWS • Docker • GraphQL • REST APIs",
        },
      },
      {
        type: "description",
        props: {
          title: "Featured Repositories",
          content: "AI Chat Application - Real-time chat with AI integration using OpenAI\n\nE-commerce Platform - Full-stack shopping solution with Stripe payments\n\nAnalytics Dashboard - Data visualization platform with real-time updates",
        },
      },
    ],
  },
  marketing: {
    name: "Marketing Portfolio",
    widgets: [
      {
        type: "description",
        props: {
          content: "Data-driven marketer with proven track record of scaling startups from 0 to 1M+ users through strategic campaigns and growth experiments.",
        },
      },
      {
        type: "description",
        props: {
          title: "Key Metrics",
          content: "200% Average ROI • 50K+ Qualified Leads Generated • 10M+ Social Media Reach • 40% Email Conversion Rate",
        },
      },
      {
        type: "description",
        props: {
          title: "Campaign Highlights",
          content: "Product Launch Campaign - Multi-channel strategy resulting in 500% growth\n\nViral Social Series - 10M+ impressions in 30 days across platforms\n\nEmail Nurture Sequence - 40% conversion rate, 10x industry average",
        },
      },
    ],
  },
  founder: {
    name: "Founder Portfolio",
    widgets: [
      {
        type: "description",
        props: {
          content: "Building the future of [industry]. Previously exited startup, now solving [problem] for [market]. Passionate about creating impact through technology.",
        },
      },
      {
        type: "description",
        props: {
          title: "Company Overview",
          content: "Revolutionizing how teams collaborate remotely. Our mission is to make distributed work seamless and productive for everyone.",
        },
      },
      {
        type: "description",
        props: {
          title: "Milestones & Funding",
          content: "Founded Q1 2023 • 10K Active Users • Profitable in 12 Months • Seed Round: $2M from Top VCs • Series A: Q4 2025",
        },
      },
    ],
  },
}
