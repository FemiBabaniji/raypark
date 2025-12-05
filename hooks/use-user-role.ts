"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { CommunityRole, CohortRole } from "@/types/admin"

export interface UserRoleInfo {
  isCommunityAdmin: boolean
  isModerator: boolean
  isContentManager: boolean
  roles: CommunityRole[]
  isLoading: boolean
}

export interface CohortRoleInfo {
  isCohortAdmin: boolean
  isModerator: boolean
  isEventCoordinator: boolean
  roles: CohortRole[]
  isLoading: boolean
}

/**
 * Hook to check user's community-level roles
 * Returns role information and loading state
 */
export function useUserRole(communityId?: string): UserRoleInfo {
  const [roleInfo, setRoleInfo] = useState<UserRoleInfo>({
    isCommunityAdmin: false,
    isModerator: false,
    isContentManager: false,
    roles: [],
    isLoading: true,
  })

  useEffect(() => {
    async function checkRole() {
      if (!communityId) {
        setRoleInfo({
          isCommunityAdmin: false,
          isModerator: false,
          isContentManager: false,
          roles: [],
          isLoading: false,
        })
        return
      }

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setRoleInfo({
          isCommunityAdmin: false,
          isModerator: false,
          isContentManager: false,
          roles: [],
          isLoading: false,
        })
        return
      }

      try {
        // Check if user is community admin using RPC function
        const { data: isAdmin, error: adminError } = await supabase.rpc("is_community_admin", {
          p_user_id: user.id,
          p_community_id: communityId,
        })

        if (adminError) {
          console.error("[v0] Error checking community admin status:", adminError)
        }

        // Fetch all user's community roles
        const { data: userRoles, error: rolesError } = await supabase
          .from("user_community_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("community_id", communityId)
          .or("expires_at.is.null,expires_at.gt.now()")

        if (rolesError) {
          console.error("[v0] Error fetching user roles:", rolesError)
        }

        const roles = (userRoles || []).map((r) => r.role as CommunityRole)

        setRoleInfo({
          isCommunityAdmin: isAdmin || false,
          isModerator: roles.includes("moderator"),
          isContentManager: roles.includes("content_manager"),
          roles,
          isLoading: false,
        })
      } catch (error) {
        console.error("[v0] Error in useUserRole:", error)
        setRoleInfo({
          isCommunityAdmin: false,
          isModerator: false,
          isContentManager: false,
          roles: [],
          isLoading: false,
        })
      }
    }

    checkRole()
  }, [communityId])

  return roleInfo
}

/**
 * Hook to check user's cohort-level roles
 * Returns role information and loading state
 */
export function useCohortRole(cohortId?: string): CohortRoleInfo {
  const [roleInfo, setRoleInfo] = useState<CohortRoleInfo>({
    isCohortAdmin: false,
    isModerator: false,
    isEventCoordinator: false,
    roles: [],
    isLoading: true,
  })

  useEffect(() => {
    async function checkRole() {
      if (!cohortId) {
        setRoleInfo({
          isCohortAdmin: false,
          isModerator: false,
          isEventCoordinator: false,
          roles: [],
          isLoading: false,
        })
        return
      }

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setRoleInfo({
          isCohortAdmin: false,
          isModerator: false,
          isEventCoordinator: false,
          roles: [],
          isLoading: false,
        })
        return
      }

      try {
        // Check if user is cohort admin using RPC function
        const { data: isAdmin, error: adminError } = await supabase.rpc("is_cohort_admin", {
          p_user_id: user.id,
          p_cohort_id: cohortId,
        })

        if (adminError) {
          console.error("[v0] Error checking cohort admin status:", adminError)
        }

        // Fetch all user's cohort roles
        const { data: userRoles, error: rolesError } = await supabase
          .from("user_cohort_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("cohort_id", cohortId)
          .or("expires_at.is.null,expires_at.gt.now()")

        if (rolesError) {
          console.error("[v0] Error fetching cohort roles:", rolesError)
        }

        const roles = (userRoles || []).map((r) => r.role as CohortRole)

        setRoleInfo({
          isCohortAdmin: isAdmin || false,
          isModerator: roles.includes("moderator"),
          isEventCoordinator: roles.includes("event_coordinator"),
          roles,
          isLoading: false,
        })
      } catch (error) {
        console.error("[v0] Error in useCohortRole:", error)
        setRoleInfo({
          isCohortAdmin: false,
          isModerator: false,
          isEventCoordinator: false,
          roles: [],
          isLoading: false,
        })
      }
    }

    checkRole()
  }, [cohortId])

  return roleInfo
}

/**
 * Simple hook to check if current user can perform a specific action
 */
export function usePermission(action: string, resourceType: string, resourceId: string) {
  const [hasPermission, setHasPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkPerm() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setHasPermission(false)
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.rpc("has_permission", {
          p_user_id: user.id,
          p_action: action,
          p_resource_type: resourceType,
          p_resource_id: resourceId,
        })

        if (error) {
          console.error("[v0] Error checking permission:", error)
          setHasPermission(false)
        } else {
          setHasPermission(data || false)
        }
      } catch (error) {
        console.error("[v0] Error in usePermission:", error)
        setHasPermission(false)
      }

      setIsLoading(false)
    }

    checkPerm()
  }, [action, resourceType, resourceId])

  return { hasPermission, isLoading }
}
