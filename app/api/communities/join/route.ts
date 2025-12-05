import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { communityCode } = await request.json()

    if (!communityCode) {
      return NextResponse.json({ error: "Community code is required" }, { status: 400 })
    }

    // Get community ID
    const { data: community, error: communityError } = await supabase
      .from("communities")
      .select("id, code, name")
      .eq("code", communityCode)
      .single()

    if (communityError || !community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from("community_members")
      .select("id")
      .eq("user_id", user.id)
      .eq("community_id", community.id)
      .single()

    if (existingMember) {
      return NextResponse.json({
        message: "Already a member",
        community,
      })
    }

    // Add user to community
    const { error: memberError } = await supabase.from("community_members").insert({
      user_id: user.id,
      community_id: community.id,
      joined_at: new Date().toISOString(),
    })

    if (memberError) {
      console.error("[v0] Error adding member:", memberError)
      return NextResponse.json({ error: "Failed to join community" }, { status: 500 })
    }

    // Check if this is the first member - if so, make them admin
    const { count } = await supabase
      .from("community_members")
      .select("*", { count: "exact", head: true })
      .eq("community_id", community.id)

    console.log("[v0] Member count for community:", count)

    if (count === 1) {
      // First member - make them admin
      const { error: roleError } = await supabase.from("user_community_roles").insert({
        user_id: user.id,
        community_id: community.id,
        role: "community_admin",
        assigned_at: new Date().toISOString(),
        notes: "Bootstrap first admin",
      })

      if (roleError) {
        console.error("[v0] Error assigning admin role:", roleError)
      } else {
        console.log("[v0] First member - assigned admin role")
      }
    }

    return NextResponse.json({
      message: "Successfully joined community",
      community,
      isFirstMember: count === 1,
    })
  } catch (error) {
    console.error("[v0] Join community error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
