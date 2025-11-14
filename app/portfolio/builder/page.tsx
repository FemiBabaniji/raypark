"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import PortfolioCanvas from "@/components/home/PortfolioCanvas"
import MusicAppInterface from "@/components/music-app-interface"
import { Button } from "@/components/ui/button"
import type { ThemeIndex } from "@/lib/theme"
import { useAuth } from "@/lib/auth"
import { loadUserPortfolios, getIdentityProps, normalizeHandle } from "@/lib/portfolio-service"

export default function PortfolioBuilderPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [activeIdentity, setActiveIdentity] = useState<{
    id: string
    name: string
    handle: string
    avatarUrl?: string
    selectedColor: ThemeIndex
  }>({
    id: "bea-portfolio",
    name: "",
    handle: "",
    selectedColor: 3 as ThemeIndex,
  })
  const [isLive, setIsLive] = useState(false)
  const lastFetchedUserIdRef = useRef<string | null>(null)
  const hasFetchedRef = useRef(false)
  const [communityId, setCommunityId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      console.log("[v0] No authenticated user, redirecting to /auth")
      router.push("/auth?redirect=/portfolio/builder")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (hasFetchedRef.current) return
    if (loading || !user) return // Wait for auth to complete
    hasFetchedRef.current = true

    async function loadPortfolio() {
      console.log("[v0] ========== LOADING PORTFOLIO FOR BUILDER ==========")
      console.log("[v0] Authenticated user:", user.email)

      try {
        console.log("[v0] Fetching from database...")
        const portfolios = await loadUserPortfolios(user)
        console.log("[v0] Found", portfolios.length, "portfolios")

        if (portfolios.length > 0) {
          const beaPortfolio = portfolios.find((p: any) => p.community_id)
          const portfolio = beaPortfolio || portfolios[0]

          console.log("[v0] Selected portfolio:", portfolio.id, "| BEA:", !!beaPortfolio)

          if ((portfolio as any).community_id) {
            setCommunityId((portfolio as any).community_id)
            console.log("[v0] Community ID stored:", (portfolio as any).community_id)
          }

          const identity = await getIdentityProps(portfolio.id)
          console.log("[v0] Identity props:", identity)

          if (identity) {
            const colorValue = typeof identity.selectedColor === "number" ? identity.selectedColor : 3
            console.log("[v0] Color from DB:", identity.selectedColor, "→", colorValue)

            const loadedIdentity = {
              id: portfolio.id,
              name: identity.name || portfolio.name || "",
              handle: normalizeHandle(identity.handle),
              avatarUrl: identity.avatarUrl,
              selectedColor: colorValue as ThemeIndex,
            }

            console.log("[v0] Loading identity from database")
            setActiveIdentity(loadedIdentity)
            setIsLive(Boolean((portfolio as any).is_public))

            // Sync to localStorage for offline access
            localStorage.setItem(
              "bea_portfolio_data",
              JSON.stringify({
                ...loadedIdentity,
                isLive: (portfolio as any).is_public,
                _source: "database",
              }),
            )
            console.log("[v0] Synced to localStorage")
            return
          }
        }

        console.log("[v0] No portfolio found, using user data as default")
        setActiveIdentity({
          id: "bea-portfolio",
          name: user.user_metadata?.name || user.email?.split("@")[0] || "",
          handle: user.email?.split("@")[0] || "",
          selectedColor: 3 as ThemeIndex,
        })
      } catch (error) {
        console.error("[v0] Database load failed:", error)
        setActiveIdentity({
          id: "bea-portfolio",
          name: user.user_metadata?.name || user.email?.split("@")[0] || "",
          handle: user.email?.split("@")[0] || "",
          selectedColor: 3 as ThemeIndex,
        })
      }

      console.log("[v0] ========== PORTFOLIO LOADING COMPLETE ==========")
    }

    loadPortfolio()
  }, [user, loading])

  const handleIdentityChange = (
    next: Partial<{
      name: string
      handle: string
      avatarUrl?: string
      selectedColor: ThemeIndex
    }>,
  ) => {
    console.log("[v0] Identity change:", next)

    setActiveIdentity((prev) => {
      const merged = { ...prev, ...next }

      // Save to localStorage for immediate persistence
      try {
        const existing = localStorage.getItem("bea_portfolio_data")
        const base = existing ? JSON.parse(existing) : {}
        const updated = { ...base, ...merged, _timestamp: Date.now() }
        localStorage.setItem("bea_portfolio_data", JSON.stringify(updated))
        console.log("[v0] Saved to localStorage")

        // Notify other components
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
    router.push("/dmz")
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
