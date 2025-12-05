import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireCommunityAdmin } from "@/lib/middleware/require-permission"

/**
 * DELETE /api/admin/roles/revoke
 * Revoke a role from a user
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const body = await request.json()
  const { roleId, scope } = body // scope: 'community' | 'cohort'

  if (!roleId || !scope) {
    return new Response(JSON.stringify({ error: "Missing roleId or scope" }), { status: 400 })
  }

  if (scope === "community") {
    // Get role details to check permission
    const { data: roleData, error: fetchError } = await supabase
      .from("user_community_roles")
      .select("community_id")
      .eq("id", roleId)
      .single()

    if (fetchError || !roleData) {
      return new Response(JSON.stringify({ error: "Role not found" }), { status: 404 })
    }

    // Check permission
    const permissionError = await requireCommunityAdmin(roleData.community_id)
    if (permissionError) return permissionError

    // Delete role
    const { error } = await supabase.from("user_community_roles").delete().eq("id", roleId)

    if (error) {
      return new Response(JSON.stringify({ error: "Failed to revoke role", details: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } else if (scope === "cohort") {
    // Get cohort details
    const { data: roleData, error: fetchError } = await supabase
      .from("user_cohort_roles")
      .select("cohort_id")
      .eq("id", roleId)
      .single()

    if (fetchError || !roleData) {
      return new Response(JSON.stringify({ error: "Role not found" }), { status: 404 })
    }

    // Check permission
    const { data: canManage } = await supabase.rpc("can_manage_cohort", {
      p_user_id: user.id,
      p_cohort_id: roleData.cohort_id,
    })

    if (!canManage) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 })
    }

    // Delete role
    const { error } = await supabase.from("user_cohort_roles").delete().eq("id", roleId)

    if (error) {
      return new Response(JSON.stringify({ error: "Failed to revoke role", details: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  }

  return new Response(JSON.stringify({ error: "Invalid scope" }), { status: 400 })
}
