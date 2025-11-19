"use client"

import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from 'lucide-react'
import EventsPage from "@/components/events-page"

export default function CommunityHubPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const communityId = params.communityId as string
  const initialTab = searchParams.get('tab') || 'Home'
  const [community, setCommunity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userPortfolio, setUserPortfolio] = useState<any>(null)

  useEffect(() => {
    async function loadCommunity() {
      const supabase = createClient()
      
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push(`/network/${communityId}?redirect=true`)
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
      console.log("[v0] Community loaded:", data.id, data.name)
      console.log("[v0] Looking for portfolio with user_id:", authUser.id, "community_id:", data.id)

      const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolios")
        .select("id, name, slug, is_public, community_id, user_id")
        .eq("user_id", authUser.id)
        .eq("community_id", data.id)
        .maybeSingle()

      console.log("[v0] Portfolio query result:", { portfolioData, portfolioError })

      if (!portfolioError && portfolioData) {
        console.log("[v0] Found user portfolio for community:", portfolioData)
        setUserPortfolio(portfolioData)
      } else {
        console.log("[v0] No portfolio found for this community")
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

  return (
    <EventsPage 
      logo={logo}
      communityName={shortName}
      communityId={community.id}
      hasUserPortfolio={!!userPortfolio}
      userPortfolio={userPortfolio}
      initialTab={initialTab}
    />
  )
}
