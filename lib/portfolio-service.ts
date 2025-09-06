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
export async function savePortfolioUniversal(portfolio: UnifiedPortfolio, signal?: AbortSignal): Promise<void> {
  const supabase = createClient()

  const { data: auth } = await supabase.auth.getUser()
  if (!auth?.user) throw new Error("Not authenticated")

  console.log("[v0] Starting UUID-safe portfolio save for:", portfolio.name)

  // Upsert portfolio without id — rely on (user_id, slug) uniqueness
  const base = {
    user_id: auth.user.id,
    name: portfolio.name,
    slug: portfolio.id, // if you want a prettier slug, sanitize it
    is_public: (portfolio as any).isLive ?? false,
    is_demo: false,
    theme_id: (portfolio as any).theme_id ?? null,
  }

  const { data: upserted, error: upErr } = await supabase
    .from("portfolios")
    .upsert(base, { onConflict: "user_id,slug" })
    .select("*")
    .single()

  if (upErr) {
    console.error("[v0] Error upserting portfolio:", upErr)
    throw upErr
  }

  const portfolioId = upserted!.id as string // DB-generated UUID
  console.log("[v0] Portfolio upserted with UUID:", portfolioId)

  // Ensure main page exists (key='main')
  const { data: mainPage } = await supabase
    .from("pages")
    .select("*")
    .eq("portfolio_id", portfolioId)
    .eq("key", "main")
    .maybeSingle()

  if (!mainPage) {
    const { error: pageErr } = await supabase.from("pages").insert({
      portfolio_id: portfolioId,
      key: "main",
      title: portfolio.name,
      route: "/",
      is_demo: false,
    })
    if (pageErr) {
      console.error("[v0] Error creating main page:", pageErr)
      throw pageErr
    }
    console.log("[v0] Created main page")
  }

  // Get page id for widget operations
  const { data: page } = await supabase
    .from("pages")
    .select("id")
    .eq("portfolio_id", portfolioId)
    .eq("key", "main")
    .single()
  const pageId = page!.id

  // Get profile widget type id
  const { data: profileType } = await supabase.from("widget_types").select("id").eq("key", "profile").single()

  if (!profileType) {
    console.error("[v0] Profile widget type not found")
    return
  }

  // Find existing profile instance or insert new one
  const { data: existingProfile } = await supabase
    .from("widget_instances")
    .select("id")
    .eq("page_id", pageId)
    .eq("widget_type_id", profileType.id)
    .maybeSingle()

  const profileProps = {
    name: portfolio.name,
    title: portfolio.title,
    email: portfolio.email,
    location: portfolio.location,
    handle: portfolio.handle,
    initials: portfolio.initials,
    selectedColor: portfolio.selectedColor,
  }

  if (existingProfile) {
    await supabase.from("widget_instances").update({ props: profileProps }).eq("id", existingProfile.id)
    console.log("[v0] Updated existing profile widget")
  } else {
    await supabase.from("widget_instances").insert({
      page_id: pageId,
      widget_type_id: profileType.id,
      enabled: true,
      props: profileProps,
    })
    console.log("[v0] Created new profile widget")
  }

  // Handle template content if present
  if (portfolio.isTemplate && (portfolio as any).content) {
    const content = (portfolio as any).content
    console.log("[v0] Saving template content")

    // Get widget types for template content
    const { data: widgetTypes } = await supabase
      .from("widget_types")
      .select("id, key")
      .in("key", ["description", "projects"])

    const descriptionType = widgetTypes?.find((wt) => wt.key === "description")
    const projectsType = widgetTypes?.find((wt) => wt.key === "projects")

    // Save about/description widget
    if (descriptionType && content.about) {
      const { data: existingDesc } = await supabase
        .from("widget_instances")
        .select("id")
        .eq("page_id", pageId)
        .eq("widget_type_id", descriptionType.id)
        .maybeSingle()

      const descProps = { title: "About", content: content.about }

      if (existingDesc) {
        await supabase.from("widget_instances").update({ props: descProps }).eq("id", existingDesc.id)
      } else {
        await supabase.from("widget_instances").insert({
          page_id: pageId,
          widget_type_id: descriptionType.id,
          enabled: true,
          props: descProps,
        })
      }
    }

    // Save projects widget
    if (projectsType && (content.projectColors || content.galleryGroups)) {
      const { data: existingProjects } = await supabase
        .from("widget_instances")
        .select("id")
        .eq("page_id", pageId)
        .eq("widget_type_id", projectsType.id)
        .maybeSingle()

      const projectProps = {
        title: "Projects",
        projectColors: content.projectColors || [],
        galleryGroups: content.galleryGroups || [],
      }

      if (existingProjects) {
        await supabase.from("widget_instances").update({ props: projectProps }).eq("id", existingProjects.id)
      } else {
        await supabase.from("widget_instances").insert({
          page_id: pageId,
          widget_type_id: projectsType.id,
          enabled: true,
          props: projectProps,
        })
      }
    }
  }

  console.log("[v0] Portfolio save completed successfully")
}

export async function savePortfolio(portfolio: UnifiedPortfolio, user?: any): Promise<void> {
  return savePortfolioUniversal(portfolio)
}

export async function loadUserPortfolios(user?: any): Promise<UnifiedPortfolio[]> {
  const supabase = createClient()

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
      id: portfolio.slug, // Use slug as the client-side ID
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
