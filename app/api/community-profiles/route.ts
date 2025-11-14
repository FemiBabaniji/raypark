import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { communityCode, ...profileData } = body

    const { data: community, error: communityError } = await supabase
      .from("communities")
      .select("id")
      .eq("code", communityCode)
      .single()

    if (communityError || !community) {
      console.error("Community not found:", communityError)
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    const { error: joinError } = await supabase.rpc("join_community", {
      p_community_code: communityCode,
      p_user_id: user.id,
      p_metadata: {
        industry: profileData.industry,
        skills: profileData.skills,
        goals: profileData.goals,
      },
    })

    if (joinError) {
      console.error("Error joining community:", joinError)
    }

    return NextResponse.json({
      success: true,
      communityId: community.id,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
