import { type NextRequest, NextResponse } from "next/server"
import { getAvailableTemplates } from "@/lib/template-service"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const communityId = searchParams.get("communityId") || undefined

    console.log("[v0] 📋 Templates API GET request:")
    console.log("[v0]   - Full URL:", request.url)
    console.log("[v0]   - communityId param:", communityId)
    console.log("[v0]   - searchParams:", Object.fromEntries(searchParams.entries()))

    const templates = await getAvailableTemplates(communityId)

    console.log("[v0] 📋 Templates API returning:")
    console.log("[v0]   - Total templates:", templates.length)
    console.log(
      "[v0]   - System templates (community_id=null):",
      templates.filter((t) => t.community_id === null).length,
    )
    console.log("[v0]   - Community templates:", templates.filter((t) => t.community_id !== null).length)
    console.log("[v0]   - Mandatory templates:", templates.filter((t) => t.is_mandatory).length)

    if (templates.length > 0) {
      console.log("[v0]   - Template details:")
      templates.forEach((t) => {
        console.log(
          `[v0]     * ${t.name} (${t.id.slice(0, 8)}...) - community: ${t.community_id?.slice(0, 8) || "system"} - mandatory: ${t.is_mandatory}`,
        )
      })
    }

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("[v0] ❌ Error in templates API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
