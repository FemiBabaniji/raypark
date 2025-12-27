import { type NextRequest, NextResponse } from "next/server"
import { getAvailableTemplates } from "@/lib/template-service"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const communityId = searchParams.get("communityId") || undefined

    const templates = await getAvailableTemplates(communityId)

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("[v0] Error in templates API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
