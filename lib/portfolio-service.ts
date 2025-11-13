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
  community_id?: string // Optional community association
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
  community_id?: string // Optional community association
}) {
  const supabase = createClient()
  const slug = toSlug(params.name)

  console.log("[v0] createPortfolioOnce called with:", {
    userId: params.userId,
    name: params.name,
    slug,
    theme_id: params.theme_id,
  })

  const insertData: any = {
    user_id: params.userId,
    name: params.name.trim(),
    slug,
    description: params.description?.trim() || `${params.name}'s portfolio`,
    is_public: false,
    is_demo: false,
  }

  // Only add theme_id if it's a valid UUID
  if (params.theme_id && isUUID(params.theme_id)) {
    insertData.theme_id = params.theme_id
  }

  // Only add community_id if provided (column may not exist yet)
  if (params.community_id) {
    insertData.community_id = params.community_id
  }

  console.log("[v0] Inserting portfolio with data:", insertData)

  const { data, error } = await supabase
    .from("portfolios")
    .insert(insertData)
    .select("id, name, slug, description, theme_id, is_public, is_demo, created_at, updated_at")
    .maybeSingle()

  if (error || !data) {
    console.error("[v0] ❌ Failed to create portfolio:", error)
    throw new Error(`Failed to create portfolio: ${error?.message || "No data returned"}`)
  }

  console.log("[v0] ✅ Portfolio created successfully:", data.id)

  console.log("[v0] Creating main page for portfolio:", data.id)
  const { data: page, error: pageErr } = await supabase
    .from("pages")
    .insert({ portfolio_id: data.id, key: "main", title: "Main", route: "/", is_demo: false })
    .select("id")
    .maybeSingle()

  if (pageErr || !page) {
    console.error("[v0] ❌ Failed to create page:", pageErr)
    throw new Error(`Failed to create page: ${pageErr?.message || "No data returned"}`)
  }

  console.log("[v0] ✅ Page created successfully:", page.id)

  // Create the layout structure that matches the constraint exactly
  const layoutStructure = {
    left: {
      type: "vertical" as const,
      widgets: [] as string[],
    },
    right: {
      type: "vertical" as const,
      widgets: [] as string[],
    },
  }

  // Validate the structure before sending
  console.log("[v0] Validating layout structure before insert...")
  console.log("[v0] - typeof layoutStructure:", typeof layoutStructure)
  console.log("[v0] - typeof layoutStructure.left:", typeof layoutStructure.left)
  console.log("[v0] - Array.isArray(layoutStructure.left.widgets):", Array.isArray(layoutStructure.left.widgets))
  console.log("[v0] - typeof layoutStructure.right:", typeof layoutStructure.right)
  console.log("[v0] - Array.isArray(layoutStructure.right.widgets):", Array.isArray(layoutStructure.right.widgets))

  const layoutData = {
    page_id: page.id,
    layout: layoutStructure,
  }

  console.log("[v0] Inserting page_layout:")
  console.log(JSON.stringify(layoutData, null, 2))

  const { data: insertedLayout, error: layoutErr } = await supabase.from("page_layouts").insert(layoutData).select()

  if (layoutErr) {
    console.error("[v0] ❌ Failed to create layout:", layoutErr)
    console.error("[v0] Error code:", layoutErr.code)
    console.error("[v0] Error details:", layoutErr.details)
    console.error("[v0] Error hint:", layoutErr.hint)
    console.error("[v0] Full error:", JSON.stringify(layoutErr, null, 2))

    // Try to provide more context about what went wrong
    if (layoutErr.message?.includes("page_layouts_left_widgets_valid")) {
      console.error("[v0] ❌ Constraint violation: left.widgets must be an array")
      console.error("[v0] Actual type sent:", typeof layoutStructure.left.widgets)
      console.error("[v0] Is array?:", Array.isArray(layoutStructure.left.widgets))
    }

    throw new Error(`Failed to create page layout: ${layoutErr.message}`)
  }

  console.log("[v0] ✅ Layout created successfully:", insertedLayout)

  return data
}

