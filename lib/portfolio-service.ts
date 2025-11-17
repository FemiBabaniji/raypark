import { createClient } from "@/lib/supabase/client"
import type { UnifiedPortfolio } from "@/components/unified-portfolio-card"
import type { ThemeIndex } from "@/types/theme"

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

export async function ensureMainPage(supabase: ReturnType<typeof createClient>, portfolioId: string): Promise<string> {
  console.log("[v0] 🔍 Fetching main page for portfolio:", portfolioId)
  
  const { data: existingPage, error } = await supabase
    .from("pages")
    .select("id")
    .eq("portfolio_id", portfolioId)
    .eq("key", "main")
    .maybeSingle()

  if (error) {
    console.error("Error fetching page:", error)
    throw new Error(`Database error: ${error.message}`)
  }

  if (!existingPage?.id) {
    console.error("No main page found for portfolio:", portfolioId)
    throw new Error("Portfolio structure is incomplete. Please try creating a new portfolio.")
  }

  console.log("[v0] ✅ Found main page:", existingPage.id)
  await ensurePageLayout(supabase, existingPage.id)
  return existingPage.id
}

async function ensurePageLayout(supabase: ReturnType<typeof createClient>, pageId: string): Promise<void> {
  const { data: pl } = await supabase
    .from("page_layouts")
    .select("id")
    .eq("page_id", pageId)
    .maybeSingle()

  if (!pl?.id) {
    console.log("[v0] ⚠️ No layout found for page:", pageId, "- this should have been created during portfolio creation")
    // Don't create a default layout here - it would override template layouts
  } else {
    console.log("[v0] ℹ️ Layout already exists for page:", pageId)
  }
}

export async function createPortfolioOnce(params: {
  userId: string
  name: string
  theme_id: string
  description?: string
  community_id?: string
}) {
  const supabase = createClient()
  const baseName = params.name?.trim() || "portfolio"
  const baseSlug = toSlug(baseName)

  if (params.community_id) {
    console.log("[v0] Checking for existing portfolio in community:", params.community_id)
    
    const { data: existingCommunityPortfolio } = await supabase
      .from("portfolios")
      .select("id, slug, name")
      .eq("user_id", params.userId)
      .eq("community_id", params.community_id)
      .maybeSingle()

    if (existingCommunityPortfolio) {
      console.log("[v0] User already has a portfolio for this community:", existingCommunityPortfolio.id)
      throw new Error(`You already have a portfolio "${existingCommunityPortfolio.name}" for this community. Please sync an existing portfolio or delete the current one first.`)
    }
  }

  let inserted: any = null

  for (let i = 0; i < 10; i++) {
    const trySlug = i === 0 ? baseSlug : `${baseSlug}-${i}`

    const insertData: any = {
      user_id: params.userId,
      name: baseName,
      slug: trySlug,
      description: params.description?.trim() || `${baseName}'s portfolio`,
      is_public: false,
      is_demo: false,
    }

    if (params.theme_id && isUUID(params.theme_id)) {
      insertData.theme_id = params.theme_id
    }

    if (params.community_id) {
      insertData.community_id = params.community_id
      console.log("[v0] Creating portfolio with community_id:", params.community_id)
    }

    const { data, error } = await supabase.from("portfolios").insert(insertData).select("id, slug, name").single()

    if (!error && data) {
      inserted = data
      console.log("[v0] Portfolio created successfully:", inserted.id, "with slug:", inserted.slug)
      break
    }

    if (error && error.code === "23505") {
      if (error.message.includes("idx_unique_user_community_portfolio")) {
        console.log("[v0] Constraint violation: user already has portfolio for this community")
        throw new Error("You already have a portfolio for this community")
      }
      if (error.message.includes("portfolios_slug_idx")) {
        console.log(`[v0] Slug collision on '${trySlug}', trying next variant`)
        continue
      }
    }

    if (error) {
      console.error("[v0] ❌ Error creating portfolio:", error)
      throw error
    }
  }

  if (!inserted) {
    throw new Error("Could not create a unique slug after 10 attempts. Please try a different portfolio name.")
  }

  await ensureMainPage(supabase, inserted.id)

  return inserted
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
  const supabase = createClient()
  if (!user?.id) {
    return []
  }

  const { data, error } = await supabase
    .from("portfolios")
    .select(`
      id, 
      user_id, 
      name, 
      slug, 
      is_public, 
      is_demo, 
      theme_id, 
      community_id, 
      created_at, 
      updated_at,
      communities:community_id (
        id,
        name,
        code
      )
    `)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("[v0] ❌ Database error loading portfolios:", error)
    throw new Error(`Failed to load portfolios: ${error.message}`)
  }

  const seen = new Set<string>()
  const deduped = []
  
  console.log("[v0] Total portfolios fetched:", data?.length || 0)
  
  for (const p of data ?? []) {
    // Use portfolio ID as the unique key (most reliable)
    if (seen.has(p.id)) {
      console.log("[v0] Skipping duplicate portfolio:", p.id, p.name)
      continue
    }
    seen.add(p.id)
    deduped.push(p)
  }

  console.log("[v0] Portfolios after deduplication:", deduped.length)

  const portfoliosWithColors = await Promise.all(
    deduped.map(async (portfolio: any) => {
      const community = portfolio.communities
        ? {
            id: portfolio.communities.id,
            name: portfolio.communities.name,
            code: portfolio.communities.code,
          }
        : undefined

      // Try to load identity widget for this portfolio
      const identityProps = await getIdentityProps(portfolio.id)
      const selectedColor = typeof identityProps?.selectedColor === "number" 
        ? identityProps.selectedColor 
        : 3 // Default color if not found

      console.log(`[v0] Portfolio "${portfolio.name}" (${portfolio.id}) selectedColor:`, selectedColor)

      return {
        id: portfolio.id,
        name: portfolio.name,
        title: identityProps?.title || "Portfolio",
        email: identityProps?.email || `${portfolio.slug}@example.com`,
        location: identityProps?.location || "Location",
        handle: identityProps?.handle || `@${portfolio.slug}`,
        avatarUrl: portfolio.avatarUrl,
        initials: portfolio.name.slice(0, 2).toUpperCase(),
        selectedColor: selectedColor as ThemeIndex,
        isLive: portfolio.is_public || false,
        isTemplate: false,
        community,
      }
    })
  )

  return portfoliosWithColors
}

