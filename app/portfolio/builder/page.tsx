"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import PortfolioCanvas from "@/components/home/PortfolioCanvas"
import MusicAppInterface from "@/components/music-app-interface"
import { Button } from "@/components/ui/button"
import type { ThemeIndex } from "@/lib/theme"
import { useAuth } from "@/lib/auth"
import { loadUserPortfolios, getIdentityProps, normalizeHandle, verifyPortfolioCommunity } from "@/lib/portfolio-service"
import { createClient } from "@/lib/supabase/client"

export default function PortfolioBuilderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [activeIdentity, setActiveIdentity] = useState<{
    id: string | null
    name: string
    handle: string
    avatarUrl?: string
    selectedColor: ThemeIndex
    title?: string
    email?: string
    location?: string
    bio?: string
    linkedin?: string
    dribbble?: string
    behance?: string
    twitter?: string
    unsplash?: string
    instagram?: string
  }>({
    id: null,
    name: "",
    handle: "",
    selectedColor: 3 as ThemeIndex,
  })
  const [isLive, setIsLive] = useState(false)
  const lastFetchedUserIdRef = useRef<string | null>(null)
  const hasFetchedRef = useRef(false)
  const [communityId, setCommunityId] = useState<string | null>(null)
  const [securityError, setSecurityError] = useState<string | null>(null)

  const portfolioIdFromUrl = searchParams?.get('portfolio')
  const communityIdFromUrl = searchParams?.get('community')

  useEffect(() => {
    if (!loading && !user) {
      console.log("[v0] No authenticated user, redirecting to /auth")
      router.push("/auth?redirect=/portfolio/builder")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (hasFetchedRef.current) return
    if (loading || !user) return
    hasFetchedRef.current = true

    async function loadPortfolio() {
      try {
        if (portfolioIdFromUrl) {
          if (communityIdFromUrl) {
            const isValid = await verifyPortfolioCommunity(portfolioIdFromUrl, communityIdFromUrl)
            if (!isValid) {
              setSecurityError("This portfolio does not belong to the selected community. Please go back and select the correct portfolio.")
              return
            }
          }
          
          const identity = await getIdentityProps(portfolioIdFromUrl)

          const loadedIdentity = {
            id: portfolioIdFromUrl,
            name: identity?.name || user.user_metadata?.name || user.email?.split("@")[0] || "",
            handle: normalizeHandle(identity?.handle || user.email?.split("@")[0] || ""),
            avatarUrl: identity?.avatarUrl,
            selectedColor: (typeof identity?.selectedColor === "number" ? identity.selectedColor : 3) as ThemeIndex,
            title: identity?.title,
            email: identity?.email,
            location: identity?.location,
            bio: identity?.bio,
            linkedin: identity?.linkedin,
            dribbble: identity?.dribbble,
            behance: identity?.behance,
            twitter: identity?.twitter,
            unsplash: identity?.unsplash,
            instagram: identity?.instagram,
          }

          setActiveIdentity(loadedIdentity)
          
          if (communityIdFromUrl) {
            setCommunityId(communityIdFromUrl)
          }
          
          return
        }

        const portfolios = await loadUserPortfolios(user)

        if (portfolios.length > 0) {
          const beaPortfolio = portfolios.find((p: any) => p.community_id)
          const portfolio = beaPortfolio || portfolios[0]

          if ((portfolio as any).community_id) {
            setCommunityId((portfolio as any).community_id)
          }

          const identity = await getIdentityProps(portfolio.id)

          const loadedIdentity = {
            id: portfolio.id,
            name: identity?.name || portfolio.name || "",
            handle: normalizeHandle(identity?.handle),
            avatarUrl: identity?.avatarUrl,
            selectedColor: (typeof identity?.selectedColor === "number" ? identity.selectedColor : 3) as ThemeIndex,
            title: identity?.title,
            email: identity?.email,
            location: identity?.location,
            bio: identity?.bio,
            linkedin: identity?.linkedin,
            dribbble: identity?.dribbble,
            behance: identity?.behance,
            twitter: identity?.twitter,
            unsplash: identity?.unsplash,
            instagram: identity?.instagram,
          }

          setActiveIdentity(loadedIdentity)
          setIsLive(Boolean((portfolio as any).is_public))
          return
        }

        setActiveIdentity({
          id: null,
          name: user.user_metadata?.name || user.email?.split("@")[0] || "",
          handle: user.email?.split("@")[0] || "",
          selectedColor: 3 as ThemeIndex,
        })
      } catch (error) {
        setSecurityError("Failed to load portfolio. Please try again.")
      }
    }

    loadPortfolio()
  }, [user, loading, portfolioIdFromUrl, communityIdFromUrl, router])

  const handleIdentityChange = (
    next: Partial<{
      name: string
      handle: string
      avatarUrl?: string
      selectedColor: ThemeIndex
      title?: string
      email?: string
      location?: string
      bio?: string
      linkedin?: string
      dribbble?: string
      behance?: string
      twitter?: string
      unsplash?: string
      instagram?: string
    }>,
  ) => {
    console.log("[v0] handleIdentityChange called with:", next)
    if (next.selectedColor !== undefined) {
      console.log("[v0] 🎨 Color change detected:", next.selectedColor)
    }

    setActiveIdentity((prev) => {
      const merged = { ...prev, ...next }
      
      console.log("[v0] 🎨 Merged identity state - selectedColor:", merged.selectedColor)

      try {
        const existing = localStorage.getItem("bea_portfolio_data")
        const base = existing ? JSON.parse(existing) : {}
        const updated = { ...base, ...merged, _timestamp: Date.now() }
        localStorage.setItem("bea_portfolio_data", JSON.stringify(updated))

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("portfolio-updated"))
          window.dispatchEvent(new Event("storage"))
        }
      } catch (error) {
        console.error("[v0] localStorage save failed:", error)
      }

      if (merged.id) {
        const supabase = createClient()
        
        supabase
          .from("pages")
          .select("id")
          .eq("portfolio_id", merged.id)
          .eq("key", "main")
          .maybeSingle()
          .then(({ data: page }) => {
            if (!page?.id) return
            
            return supabase
              .from("widget_types")
              .select("id")
              .eq("key", "identity")
              .maybeSingle()
              .then(({ data: widgetType }) => {
                if (!widgetType?.id) return
                
                return supabase
                  .from("widget_instances")
                  .upsert(
                    {
                      page_id: page.id,
                      widget_type_id: widgetType.id,
                      props: {
                        name: merged.name,
                        handle: merged.handle,
                        avatarUrl: merged.avatarUrl,
                        selectedColor: merged.selectedColor,
                        title: merged.title,
                        email: merged.email,
                        location: merged.location,
                        bio: merged.bio,
                        linkedin: merged.linkedin,
                        dribbble: merged.dribbble,
                        behance: merged.behance,
                        twitter: merged.twitter,
                        unsplash: merged.unsplash,
                        instagram: merged.instagram,
                      },
                      enabled: true,
                    },
                    { onConflict: "page_id,widget_type_id" }
                  )
              })
          })
          .catch((err) => {
            console.error("[v0] Failed to save identity:", err)
          })
      }

      return merged
    })
  }

  const handleToggleLive = (newIsLive: boolean) => {
    console.log("[v0] Toggle live:", newIsLive)
    setIsLive(newIsLive)

    try {
      const existing = localStorage.getItem("bea_portfolio_data")
      const base = existing ? JSON.parse(existing) : {}
      localStorage.setItem("bea_portfolio_data", JSON.stringify({ ...base, isLive: newIsLive, _timestamp: Date.now() }))

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("portfolio-updated"))
        window.dispatchEvent(new Event("storage"))
      }
      console.log("[v0] Live status saved")
    } catch (error) {
      console.error("[v0] Failed to save live status:", error)
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/dmz")
    }
  }

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[oklch(0.18_0_0)] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (securityError) {
    return (
      <div className="min-h-screen bg-[oklch(0.18_0_0)] flex items-center justify-center">
        <div className="max-w-md p-8 bg-red-900/20 border border-red-500/50 rounded-xl">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Access Denied</h2>
          <p className="text-white/80 mb-6">{securityError}</p>
          <Button
            onClick={() => router.back()}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[oklch(0.18_0_0)]">
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={togglePreview}
          variant="ghost"
          size="sm"
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
        >
          {isPreviewMode ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Exit Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </>
          )}
        </Button>
      </div>

      <div className="flex" style={{ paddingTop: 80 }}>
        <div className="flex-1 max-w-5xl mx-auto">
          <PortfolioCanvas
            isPreviewMode={isPreviewMode}
            useStarterTemplate={false}
            activeIdentity={activeIdentity}
            onActiveIdentityChange={handleIdentityChange}
            isLive={isLive}
            onToggleLive={handleToggleLive}
            onBack={handleBack}
            communityId={communityId} // Pass communityId to PortfolioCanvas
          />
        </div>

        {!isPreviewMode && (
          <div className="w-96 h-screen">
            <div className="h-full" style={{ paddingTop: 32, paddingRight: 32, paddingLeft: 32, paddingBottom: 32 }}>
              <MusicAppInterface
                identity={{
                  name: activeIdentity.name,
                  handle: activeIdentity.handle,
                  avatarUrl: activeIdentity.avatarUrl,
                  selectedColor: activeIdentity.selectedColor,
                  title: activeIdentity.title,
                  email: activeIdentity.email,
                  location: activeIdentity.location,
                  bio: activeIdentity.bio,
                  linkedin: activeIdentity.linkedin,
                  dribbble: activeIdentity.dribbble,
                  behance: activeIdentity.behance,
                  twitter: activeIdentity.twitter,
                  unsplash: activeIdentity.unsplash,
                  instagram: activeIdentity.instagram,
                }}
                onIdentityChange={handleIdentityChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
