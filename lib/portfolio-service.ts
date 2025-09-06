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
export async function savePortfolio(portfolio: UnifiedPortfolio): Promise<void> {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("User must be authenticated to save portfolios")
  }

  // Save basic portfolio info
  const portfolioData: Partial<PortfolioData> = {
    id: portfolio.id,
    user_id: user.id,
    name: portfolio.name,
    slug: portfolio.id,
    is_public: portfolio.isLive || false,
    is_demo: false,
  }

  const { error: portfolioError } = await supabase.from("portfolios").upsert(portfolioData)
  if (portfolioError) {
    console.error("Error saving portfolio:", portfolioError)
    throw new Error(`Failed to save portfolio: ${portfolioError.message}`)
  }

  // Create or update the main page
  const pageData = {
    id: `${portfolio.id}-main`,
    portfolio_id: portfolio.id,
    key: "main",
    title: portfolio.name,
    route: "/",
    is_demo: false,
  }

  const { error: pageError } = await supabase.from("pages").upsert(pageData)
  if (pageError) {
    console.error("Error saving page:", pageError)
    throw new Error(`Failed to save page: ${pageError.message}`)
  }

  // Save template data using RPC functions if it's a template portfolio
  if (portfolio.isTemplate && (portfolio as any).content) {
    const content = (portfolio as any).content
    const pageId = `${portfolio.id}-main`

    try {
      // Use RPC to add profile widget
      await supabase.rpc("add_widget_to_page", {
        p_page_id: pageId,
        p_widget_key: "profile",
        p_props: {
          name: portfolio.name,
          title: portfolio.title,
          email: portfolio.email,
          location: portfolio.location,
          handle: portfolio.handle,
          initials: portfolio.initials,
          selectedColor: portfolio.selectedColor,
          profileText: content.profile,
        },
        p_column: "left",
        p_position: null,
      })

      // Use RPC to add about widget
      await supabase.rpc("add_widget_to_page", {
        p_page_id: pageId,
        p_widget_key: "description",
        p_props: {
          title: "About",
          content: content.about,
        },
        p_column: "left",
        p_position: null,
      })

      // Use RPC to add projects widget
      await supabase.rpc("add_widget_to_page", {
        p_page_id: pageId,
        p_widget_key: "projects",
        p_props: {
          title: "Projects",
          projectColors: content.projectColors,
          galleryGroups: content.galleryGroups,
        },
        p_column: "right",
        p_position: null,
      })
    } catch (rpcError) {
      console.error("Error adding widgets via RPC:", rpcError)
      // Fallback to direct widget insertion if RPC fails
      throw new Error(`Failed to save portfolio widgets: ${rpcError}`)
    }
  }
}

export async function loadUserPortfolios(): Promise<UnifiedPortfolio[]> {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    // Return demo portfolios if not authenticated
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

  const { data, error } = await supabase.rpc("add_widget_to_page", {
    p_page_id: pageId,
    p_widget_key: widgetKey,
    p_props: props,
    p_column: column,
    p_position: position,
  })

  if (error) {
    console.error("Error adding widget:", error)
    throw new Error(`Failed to add widget: ${error.message}`)
  }

  return data
}

export async function removeWidgetFromPage(instanceId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc("remove_widget_from_page", {
    p_instance_id: instanceId,
  })

  if (error) {
    console.error("Error removing widget:", error)
    throw new Error(`Failed to remove widget: ${error.message}`)
  }
}