/**
 * Ensures the current user has a portfolio and page.
 * Uses the database function ensure_user_portfolio() for atomic, RLS-compliant creation.
 *
 * @returns Object with portfolio_id, page_id, and is_new flag
 */
export async function ensureUserPortfolio(): Promise<{
  portfolio_id: string
  page_id: string
  is_new: boolean
}> {
  console.log("[v0] ensureUserPortfolio: calling database function")

  const supabase = createClient()

  // Call the database function that handles everything atomically
  const { data, error } = await supabase.rpc("ensure_user_portfolio").single()

  if (error) {
    console.error("[v0] Error calling ensure_user_portfolio:", error)
    throw new Error(`Failed to ensure portfolio: ${error.message}`)
  }

  if (!data) {
    throw new Error("No data returned from ensure_user_portfolio")
  }

  console.log("[v0] ensureUserPortfolio result:", data)

  return {
    portfolio_id: data.portfolio_id,
    page_id: data.page_id,
    is_new: data.is_new,
  }
}

export async function updatePortfolioById(
  portfolioId: string,
  patch: {
    name?: string
    description?: string
    theme_id?: string
    is_public?: boolean
    community_id?: string
  },
) {
  if (!isUUID(portfolioId)) throw new Error("updatePortfolioById requires a real portfolioId (UUID)")

  const response = await fetch(`/api/portfolios/${portfolioId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to update portfolio: ${error.error}`)
  }

  return await response.json()
}

