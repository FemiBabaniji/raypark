import type { PortfolioTemplateType } from "@/components/portfolio-template-modal"

export interface TemplateWidget {
  type: string
  position: { x: number; y: number }
  size: { w: number; h: number }
  props?: Record<string, any>
}

export const PORTFOLIO_TEMPLATES: Record<PortfolioTemplateType, {
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
        type: "skills",
        position: { x: 0, y: 1 },
        size: { w: 6, h: 4 },
        props: {
          title: "Design Skills",
          skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research"],
        },
      },
      {
        type: "projects",
        position: { x: 6, y: 1 },
        size: { w: 6, h: 4 },
        props: {
          title: "Featured Projects",
          projects: [
            { title: "E-commerce Redesign", description: "Modern shopping experience" },
            { title: "Mobile Banking App", description: "Intuitive financial management" },
          ],
        },
      },
      {
        type: "experience",
        position: { x: 0, y: 5 },
        size: { w: 6, h: 3 },
        props: {
          title: "Experience",
          items: [
            { role: "Senior UI/UX Designer", company: "Tech Company" },
            { role: "Product Designer", company: "Startup Inc" },
          ],
        },
      },
      {
        type: "testimonials",
        position: { x: 6, y: 5 },
        size: { w: 6, h: 3 },
        props: {
          title: "Testimonials",
          testimonials: [
            { text: "Exceptional designer with great attention to detail", author: "Client Name" },
          ],
        },
      },
    ],
  },
  developer: {
    name: "Developer Portfolio",
    widgets: [
      {
        type: "skills",
        position: { x: 0, y: 1 },
        size: { w: 6, h: 4 },
        props: {
          title: "Tech Stack",
          skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
        },
      },
      {
        type: "projects",
        position: { x: 6, y: 1 },
        size: { w: 6, h: 4 },
        props: {
          title: "Featured Repositories",
          projects: [
            { title: "AI Chat Application", description: "Real-time chat with AI integration" },
            { title: "E-commerce Platform", description: "Full-stack shopping solution" },
            { title: "Analytics Dashboard", description: "Data visualization platform" },
          ],
        },
      },
      {
        type: "certifications",
        position: { x: 0, y: 5 },
        size: { w: 6, h: 3 },
        props: {
          title: "Certifications",
          items: [
            { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services" },
            { name: "Full Stack Web Development", issuer: "Online Course" },
          ],
        },
      },
    ],
  },
  marketing: {
    name: "Marketing Portfolio",
    widgets: [
      {
        type: "metrics",
        position: { x: 0, y: 1 },
        size: { w: 6, h: 3 },
        props: {
          title: "Key Metrics",
          metrics: [
            { label: "Average ROI", value: "200%" },
            { label: "Leads Generated", value: "50K+" },
            { label: "Social Reach", value: "10M+" },
          ],
        },
      },
      {
        type: "skills",
        position: { x: 6, y: 1 },
        size: { w: 6, h: 3 },
        props: {
          title: "Specializations",
          skills: ["SEO/SEM", "Content Marketing", "Social Media", "Email Campaigns", "Analytics"],
        },
      },
      {
        type: "projects",
        position: { x: 0, y: 4 },
        size: { w: 12, h: 4 },
        props: {
          title: "Campaign Portfolio",
          projects: [
            { title: "Product Launch Campaign", description: "Multi-channel launch strategy" },
            { title: "Viral Social Series", description: "10M+ impressions in 30 days" },
            { title: "Email Nurture Sequence", description: "40% conversion rate" },
          ],
        },
      },
    ],
  },
  founder: {
    name: "Founder Portfolio",
    widgets: [
      {
        type: "company",
        position: { x: 0, y: 1 },
        size: { w: 12, h: 3 },
        props: {
          title: "Company Overview",
          company: "Startup Name",
          tagline: "Revolutionizing the industry",
          mission: "Building the future of [industry]",
        },
      },
      {
        type: "milestones",
        position: { x: 0, y: 4 },
        size: { w: 6, h: 3 },
        props: {
          title: "Milestones",
          items: [
            { label: "Founded", value: "Q1 2023" },
            { label: "Users", value: "10K+" },
            { label: "Revenue", value: "Profitable" },
          ],
        },
      },
      {
        type: "funding",
        position: { x: 6, y: 4 },
        size: { w: 6, h: 3 },
        props: {
          title: "Funding",
          rounds: [
            { stage: "Seed", amount: "$2M", investors: "Top VCs" },
          ],
        },
      },
      {
        type: "team",
        position: { x: 0, y: 7 },
        size: { w: 6, h: 3 },
        props: {
          title: "Team",
          members: [
            { name: "Co-founder", role: "CTO" },
            { name: "Advisor", role: "Industry Expert" },
          ],
        },
      },
    ],
  },
}
