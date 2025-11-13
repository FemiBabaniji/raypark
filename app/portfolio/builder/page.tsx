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
  const { user } = useAuth()
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

      console.log("[v0] User object exists:", !!user)
      console.log("[v0] User ID:", user?.id)
      console.log("[v0] User name:", user?.name)
      console.log("[v0] User email:", user?.email)

      if (!user) {
        console.warn("[v0] ⚠️ No user found, falling back to localStorage")
        const savedData = localStorage.getItem("bea_portfolio_data")
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData)
            console.log("[v0] Loaded from localStorage:", parsed)

            const colorValue = typeof parsed.selectedColor === "number" ? parsed.selectedColor : 3

            setActiveIdentity({
              id: parsed.id || "bea-portfolio",
              name: parsed.name || "",
              handle: normalizeHandle(parsed.handle),
              avatarUrl: parsed.avatarUrl,
              selectedColor: colorValue as ThemeIndex,
            })
            setIsLive(parsed.isLive || false)
          } catch (error) {
            console.error("[v0] Failed to parse localStorage:", error)
          }
        }
        return
      }

      try {
        console.log("[v0] 🔍 Fetching portfolios from database for user:", user.id)
        const portfolios = await loadUserPortfolios(user)
        console.log("[v0] ✅ Database query successful, found", portfolios.length, "portfolios")

        if (portfolios.length > 0) {
          const beaPortfolio = portfolios.find((p: any) => p.community_id)
          const portfolio = beaPortfolio || portfolios[0]

          console.log("[v0] 📋 Selected portfolio:", {
            id: portfolio.id,
            name: portfolio.name,
            community_id: (portfolio as any).community_id,
            is_bea: !!beaPortfolio,
            is_public: (portfolio as any).is_public,
          })

          console.log("[v0] 🔍 Fetching identity props for portfolio:", portfolio.id)
          const identity = await getIdentityProps(portfolio.id)
          console.log("[v0] ✅ Identity props loaded from database:", identity)

          if (identity) {
            const colorValue = typeof identity.selectedColor === "number" ? identity.selectedColor : 3
            console.log("[v0] 🎨 selectedColor from database:", identity.selectedColor, "→", colorValue)

            const loadedIdentity = {
              id: portfolio.id,
              name: identity.name || portfolio.name || "",
              handle: normalizeHandle(identity.handle),
              avatarUrl: identity.avatarUrl,
              selectedColor: colorValue as ThemeIndex,
            }

            console.log("[v0] 💾 Setting identity state from database:", loadedIdentity)
            setActiveIdentity(loadedIdentity)
            setIsLive(Boolean((portfolio as any).is_public))

            const syncData = {
              ...loadedIdentity,
              isLive: (portfolio as any).is_public,
              _source: "database",
              _timestamp: Date.now(),
            }
            localStorage.setItem("bea_portfolio_data", JSON.stringify(syncData))
            console.log("[v0] ✅ Synced database data to localStorage")

            return
          } else {
            console.warn("[v0] ⚠️ No identity widget found, using portfolio metadata")
            const fallbackIdentity = {
              id: portfolio.id,
              name: portfolio.name || "",
              handle: portfolio.name?.toLowerCase().replace(/\s+/g, "") || "",
              selectedColor: 3 as ThemeIndex,
            }
            setActiveIdentity(fallbackIdentity)
            setIsLive(Boolean((portfolio as any).is_public))

            localStorage.setItem(
              "bea_portfolio_data",
              JSON.stringify({ ...fallbackIdentity, isLive: (portfolio as any).is_public, _source: "fallback" }),
            )
            return
          }
        } else {
          console.warn("[v0] ⚠️ No portfolios found for user in database")
        }
      } catch (error) {
        console.error("[v0] ❌ Database load failed with error:", error)
        console.error("[v0] Error details:", {
          message: (error as Error).message,
          stack: (error as Error).stack,
        })
      }

      console.log("[v0] 💾 Falling back to localStorage")
      const savedData = localStorage.getItem("bea_portfolio_data")
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          console.log("[v0] ✅ Loaded from localStorage:", parsed)

          const colorValue = typeof parsed.selectedColor === "number" ? parsed.selectedColor : 3

          setActiveIdentity({
            id: parsed.id || "bea-portfolio",
            name: parsed.name || "",
            handle: normalizeHandle(parsed.handle),
            avatarUrl: parsed.avatarUrl,
            selectedColor: colorValue as ThemeIndex,
          })
          setIsLive(parsed.isLive || false)
          return
        } catch (error) {
          console.error("[v0] ❌ Failed to parse localStorage:", error)
        }
      }

      if (user) {
        console.log("[v0] 🆘 Final fallback to user profile")
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
  }, [user])

  const handleIdentityChange = (
    next: Partial<{
      name: string
      handle: string
      avatarUrl?: string
      selectedColor: ThemeIndex
    }>,
  ) => {
    console.log("[v0] Identity change triggered:", next)
    console.log("[v0] selectedColor in change:", next.selectedColor, typeof next.selectedColor)

    setActiveIdentity((prev) => {
      const merged = { ...prev, ...next }

      if (JSON.stringify(merged) !== JSON.stringify(prev)) {
        try {
          const existing = localStorage.getItem("bea_portfolio_data")
          const base = existing ? JSON.parse(existing) : {}
          const updated = { ...base, ...merged, _ts: Date.now() }
          localStorage.setItem("bea_portfolio_data", JSON.stringify(updated))

          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("portfolio-updated"))
          }

          console.log("[v0] ✅ Identity saved to localStorage:", updated)
        } catch (error) {
          console.error("[v0] Failed to save portfolio data to localStorage:", error)
        }
      }

      return merged
    })
  }

  const handleToggleLive = (newIsLive: boolean) => {
    setIsLive(newIsLive)

    try {
      const existing = localStorage.getItem("bea_portfolio_data")
      const base = existing ? JSON.parse(existing) : {}
      localStorage.setItem("bea_portfolio_data", JSON.stringify({ ...base, isLive: newIsLive, _ts: Date.now() }))

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("portfolio-updated"))
      }
    } catch (error) {
      console.error("[v0] Failed to save live status:", error)
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
