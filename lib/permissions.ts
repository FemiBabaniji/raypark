/**
 * Permission Helper Functions
 * TypeScript wrappers around SQL permission functions for use in API routes and components
 */

import { createClient } from "@/lib/supabase/server"

export type CommunityRole = "community_admin" | "moderator" | "content_manager"
export type CohortRole = "cohort_admin" | "moderator" | "event_coordinator"
export type LifecycleStage = "new" | "active" | "dormant" | "alumni"

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "manage_members"
  | "manage_events"
  | "manage_templates"
  | "manage_roles"
  | "view_analytics"

export type ResourceType = "community" | "cohort" | "event" | "template" | "member"

/**
 * Check if user is a community admin
 */
export async function isCommunityAdmin(userId: string, communityId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("is_community_admin", {
    p_user_id: userId,
    p_community_id: communityId,
  })

  if (error) {
    console.error("[v0] Error checking community admin status:", error)
    return false
  }

  return data === true
}

/**
 * Check if user is a cohort admin
 */
export async function isCohortAdmin(userId: string, cohortId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("is_cohort_admin", {
    p_user_id: userId,
    p_cohort_id: cohortId,
  })

  if (error) {
    console.error("[v0] Error checking cohort admin status:", error)
    return false
  }

  return data === true
}

/**
 * Get all cohorts user has admin access to
 */
export async function getUserAdminCohorts(
  userId: string,
): Promise<{ cohort_id: string; admin_type: "cohort_admin" | "community_admin" }[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("get_user_admin_cohorts", {
    p_user_id: userId,
  })

  if (error) {
    console.error("[v0] Error getting user admin cohorts:", error)
    return []
  }

  return data || []
}

/**
 * Get all cohorts user is a member of (not admin)
 */
export async function getUserCohorts(userId: string): Promise<{ cohort_id: string; joined_at: string }[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("get_user_cohorts", {
    p_user_id: userId,
  })

  if (error) {
    console.error("[v0] Error getting user cohorts:", error)
    return []
  }

  return data || []
}

/**
 * Check if user can manage a specific cohort
 */
export async function canManageCohort(userId: string, cohortId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("can_manage_cohort", {
    p_user_id: userId,
    p_cohort_id: cohortId,
  })

  if (error) {
    console.error("[v0] Error checking cohort management permission:", error)
    return false
  }

  return data === true
}

/**
 * Generic permission check
 */
export async function hasPermission(
  userId: string,
  action: PermissionAction,
  resourceType: ResourceType,
  resourceId: string,
): Promise<boolean> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("has_permission", {
    p_user_id: userId,
    p_action: action,
    p_resource_type: resourceType,
    p_resource_id: resourceId,
  })

  if (error) {
    console.error("[v0] Error checking permission:", error)
    return false
  }

  return data === true
}

export const checkUserPermission = hasPermission

/**
 * Update user lifecycle stage
 */
export async function updateLifecycleStage(
  userId: string,
  communityId: string,
  newStage: LifecycleStage,
  changedBy?: string,
  reason?: string,
  automated = false,
): Promise<boolean> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("update_lifecycle_stage", {
    p_user_id: userId,
    p_community_id: communityId,
    p_new_stage: newStage,
    p_changed_by: changedBy || null,
    p_reason: reason || null,
    p_automated: automated,
  })

  if (error) {
    console.error("[v0] Error updating lifecycle stage:", error)
    return false
  }

  return data === true
}

/**
 * Check if current authenticated user has permission
 * Convenience wrapper for API routes
 */
export async function requirePermission(
  action: PermissionAction,
  resourceType: ResourceType,
  resourceId: string,
): Promise<{ authorized: boolean; userId?: string; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { authorized: false, error: "Unauthorized" }
  }

  const authorized = await hasPermission(user.id, action, resourceType, resourceId)

  return { authorized, userId: user.id }
}
