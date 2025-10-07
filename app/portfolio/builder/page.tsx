"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PortfolioCanvas from "@/components/home/PortfolioCanvas"
import type { ThemeIndex } from "@/lib/theme"
import { useAuth } from "@/lib/auth"

export default function PortfolioBuilderPage() {
  const router = useRouter()
  const { user } = useAuth()
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

  return (
    <div className="min-h-screen bg-[oklch(0.18_0_0)]">
      <PortfolioCanvas
        isPreviewMode={false}
        useStarterTemplate={false}
        activeIdentity={activeIdentity}
        onActiveIdentityChange={handleIdentityChange}
        isLive={isLive}
        onToggleLive={handleToggleLive}
        onBack={handleBack}
      />
    </div>
  )
}
