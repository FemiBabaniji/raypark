"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PortfolioCanvas from "@/components/home/PortfolioCanvas"
import MusicAppInterface from "@/components/music-app-interface"
import BackButton from "@/components/ui/back-button"
import type { ThemeIndex } from "@/lib/theme"
import { useAuth } from "@/lib/auth"

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

  useEffect(() => {
    const savedData = localStorage.getItem("bea_portfolio_data")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setActiveIdentity({
          id: "bea-portfolio",
          name: parsed.name || "",
          handle: parsed.handle || "",
          avatarUrl: parsed.avatarUrl,
          selectedColor: (parsed.selectedColor || 3) as ThemeIndex,
        })
        setIsLive(parsed.isLive || false)
      } catch (error) {
        console.error("Failed to load portfolio data:", error)
      }
    } else if (user) {
      setActiveIdentity({
        id: "bea-portfolio",
        name: user.name || "",
        handle: user.name?.toLowerCase().replace(/\s+/g, "") || "",
        selectedColor: 3 as ThemeIndex,
      })
    }
  }, [user])

  const handleIdentityChange = (
    next: Partial<{
      name: string
      handle: string
      avatarUrl?: string
      selectedColor: ThemeIndex
    }>,
  ) => {
    setActiveIdentity((prev) => ({ ...prev, ...next }))

    const savedData = localStorage.getItem("bea_portfolio_data")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        const updated = {
          ...parsed,
          ...next,
        }
        localStorage.setItem("bea_portfolio_data", JSON.stringify(updated))
      } catch (error) {
        console.error("Failed to save portfolio data:", error)
      }
    }
  }

  const handleToggleLive = (newIsLive: boolean) => {
    setIsLive(newIsLive)

    const savedData = localStorage.getItem("bea_portfolio_data")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        const updated = {
          ...parsed,
          isLive: newIsLive,
        }
        localStorage.setItem("bea_portfolio_data", JSON.stringify(updated))
      } catch (error) {
        console.error("Failed to save live status:", error)
      }
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
      {isPreviewMode ? (
        <div className="fixed top-8 left-8 z-50">
          <BackButton onClick={togglePreview} />
        </div>
      ) : (
        <>
          {/* Back button in top left corner */}
          <div className="fixed top-8 left-8 z-50">
            <BackButton onClick={handleBack} aria-label="Back to BEA" />
          </div>

          {/* Preview button in top right corner */}
          <div className="fixed top-8 right-8 z-50">
            <button
              onClick={togglePreview}
              className="px-4 py-2 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors text-sm font-medium"
            >
              Preview
            </button>
          </div>
        </>
      )}

      <div className="flex" style={{ paddingTop: isPreviewMode ? 0 : 80 }}>
        <div className="flex-1 max-w-5xl mx-auto">
          <PortfolioCanvas
            isPreviewMode={isPreviewMode}
            useStarterTemplate={false}
            activeIdentity={activeIdentity}
            onActiveIdentityChange={handleIdentityChange}
            isLive={isLive}
            onToggleLive={handleToggleLive}
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
