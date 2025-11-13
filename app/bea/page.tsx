"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import EventsPage from "@/components/events-page"
import { useAuth } from "@/lib/auth"

export default function BeaNetworkPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      console.log("[v0] No authenticated user, redirecting to /auth")
      router.push("/auth?redirect=/bea")
    }
  }, [user, loading, router])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Don't render page if not authenticated
  if (!user) {
    return null
  }

  return <EventsPage />
}
