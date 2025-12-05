import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isCommunityAdmin } from "@/lib/permissions"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { slug } = params

    const { data: portfolio, error } = await supabase
      .from("public_portfolio_by_slug")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("Error fetching portfolio:", error)
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const identifier = params.slug
    const body = await request.json()

    console.log("[v0] Updating portfolio:", identifier, body)

    // Check if identifier is a UUID (id) or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)

    const { data: portfolio, error: fetchError } = await supabase
      .from("portfolios")
      .select("user_id, community_id")
      .eq(isUUID ? "id" : "slug", identifier)
      .single()

    if (fetchError || !portfolio) {
      console.error("[v0] Portfolio not found:", fetchError)
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    const isOwner = portfolio.user_id === user.id
    const isAdmin = portfolio.community_id ? await isCommunityAdmin(user.id, portfolio.community_id) : false

    if (!isOwner && !isAdmin) {
      console.log(
        "[v0] User not authorized to edit portfolio. Owner:",
        portfolio.user_id,
        "User:",
        user.id,
        "Admin:",
        isAdmin,
      )
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "You do not have permission to edit this portfolio",
        },
        { status: 403 },
      )
    }

    console.log("[v0] User authorized:", isOwner ? "owner" : "community admin")

    const { error } = await supabase
      .from("portfolios")
      .update({
        name: body.name,
        description: body.description,
        theme_id: body.theme_id,
        is_public: body.is_public,
        community_id: body.community_id,
      })
      .eq(isUUID ? "id" : "slug", identifier)

    if (error) {
      console.error("[v0] Error updating portfolio:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const identifier = params.slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)

    // Fetch portfolio to check ownership and admin status
    const { data: portfolio, error: fetchError } = await supabase
      .from("portfolios")
      .select("user_id, community_id, name")
      .eq(isUUID ? "id" : "slug", identifier)
      .single()

    if (fetchError || !portfolio) {
      console.error("[v0] Portfolio not found:", fetchError)
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    const isOwner = portfolio.user_id === user.id
    const isAdmin = portfolio.community_id ? await isCommunityAdmin(user.id, portfolio.community_id) : false

    if (!isOwner && !isAdmin) {
      console.log("[v0] User not authorized to delete portfolio")
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "You do not have permission to delete this portfolio",
        },
        { status: 403 },
      )
    }

    console.log("[v0] Deleting portfolio:", portfolio.name, "by", isOwner ? "owner" : "community admin")

    // Delete portfolio (cascades to pages, layouts, widgets via foreign key)
    const { error } = await supabase
      .from("portfolios")
      .delete()
      .eq(isUUID ? "id" : "slug", identifier)

    if (error) {
      console.error("[v0] Error deleting portfolio:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Portfolio deleted successfully" })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