export async function loadUserPortfolios(user?: any): Promise<UnifiedPortfolio[]> {
  console.log("[v0] loadUserPortfolios called with user:", { id: user?.id, email: user?.email })

  const supabase = createClient()
  if (!user?.id) {
    console.warn("[v0] No user ID provided to loadUserPortfolios")
    return []
  }

  console.log("[v0] Querying portfolios table for user_id:", user.id)

  const { data, error } = await supabase
    .from("portfolios")
    .select("id, user_id, name, slug, is_public, is_demo, theme_id, community_id, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("[v0] ❌ Database error loading portfolios:", error)
    console.error("[v0] Error code:", error.code)
    console.error("[v0] Error message:", error.message)
    console.error("[v0] Error details:", error.details)
    throw new Error(`Failed to load portfolios: ${error.message}`)
  }

  console.log("[v0] ✅ Query successful, raw data:", data)
  console.log("[v0] Portfolio count:", data?.length || 0)

  data?.forEach((p: any, i: number) => {
    console.log(`[v0] Portfolio ${i + 1}:`, {
      id: p.id,
      name: p.name,
      slug: p.slug,
      community_id: p.community_id,
      is_public: p.is_public,
      has_community: !!p.community_id,
    })
  })

  const seen = new Set<string>()
  const deduped = []
  for (const p of data ?? []) {
    const key = p.slug || p.id
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(p)
  }

  console.log("[v0] After deduplication:", deduped.length, "portfolios")

  return deduped.map(
    (portfolio: any): UnifiedPortfolio => ({
      id: portfolio.id,
      name: portfolio.name,
      title: "Portfolio",
      email: `${portfolio.slug}@example.com`,
      location: "Location",
      handle: `@${portfolio.slug}`,
      initials: portfolio.name.slice(0, 2).toUpperCase(),
      selectedColor: 0 as any,
      isLive: portfolio.is_public || false,
      isTemplate: false,
    }),
  )
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
    community_id?: string
  },
) {
  const { community_id, ...basePayload } = payload

  const candidates = [payload.slug]
  for (let i = 1; i <= 5; i++) candidates.push(`${payload.slug}-${i}`)
  candidates.push(`${payload.slug}-${makeSuffix()}`)

  for (const slug of candidates) {
    const insertData = { ...basePayload, slug }

    // Only add theme_id if it's a valid UUID
    if (payload.theme_id && isUUID(payload.theme_id)) {
      insertData.theme_id = payload.theme_id
    }

    // Only add community_id if it exists
    if (community_id) {
      insertData.community_id = community_id
    }

    const { data, error } = await supabase.from("portfolios").insert(insertData).select().maybeSingle()

    if (!error && data) return data

    // 23505 unique violation on portfolios_slug_idx → try next
    if (error?.code === "23505" && /portfolios_slug_idx/.test(error.message)) {
      console.log(`[v0] Slug '${slug}' already exists, trying next candidate`)
      continue
    }

    // other errors: bubble up
    if (error) throw error
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
        .maybeSingle()

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
    ...(isUUID(portfolio.id) ? { id: portfolio.id } : {}),
    user_id: user.id,
    name: portfolio.name,
    slug: baseSlug,
    is_public: portfolio.isLive || false,
    is_demo: false,
  }

  if ((portfolio as any).community_id) {
    baseData.community_id = (portfolio as any).community_id
  }

  let savedPortfolio

  if (isUUID(portfolio.id)) {
    console.log("[v0] Upserting existing portfolio:", baseData)

    const { data, error } = await supabase
      .from("portfolios")
      .upsert(baseData, { onConflict: "id" })
      .select()
      .maybeSingle()

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
    .maybeSingle()

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
      const identityWidgetType = widgetTypes?.find((wt) => wt.key === "identity")

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

      if (identityWidgetType) {
        widgets.push({
          page_id: pageId,
          widget_type_id: identityWidgetType.id,
          props: {
            name: portfolio.name,
            handle: portfolio.handle,
            avatarUrl: portfolio.avatarUrl,
            selectedColor: portfolio.selectedColor,
            title: portfolio.title,
            email: portfolio.email,
            location: portfolio.location,
            bio: portfolio.bio,
            linkedin: portfolio.linkedin,
            dribbble: portfolio.dribbble,
            behance: portfolio.behance,
            twitter: portfolio.twitter,
            unsplash: portfolio.unsplash,
            instagram: portfolio.instagram,
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

  const { data, error } = await supabase.from("public_portfolio_by_slug").select("*").eq("slug", slug).maybeSingle()

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
    .maybeSingle()

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

  const { data, error } = await supabase.from("widget_instances").insert(widgetData).select("id").maybeSingle()

  if (error || !data) {
    console.error("Error adding widget:", error)
    throw new Error(`Failed to add widget: ${error?.message || "No data returned"}`)
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

export async function getCommunityByCode(code: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("communities").select("*").eq("code", code).maybeSingle()

  if (error) {
    console.error("Error fetching community:", error)
    return null
  }

  return data
}

export async function joinCommunity(communityCode: string, userId: string, metadata?: Record<string, any>) {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("join_community", {
    p_community_code: communityCode,
    p_user_id: userId,
    p_metadata: metadata || {},
  })

  if (error) {
    console.error("Error joining community:", error)
    throw new Error(`Failed to join community: ${error.message}`)
  }

  return data
}

export async function getCommunityPortfolios(communityId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("community_portfolios")
    .select("*")
    .eq("community_id", communityId)
    .eq("is_public", true)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching community portfolios:", error)
    throw new Error(`Failed to fetch community portfolios: ${error.message}`)
  }

  return data
}

export async function saveWidgetLayout(
  portfolioId: string,
  leftWidgets: Array<{ id: string; type: string }>,
  rightWidgets: Array<{ id: string; type: string }>,
  widgetContent: Record<string, any>,
) {
  console.log("[v0] ========== START SAVE WIDGET LAYOUT ==========")
  console.log("[v0] Portfolio ID:", portfolioId)
  console.log("[v0] Widget content identity:", widgetContent.identity)
  console.log("[v0] selectedColor being saved:", widgetContent.identity?.selectedColor)

  const supabase = createClient()

  console.log("[v0] Testing Supabase connection...")
  try {
    const { data: testData, error: testError } = await supabase.from("portfolios").select("id").limit(1)
    if (testError) {
      console.error("[v0] ❌ Supabase connection test FAILED:", testError)
      throw new Error(`Supabase connection failed: ${testError.message}`)
    }
    console.log("[v0] ✅ Supabase connection test passed")
  } catch (err) {
    console.error("[v0] ❌ Supabase connection error:", err)
    throw err
  }

  console.log("[v0] Fetching page for portfolio...")
  const { data: existingPage, error: pageError } = await supabase
    .from("pages")
    .select("id")
    .eq("portfolio_id", portfolioId)
    .eq("key", "main")
    .maybeSingle()

  if (pageError) {
    console.error("[v0] ❌ Error fetching page:", pageError)
    throw new Error(`Failed to fetch page: ${pageError.message}`)
  }

  if (!existingPage) {
    console.error("[v0] ❌ No page found for portfolio. Portfolio may not be properly initialized.")
    throw new Error(
      `No page found for portfolio ${portfolioId}. Please ensure the portfolio is created with createPortfolioOnce() which creates both the portfolio and its main page.`,
    )
  }

  const page = existingPage
  console.log("[v0] ✅ Using existing page:", page.id)
}

export async function getPageLayout(portfolioId: string): Promise<{
  left: { type: string; widgets: string[] }
  right: { type: string; widgets: string[] }
} | null> {
  const supabase = createClient()

  const { data: page } = await supabase
    .from("pages")
    .select("id")
    .eq("portfolio_id", portfolioId)
    .eq("key", "main")
    .maybeSingle()

  if (!page?.id) return null

  const { data: layout } = await supabase.from("page_layouts").select("layout").eq("page_id", page.id).maybeSingle()

  return layout?.layout as any
}

export async function getPageWidgets(portfolioId: string): Promise<Array<{ key: string; props: any }>> {
  const supabase = createClient()

  const { data: page } = await supabase
    .from("pages")
    .select("id")
    .eq("portfolio_id", portfolioId)
    .eq("key", "main")
    .maybeSingle()

  if (!page?.id) return []

  const { data: instances } = await supabase
    .from("widget_instances")
    .select(
      `
      props,
      widget_types!inner(key)
    `,
    )
    .eq("page_id", page.id)

  return (
    instances?.map((i: any) => ({
      key: i.widget_types.key,
      props: i.props || {},
    })) || []
  )
}

const makeSuffix = () => Math.random().toString(36).slice(2, 7) // 5 chars

export type IdentityProps = {
  name?: string
  handle?: string
  avatarUrl?: string
  selectedColor?: number
  title?: string
  email?: string
  location?: string
  bio?: string
  linkedin?: string
  dribbble?: string
  behance?: string
  twitter?: string
  unsplash?: string
  instagram?: string
}

export async function getIdentityProps(portfolioId: string): Promise<IdentityProps | null> {
  const supabase = createClient()
  console.log("[v0] getIdentityProps called for portfolio:", portfolioId)

  const { data: page, error: pageErr } = await supabase
    .from("pages")
    .select("id")
    .eq("portfolio_id", portfolioId)
    .eq("key", "main")
    .maybeSingle()

  if (pageErr || !page?.id) {
    console.log("[v0] No page found for portfolio:", pageErr?.message)
    return null
  }

  const { data: wt, error: wtErr } = await supabase
    .from("widget_types")
    .select("id")
    .eq("key", "identity")
    .maybeSingle()

  if (wtErr || !wt?.id) {
    console.log("[v0] No identity widget type found:", wtErr?.message)
    return null
  }

  const { data: wi, error: wiErr } = await supabase
    .from("widget_instances")
    .select("props")
    .eq("page_id", page.id)
    .eq("widget_type_id", wt.id)
    .maybeSingle()

  if (wiErr) {
    console.log("[v0] Error fetching identity widget:", wiErr.message)
    return null
  }

  console.log("[v0] Identity widget props:", wi?.props)
  console.log("[v0] selectedColor in props:", wi?.props?.selectedColor, typeof wi?.props?.selectedColor)

  return (wi?.props as IdentityProps) ?? null
}

export const normalizeHandle = (h?: string) => (h || "").replace(/^@/, "")
