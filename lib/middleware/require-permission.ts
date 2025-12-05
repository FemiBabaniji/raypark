import { createClient } from "@/lib/supabase/server"
import { checkUserPermission, type PermissionAction } from "@/lib/permissions"

/**
 * Middleware helper to enforce permission checks in API routes
 *
 * Usage in API route:
 * ```
 * const permissionError = await requirePermission(
 *   'manage_events',
 *   'event',
 *   eventId
 * )
 * if (permissionError) return permissionError
 * ```
 */
export async function requirePermission(
  action: PermissionAction,
  resourceType: string,
  resourceId: string,
): Promise<Response | null> {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized - Please sign in" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Check permission
  const hasPermission = await checkUserPermission(user.id, action, resourceType, resourceId)

  if (!hasPermission) {
    return new Response(
      JSON.stringify({
        error: "Forbidden - You do not have permission to perform this action",
        details: {
          action,
          resourceType,
          resourceId,
          userId: user.id,
        },
      }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    )
  }

  // Permission granted
  return null
}

/**
 * Require community admin role for the given community
 */
export async function requireCommunityAdmin(communityId: string): Promise<Response | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Use RPC function to check admin status
  const { data: isAdmin, error } = await supabase.rpc("is_community_admin", {
    p_user_id: user.id,
    p_community_id: communityId,
  })

  if (error || !isAdmin) {
    return new Response(
      JSON.stringify({
        error: "Forbidden - Community admin access required",
        communityId,
      }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    )
  }

  return null
}

/**
 * Require cohort admin role for the given cohort
 */
export async function requireCohortAdmin(cohortId: string): Promise<Response | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { data: isAdmin, error } = await supabase.rpc("is_cohort_admin", {
    p_user_id: user.id,
    p_cohort_id: cohortId,
  })

  if (error || !isAdmin) {
    return new Response(
      JSON.stringify({
        error: "Forbidden - Cohort admin access required",
        cohortId,
      }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    )
  }

  return null
}

/**
 * Get current user or return 401 error
 */
export async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      user: null,
      error: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    }
  }

  return { user, error: null }
}
