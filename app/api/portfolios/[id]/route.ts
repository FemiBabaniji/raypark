import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const portfolioId = params.id
    const body = await request.json()

    console.log("[v0] Updating portfolio:", portfolioId, body)

    const { error } = await supabase
      .from("portfolios")
      .update({
        name: body.name,
        description: body.description,
        theme_id: body.theme_id,
        is_public: body.is_public,
        community_id: body.community_id,
      })
      .eq("id", portfolioId)
      .eq("user_id", user.id)

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
