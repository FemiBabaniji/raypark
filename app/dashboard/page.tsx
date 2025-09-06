"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ZoomOut } from "lucide-react"
import MusicAppInterface from "@/components/music-app-interface"
import BackButton from "@/components/ui/back-button"
import { getPublishedPortfolios } from "@/lib/portfolio-data"
import { DebugPanel } from "@/components/debug-panel"
import type { Portfolio } from "@/lib/types"
import type { UnifiedPortfolio } from "@/components/unified-portfolio-card"
import type { ThemeIndex } from "@/lib/theme"
import PortfolioCanvas from "@/components/home/PortfolioCanvas"
import PortfolioGrid from "@/components/home/PortfolioGrid" // Import PortfolioGrid component

const NAV_H = 80
const BASE_PADDING = 32 // 8 * 4 = p-8
const SIDEBAR_WIDTH = 384 // w-96

const TopBarActions = ({
  onZoomOut,
  onPreview,
  isPreviewMode,
}: {
  onZoomOut: () => void
  onPreview: () => void
  isPreviewMode: boolean
}) => {
  if (isPreviewMode) {
    return (
      <div className="absolute top-6 left-6 z-50">
        <BackButton onClick={() => onPreview()} />
      </div>
    )
  }

  return (
    <div className="flex justify-end gap-2 mb-4">
      <button
        onClick={onZoomOut}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors"
      >
        <ZoomOut size={16} />
        Dashboard
      </button>
      <button
        onClick={onPreview}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors"
      >
        Preview Mode
      </button>
    </div>
  )
}

const PortfolioCanvasWrapper = ({
  isPreviewMode,
  useStarterTemplate, // Added useStarterTemplate prop
  activeIdentity,
  onActiveIdentityChange,
}: {
  isPreviewMode: boolean
  useStarterTemplate?: boolean // Added useStarterTemplate prop type
  activeIdentity?: UnifiedPortfolio
  onActiveIdentityChange?: (next: Partial<UnifiedPortfolio>) => void
}) => {
  return (
    <PortfolioCanvas
      isPreviewMode={isPreviewMode}
      useStarterTemplate={useStarterTemplate} // Pass useStarterTemplate to PortfolioCanvas
      activeIdentity={
        activeIdentity
          ? {
              id: activeIdentity.id,
              name: activeIdentity.name,
              handle: activeIdentity.handle || "",
              avatarUrl: activeIdentity.avatarUrl,
              selectedColor: activeIdentity.selectedColor,
            }
          : undefined
      }
      onActiveIdentityChange={
        onActiveIdentityChange
          ? (next) => {
              onActiveIdentityChange({
                name: next.name,
                handle: next.handle,
                avatarUrl: next.avatarUrl,
                selectedColor: next.selectedColor as ThemeIndex,
              })
            }
          : undefined
      }
    />
  )
}

