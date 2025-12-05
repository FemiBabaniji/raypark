/**
 * TypeScript types for admin features
 */

export type CommunityRole = "community_admin" | "moderator" | "content_manager"
export type CohortRole = "cohort_admin" | "moderator" | "event_coordinator"
export type LifecycleStage = "new" | "active" | "dormant" | "alumni"

export interface Cohort {
  id: string
  community_id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  settings: Record<string, any>
  archived_at: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface CohortMember {
  id: string
  cohort_id: string
  user_id: string
  joined_at: string
  added_by: string | null
  notes: string | null
}

export interface UserCommunityRole {
  id: string
  user_id: string
  community_id: string
  role: CommunityRole
  assigned_by: string | null
  assigned_at: string
  expires_at: string | null
  notes: string | null
}

export interface UserCohortRole {
  id: string
  user_id: string
  cohort_id: string
  role: CohortRole
  assigned_by: string | null
  assigned_at: string
  expires_at: string | null
  notes: string | null
}

export interface LifecycleHistory {
  id: string
  user_id: string
  community_id: string
  from_stage: LifecycleStage | null
  to_stage: LifecycleStage
  changed_at: string
  changed_by: string | null
  change_reason: string | null
  automated: boolean
}

export interface CohortWithStats extends Cohort {
  member_count?: number
  active_member_count?: number
  admin_count?: number
}

export interface AdminPermissions {
  isCommunityAdmin: boolean
  isCohortAdmin: boolean
  canManageMembers: boolean
  canManageEvents: boolean
  canManageRoles: boolean
  canViewAnalytics: boolean
  adminCohorts: string[]
}
