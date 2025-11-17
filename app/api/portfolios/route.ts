import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    const { name, theme_id, description, community_id } = body

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
            error: "Portfolio already exists",
            details: `You already have a portfolio "${existingPortfolio.name}" for this community. Each user can only have one portfolio per community.`,
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
    )

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    let portfolio = null
    let lastError = null

    for (let i = 0; i < 10; i++) {
      const slug = i === 0 ? baseSlug : `${baseSlug}-${i}`

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

      const { data, error } = await supabase
        .from("portfolios")
        .insert(insertData)
        .select()
        .single()

      if (!error && data) {
        portfolio = data
        console.log("[v0] Portfolio created successfully:", portfolio.id, "with slug:", portfolio.slug)
        break
      }

      lastError = error

      if (error?.code === "23505" && error.message.includes("portfolios_slug_idx")) {
        console.log(`[v0] Slug '${slug}' already exists, trying variant ${i + 1}`)
        continue
      }

      if (error?.code === "23505" && error.message.includes("idx_unique_user_community_portfolio")) {
        console.error("[v0] User already has a portfolio for this community:", error)
        return NextResponse.json(
          {
            error: "Portfolio already exists",
            details: "You already have a portfolio for this community. Each user can only have one portfolio per community.",
          },
          { status: 409 },
        )
      }

      break
    }

    if (!portfolio) {
      console.error("[v0] Failed to create portfolio after 10 attempts:", lastError)
      return NextResponse.json(
        {
          error: "Failed to create portfolio",
          details: lastError?.message || "Could not generate unique slug after 10 attempts",
          code: lastError?.code,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Creating default main page for portfolio:", portfolio.id)

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
      console.error("[v0] Failed to create main page:", pageError)
      // Don't fail the request, but log the issue
      return NextResponse.json(
        {
          error: "Portfolio created but page setup failed",
          details: pageError.message,
          portfolio,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Main page created:", mainPage.id)

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
      console.error("[v0] Failed to create page layout:", layoutError)
      // Don't fail the request
    } else {
      console.log("[v0] Page layout created successfully")
    }

    console.log("[v0] Portfolio created successfully:", portfolio.id, "Community:", portfolio.community_id || "none")
    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error("[v0] API Error in portfolio POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