export async function savePortfolio(portfolio: UnifiedPortfolio, user?: any): Promise<void> {
  let supabase
  try {
    supabase = createClient()
  } catch (error) {
    console.error("[v0] Failed to create Supabase client:", error)
    throw new Error(`Supabase configuration error: ${error}`)
  }

  const baseSlug = toSlug(portfolio.name)

  if (!user) {
    const baseData = {
      ...(isUUID(portfolio.id) ? { id: portfolio.id } : {}),
      user_id: "demo-user",
      name: portfolio.name,
      slug: baseSlug,
      is_public: portfolio.isLive || false,
      is_demo: true,
    }

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

  if (portfolio.isTemplate && (portfolio as any).content) {
    console.log("[v0] Saving template content:", (portfolio as any).content)
    const content = (portfolio as any).content
    const pageId = savedPage?.id

    try {
      console.log("[v0] Using direct widget insertion")

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
            selectedColor: typeof portfolio.selectedColor === "number" ? portfolio.selectedColor : 0,
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

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("User must be authenticated to delete portfolios")
  }

  const { error } = await supabase.from("portfolios").delete().eq("id", portfolioId).eq("user_id", user.id)

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

  const { data: widgetType, error: widgetTypeError } = await supabase
    .from("widget_types")
    .select("id")
    .eq("key", widgetKey)
    .maybeSingle()

  if (widgetTypeError || !widgetType) {
    console.error("Error finding widget type:", widgetTypeError)
    throw new Error(`Widget type '${widgetKey}' not found`)
  }

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
  communityId?: string | null,
) {
  const supabase = createClient()
  console.log("[v0] 💾 Starting saveWidgetLayout for portfolio:", portfolioId)
  console.log("[v0] Left widgets:", leftWidgets.map(w => w.type))
  console.log("[v0] Right widgets:", rightWidgets.map(w => w.type))
  console.log("[v0] 🎨 Widget content being saved:", JSON.stringify(widgetContent, null, 2))
  
  if (communityId !== undefined) {
    const isValid = await verifyPortfolioCommunity(portfolioId, communityId)
    if (!isValid) {
      console.error("[v0] ❌ Cannot save: Portfolio does not belong to this community")
      throw new Error("Cannot save: Portfolio does not belong to this community")
    }
    console.log("[v0] ✅ Community ownership verified for save")
  }

  try {
    const { data: page, error: pageError } = await supabase
      .from("pages")
      .select("id")
      .eq("portfolio_id", portfolioId)
      .eq("key", "main")
      .maybeSingle()

    if (pageError) {
      console.error("[v0] ❌ Database error fetching page:", pageError)
      throw new Error(`Failed to find portfolio page: ${pageError.message}`)
    }

    if (!page?.id) {
      console.error("[v0] ❌ No page found for portfolio:", portfolioId)
      throw new Error("Portfolio page not found. The portfolio may be incomplete.")
    }

    const pageId = page.id
    console.log("[v0] ✅ Page ID confirmed:", pageId)

    // Save layout structure
    const layout = {
      left: { type: "vertical", widgets: leftWidgets.map((w) => w.type) },
      right: { type: "vertical", widgets: rightWidgets.map((w) => w.type) },
    }

    console.log("[v0] Saving layout structure...")

    const { error: layoutError } = await supabase
      .from("page_layouts")
      .upsert({ page_id: pageId, layout }, { onConflict: "page_id" })

    if (layoutError) {
      console.error("[v0] ❌ Failed to save layout:", layoutError)
      throw new Error(`Failed to save layout: ${layoutError.message}`)
    }

    console.log("[v0] ✅ Layout saved successfully")

    // Get widget type mappings
    const { data: types, error: typesError } = await supabase
      .from("widget_types")
      .select("id, key")
    
    if (typesError) {
      console.error("[v0] ❌ Failed to fetch widget types:", typesError)
      throw new Error(`Failed to fetch widget types: ${typesError.message}`)
    }

    const keyToId = Object.fromEntries((types ?? []).map((t) => [t.key, t.id]))
    console.log("[v0] Available widget types:", Object.keys(keyToId))

    // Collect all unique widget types
    const allWidgetTypes = new Set([
      ...leftWidgets.map(w => w.type),
      ...rightWidgets.map(w => w.type)
    ])

    console.log("[v0] Saving", allWidgetTypes.size, "unique widgets")

    let successCount = 0
    let failCount = 0

    let savedIdentityColor: number | undefined = undefined

    // Save each widget's content
    for (const widgetType of allWidgetTypes) {
      const widget_type_id = keyToId[widgetType]
      
      if (!widget_type_id) {
        console.warn("[v0] ⚠️ Widget type not found in database:", widgetType)
        failCount++
        continue
      }

      const content = widgetContent[widgetType] || {}

      if (widgetType === "identity") {
        console.log(`[v0] 🎨 SAVING IDENTITY WIDGET - selectedColor:`, content.selectedColor, "full content:", JSON.stringify(content, null, 2))
        savedIdentityColor = content.selectedColor
      }

      console.log(`[v0] Saving widget '${widgetType}' with ${Object.keys(content).length} properties`)

      const { error: widgetError } = await supabase
        .from("widget_instances")
        .upsert(
          { 
            page_id: pageId, 
            widget_type_id, 
            props: content, 
            enabled: true 
          },
          { onConflict: "page_id,widget_type_id" }
        )

      if (widgetError) {
        console.error(`[v0] ❌ Failed to save widget '${widgetType}':`, widgetError)
        failCount++
      } else {
        console.log(`[v0] ✅ Widget '${widgetType}' saved`)
        successCount++
      }
    }

    console.log(`[v0] ✅ Save complete: ${successCount} succeeded, ${failCount} failed`)
    
    if (failCount > 0) {
      throw new Error(`Some widgets failed to save (${failCount}/${allWidgetTypes.size})`)
    }

    if (typeof savedIdentityColor === "number" && typeof window !== "undefined") {
      console.log("[v0] 📡 Broadcasting color update event - portfolioId:", portfolioId, "color:", savedIdentityColor)
      window.dispatchEvent(
        new CustomEvent("portfolio-color-updated", {
          detail: { portfolioId, selectedColor: savedIdentityColor }
        })
      )
    }
    
  } catch (error) {
    console.error("[v0] ❌ saveWidgetLayout failed:", error)
    throw error
  }
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

  const { data: layoutData } = await supabase
    .from("page_layouts")
    .select("layout")
    .eq("page_id", page.id)
    .maybeSingle()

  return layoutData?.layout as any
}

export async function getPageWidgets(portfolioId: string): Promise<Array<{ key: string; props: any }>> {
  const supabase = createClient()

  const { data: page, error: pageErr } = await supabase
    .from("pages")
    .select("id")
    .eq("portfolio_id", portfolioId)
    .eq("key", "main")
    .maybeSingle()

  if (pageErr || !page?.id) {
    console.error("[v0] Failed to load page:", pageErr)
    return []
  }

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

export async function loadPortfolioData(portfolioId: string, communityId?: string | null): Promise<{
  layout: {
    left: Array<{ id: string; type: string }>
    right: Array<{ id: string; type: string }>
  }
  widgetContent: Record<string, any>
} | null> {
  const supabase = createClient()
  console.log("[v0] 🔄 Loading portfolio data for ID:", portfolioId)
  
  if (communityId !== undefined) {
    const isValid = await verifyPortfolioCommunity(portfolioId, communityId)
    if (!isValid) {
      console.error("[v0] ❌ Portfolio does not belong to the specified community")
      throw new Error("Portfolio does not belong to this community")
    }
    console.log("[v0] ✅ Portfolio community verified")
  }

  const { data: page } = await supabase
    .from("pages")
    .select("id")
    .eq("portfolio_id", portfolioId)
    .eq("key", "main")
    .maybeSingle()

  if (!page?.id) {
    console.log("[v0] ℹ️ No main page found for portfolio")
    return null
  }

  console.log("[v0] ✅ Found page ID:", page.id)

  const { data: layoutData } = await supabase
    .from("page_layouts")
    .select("layout")
    .eq("page_id", page.id)
    .maybeSingle()

  const rawLayout = layoutData?.layout as any
  const leftWidgetKeys = rawLayout?.left?.widgets || []
  const rightWidgetKeys = rawLayout?.right?.widgets || []

  console.log("[v0] Left widget keys from layout:", leftWidgetKeys)
  console.log("[v0] Right widget keys from layout:", rightWidgetKeys)

  const { data: widgetTypes } = await supabase.from("widget_types").select("id, key")
  const idToKey = Object.fromEntries((widgetTypes || []).map((t) => [t.id, t.key]))
  const keyToId = Object.fromEntries((widgetTypes || []).map((t) => [t.key, t.id]))

  const { data: instances } = await supabase
    .from("widget_instances")
    .select("id, widget_type_id, props")
    .eq("page_id", page.id)

  console.log("[v0] Found", instances?.length || 0, "widget instances")

  const instanceMap: Record<string, { type: string; props: any }> = {}
  const typeToPropsMap: Record<string, any> = {}
  const widgetContent: Record<string, any> = {}

  for (const instance of instances || []) {
    const widgetType = idToKey[instance.widget_type_id]
    if (!widgetType) continue

    const props = instance.props || {}

    // Store by instance ID (for UUID-based widgets)
    instanceMap[instance.id] = {
      type: widgetType,
      props
    }

    // Store by widget type (for type-based widgets)
    typeToPropsMap[widgetType] = props

    console.log("[v0] Loaded widget instance:", instance.id, "type:", widgetType)
  }
  
  const leftWidgets = leftWidgetKeys.map((key: string) => {
    // Handle identity widget specially
    if (key === "identity") {
      widgetContent.identity = typeToPropsMap.identity || {}
      return { id: key, type: key }
    }
    
    // Check if key is UUID-based (e.g., "description-uuid123")
    if (key.includes("-") && key.length > 20) {
      const instanceId = key.split("-").slice(1).join("-")
      const widgetData = instanceMap[instanceId]
      if (widgetData) {
        widgetContent[key] = widgetData.props
        return { id: key, type: widgetData.type }
      }
    }
    
    // Handle plain type strings (e.g., "description", "projects")
    if (typeToPropsMap[key]) {
      widgetContent[key] = typeToPropsMap[key]
      console.log(`[v0] ✅ Loaded content for widget type '${key}':`, Object.keys(typeToPropsMap[key]))
    } else {
      console.log(`[v0] ⚠️ No content found for widget '${key}'`)
    }
    
    return { id: key, type: key }
  })

  const rightWidgets = rightWidgetKeys.map((key: string) => {
    // Check if key is UUID-based
    if (key.includes("-") && key.length > 20) {
      const instanceId = key.split("-").slice(1).join("-")
      const widgetData = instanceMap[instanceId]
      if (widgetData) {
        widgetContent[key] = widgetData.props
        return { id: key, type: widgetData.type }
      }
    }
    
    // Handle plain type strings
    if (typeToPropsMap[key]) {
      widgetContent[key] = typeToPropsMap[key]
      console.log(`[v0] ✅ Loaded content for widget type '${key}':`, Object.keys(typeToPropsMap[key]))
    } else {
      console.log(`[v0] ⚠️ No content found for widget '${key}'`)
    }
    
    return { id: key, type: key }
  })

  console.log("[v0] ✅ Returning loaded data with", leftWidgets.length, "left and", rightWidgets.length, "right widgets")
  console.log("[v0] Widget content keys:", Object.keys(widgetContent))

  return {
    layout: { left: leftWidgets, right: rightWidgets },
    widgetContent,
  }
}

export const normalizeHandle = (h?: string) => (h || "").replace(/^@/, "")

export async function verifyPortfolioCommunity(
  portfolioId: string,
  expectedCommunityId: string | null
): Promise<boolean> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("portfolios")
    .select("community_id")
    .eq("id", portfolioId)
    .maybeSingle()
  
  if (error || !data) {
    console.error("[v0] Failed to verify portfolio community:", error)
    return false
  }
  
  // Both null (personal portfolio) or both match (same community)
  if (expectedCommunityId === null && data.community_id === null) {
    return true
  }
  
  return data.community_id === expectedCommunityId
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

    if (payload.theme_id && isUUID(payload.theme_id)) {
      insertData.theme_id = payload.theme_id
    }

    if (community_id) {
      insertData.community_id = community_id
    }

    const { data, error } = await supabase.from("portfolios").insert(insertData).select().maybeSingle()

    if (!error && data) return data

    if (error?.code === "23505") {
      if (error.message.includes("idx_unique_user_community_portfolio")) {
        throw new Error("You already have a portfolio for this community")
      }
      // Slug collision - try next candidate
      if (/portfolios_slug_idx/.test(error.message)) {
        console.log(`[v0] Slug '${slug}' already exists, trying next candidate`)
        continue
      }
    }

    if (error) throw error
  }
  throw new Error("Could not create a unique slug after several attempts")
}

const makeSuffix = () => Math.random().toString(36).slice(2, 7)

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
  
  console.log("[v0] 🎨 getIdentityProps called for portfolio:", portfolioId)

  const { data: page, error: pageErr } = await supabase
    .from("pages")
    .select("id")
    .eq("portfolio_id", portfolioId)
    .eq("key", "main")
    .maybeSingle()

  if (pageErr || !page?.id) {
    console.log("[v0] getIdentityProps: No page found for portfolio:", portfolioId, "error:", pageErr)
    return null
  }

  console.log("[v0] getIdentityProps: Found page ID:", page.id)

  const { data: wt, error: wtErr } = await supabase
    .from("widget_types")
    .select("id")
    .eq("key", "identity")
    .maybeSingle()

  if (wtErr || !wt?.id) {
    console.log("[v0] getIdentityProps: Identity widget type not found, error:", wtErr)
    return null
  }

  console.log("[v0] getIdentityProps: Found identity widget type ID:", wt.id)

  const { data: wi, error: wiErr } = await supabase
    .from("widget_instances")
    .select("props")
    .eq("page_id", page.id)
    .eq("widget_type_id", wt.id)
    .maybeSingle()

  if (wiErr) {
    console.log("[v0] getIdentityProps: Error fetching widget instance:", wiErr)
    return null
  }

  return (wi?.props as IdentityProps) ?? null
}
