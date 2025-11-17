import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { PORTFOLIO_TEMPLATES, type PortfolioTemplateType } from "@/lib/portfolio-templates"
import { getTemplateById } from "@/lib/template-service"

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("[v0] Missing Supabase environment variables")
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Missing Supabase environment variables",
        },
        { status: 500 },
      )
    }

    const supabase = await createClient()

    const { data: portfolios, error } = await supabase
      .from("public_portfolio_by_slug")
      .select("*")
      .order("portfolio_id", { ascending: false })

    if (error) {
      console.error("Error fetching portfolios:", error)
      return NextResponse.json({ error: "Failed to fetch portfolios" }, { status: 500 })
    }

    return NextResponse.json({ portfolios })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("[v0] Missing Supabase environment variables")
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Missing Supabase environment variables",
        },
        { status: 500 },
      )
    }

    const supabase = await createClient()

    let body
    try {
      body = await request.json()
    } catch (error) {
      console.log("[v0] Invalid JSON in portfolio POST request:", error)
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const { name, theme_id, description, community_id, templateId } = body

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      console.log("[v0] Missing or invalid portfolio name:", name)
      return NextResponse.json({ error: "Portfolio name is required" }, { status: 400 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] Unauthorized portfolio creation request")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (community_id) {
      console.log("[v0] Checking for existing community portfolio, user:", user.id, "community:", community_id)
      
      const { data: existingPortfolio } = await supabase
        .from("portfolios")
        .select("id, name")
        .eq("user_id", user.id)
        .eq("community_id", community_id)
        .maybeSingle()

      if (existingPortfolio) {
        console.log("[v0] User already has a portfolio for this community:", existingPortfolio.id)
        return NextResponse.json(
          {
            error: "Duplicate community portfolio",
            message: `You already have a portfolio "${existingPortfolio.name}" for this community.`,
            details: "Each user can only have one portfolio per community. Please sync an existing portfolio instead.",
            existingPortfolio,
          },
          { status: 409 },
        )
      }
    }

    console.log(
      "[v0] Creating portfolio for user:",
      user.id,
      "Name:",
      name,
      "Theme:",
      theme_id,
      "Community:",
      community_id || "none (personal)",
      "Template:",
      templateId || "blank"
    )

    const timestamp = Date.now()
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    
    const slug = `${baseSlug}-${timestamp}`

    console.log("[v0] Generated unique slug:", slug)

    const insertData: any = {
      user_id: user.id,
      name: name.trim(),
      slug,
      description: description || `${name}'s portfolio`,
      is_public: false,
      is_demo: false,
    }

    if (theme_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(theme_id)) {
      insertData.theme_id = theme_id
    }

    if (community_id) {
      insertData.community_id = community_id
    }

    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .insert(insertData)
      .select()
      .single()

    if (portfolioError) {
      console.error("[v0] ❌ Failed to create portfolio:", portfolioError)
      
      if (portfolioError.code === "23505" && portfolioError.message.includes("idx_unique_user_community_portfolio")) {
        console.error("[v0] User already has a portfolio for this community:", portfolioError)
        return NextResponse.json(
          {
            error: "Duplicate community portfolio",
            message: "You already have a portfolio for this community.",
            details: "Each user can only have one portfolio per community.",
          },
          { status: 409 },
        )
      }

      return NextResponse.json(
        {
          error: "Portfolio creation failed",
          message: "Could not create your portfolio.",
          details: portfolioError.message || "Please try again.",
          code: portfolioError.code,
        },
        { status: 500 },
      )
    }

    if (!portfolio) {
      console.error("[v0] ❌ Portfolio creation returned no data")
      return NextResponse.json(
        {
          error: "Portfolio creation failed",
          message: "Could not create your portfolio.",
          details: "No data returned from database.",
        },
        { status: 500 },
      )
    }

    console.log("[v0] ✅ Portfolio created successfully:", portfolio.id, "with slug:", portfolio.slug)

    console.log("[v0] Creating default page structure for portfolio:", portfolio.id)

    const { data: mainPage, error: pageError } = await supabase
      .from("pages")
      .insert({
        portfolio_id: portfolio.id,
        key: "main",
        title: "Main",
        route: "/",
        is_demo: false,
      })
      .select("id")
      .single()

    if (pageError) {
      console.error("[v0] ❌ Failed to create main page:", pageError)
      
      await supabase.from("portfolios").delete().eq("id", portfolio.id)
      
      return NextResponse.json(
        {
          error: "Page creation failed",
          message: "Failed to initialize portfolio structure.",
          details: pageError.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] ✅ Main page created:", mainPage.id)

    let layoutStructure: any
    let widgetConfigs: any[] = []

    if (templateId) {
      console.log("[v0] 📋 Fetching template with ID:", templateId)
      const template = await getTemplateById(templateId)
      
      if (template) {
        console.log("[v0] ✅ Using database template:", template.name)
        console.log("[v0] Template layout:", JSON.stringify(template.layout, null, 2))
        console.log("[v0] Template widget_configs count:", template.widget_configs.length)
        console.log("[v0] Template widget_configs:", JSON.stringify(template.widget_configs, null, 2))
        
        layoutStructure = template.layout
        widgetConfigs = template.widget_configs
      } else {
        console.warn("[v0] ⚠️ Template not found, using blank template")
        layoutStructure = {
          left: { type: "vertical", widgets: ["identity"] },
          right: { type: "vertical", widgets: [] },
        }
        widgetConfigs = [{ id: "identity", type: "identity", props: { selectedColor: 3 } }]
      }
    } else {
      // Blank template
      layoutStructure = {
        left: { type: "vertical", widgets: ["identity"] },
        right: { type: "vertical", widgets: [] },
      }
      widgetConfigs = [{ id: "identity", type: "identity", props: { selectedColor: 3 } }]
    }

    console.log("[v0] 📋 Processing", widgetConfigs.length, "widgets from template")

    const { data: widgetTypes } = await supabase.from("widget_types").select("id, key")
    const keyToId: Record<string, string> = {}
    for (const wt of widgetTypes || []) {
      keyToId[wt.key] = wt.id
    }

    const templateIdToActualId: Record<string, string> = {}

    for (const widgetConfig of widgetConfigs) {
      console.log("[v0] Creating widget:", widgetConfig.type, "with template ID:", widgetConfig.id)
      
      const widgetTypeId = keyToId[widgetConfig.type]
      
      if (!widgetTypeId) {
        console.warn("[v0] ⚠️ Widget type not found:", widgetConfig.type)
        continue
      }

      const props = { ...widgetConfig.props }
      
      if (widgetConfig.type === "identity") {
        props.name = user.user_metadata?.full_name || name
        props.email = user.email || ""
        props.handle = `@${portfolio.slug}`
      }

      const { data: createdWidget, error: widgetError } = await supabase
        .from("widget_instances")
        .insert({
          page_id: mainPage.id,
          widget_type_id: widgetTypeId,
          props,
          enabled: true,
        })
        .select("id")
        .single()

      if (widgetError) {
        console.error("[v0] ⚠️ Failed to create widget:", widgetConfig.type, widgetError)
      } else if (createdWidget?.id) {
        if (widgetConfig.type === "identity") {
          templateIdToActualId[widgetConfig.id] = "identity"
        } else {
          templateIdToActualId[widgetConfig.id] = `${widgetConfig.type}-${createdWidget.id}`
        }
        console.log("[v0] ✅ Created widget:", widgetConfig.type, "->", templateIdToActualId[widgetConfig.id])
      }
    }

    console.log("[v0] 📋 Widget ID mapping:", JSON.stringify(templateIdToActualId, null, 2))

    const finalLayout = {
      left: {
        type: layoutStructure.left.type,
        widgets: layoutStructure.left.widgets.map((id: string) => {
          const mapped = templateIdToActualId[id] || id
          console.log("[v0] Left widget mapping:", id, "->", mapped)
          return mapped
        }),
      },
      right: {
        type: layoutStructure.right.type,
        widgets: layoutStructure.right.widgets.map((id: string) => {
          const mapped = templateIdToActualId[id] || id
          console.log("[v0] Right widget mapping:", id, "->", mapped)
          return mapped
        }),
      },
    }

    console.log("[v0] 📐 Final layout structure:", JSON.stringify(finalLayout, null, 2))

    const { data: savedLayout, error: layoutError } = await supabase
      .from("page_layouts")
      .insert({
        page_id: mainPage.id,
        layout: finalLayout,
      })
      .select("*")
      .single()

    if (layoutError) {
      console.error("[v0] ❌ Failed to create page layout:", layoutError)
    } else {
      console.log("[v0] ✅ Page layout saved successfully")
    }

    console.log("[v0] ✅ Portfolio fully initialized:", portfolio.id)
    
    return NextResponse.json({ 
      portfolio,
      message: "Portfolio created successfully"
    })
  } catch (error) {
    console.error("[v0] ❌ API Error in portfolio POST:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      message: "An unexpected error occurred. Please try again.",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
