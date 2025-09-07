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

const isUUID = (v?: string) =>
  typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64)

const makeSuffix = () => Math.random().toString(36).slice(2, 7) // 5 chars

async function insertPortfolioWithRetry(
  supabase: any,
  payload: {
    user_id: string
    name: string
    slug: string
    description?: string
    theme_id?: string
    is_public?: boolean
    is_demo?: boolean
    id?: string
  },
) {
  // try base, then slug-<n>, then slug-<random>
  const candidates = [payload.slug]
  for (let i = 1; i <= 5; i++) candidates.push(`${payload.slug}-${i}`)
  candidates.push(`${payload.slug}-${makeSuffix()}`)

  for (const slug of candidates) {
    const { data, error } = await supabase
      .from("portfolios")
      .insert({ ...payload, slug })
      .select()
      .single()

    if (!error) return data

    // 23505 unique violation on portfolios_slug_idx → try next
    if (error.code === "23505" && /portfolios_slug_idx/.test(error.message)) {
      console.log(`[v0] Slug '${slug}' already exists, trying next candidate`)
      continue
    }

    // other errors: bubble up
    throw error
  }
  throw new Error("Could not create a unique slug after several attempts")
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

  const baseSlug = toSlug(portfolio.name)

  if (!user) {
    console.log("[v0] No authenticated user, saving as demo portfolio")

    const baseData = {
      ...(isUUID(portfolio.id) ? { id: portfolio.id } : {}), // Only include valid UUID
      user_id: "demo-user",
      name: portfolio.name,
      slug: baseSlug,
      is_public: portfolio.isLive || false,
      is_demo: true,
    }

    console.log("[v0] Inserting demo portfolio with retry logic:", baseData)

    const savedPortfolio = await insertPortfolioWithRetry(supabase, baseData)
    console.log("[v0] Demo portfolio saved successfully with ID:", savedPortfolio?.id)
    return
  }

  const baseData = {
    ...(isUUID(portfolio.id) ? { id: portfolio.id } : {}), // Only include valid UUID
    user_id: user.id,
    name: portfolio.name,
    slug: baseSlug,
    is_public: portfolio.isLive || false,
    is_demo: false,
  }

  console.log("[v0] Inserting portfolio with retry logic:", baseData)

  const savedPortfolio = await insertPortfolioWithRetry(supabase, baseData)
  console.log("[v0] Portfolio saved successfully with ID:", savedPortfolio?.id)

  const actualPortfolioId = savedPortfolio?.id || portfolio.id

  const pageData = {
    portfolio_id: actualPortfolioId,
    key: "main",
    title: portfolio.name,
    route: "/",
    is_demo: false,
  }

  console.log("[v0] Saving page data:", pageData)

  const { data: savedPage, error: pageError } = await supabase
    .from("pages")
    .upsert(pageData, { onConflict: "portfolio_id,key" })
    .select()
    .single()

  if (pageError) {
    console.error("[v0] Error saving page:", pageError)
    throw new Error(`Failed to save page: ${pageError.message}`)
  }

  console.log("[v0] Page saved successfully with ID:", savedPage?.id)

  // Save template data using direct widget insertion
  if (portfolio.isTemplate && (portfolio as any).content) {
    console.log("[v0] Saving template content:", (portfolio as any).content)
    const content = (portfolio as any).content
    const pageId = savedPage?.id // Use actual saved page ID

    try {
      console.log("[v0] Using direct widget insertion")

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

      const widgets = []

      if (profileWidgetType) {
        widgets.push({
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
    console.log("[v0] No authenticated user, loading demo portfolios") // Load demo portfolios instead of empty array

    const { data: demoPortfolios, error: demoError } = await supabase
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
      .eq("is_demo", true)
      .order("updated_at", { ascending: false })
      .limit(5)

    if (demoError) {
      console.error("[v0] Error loading demo portfolios:", demoError)
      return []
    }

    console.log("[v0] Loaded demo portfolios:", demoPortfolios?.length || 0)

    return (demoPortfolios || []).map((portfolio: any): UnifiedPortfolio => {
      // ... existing mapping logic ...
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

  // Load portfolios with their pages and widgets for authenticated users
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