const SidePanel = ({ isVisible, isPreviewMode }: { isVisible: boolean; isPreviewMode: boolean }) => {
  return (
    <motion.div
      className="h-full"
      style={{
        paddingTop: isPreviewMode ? 0 : BASE_PADDING,
        paddingRight: BASE_PADDING,
        paddingLeft: BASE_PADDING,
        paddingBottom: BASE_PADDING,
      }}
      animate={{ x: isVisible ? "0%" : "100%" }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <MusicAppInterface />
    </motion.div>
  )
}

export default function Home() {
  const [isPreviewMode, setIsPreviewMode] = useState(false) // Controls UI chrome visibility
  const [viewMode, setViewMode] = useState<"expanded" | "minimized">("minimized") // Default to minimized (grid view)
  const [useStarterTemplate, setUseStarterTemplate] = useState(false) // Added useStarterTemplate state
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("jenny-wilson")
  const [portfolios, setPortfolios] = useState<UnifiedPortfolio[]>([])
  const [publishedPortfolios, setPublishedPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch & map to UnifiedPortfolio, cycling across ALL 7 theme indices (0..6)
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const data = await getPublishedPortfolios()
        setPublishedPortfolios(data)

        if (data.length > 0) {
          const portfolioCards: UnifiedPortfolio[] = data.map((portfolio, index) => ({
            id: portfolio.slug,
            name: portfolio.title,
            title: "Portfolio",
            email: `${portfolio.slug}@example.com`,
            location: "Location",
            handle: `@${portfolio.slug}`,
            initials: portfolio.title
              ? portfolio.title
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "??",
            selectedColor: (index % 7) as ThemeIndex, // ⬅️ use all 7 theme colors
          }))
          // setPortfolios((prev) => [...prev, ...portfolioCards])
          // setSelectedPortfolioId(portfolioCards[0].id)
        }
      } catch (error) {
        console.error("Error fetching portfolios:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolios()
  }, [])

  const handleZoomOut = () => {
    setViewMode("minimized")
    setIsPreviewMode(false)
    setUseStarterTemplate(false) // Reset starter template when zooming out
  }

  const handlePortfolioSelect = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId)
    setViewMode("expanded")
    setUseStarterTemplate(false) // Use regular portfolio builder for existing portfolios
  }

  const handleStartStarter = () => {
    setUseStarterTemplate(true)
    setViewMode("expanded")
  }

  const handleAddPortfolio = () => {
    const newPortfolio: UnifiedPortfolio = {
      id: `portfolio-${Date.now()}`,
      name: "New Portfolio",
      title: "Portfolio",
      email: "new@example.com",
      location: "Location",
      handle: "@newuser",
      initials: "NP",
      selectedColor: Math.floor(Math.random() * 7) as ThemeIndex, // ⬅️ 0..6
    }
    setPortfolios((prev) => [...prev, newPortfolio])
  }

  const handleDeletePortfolio = (portfolioId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPortfolios((prev) => {
      if (prev.length <= 1) return prev
      const next = prev.filter((p) => p.id !== portfolioId)
      if (selectedPortfolioId === portfolioId && next.length > 0) {
        setSelectedPortfolioId(next[0].id)
      }
      return next
    })
  }

  const togglePreview = () => setIsPreviewMode(!isPreviewMode)
  const hasSidebar = viewMode === "expanded" && !isPreviewMode

  const handleChangeCardColor = (id: string, colorIndex: ThemeIndex) => {
    setPortfolios((prev) => prev.map((p) => (p.id === id ? { ...p, selectedColor: colorIndex } : p)))
  }

  const handleChangeActivePortfolioColor = (colorIndex: ThemeIndex) => {
    setPortfolios((prev) => prev.map((p) => (p.id === selectedPortfolioId ? { ...p, selectedColor: colorIndex } : p)))
    // TODO: persist to DB here
  }

  const activePortfolio = portfolios.find((p) => p.id === selectedPortfolioId)

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading portfolios...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden">
      {/* Fixed Nav */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{ height: NAV_H, paddingLeft: BASE_PADDING, paddingRight: BASE_PADDING }}
        animate={{
          opacity: isPreviewMode ? 0 : 1,
          y: isPreviewMode ? -20 : 0,
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-neutral-400">pathwai</span>
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-sm text-neutral-500 hover:text-white transition-colors duration-300">ai</button>
          <Link href="/network" className="text-sm text-neutral-500 hover:text-white transition-colors duration-300">
            network
          </Link>
          <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">U</span>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="flex" style={{ paddingTop: isPreviewMode ? 0 : NAV_H }}>
        {/* Left Column: Main Content */}
        <div className="flex-1" style={{ padding: BASE_PADDING }}>
          {/* Top Bar Actions - now part of content flow */}
          {viewMode === "expanded" && (
            <TopBarActions onZoomOut={handleZoomOut} onPreview={togglePreview} isPreviewMode={isPreviewMode} />
          )}

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {viewMode === "minimized" ? (
              <motion.div
                key="minimized"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="min-h-screen flex items-start justify-center"
              >
                <PortfolioGrid
                  portfolios={portfolios}
                  onSelect={handlePortfolioSelect}
                  onAdd={handleAddPortfolio}
                  onDelete={handleDeletePortfolio}
                  onChangeColor={handleChangeCardColor}
                  onStartStarter={handleStartStarter} // Pass handleStartStarter to PortfolioGrid
                />
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <PortfolioCanvasWrapper
                  isPreviewMode={isPreviewMode}
                  useStarterTemplate={useStarterTemplate} // Pass useStarterTemplate to wrapper
                  activeIdentity={activePortfolio}
                  onActiveIdentityChange={(next) => {
                    setPortfolios((prev) =>
                      prev.map((p) => {
                        if (p.id !== selectedPortfolioId) return p
                        return {
                          ...p,
                          name: next.name ?? p.name,
                          handle: next.handle ?? p.handle,
                          avatarUrl: next.avatarUrl ?? p.avatarUrl,
                          selectedColor: (next.selectedColor ?? p.selectedColor) as ThemeIndex,
                        }
                      }),
                    )
                    // TODO: persist to DB
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Sidebar */}
        {hasSidebar && (
          <div className="w-96 h-screen" style={{ top: isPreviewMode ? 0 : NAV_H }}>
            <SidePanel isVisible={hasSidebar} isPreviewMode={isPreviewMode} />
          </div>
        )}
      </div>

      {/* Debug Panels */}
      {process.env.NODE_ENV === "development" && (
        <>
          <DebugPanel
            data={{
              portfoliosCount: portfolios.length,
              publishedPortfoliosCount: publishedPortfolios.length,
              selectedPortfolio: selectedPortfolioId,
              loading,
            }}
            title="Portfolio Debug"
          />
          <div className="fixed bottom-4 left-4 z-50">
            <Link
              href="/test-db"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
            >
              🧪 Test Database
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
