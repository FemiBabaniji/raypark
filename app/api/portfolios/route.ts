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

    const { name, theme_id, description } = body

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      console.log("[v0] Missing or invalid portfolio name:", name)
      return NextResponse.json({ error: "Portfolio name is required" }, { status: 400 })
    }

    if (!theme_id) {
      console.log("[v0] Missing theme_id:", theme_id)
      return NextResponse.json({ error: "Theme ID is required" }, { status: 400 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] Unauthorized portfolio creation request")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Creating portfolio for user:", user.id, "Name:", name, "Theme:", theme_id)

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const { data: portfolio, error } = await supabase
      .from("portfolios")
      .insert({
        user_id: user.id,
        name: name.trim(),
        slug,
        theme_id,
        is_public: false,
        is_demo: false,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating portfolio:", error)
      return NextResponse.json(
        {
          error: "Failed to create portfolio",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Portfolio created successfully:", portfolio.id)
    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error("[v0] API Error in portfolio POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
