"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

/**
 * Hook to check if current user is an admin of ANY community
 * Used to determine if admin navigation should be shown
 */
export function useIsAdmin() {
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

      try {
        // Check if user has any community_admin roles
        const { data: roles, error } = await supabase
          .from("user_community_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "community_admin")
          .or("expires_at.is.null,expires_at.gt.now()")
          .limit(1)

        if (error) {
          console.error("[v0] Error checking admin status:", error)
          setIsAdmin(false)
        } else {
          setIsAdmin((roles?.length || 0) > 0)
        }
      } catch (error) {
        console.error("[v0] Error in useIsAdmin:", error)
        setIsAdmin(false)
      }

      setIsLoading(false)
    }

    checkAdminStatus()
  }, [])

  return { isAdmin, isLoading }
}
