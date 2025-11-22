import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: widgetTypes, error } = await supabase
      .from("widget_types")
      .select("*")
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching widget types:", error)
      return NextResponse.json({ error: "Failed to fetch widget types" }, { status: 500 })
    }

    return NextResponse.json({ widgetTypes })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
