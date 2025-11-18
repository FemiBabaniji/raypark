import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: tokenData, error } = await supabase
      .from("google_calendar_tokens")
      .select("user_id")
      .eq("user_id", user.id)
      .single()

    return NextResponse.json({
      connected: !!tokenData && !error,
    })
  } catch (error) {
    console.error("[v0] Status check error:", error)
    return NextResponse.json({ connected: false })
  }
}
