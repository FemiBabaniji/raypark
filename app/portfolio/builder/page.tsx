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
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true

    async function loadPortfolio() {
      console.log("[v0] ========== LOADING PORTFOLIO FOR BUILDER ==========")
      console.log("[v0] Auth loading:", loading, "| User exists:", !!user)

      if (!loading && user) {
        try {
          console.log("[v0] 🔍 Authenticated user - fetching from database")
          const portfolios = await loadUserPortfolios(user)
          console.log("[v0] ✅ Found", portfolios.length, "portfolios")

          if (portfolios.length > 0) {
            const beaPortfolio = portfolios.find((p: any) => p.community_id)
            const portfolio = beaPortfolio || portfolios[0]

            console.log("[v0] 📋 Selected portfolio:", portfolio.id, "| BEA:", !!beaPortfolio)

            const identity = await getIdentityProps(portfolio.id)
            console.log("[v0] Identity props:", identity)

            if (identity) {
              const colorValue = typeof identity.selectedColor === "number" ? identity.selectedColor : 3
              console.log("[v0] 🎨 Color from DB:", identity.selectedColor, "→", colorValue)

              const loadedIdentity = {
                id: portfolio.id,
                name: identity.name || portfolio.name || "",
                handle: normalizeHandle(identity.handle),
                avatarUrl: identity.avatarUrl,
                selectedColor: colorValue as ThemeIndex,
              }

              console.log("[v0] ✅ Loading identity from database")
              setActiveIdentity(loadedIdentity)
              setIsLive(Boolean((portfolio as any).is_public))

              // Sync to localStorage
              localStorage.setItem(
                "bea_portfolio_data",
                JSON.stringify({
                  ...loadedIdentity,
                  isLive: (portfolio as any).is_public,
                  _source: "database",
                }),
              )
              console.log("[v0] ✅ Synced to localStorage")
              return
            }
          }
        } catch (error) {
          console.error("[v0] ❌ Database load failed:", error)
        }
      }

      console.log("[v0] 💾 Loading from localStorage (unauthenticated or DB failed)")
      const savedData = localStorage.getItem("bea_portfolio_data")

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          console.log("[v0] ✅ localStorage data found:", parsed)

          const colorValue = typeof parsed.selectedColor === "number" ? parsed.selectedColor : 3
          console.log("[v0] 🎨 Color from localStorage:", parsed.selectedColor, "→", colorValue)

          setActiveIdentity({
            id: parsed.id || "bea-portfolio",
            name: parsed.name || "",
            handle: normalizeHandle(parsed.handle),
            avatarUrl: parsed.avatarUrl,
            selectedColor: colorValue as ThemeIndex,
          })
          setIsLive(parsed.isLive || false)
          console.log("[v0] ✅ Portfolio loaded from localStorage")
          return
        } catch (error) {
          console.error("[v0] ❌ Failed to parse localStorage:", error)
        }
      }

      console.log("[v0] 🆘 No data found - using default template")
      if (user) {
        setActiveIdentity({
          id: "bea-portfolio",
          name: user.name || "",
          handle: user.name?.toLowerCase().replace(/\s+/g, "") || "",
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
    console.log("[v0] 🔄 Identity change:", next)

    setActiveIdentity((prev) => {
      const merged = { ...prev, ...next }

      // Always save to localStorage for immediate persistence
      try {
        const existing = localStorage.getItem("bea_portfolio_data")
        const base = existing ? JSON.parse(existing) : {}
        const updated = { ...base, ...merged, _timestamp: Date.now() }
        localStorage.setItem("bea_portfolio_data", JSON.stringify(updated))
        console.log("[v0] ✅ Saved to localStorage")

        // Notify other components
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("portfolio-updated"))
          window.dispatchEvent(new Event("storage"))
        }
      } catch (error) {
        console.error("[v0] ❌ localStorage save failed:", error)
      }

      return merged
    })
  }

  const handleToggleLive = (newIsLive: boolean) => {
    console.log("[v0] 🔄 Toggle live:", newIsLive)
    setIsLive(newIsLive)

    try {
      const existing = localStorage.getItem("bea_portfolio_data")
      const base = existing ? JSON.parse(existing) : {}
      localStorage.setItem("bea_portfolio_data", JSON.stringify({ ...base, isLive: newIsLive, _timestamp: Date.now() }))

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("portfolio-updated"))
        window.dispatchEvent(new Event("storage"))
      }
      console.log("[v0] ✅ Live status saved")
    } catch (error) {
      console.error("[v0] ❌ Failed to save live status:", error)
    }
  }

  const handleBack = () => {
    router.push("/bea")
  }

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode)
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
