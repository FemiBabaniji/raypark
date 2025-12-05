"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

/**
 * Progressive admin access hook
 *
 * Logic:
 * 1. If community has admin_access_restricted = false → Everyone is admin (open access)
 * 2. If community has admin_access_restricted = true → Check user_community_roles for community_admin role
 *
 * This allows communities to start with open admin access and tighten security when ready
 */
export function useIsAdmin(communityId?: string) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      if (communityId) {
        // Check specific community
        const { data: community } = await supabase
          .from("communities")
          .select("admin_access_restricted")
          .eq("id", communityId)
          .single()

        if (!community) {
          setIsAdmin(false)
          setIsLoading(false)
          return
        }

        // If restriction disabled, everyone is admin
        if (!community.admin_access_restricted) {
          setIsAdmin(true)
          setIsLoading(false)
          return
        }

        // If restriction enabled, check for community_admin role
        const { data: roles } = await supabase
          .from("user_community_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("community_id", communityId)
          .eq("role", "community_admin")
          .limit(1)

        setIsAdmin(roles && roles.length > 0)
      } else {
        // Check if user is admin of ANY community (for showing admin nav link)
        // First check if user has admin role in any unrestricted community
        const { data: unrestrictedCommunities } = await supabase
          .from("communities")
          .select("id")
          .eq("admin_access_restricted", false)

        // If there are unrestricted communities user is member of, they're admin
        if (unrestrictedCommunities && unrestrictedCommunities.length > 0) {
          const { data: memberships } = await supabase
            .from("community_members")
            .select("community_id")
            .eq("user_id", user.id)
            .in(
              "community_id",
              unrestrictedCommunities.map((c) => c.id),
            )
            .limit(1)

          if (memberships && memberships.length > 0) {
            setIsAdmin(true)
            setIsLoading(false)
            return
          }
        }

        // Check if user has community_admin role in any restricted community
        const { data: roles } = await supabase
          .from("user_community_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "community_admin")
          .limit(1)

        setIsAdmin(roles && roles.length > 0)
      }

      setIsLoading(false)
    }

    checkAdminStatus()
  }, [communityId])

  return { isAdmin, isLoading }
}
