import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { slug } = params

    const { data: pages, error } = await supabase
      .from("pages")
      .select(`
        *,
        portfolios!inner (slug),
        page_layouts (
          id,
          layout
        ),
        widget_instances (
          *,
          widget_types (
            id,
            name,
            key,
            schema,
            render_hint
          )
        )
      `)
      .eq("portfolios.slug", slug)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching pages:", error)
      return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
    }

    return NextResponse.json({ pages })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
