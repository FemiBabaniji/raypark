import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const supabaseServer = () => createServerComponentClient({ cookies })

export const supabaseClient = () => createClientComponentClient()

// Portfolio operations
export async function getPortfolios(userId?: string) {
  const supabase = supabaseServer()

  const { data: portfolios, error } = await supabase
    .from("portfolios")
    .select(`
      id, name, slug, is_public, created_at,
      theme:themes ( tokens )
    `)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (
    portfolios?.map((p) => ({
      id: p.id,
      name: p.name,
      title: "Portfolio",
      email: `${p.slug}@example.com`,
      location: "San Francisco, CA",
      handle: `@${p.slug}`,
      initials: p.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      selectedColor: p.theme?.tokens?.default_card_gradient_index ?? 0,
    })) || []
  )
}

// Page operations
export async function getPageForEdit(portfolioId: string, pageTitle = "home") {
  const supabase = supabaseServer()

  const { data: page, error } = await supabase
    .from("pages")
    .select(`
      id, title,
      layout:page_layouts ( layout ),
      widgets:widget_instances ( 
        id, widget_type_id, props, enabled,
        type:widget_types ( key, name )
      )
    `)
    .eq("portfolio_id", portfolioId)
    .eq("title", pageTitle)
    .single()

  if (error) throw error
  return page
}

// Widget operations
export async function updateWidgetProps(widgetId: string, props: any) {
  const supabase = supabaseClient()

  const { error } = await supabase.from("widget_instances").update({ props }).eq("id", widgetId)

  if (error) throw error
}

export async function updatePageLayout(pageId: string, layout: any) {
  const supabase = supabaseClient()

  const { error } = await supabase.from("page_layouts").update({ layout }).eq("page_id", pageId)

  if (error) throw error
}

// Theme operations
export async function updateThemeColorIndex(themeId: string, colorIndex: number) {
  const supabase = supabaseClient()

  const { data: theme } = await supabase.from("themes").select("tokens").eq("id", themeId).single()

  if (theme) {
    const tokens = { ...theme.tokens, default_card_gradient_index: colorIndex }

    const { error } = await supabase.from("themes").update({ tokens }).eq("id", themeId)

    if (error) throw error
  }
}

// Publishing operations
export async function publishPage(pageId: string, userId: string) {
  const supabase = supabaseClient()

  const { data: page } = await supabase
    .from("pages")
    .select(`
      id, title,
      layout:page_layouts ( layout ),
      widgets:widget_instances ( id, widget_type_id, props, enabled )
    `)
    .eq("id", pageId)
    .single()

  if (page) {
    const { error } = await supabase.from("page_versions").insert({
      page_id: page.id,
      status: "published",
      snapshot: page,
      created_by: userId,
      published_at: new Date().toISOString(),
    })

    if (error) throw error
  }
}

// First-run seeding for new users
export async function seedUserPortfolio(userId: string) {
  const supabase = supabaseClient()

  // Create portfolio
  const { data: portfolio, error: portfolioError } = await supabase
    .from("portfolios")
    .insert({
      user_id: userId,
      name: "Jenny Wilson",
      slug: `jenny-wilson-${Date.now()}`, // Ensure uniqueness
      theme_id: (await supabase.from("themes").select("id").eq("name", "Translucent 7").single()).data?.id,
      is_public: false,
      is_demo: false,
    })
    .select()
    .single()

  if (portfolioError) throw portfolioError

  // Create home page
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .insert({
      portfolio_id: portfolio.id,
      title: "home",
      is_demo: false,
    })
    .select()
    .single()

  if (pageError) throw pageError

  // Get widget types
  const { data: widgetTypes } = await supabase.from("widget_types").select("id, key")

  const typeMap = widgetTypes?.reduce((acc, wt) => ({ ...acc, [wt.key]: wt.id }), {}) || {}

  // Create widget instances with Jenny Wilson data
  const widgets = [
    {
      widget_type_id: typeMap["profile"],
      props: {
        avatarUrl: "/professional-woman-headshot.png",
        name: "jenny wilson",
        title: "is a digital product designer",
        subtitle: "currently designing at acme.",
        social: ["linkedin", "dribbble", "behance", "twitter", "unsplash", "instagram"],
      },
    },
    {
      widget_type_id: typeMap["education"],
      props: {
        items: [
          { degree: "MS Computer Science", school: "Stanford University", meta: "2020 • GPA: 3.8" },
          { degree: "BS Software Engineering", school: "UC Berkeley", meta: "2018 • GPA: 3.7" },
          { degree: "AWS Solutions Architect", school: "Coursera", meta: "2021 • Certified" },
        ],
      },
    },
    {
      widget_type_id: typeMap["description"],
      props: {
        title: "About Me",
        body: "I'm a passionate digital designer with over 5 years of experience creating user-centered designs that drive business results.",
      },
    },
    {
      widget_type_id: typeMap["projects"],
      props: {
        groups: [
          { name: "Web Development", stack: ["React", "Node.js", "AWS"], status: "In Progress", progress: 85 },
          { name: "AI/ML", stack: ["Python", "React", "TensorFlow"], status: "In Progress", progress: 60 },
          { name: "Mobile", stack: ["React Native", "TypeScript", "Firebase"], status: "Completed", progress: 100 },
          { name: "DevOps", stack: ["AWS", "Terraform", "Kubernetes"], status: "Completed", progress: 100 },
        ],
      },
    },
    {
      widget_type_id: typeMap["services"],
      props: {
        text: "I specialize in creating unique visual identities and user experiences that help businesses stand out in competitive markets.",
      },
    },
  ]

  const { data: createdWidgets, error: widgetError } = await supabase
    .from("widget_instances")
    .insert(widgets.map((w) => ({ ...w, page_id: page.id, enabled: true })))
    .select()

  if (widgetError) throw widgetError

  // Create layout
  const layout = {
    columns: {
      left: [createdWidgets[0].id, createdWidgets[1].id],
      right: [createdWidgets[2].id, createdWidgets[3].id, createdWidgets[4].id],
    },
  }

  const { error: layoutError } = await supabase.from("page_layouts").insert({
    page_id: page.id,
    layout,
  })

  if (layoutError) throw layoutError

  return portfolio
}
