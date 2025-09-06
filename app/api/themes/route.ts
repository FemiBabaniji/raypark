import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: themes, error } = await supabase
      .from("themes")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching themes:", error)
      return NextResponse.json({ error: "Failed to fetch themes" }, { status: 500 })
    }

    return NextResponse.json({ themes })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
