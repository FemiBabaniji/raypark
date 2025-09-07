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

export async function createPortfolioOnce(params: {
  userId: string
  name: string
  theme_id: string
  description?: string
}) {
  const supabase = createClient()
  // slug is decided ONCE at creation; do not recompute on edits
  const slug = toSlug(params.name)

  const { data, error } = await supabase
    .from("portfolios")
    .insert({
      user_id: params.userId,
      name: params.name.trim(),
      slug,
      description: params.description?.trim() || `${params.name}'s portfolio`,
      theme_id: params.theme_id,
      is_public: false,
      is_demo: false,
    })
    .select("id, name, slug, description, theme_id, is_public, is_demo, created_at, updated_at")
    .single()

  if (error) {
    // if slug is globally unique and already taken, you may see 23505; handle if needed
    throw new Error(`Failed to create portfolio: ${error.message}`)
  }

  // Optional: seed a main page + layout for the editor to bind to
  const { data: page, error: pageErr } = await supabase
    .from("pages")
    .insert({ portfolio_id: data.id, key: "main", title: "Main", route: "/", is_demo: false })
    .select("id")
    .single()
  if (!page && pageErr) console.warn("[seed] page create failed:", pageErr?.message)

  const { error: layoutErr } = await supabase
    .from("page_layouts")
    .insert({ page_id: page?.id, layout: { columns: { left: [], right: [] } } })
  if (layoutErr) console.warn("[seed] layout create failed:", layoutErr?.message)

  return data
}

export async function updatePortfolioById(
  portfolioId: string,
  patch: {
    name?: string
    description?: string
    theme_id?: string
    is_public?: boolean
    identity?: {
      name?: string
      title?: string
      subtitle?: string
      selectedColor?: number
      initials?: string
      email?: string
      location?: string
      handle?: string
    }
    // intentionally no slug here — slug changes should be explicit via a separate function/flow
  },
) {
  if (!isUUID(portfolioId)) throw new Error("updatePortfolioById requires a real portfolioId (UUID)")

  const supabase = createClient()

  const { identity, ...portfolioPatch } = patch

  const { data, error } = await supabase
    .from("portfolios")
    .update(portfolioPatch)
    .eq("id", portfolioId)
    .select("id, name, slug, description, theme_id, is_public, is_demo, created_at, updated_at")
    .single()

  if (error) throw new Error(`Failed to update portfolio: ${error.message}`)

  if (identity) {
    console.log("[v0] Updating identity data including selectedColor:", identity.selectedColor)

    // Get the main page for this portfolio
    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("portfolio_id", portfolioId)
      .eq("key", "main")
      .single()

    if (page) {
      // Get the profile widget type
      const { data: widgetType } = await supabase.from("widget_types").select("id").eq("key", "profile").single()

      if (widgetType) {
        // Update or create the profile widget with identity data
        const { error: widgetError } = await supabase.from("widget_instances").upsert(
          {
            page_id: page.id,
            widget_type_id: widgetType.id,
            props: {
              name: identity.name,
              title: identity.title,
              subtitle: identity.subtitle,
              selectedColor: identity.selectedColor,
              initials: identity.initials,
              email: identity.email,
              location: identity.location,
              handle: identity.handle,
            },
            enabled: true,
          },
          { onConflict: "page_id,widget_type_id" },
        )

        if (widgetError) {
          console.error("[v0] Error updating profile widget:", widgetError)
        } else {
          console.log("[v0] Profile widget updated with selectedColor:", identity.selectedColor)
        }
      }
    }
  }

  return data
}

