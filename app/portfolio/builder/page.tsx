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
  }>({
    id: null,  // Start with null, will be set from URL or database
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
      console.log("[v0] ========== LOADING PORTFOLIO FOR BUILDER ==========")
      console.log("[v0] Authenticated user:", user.email)
      console.log("[v0] Portfolio ID from URL:", portfolioIdFromUrl)
      console.log("[v0] Community ID from URL:", communityIdFromUrl)

      try {
        if (portfolioIdFromUrl) {
          console.log("[v0] Loading specific portfolio from URL:", portfolioIdFromUrl)
          
          if (communityIdFromUrl) {
            const isValid = await verifyPortfolioCommunity(portfolioIdFromUrl, communityIdFromUrl)
            if (!isValid) {
              console.error("[v0] ❌ SECURITY: Portfolio does not belong to this community")
              setSecurityError("This portfolio does not belong to the selected community. Please go back and select the correct portfolio.")
              return
            }
            console.log("[v0] ✅ Portfolio-community ownership verified")
          }
          
          const identity = await getIdentityProps(portfolioIdFromUrl)
          console.log("[v0] Identity props from database:", identity)

          const loadedIdentity = {
            id: portfolioIdFromUrl,
            name: identity?.name || user.user_metadata?.name || user.email?.split("@")[0] || "",
            handle: normalizeHandle(identity?.handle || user.email?.split("@")[0] || ""),
            avatarUrl: identity?.avatarUrl,
            selectedColor: (identity?.selectedColor !== undefined && identity?.selectedColor !== null
              ? identity.selectedColor 
              : 0) as ThemeIndex, // Default to 0 (first color) if no color saved
          }

          console.log("[v0] ✅ Setting identity with portfolio ID from URL:", loadedIdentity.id)
          console.log("[v0] 🎨 FINAL Identity selectedColor value:", loadedIdentity.selectedColor, "type:", typeof loadedIdentity.selectedColor, "from DB:", identity?.selectedColor)
          setActiveIdentity(loadedIdentity)
          
          if (communityIdFromUrl) {
            setCommunityId(communityIdFromUrl)
            console.log("[v0] ✅ Community context preserved - ID:", communityIdFromUrl)
          }
          
          return
        }

        console.log("[v0] No portfolio ID in URL, fetching user portfolios...")
        const portfolios = await loadUserPortfolios(user)
        console.log("[v0] Found", portfolios.length, "portfolios")

        if (portfolios.length > 0) {
          const beaPortfolio = portfolios.find((p: any) => p.community_id)
          const portfolio = beaPortfolio || portfolios[0]

          console.log("[v0] Selected portfolio:", portfolio.id)

          if ((portfolio as any).community_id) {
            setCommunityId((portfolio as any).community_id)
            console.log("[v0] ✅ Community ID loaded from portfolio:", (portfolio as any).community_id)
          }

          const identity = await getIdentityProps(portfolio.id)

          const loadedIdentity = {
            id: portfolio.id,
            name: identity?.name || portfolio.name || "",
            handle: normalizeHandle(identity?.handle),
            avatarUrl: identity?.avatarUrl,
            selectedColor: (identity?.selectedColor !== undefined && identity?.selectedColor !== null
              ? identity.selectedColor 
              : 0) as ThemeIndex, // Default to 0 if no color saved
          }

          console.log("[v0] ✅ Loading identity from first portfolio:", loadedIdentity.id)
          console.log("[v0] 🎨 FINAL Identity selectedColor value:", loadedIdentity.selectedColor, "type:", typeof loadedIdentity.selectedColor, "from DB:", identity?.selectedColor)
          setActiveIdentity(loadedIdentity)
          setIsLive(Boolean((portfolio as any).is_public))
          return
        }

        console.log("[v0] No portfolios found. User needs to create one first.")
        setActiveIdentity({
          id: null,
          name: user.user_metadata?.name || user.email?.split("@")[0] || "",
          handle: user.email?.split("@")[0] || "",
          selectedColor: 0 as ThemeIndex, // Start with first color for new portfolios
        })
      } catch (error) {
        console.error("[v0] ❌ Database load failed:", error)
        setSecurityError("Failed to load portfolio. Please try again.")
      }

      console.log("[v0] ========== PORTFOLIO LOADING COMPLETE ==========")
    }

    loadPortfolio()
  }, [user, loading, portfolioIdFromUrl, communityIdFromUrl, router])

  const handleIdentityChange = (
    next: Partial<{
      name: string
      handle: string
      avatarUrl?: string
      selectedColor: ThemeIndex
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
        console.log("[v0] Saved to localStorage with selectedColor:", merged.selectedColor)

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("portfolio-updated"))
          window.dispatchEvent(new Event("storage"))
        }
      } catch (error) {
        console.error("[v0] localStorage save failed:", error)
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
