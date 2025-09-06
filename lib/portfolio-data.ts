import type { Portfolio } from "@/lib/types"

export async function getPublishedPortfolios(): Promise<Portfolio[]> {
  try {
    const response = await fetch("/api/portfolios")
    if (!response.ok) {
      throw new Error("Failed to fetch portfolios")
    }
    const data = await response.json()
    return data.portfolios || []
  } catch (error) {
    console.error("Error fetching portfolios:", error)
    return [
      {
        id: "jenny-wilson-db",
        user_id: "mock-user-1",
        title: "Jenny Wilson Portfolio",
        slug: "jenny-wilson",
        description: "Digital Product Designer Portfolio",
        theme_id: "creative-rose",
        is_published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "john-doe-db",
        user_id: "mock-user-2",
        title: "John Doe Portfolio",
        slug: "john-doe",
        description: "Full Stack Developer Portfolio",
        theme_id: "creative-dark",
        is_published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }
}

export async function getPortfolioBySlug(slug: string) {
  try {
    const response = await fetch(`/api/portfolios/${slug}`)
    if (!response.ok) {
      throw new Error("Portfolio not found")
    }
    const data = await response.json()
    return data.portfolio
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return null
  }
}

export const mockPortfolios = [
  {
    id: "jenny-wilson",
    name: "Jenny Wilson",
    title: "Digital Product Designer",
    email: "jenny@acme.com",
    location: "New York, NY",
    handle: "@jenny_design",
    avatarUrl: "/woman-designer.png",
    initials: "JW",
    selectedColor: 1, // blue
  },
  {
    id: "john-doe",
    name: "John Doe",
    title: "Data Scientist",
    email: "john@datateam.edu",
    location: "Boston, MA",
    handle: "@johndata",
    avatarUrl: "/man-developer.png",
    initials: "JD",
    selectedColor: 3, // green
  },
]

export const mockNetworkMembers = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "UX Designer",
    avatar: "/woman-designer.png",
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    role: "Full Stack Developer",
    avatar: "/man-developer.png",
  },
  {
    id: "3",
    name: "Emily Chen",
    role: "Data Analyst",
    avatar: "/woman-analyst.png",
  },
]
