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

    let layoutStructure = {
      left: { type: "vertical", widgets: [] as string[] },
      right: { type: "vertical", widgets: [] as string[] },
    }

    // Fetch widget type IDs
    const { data: widgetTypes } = await supabase
      .from("widget_types")
      .select("id, key")
    
    const keyToId: Record<string, string> = {}
    for (const wt of widgetTypes || []) {
      keyToId[wt.key] = wt.id
    }

    const identityTypeId = keyToId["identity"]
    const descriptionTypeId = keyToId["description"]

    // Create identity widget with template-specific data
    if (identityTypeId) {
      const identityProps: any = {
        name: user.user_metadata?.full_name || name,
        email: user.email || "",
        handle: `@${portfolio.slug}`,
      }

      // Apply template-specific identity customizations
      if (template === "designer") {
        identityProps.selectedColor = 4 // Purple
        identityProps.title = "UI/UX Designer"
        identityProps.bio = "I create intuitive digital experiences that delight users."
      } else if (template === "developer") {
        identityProps.selectedColor = 2 // Green
        identityProps.title = "Full Stack Developer"
        identityProps.bio = "Building scalable web applications with modern technologies."
      } else if (template === "marketing") {
        identityProps.selectedColor = 1 // Orange/Red
        identityProps.title = "Growth Marketing Manager"
        identityProps.bio = "Data-driven marketer scaling startups through strategic campaigns."
      } else if (template === "founder") {
        identityProps.selectedColor = 0 // Blue
        identityProps.title = "Founder & CEO"
        identityProps.bio = "Building the future. Previously exited startup."
      } else {
        identityProps.selectedColor = 3 // Default red
      }

      console.log("[v0] Creating identity widget with color:", identityProps.selectedColor)

      const { error: identityError } = await supabase
        .from("widget_instances")
        .insert({
          page_id: mainPage.id,
          widget_type_id: identityTypeId,
          props: identityProps,
          enabled: true,
        })

      if (identityError) {
        console.error("[v0] ⚠️ Failed to create identity widget:", identityError)
      } else {
        layoutStructure.left.widgets.push("identity")
        console.log("[v0] ✅ Identity widget created")
      }
    }

    // Create template-specific description widgets
    if (template && template !== "blank" && PORTFOLIO_TEMPLATES[template as PortfolioTemplateType] && descriptionTypeId) {
      console.log("[v0] 📋 Creating template widgets for:", template)
      console.log("[v0] Template exists:", !!PORTFOLIO_TEMPLATES[template as PortfolioTemplateType])
      console.log("[v0] Description type ID:", descriptionTypeId)
      
      const templateConfig = PORTFOLIO_TEMPLATES[template as PortfolioTemplateType]
      console.log("[v0] Template config:", JSON.stringify(templateConfig))
      
      if (templateConfig.widgets.length > 0) {
        console.log("[v0] Creating", templateConfig.widgets.length, "description widgets")
        
        for (let i = 0; i < templateConfig.widgets.length; i++) {
          const widget = templateConfig.widgets[i]
          console.log("[v0] Creating widget", i, "with props:", JSON.stringify(widget.props))
          
          const { data: createdWidget, error: widgetError } = await supabase
            .from("widget_instances")
            .insert({
              page_id: mainPage.id,
              widget_type_id: descriptionTypeId,
              props: widget.props || {},
              enabled: true,
            })
            .select("id")
            .single()

          if (widgetError) {
            console.error("[v0] ⚠️ Failed to create template widget", i, ":", widgetError)
            console.error("[v0] Widget error details:", JSON.stringify(widgetError))
          } else if (createdWidget?.id) {
            layoutStructure.left.widgets.push(`description-${createdWidget.id}`)
            console.log("[v0] ✅ Template widget", i, "created with ID:", createdWidget.id)
          } else {
            console.error("[v0] ⚠️ No widget ID returned for widget", i)
          }
        }
        
        console.log("[v0] Final layout structure:", JSON.stringify(layoutStructure))
      } else {
        console.log("[v0] ⚠️ Template has no widgets configured")
      }
    } else {
      console.log("[v0] ⚠️ Template widget creation skipped - template:", template, "exists:", !!PORTFOLIO_TEMPLATES[template as any], "descriptionTypeId:", descriptionTypeId)
    }

    // Create layout with structure
    console.log("[v0] Creating layout with structure:", JSON.stringify(layoutStructure))
    
    const { error: layoutError } = await supabase
      .from("page_layouts")
      .insert({
        page_id: mainPage.id,
        layout: layoutStructure,
      })

    if (layoutError) {
      console.error("[v0] ❌ Failed to create page layout:", layoutError)
    } else {
      console.log("[v0] ✅ Page layout created with", layoutStructure.left.widgets.length, "left widgets")
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
