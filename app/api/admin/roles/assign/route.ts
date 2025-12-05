import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireCommunityAdmin } from "@/lib/middleware/require-permission"
import type { CommunityRole, CohortRole } from "@/types/admin"

/**
 * POST /api/admin/roles/assign
 * Assign a role to a user (community or cohort level)
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const body = await request.json()
  const {
    targetUserId,
    role,
    scope, // 'community' | 'cohort'
    scopeId, // community_id or cohort_id
    expiresAt,
  } = body

  // Validate input
  if (!targetUserId || !role || !scope || !scopeId) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
  }

  // Check permissions based on scope
  if (scope === "community") {
    // Require community admin to assign community roles
    const permissionError = await requireCommunityAdmin(scopeId)
    if (permissionError) return permissionError

    // Insert community role
    const { data, error } = await supabase
      .from("user_community_roles")
      .insert({
        user_id: targetUserId,
        community_id: scopeId,
        role: role as CommunityRole,
        assigned_by: user.id,
        expires_at: expiresAt || null,
      })
      .select()
      .single()

    if (error) {
      return new Response(JSON.stringify({ error: "Failed to assign role", details: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 201 })
  } else if (scope === "cohort") {
    // Check if user is cohort admin or community admin
    const { data: canManage } = await supabase.rpc("can_manage_cohort", {
      p_user_id: user.id,
      p_cohort_id: scopeId,
    })

    if (!canManage) {
      return new Response(JSON.stringify({ error: "Forbidden - Cannot manage this cohort" }), { status: 403 })
    }

    // Insert cohort role
    const { data, error } = await supabase
      .from("user_cohort_roles")
      .insert({
        user_id: targetUserId,
        cohort_id: scopeId,
        role: role as CohortRole,
        assigned_by: user.id,
        expires_at: expiresAt || null,
      })
      .select()
      .single()

    if (error) {
      return new Response(JSON.stringify({ error: "Failed to assign role", details: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 201 })
  }

  return new Response(JSON.stringify({ error: "Invalid scope" }), { status: 400 })
}
