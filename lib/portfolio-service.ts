import { createClient } from "@/lib/supabase/client"
import type { UnifiedPortfolio } from "@/components/unified-portfolio-card"

export interface PortfolioData {
  id: string
  user_id: string
  name: string
  slug: string
  is_public: boolean
  is_demo: boolean
  theme_id?: string
  created_at?: string
  updated_at?: string
}

// Client-side functions
export async function savePortfolio(portfolio: UnifiedPortfolio, user?: any): Promise<void> {
  console.log("[v0] Starting portfolio save for:", portfolio.name)

  let supabase
  try {
    supabase = createClient()
    console.log("[v0] Supabase client created successfully")
  } catch (error) {
    console.error("[v0] Failed to create Supabase client:", error)
    throw new Error(`Supabase configuration error: ${error}`)
  }

  console.log("[v0] User from parameter:", { user: user?.id })

  if (!user) {
    console.log("[v0] No authenticated user, saving as demo portfolio")
    // For now, let's save demo portfolios with a placeholder user_id
    const demoUserId = "demo-user"

    const portfolioData: Partial<PortfolioData> = {
      // If portfolio ID starts with "portfolio-" or "starter-", let database generate UUID
      ...(portfolio.id.startsWith("portfolio-") || portfolio.id.startsWith("starter-") ? {} : { id: portfolio.id }),
      user_id: demoUserId,
      name: portfolio.name,
      slug: portfolio.id,
      is_public: portfolio.isLive || false,
      is_demo: true, // Mark as demo
    }

    console.log("[v0] Saving demo portfolio data:", portfolioData)

    const { data: savedPortfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .upsert(portfolioData)
      .select()
      .single()

    if (portfolioError) {
      console.error("[v0] Error saving demo portfolio:", portfolioError)
      throw new Error(`Failed to save portfolio: ${portfolioError.message}`)
    }

    console.log("[v0] Demo portfolio saved successfully with ID:", savedPortfolio?.id)
    return
  }

  // Save basic portfolio info
  const portfolioData: Partial<PortfolioData> = {
    // If portfolio ID starts with "portfolio-" or "starter-", let database generate UUID
    ...(portfolio.id.startsWith("portfolio-") || portfolio.id.startsWith("starter-") ? {} : { id: portfolio.id }),
    user_id: user.id,
    name: portfolio.name,
    slug: portfolio.id,
    is_public: portfolio.isLive || false,
    is_demo: false,
  }

  console.log("[v0] Saving authenticated portfolio data:", portfolioData)

  const { data: savedPortfolio, error: portfolioError } = await supabase
    .from("portfolios")
    .upsert(portfolioData)
    .select()
    .single()

  if (portfolioError) {
    console.error("[v0] Error saving portfolio:", portfolioError)
    throw new Error(`Failed to save portfolio: ${portfolioError.message}`)
  }

  console.log("[v0] Portfolio saved successfully with ID:", savedPortfolio?.id)

  const actualPortfolioId = savedPortfolio?.id || portfolio.id

  // Create or update the main page
  const pageData = {
    id: `${actualPortfolioId}-main`,
    portfolio_id: actualPortfolioId,
    key: "main",
    title: portfolio.name,
    route: "/",
    is_demo: false,
  }

  console.log("[v0] Saving page data:", pageData)

  const { error: pageError } = await supabase.from("pages").upsert(pageData)
  if (pageError) {
    console.error("[v0] Error saving page:", pageError)
    throw new Error(`Failed to save page: ${pageError.message}`)
  }

  console.log("[v0] Page saved successfully")

  // Save template data using RPC functions if it's a template portfolio
  if (portfolio.isTemplate && (portfolio as any).content) {
    console.log("[v0] Saving template content:", (portfolio as any).content)
    const content = (portfolio as any).content
    const pageId = `${actualPortfolioId}-main`

    try {
      console.log("[v0] Using direct widget insertion instead of RPC")

      // Get widget type IDs first
      const { data: widgetTypes, error: widgetTypesError } = await supabase.from("widget_types").select("id, key")

      if (widgetTypesError) {
        console.error("[v0] Error fetching widget types:", widgetTypesError)
        throw new Error(`Failed to fetch widget types: ${widgetTypesError.message}`)
      }

      console.log("[v0] Available widget types:", widgetTypes)

      const profileWidgetType = widgetTypes?.find((wt) => wt.key === "profile")
      const descriptionWidgetType = widgetTypes?.find((wt) => wt.key === "description")
      const projectsWidgetType = widgetTypes?.find((wt) => wt.key === "projects")

      // Insert widgets directly
      const widgets = []

      if (profileWidgetType) {
        widgets.push({
          id: `${actualPortfolioId}-profile`,
          page_id: pageId,
          widget_type_id: profileWidgetType.id,
          props: {
            name: portfolio.name,
            title: portfolio.title,
            email: portfolio.email,
            location: portfolio.location,
            handle: portfolio.handle,
            initials: portfolio.initials,
            selectedColor: portfolio.selectedColor,
            profileText: content.profile,
          },
          enabled: true,
        })
      }

      if (descriptionWidgetType) {
        widgets.push({
          id: `${actualPortfolioId}-about`,
          page_id: pageId,
          widget_type_id: descriptionWidgetType.id,
          props: {
            title: "About",
            content: content.about,
          },
          enabled: true,
        })
      }

      if (projectsWidgetType) {
        widgets.push({
          id: `${actualPortfolioId}-projects`,
          page_id: pageId,
          widget_type_id: projectsWidgetType.id,
          props: {
            title: "Projects",
            projectColors: content.projectColors,
            galleryGroups: content.galleryGroups,
          },
          enabled: true,
        })
      }

      console.log("[v0] Inserting widgets:", widgets)

      if (widgets.length > 0) {
        const { error: widgetError } = await supabase.from("widget_instances").upsert(widgets)

        if (widgetError) {
          console.error("[v0] Error saving widgets:", widgetError)
          throw new Error(`Failed to save widgets: ${widgetError.message}`)
        }

        console.log("[v0] Widgets saved successfully")
      }
    } catch (rpcError) {
      console.error("[v0] Error saving template content:", rpcError)
      throw new Error(`Failed to save portfolio widgets: ${rpcError}`)
    }
  }

  console.log("[v0] Portfolio save completed successfully")
}

export async function loadUserPortfolios(user?: any): Promise<UnifiedPortfolio[]> {
  let supabase
  try {
    supabase = createClient()
    console.log("[v0] Supabase client created successfully for loading portfolios")
  } catch (error) {
    console.error("[v0] Failed to create Supabase client:", error)
    return []
  }

  console.log("[v0] Loading portfolios for user:", user?.id)

  if (!user) {
    console.log("[v0] No authenticated user, returning empty array")
    return []
  }

  // Load portfolios with their pages and widgets
  const { data: portfolios, error: portfolioError } = await supabase
    .from("portfolios")
    .select(`
      *,
      pages (
        *,
        widget_instances (
          *,
          widget_types (*)
        )
      )
    `)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  if (portfolioError) {
    console.error("Error loading portfolios:", portfolioError)
    throw new Error(`Failed to load portfolios: ${portfolioError.message}`)
  }

  console.log("[v0] Loaded portfolios from database:", portfolios?.length || 0)

  return (portfolios || []).map((portfolio: any): UnifiedPortfolio => {
    // Extract template data from widgets
    const mainPage = portfolio.pages?.find((p: any) => p.key === "main")
    const widgets = mainPage?.widget_instances || []

    const profileWidget = widgets.find((w: any) => w.widget_types?.key === "profile")
    const aboutWidget = widgets.find((w: any) => w.widget_types?.key === "description")
    const projectsWidget = widgets.find((w: any) => w.widget_types?.key === "projects")

    const isTemplate = !!(profileWidget || aboutWidget || projectsWidget)

    return {
      id: portfolio.id,
      name: portfolio.name,
      title: profileWidget?.props?.title || "Portfolio",
      email: profileWidget?.props?.email || `${portfolio.slug}@example.com`,
      location: profileWidget?.props?.location || "Location",
      handle: profileWidget?.props?.handle || `@${portfolio.slug}`,
      initials: profileWidget?.props?.initials || portfolio.name.slice(0, 2).toUpperCase(),
      selectedColor: (profileWidget?.props?.selectedColor || 0) as any,
      isLive: portfolio.is_public || false,
      isTemplate,
      // Include template content if it exists
      ...(isTemplate && {
        content: {
          profile: profileWidget?.props?.profileText || "",
          about: aboutWidget?.props?.content || "",
          projectColors: projectsWidget?.props?.projectColors || [],
          galleryGroups: projectsWidget?.props?.galleryGroups || [],
        },
      }),
    }
  })
}

export async function deletePortfolio(portfolioId: string): Promise<void> {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("User must be authenticated to delete portfolios")
  }

  const { error } = await supabase.from("portfolios").delete().eq("id", portfolioId).eq("user_id", user.id) // Ensure user can only delete their own portfolios

  if (error) {
    console.error("Error deleting portfolio:", error)
    throw new Error(`Failed to delete portfolio: ${error.message}`)
  }
}

