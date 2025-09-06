"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ZoomOut, Plus, X } from "lucide-react"
import MusicAppInterface from "@/components/music-app-interface"
import BackButton from "@/components/ui/back-button"
import { getPublishedPortfolios } from "@/lib/portfolio-data"
import { DebugPanel } from "@/components/debug-panel"
import type { Portfolio } from "@/lib/types"
import { UnifiedPortfolioCard, type UnifiedPortfolio } from "@/components/unified-portfolio-card"
import type { ThemeIndex } from "@/lib/theme"
import PortfolioCanvas from "@/components/home/PortfolioCanvas"

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

const PortfolioGrid = ({
  portfolios,
  onSelect,
  onAdd,
  onDelete,
  onChangeColor,
}: {
  portfolios: UnifiedPortfolio[]
  onSelect: (id: string) => void
  onAdd: () => void
  onDelete: (id: string, e: React.MouseEvent) => void
  onChangeColor?: (id: string, colorIndex: ThemeIndex) => void
}) => {
  return (
    <div className="max-w-7xl w-full space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Your Portfolios</h1>
        <p className="text-neutral-400">Select a portfolio to edit or create a new one</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {portfolios.map((portfolio) => (
          <div key={portfolio.id} className="w-full group relative">
            <UnifiedPortfolioCard
              portfolio={portfolio}
              onClick={onSelect}
              onShare={(id) => console.log("share portfolio:", id)}
              onMore={(id) => console.log("more options:", id)}
              onChangeColor={onChangeColor}
            />
            {portfolios.length > 1 && (
              <button
                onClick={(e) => onDelete(portfolio.id, e)}
                className="absolute top-2 left-2 w-6 h-6 bg-black/20 hover:bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
              >
                <X size={12} className="text-white" />
              </button>
            )}
          </div>
        ))}

        <div className="w-full aspect-[4/5] rounded-3xl border-2 border-dashed border-neutral-700 hover:border-neutral-500 transition-colors cursor-pointer flex flex-col items-center justify-center group backdrop-blur-sm hover:scale-105 transition-all">
          <BackButton onClick={onAdd} icon={Plus} />
          <span className="text-neutral-400 font-medium text-sm mt-2">New Portfolio</span>
        </div>
      </div>
    </div>
  )
}

const PortfolioCanvasWrapper = ({
  isPreviewMode,
  activeIdentity,
  onActiveIdentityChange,
}: {
  isPreviewMode: boolean
  activeIdentity?: UnifiedPortfolio
  onActiveIdentityChange?: (next: Partial<UnifiedPortfolio>) => void
}) => {
  return (
    <PortfolioCanvas
      isPreviewMode={isPreviewMode}
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
  const [viewMode, setViewMode] = useState<"expanded" | "minimized">("expanded") // Controls layout mode
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("jenny-wilson")
  const [portfolios, setPortfolios] = useState<UnifiedPortfolio[]>([
    {
      id: "jenny-wilson",
      name: "jenny wilson",
      title: "is a digital product designer",
      email: "jenny@acme.com",
      location: "currently designing at acme.",
      handle: "@jenny_design",
      avatarUrl: "/professional-woman-headshot.png",
      initials: "JW",
      selectedColor: 0 as ThemeIndex, // rose
    },
  ])
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
          setPortfolios((prev) => [...prev, ...portfolioCards])
          setSelectedPortfolioId(portfolioCards[0].id)
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
  }

  const handlePortfolioSelect = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId)
    setViewMode("expanded")
  }

  // Randomize across ALL 7 colors (0..6)
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
