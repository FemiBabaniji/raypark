"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface NetworkProfile {
  id: string
  name: string
  title: string
  photo: string
  bio: string
  location: string
  activity: string
}

interface NetworkTabProps {
  profiles: NetworkProfile[]
}

export default function NetworkTab({ profiles }: NetworkTabProps) {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new events-based network page
    router.push("/network")
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-neutral-400 mb-2">Redirecting to Network...</div>
        <div className="w-6 h-6 border-2 border-neutral-600 border-t-white rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}