export async function getPortfolioBySlug(slug: string): Promise<any> {
  const supabase = createClient()

  const { data, error } = await supabase.from("public_portfolio_by_slug").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error loading portfolio by slug:", error)
    throw new Error(`Failed to load portfolio: ${error.message}`)
  }

  return data
}

export async function addWidgetToPage(
  pageId: string,
  widgetKey: string,
  props: any,
  column: "left" | "right",
  position?: number,
): Promise<string> {
  const supabase = createClient()

  // Get the widget type ID first
  const { data: widgetType, error: widgetTypeError } = await supabase
    .from("widget_types")
    .select("id")
    .eq("key", widgetKey)
    .single()

  if (widgetTypeError || !widgetType) {
    console.error("Error finding widget type:", widgetTypeError)
    throw new Error(`Widget type '${widgetKey}' not found`)
  }

  // Insert the widget instance directly
  const widgetData = {
    page_id: pageId,
    widget_type_id: widgetType.id,
    props: {
      ...props,
      column,
      position: position || 0,
    },
    enabled: true,
  }

  const { data, error } = await supabase.from("widget_instances").insert(widgetData).select("id").single()

  if (error) {
    console.error("Error adding widget:", error)
    throw new Error(`Failed to add widget: ${error.message}`)
  }

  return data.id
}

export async function removeWidgetFromPage(instanceId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("widget_instances").delete().eq("id", instanceId)

  if (error) {
    console.error("Error removing widget:", error)
    throw new Error(`Failed to remove widget: ${error.message}`)
  }
}
