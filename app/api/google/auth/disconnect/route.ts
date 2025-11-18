import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get tokens
    const { data: tokenData } = await supabase
      .from("google_calendar_tokens")
      .select("access_token")
      .eq("user_id", user.id)
      .single()

    if (tokenData?.access_token) {
      // Revoke token with Google
      await fetch(
        `https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`,
        { method: "POST" }
      )
    }

    // Delete tokens from database
    const { error } = await supabase
      .from("google_calendar_tokens")
      .delete()
      .eq("user_id", user.id)

    if (error) {
      console.error("[v0] Failed to delete tokens:", error)
      return NextResponse.json(
        { error: "Failed to disconnect" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Disconnect error:", error)
    return NextResponse.json(
      { error: "Failed to disconnect" },
      { status: 500 }
    )
  }
}
