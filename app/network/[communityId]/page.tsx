"use client"

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from 'lucide-react'
import EventsPage from "@/components/events-page"

export default function CommunityHubPage() {
  const router = useRouter()
  const params = useParams()
  const communityId = params.communityId as string
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [community, setCommunity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userPortfolio, setUserPortfolio] = useState<any>(null)

  useEffect(() => {
    async function loadCommunity() {
      const supabase = createClient()
      
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push(`/auth?redirect=/network/${communityId}`)
        return
      }

      setUser(authUser)

      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .eq("code", communityId)
        .maybeSingle()

      if (error || !data) {
        console.error("[v0] Error loading community:", error)
        router.push("/network")
        return
      }

      setCommunity(data)

      const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolios")
        .select("id, name, slug, is_public")
        .eq("user_id", authUser.id)
        .eq("community_id", data.id)
        .maybeSingle()

      if (!portfolioError && portfolioData) {
        console.log("[v0] User has portfolio for this community:", portfolioData)
        setUserPortfolio(portfolioData)
      } else {
        console.log("[v0] User does not have portfolio for this community")
        setUserPortfolio(null)
      }

      setLoading(false)
    }

    loadCommunity()
  }, [communityId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (!community) {
    return null
  }

  const logo = community.logo_url || 
    (community.code === 'bea-founders-connect' ? '/bea-logo.svg' : 
     community.code === 'dmz-innovation-hub' ? '/dmz-logo-white.svg' : null)

  const shortName = community.code === 'bea-founders-connect' ? 'BEA' :
                   community.code === 'dmz-innovation-hub' ? 'DMZ' :
                   community.name

  const enhancedEvents = community.events.map((event) => ({
    ...event,
    host:
      event.id === "founder-networking"
        ? "Founder's Circle Network"
        : event.id === "ai-ml-workshop"
          ? "Tech Innovation Lab"
          : "Design Collective",
    fullLocation:
      event.id === "founder-networking"
        ? "Rooftop Lounge, Downtown"
        : event.id === "ai-ml-workshop"
          ? "Innovation Centre, Floor 3"
          : "Design Studio, Creative District",
    tags:
      event.id === "founder-networking"
        ? ["Networking", "Founders", "Social", "Food & Drinks"]
        : event.id === "ai-ml-workshop"
          ? ["Workshop", "AI/ML", "Technical", "Learning"]
          : ["Design", "UX/UI", "Masterclass", "Creative"],
  }))

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId)
  }

  return (
    <EventsPage 
      logo={logo}
      communityName={shortName}
      communityId={community.id}
      hasUserPortfolio={!!userPortfolio}
      userPortfolio={userPortfolio}
      announcements={community.announcements}
      events={enhancedEvents}
      expandedEvent={expandedEvent}
      toggleEventExpansion={toggleEventExpansion}
    />
  )
}