export async function loadUserPortfolios(user?: any): Promise<UnifiedPortfolio[]> {
  const supabase = createClient()
  if (!user?.id) return []

  const { data, error } = await supabase
    .from("portfolios")
    .select(`
      id, user_id, name, slug, is_public, is_demo, theme_id, created_at, updated_at,
      pages!inner(
        id,
        widget_instances!inner(
          props,
          widget_types!inner(key)
        )
      )
    `)
    .eq("user_id", user.id)
    .eq("pages.key", "main")
    .eq("pages.widget_instances.widget_types.key", "profile")
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("[v0] Error loading portfolios with colors:", error)
    const { data: basicData, error: basicError } = await supabase
      .from("portfolios")
      .select("id, user_id, name, slug, is_public, is_demo, theme_id, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (basicError) throw new Error(`Failed to load portfolios: ${basicError.message}`)

    const seen = new Set<string>()
    const deduped = []
    for (const p of basicData ?? []) {
      const key = p.slug || p.id
      if (seen.has(key)) continue
      seen.add(key)
      deduped.push(p)
    }
    return deduped.map(
      (portfolio: any): UnifiedPortfolio => ({
        id: portfolio.id,
        name: portfolio.name,
        title: "Portfolio",
        email: `${portfolio.slug}@example.com`,
        location: "Location",
        handle: `@${portfolio.slug}`,
        initials: portfolio.name.slice(0, 2).toUpperCase(),
        selectedColor: 0 as any, // Default fallback
        isLive: portfolio.is_public || false,
        isTemplate: false,
      }),
    )
  }

  const seen = new Set<string>()
  const deduped = []
  for (const p of data ?? []) {
    const key = p.slug || p.id
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(p)
  }

  return deduped.map((portfolio: any): UnifiedPortfolio => {
    const profileWidget = portfolio.pages?.[0]?.widget_instances?.[0]
    const selectedColor = profileWidget?.props?.selectedColor ?? 0

    console.log("[v0] Loading portfolio with selectedColor:", selectedColor, "for portfolio:", portfolio.name)

    return {
      id: portfolio.id,
      name: portfolio.name,
      title: "Portfolio",
      email: `${portfolio.slug}@example.com`,
      location: "Location",
      handle: `@${portfolio.slug}`,
      initials: portfolio.name.slice(0, 2).toUpperCase(),
      selectedColor: selectedColor as any,
      isLive: portfolio.is_public || false,
      isTemplate: false,
    }
  })
}

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

    console.log("[v0] Upserting demo portfolio:", baseData)

    if (isUUID(portfolio.id)) {
      const { data: savedPortfolio, error } = await supabase
        .from("portfolios")
        .upsert(baseData, { onConflict: "id" })
        .select()
        .single()

      if (error) {
        console.error("[v0] Error upserting demo portfolio:", error)
        throw new Error(`Failed to save portfolio: ${error.message}`)
      }
      console.log("[v0] Demo portfolio upserted successfully with ID:", savedPortfolio?.id)
    } else {
      const savedPortfolio = await insertPortfolioWithRetry(supabase, baseData)
      console.log("[v0] Demo portfolio inserted successfully with ID:", savedPortfolio?.id)
    }
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

  let savedPortfolio

  if (isUUID(portfolio.id)) {
    console.log("[v0] Upserting existing portfolio:", baseData)

    const { data, error } = await supabase.from("portfolios").upsert(baseData, { onConflict: "id" }).select().single()

    if (error) {
      console.error("[v0] Error upserting portfolio:", error)
      throw new Error(`Failed to save portfolio: ${error.message}`)
    }

    savedPortfolio = data
    console.log("[v0] Portfolio upserted successfully with ID:", savedPortfolio?.id)
  } else {
    console.log("[v0] Inserting new portfolio with retry logic:", baseData)
    savedPortfolio = await insertPortfolioWithRetry(supabase, baseData)
    console.log("[v0] Portfolio inserted successfully with ID:", savedPortfolio?.id)
  }

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

      console.log("[v0] Upserting widgets:", widgets)

      if (widgets.length > 0) {
        const { error: widgetError } = await supabase
          .from("widget_instances")
          .upsert(widgets, { onConflict: "page_id,widget_type_id" })

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

const makeSuffix = () => Math.random().toString(36).slice(2, 7) // 5 chars
