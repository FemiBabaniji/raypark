"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PortfolioBuilder from "@/components/portfolio/builder/PortfolioBuilder"
import type { Identity } from "@/components/portfolio/builder/types"
import { useAuth } from "@/lib/auth"

export default function PortfolioBuilderPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [identity, setIdentity] = useState<Identity>({
    name: "",
    title: "",
    subtitle: "",
    selectedColor: 3,
    initials: "",
    email: "",
    location: "",
    handle: "",
  })
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem("bea_portfolio_data")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setIdentity({
          name: parsed.name || "",
          title: parsed.title || "",
          subtitle: parsed.industry || "",
          selectedColor: parsed.selectedColor || 3,
          initials: parsed.name?.slice(0, 2).toUpperCase() || "",
          email: parsed.email || "",
          location: parsed.location || "",
          handle: parsed.handle || "",
        })
        setIsLive(parsed.isLive || false)
      } catch (error) {
        console.error("Failed to load portfolio data:", error)
      }
    } else if (user) {
      // Fallback to user data if no saved portfolio
      setIdentity({
        name: user.name || "",
        title: user.role || "",
        subtitle: "",
        selectedColor: 3,
        initials: user.name?.slice(0, 2).toUpperCase() || "",
        email: user.email || "",
        location: "",
        handle: user.name?.toLowerCase().replace(/\s+/g, "") || "",
      })
    }
  }, [user])

  const handleIdentityChange = (newIdentity: Identity) => {
    setIdentity(newIdentity)

    const savedData = localStorage.getItem("bea_portfolio_data")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        const updated = {
          ...parsed,
          name: newIdentity.name,
          title: newIdentity.title,
          email: newIdentity.email,
          location: newIdentity.location,
          handle: newIdentity.handle,
          selectedColor: newIdentity.selectedColor,
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

  return (
    <div className="min-h-screen bg-[oklch(0.18_0_0)]">
      <PortfolioBuilder
        identity={identity}
        onIdentityChange={handleIdentityChange}
        isLive={isLive}
        onToggleLive={handleToggleLive}
      />
    </div>
  )
}
