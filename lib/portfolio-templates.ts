import type { ThemeIndex } from "@/lib/theme"

export type ProfessionCategory = 
  | "developer" 
  | "designer" 
  | "analyst" 
  | "creator" 
  | "entrepreneur"
  | "consultant"

export interface PortfolioTemplate {
  id: string
  profession: ProfessionCategory
  name: string
  description: string
  selectedColor: ThemeIndex
  icon: string
  presets: {
    identity: {
      title: string
      bio: string
      location: string
    }
    widgets: {
      left: string[]
      right: string[]
    }
    sampleContent: {
      description?: {
        title: string
        content: string
      }
      projects?: {
        title: string
        items: Array<{
          title: string
          description: string
          color: string
        }>
      }
      education?: {
        items: Array<{
          school: string
          degree: string
          year: string
        }>
      }
      services?: {
        items: string[]
      }
    }
  }
}

export const PORTFOLIO_TEMPLATES: PortfolioTemplate[] = [
  {
    id: "developer",
    profession: "developer",
    name: "Software Developer",
    description: "Perfect for engineers and full-stack developers",
    selectedColor: 1 as ThemeIndex, // Blue theme
    icon: "💻",
    presets: {
      identity: {
        title: "Full-Stack Developer",
        bio: "Passionate about building scalable web applications and solving complex problems with code.",
        location: "San Francisco, CA",
      },
      widgets: {
        left: ["identity", "description"],
        right: ["projects", "education"],
      },
      sampleContent: {
        description: {
          title: "About Me",
          content: "I'm a full-stack developer with experience in React, Node.js, and cloud technologies. I love creating elegant solutions to complex problems.",
        },
        projects: {
          title: "Featured Projects",
          items: [
            {
              title: "E-Commerce Platform",
              description: "Built a scalable e-commerce solution handling 100K+ daily users",
              color: "blue",
            },
            {
              title: "Real-time Chat Application",
              description: "WebSocket-based messaging platform with end-to-end encryption",
              color: "purple",
            },
            {
              title: "CI/CD Pipeline Tool",
              description: "Automated deployment system reducing release time by 60%",
              color: "green",
            },
          ],
        },
        education: {
          items: [
            {
              school: "Tech University",
              degree: "B.S. Computer Science",
              year: "2020",
            },
          ],
        },
      },
    },
  },
  {
    id: "designer",
    profession: "designer",
    name: "Product Designer",
    description: "Ideal for UI/UX designers and creative professionals",
    selectedColor: 4 as ThemeIndex, // Pink/Rose theme
    icon: "🎨",
    presets: {
      identity: {
        title: "Product Designer",
        bio: "Creating beautiful and intuitive digital experiences that users love.",
        location: "New York, NY",
      },
      widgets: {
        left: ["identity", "description"],
        right: ["gallery", "services"],
      },
      sampleContent: {
        description: {
          title: "Design Philosophy",
          content: "I believe great design is invisible. My focus is on creating experiences that feel natural and delightful.",
        },
        services: {
          items: [
            "UI/UX Design",
            "Design Systems",
            "User Research",
            "Prototyping",
            "Brand Identity",
          ],
        },
      },
    },
  },
  {
    id: "analyst",
    profession: "analyst",
    name: "Data Analyst",
    description: "Tailored for data professionals and researchers",
    selectedColor: 2 as ThemeIndex, // Green theme
    icon: "📊",
    presets: {
      identity: {
        title: "Data Analyst",
        bio: "Turning data into actionable insights that drive business decisions.",
        location: "Austin, TX",
      },
      widgets: {
        left: ["identity", "description"],
        right: ["projects", "education"],
      },
      sampleContent: {
        description: {
          title: "Expertise",
          content: "Specialized in statistical analysis, data visualization, and predictive modeling using Python, SQL, and Tableau.",
        },
        projects: {
          title: "Analytics Projects",
          items: [
            {
              title: "Sales Forecast Model",
              description: "Predictive analytics increasing forecast accuracy by 25%",
              color: "green",
            },
            {
              title: "Customer Segmentation",
              description: "ML clustering analysis identifying 5 key customer personas",
              color: "blue",
            },
            {
              title: "Dashboard System",
              description: "Real-time analytics dashboard for executive decision-making",
              color: "purple",
            },
          ],
        },
        education: {
          items: [
            {
              school: "Data Science Institute",
              degree: "M.S. Data Analytics",
              year: "2021",
            },
          ],
        },
      },
    },
  },
  {
    id: "creator",
    profession: "creator",
    name: "Content Creator",
    description: "Great for influencers, writers, and media professionals",
    selectedColor: 6 as ThemeIndex, // Orange theme
    icon: "✨",
    presets: {
      identity: {
        title: "Content Creator",
        bio: "Storyteller, photographer, and digital creator sharing inspiration daily.",
        location: "Los Angeles, CA",
      },
      widgets: {
        left: ["identity", "description"],
        right: ["gallery", "projects"],
      },
      sampleContent: {
        description: {
          title: "My Story",
          content: "I create content that inspires and connects. From photography to video production, I love bringing creative visions to life.",
        },
        projects: {
          title: "Latest Work",
          items: [
            {
              title: "Travel Series",
              description: "Documentary series exploring hidden gems around the world",
              color: "orange",
            },
            {
              title: "Brand Partnerships",
              description: "Collaborated with 20+ brands on creative campaigns",
              color: "pink",
            },
          ],
        },
      },
    },
  },
  {
    id: "entrepreneur",
    profession: "entrepreneur",
    name: "Entrepreneur",
    description: "Perfect for startup founders and business leaders",
    selectedColor: 5 as ThemeIndex, // Purple theme
    icon: "🚀",
    presets: {
      identity: {
        title: "Founder & CEO",
        bio: "Building innovative solutions and leading teams to achieve ambitious goals.",
        location: "Seattle, WA",
      },
      widgets: {
        left: ["identity", "description"],
        right: ["startup", "projects"],
      },
      sampleContent: {
        description: {
          title: "Vision",
          content: "I'm passionate about building products that solve real problems and create lasting value for users and stakeholders.",
        },
        projects: {
          title: "Ventures",
          items: [
            {
              title: "SaaS Platform",
              description: "B2B software serving 500+ enterprise clients",
              color: "purple",
            },
            {
              title: "Mobile App",
              description: "Consumer app with 1M+ downloads and 4.8-star rating",
              color: "blue",
            },
          ],
        },
      },
    },
  },
  {
    id: "consultant",
    profession: "consultant",
    name: "Business Consultant",
    description: "Designed for consultants and advisors",
    selectedColor: 3 as ThemeIndex, // Teal theme
    icon: "💼",
    presets: {
      identity: {
        title: "Strategy Consultant",
        bio: "Helping businesses grow through strategic planning and operational excellence.",
        location: "Boston, MA",
      },
      widgets: {
        left: ["identity", "description"],
        right: ["services", "projects"],
      },
      sampleContent: {
        description: {
          title: "Approach",
          content: "I work with clients to identify opportunities, optimize operations, and drive sustainable growth through data-driven strategies.",
        },
        services: {
          items: [
            "Business Strategy",
            "Market Research",
            "Process Optimization",
            "Change Management",
            "Growth Planning",
          ],
        },
        projects: {
          title: "Recent Engagements",
          items: [
            {
              title: "Digital Transformation",
              description: "Led enterprise-wide digital strategy for Fortune 500 company",
              color: "teal",
            },
            {
              title: "Market Expansion",
              description: "Guided startup through successful international expansion",
              color: "blue",
            },
          ],
        },
      },
    },
  },
]

export function getTemplateById(id: string): PortfolioTemplate | undefined {
  return PORTFOLIO_TEMPLATES.find((t) => t.id === id)
}

export function getTemplatesByProfession(profession: ProfessionCategory): PortfolioTemplate[] {
  return PORTFOLIO_TEMPLATES.filter((t) => t.profession === profession)
}
