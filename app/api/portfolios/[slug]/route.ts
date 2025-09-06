import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { slug } = params

    const { data: portfolio, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("slug", slug)
      .eq("is_public", true)
      .single()

    if (error) {
      console.error("Error fetching portfolio:", error)
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    let theme = null
    if (portfolio.theme_id) {
      const { data: themeData } = await supabase
        .from("themes")
        .select("id, name, tokens")
        .eq("id", portfolio.theme_id)
        .single()
      theme = themeData
    }

    const { data: pages } = await supabase
      .from("pages")
      .select("*")
      .eq("portfolio_id", portfolio.id)
      .order("created_at", { ascending: true })

    const pagesWithData = await Promise.all(
      (pages || []).map(async (page) => {
        // Fetch page layout
        const { data: layouts } = await supabase.from("page_layouts").select("id, layout").eq("page_id", page.id)

        // Fetch widget instances
        const { data: widgetInstances } = await supabase.from("widget_instances").select("*").eq("page_id", page.id)

        // For each widget instance, fetch its widget type
        const widgetInstancesWithTypes = await Promise.all(
          (widgetInstances || []).map(async (instance) => {
            const { data: widgetType } = await supabase
              .from("widget_types")
              .select("id, name, key, schema, render_hint")
              .eq("id", instance.widget_type_id)
              .single()

            return { ...instance, widget_types: widgetType }
          }),
        )

        return {
          ...page,
          page_layouts: layouts || [],
          widget_instances: widgetInstancesWithTypes,
        }
      }),
    )

    const portfolioWithData = {
      ...portfolio,
      themes: theme,
      pages: pagesWithData,
    }

    return NextResponse.json({ portfolio: portfolioWithData })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
