import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { PORTFOLIO_TEMPLATES, type PortfolioTemplateType } from "@/lib/portfolio-templates"

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

    const { name, theme_id, description, community_id, template } = body

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
      template || "blank"
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

    const defaultLayout = {
      left: { type: "vertical", widgets: ["identity"] },
      right: { type: "vertical", widgets: [] },
    }

    const { error: layoutError } = await supabase
      .from("page_layouts")
      .insert({
        page_id: mainPage.id,
        layout: defaultLayout,
      })

    if (layoutError) {
      console.error("[v0] ❌ Failed to create page layout:", layoutError)
    } else {
      console.log("[v0] ✅ Page layout created successfully")
    }

    const { data: identityType } = await supabase
      .from("widget_types")
      .select("id")
      .eq("key", "identity")
      .maybeSingle()

    if (identityType?.id) {
      const { error: widgetError } = await supabase
        .from("widget_instances")
        .insert({
          page_id: mainPage.id,
          widget_type_id: identityType.id,
          props: {
            name: user.user_metadata?.full_name || name,
            email: user.email || "",
            handle: `@${portfolio.slug}`,
          },
          enabled: true,
        })

      if (widgetError) {
        console.error("[v0] ⚠️ Failed to create identity widget:", widgetError)
      } else {
        console.log("[v0] ✅ Identity widget created")
      }
    }

    if (template && template !== "blank" && PORTFOLIO_TEMPLATES[template]) {
      console.log("[v0] 📋 Creating template widgets for:", template)
      
      const templateConfig = PORTFOLIO_TEMPLATES[template]
      
      // Get description widget type
      const { data: descriptionType } = await supabase
        .from("widget_types")
        .select("id")
        .eq("key", "description")
        .maybeSingle()

      if (descriptionType?.id && templateConfig.widgets.length > 0) {
        console.log("[v0] Creating", templateConfig.widgets.length, "description widgets")
        
        for (const widget of templateConfig.widgets) {
          const { error: widgetError } = await supabase
            .from("widget_instances")
            .insert({
              page_id: mainPage.id,
              widget_type_id: descriptionType.id,
              props: widget.props || {},
              enabled: true,
            })

          if (widgetError) {
            console.error(`[v0] ⚠️ Failed to create template widget:`, widgetError)
          } else {
            console.log(`[v0] ✅ Created template widget with title:`, widget.props?.title || "bio")
          }
        }
        
        console.log("[v0] ✅ All template widgets created for:", template)
      } else {
        console.error("[v0] ⚠️ Description widget type not found or no widgets in template")
      }
    } else {
      console.log("[v0] No template selected or blank template, skipping template widgets")
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
