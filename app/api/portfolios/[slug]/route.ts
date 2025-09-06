import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
