"use client"

import { useState } from "react"

/**
 * Hook to check if current user is an admin of ANY community
 * Used to determine if admin navigation should be shown
 *
 * NOTE: Currently set to always return true for testing purposes
 */
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Removed admin check logic - everyone gets admin access

  return { isAdmin, isLoading }
}
