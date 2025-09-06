"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import MusicAppInterface from "@/components/music-app-interface"
import BackButton from "@/components/ui/back-button"
import { getPublishedPortfolios } from "@/lib/portfolio-data"
import { DebugPanel } from "@/components/debug-panel"
import type { Portfolio } from "@/lib/portfolio-data"
import type { UnifiedPortfolio } from "@/components/unified-portfolio-card"
import type { ThemeIndex } from "@/lib/theme"
import PortfolioCanvas from "@/components/home/PortfolioCanvas"
import PortfolioGrid from "@/components/home/PortfolioGrid"
import { savePortfolio, loadUserPortfolios, deletePortfolio } from "@/lib/portfolio-service"

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

  return null
}

const ExpandedViewNavigation = ({
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
      <div className="fixed top-8 left-8 z-50">
        <BackButton onClick={() => onPreview()} />
      </div>
    )
  }

  return (
    <>
      {/* Back button in top left corner */}
      <div className="fixed top-8 left-8 z-50">
        <BackButton onClick={onZoomOut} aria-label="Back to Dashboard" />
      </div>

      {/* Preview button in top right corner */}
      <div className="fixed top-8 right-8 z-50">
        <button
          onClick={onPreview}
          className="px-4 py-2 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors text-sm font-medium"
        >
          Preview
        </button>
      </div>
    </>
  )
}

const PortfolioCanvasWrapper = ({
  isPreviewMode,
  useStarterTemplate,
  activeIdentity,
  onActiveIdentityChange,
  onSavePortfolio,
  isLive,
  onToggleLive,
}: {
  isPreviewMode: boolean
  useStarterTemplate?: boolean
  activeIdentity?: UnifiedPortfolio
  onActiveIdentityChange?: (next: Partial<UnifiedPortfolio>) => void
  onSavePortfolio?: (portfolioData: UnifiedPortfolio) => void
  isLive?: boolean
  onToggleLive?: (isLive: boolean) => void
}) => {
  return (
    <PortfolioCanvas
      isPreviewMode={isPreviewMode}
      useStarterTemplate={useStarterTemplate}
      activeIdentity={
        activeIdentity
          ? {
              id: activeIdentity.id,
              name: activeIdentity.name,
              handle: activeIdentity.handle || "",
              avatarUrl: activeIdentity.avatarUrl,
              selectedColor: activeIdentity.selectedColor,
              isLive: activeIdentity.isLive,
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
      onSavePortfolio={onSavePortfolio}
      onToggleLive={onToggleLive}
      isLive={isLive}
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
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [viewMode, setViewMode] = useState<"expanded" | "minimized">("minimized")
  const [useStarterTemplate, setUseStarterTemplate] = useState(false)
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("jenny-wilson")
  const [portfolios, setPortfolios] = useState<UnifiedPortfolio[]>([])
  const [publishedPortfolios, setPublishedPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const userPortfolios = await loadUserPortfolios()
        const demoData = await getPublishedPortfolios()
        setPublishedPortfolios(demoData)

        let allPortfolios: UnifiedPortfolio[] = []

        if (userPortfolios.length > 0) {
          allPortfolios = userPortfolios
        } else {
          allPortfolios = demoData.map((portfolio, index) => ({
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
            selectedColor: (index % 7) as ThemeIndex,
            isLive: false,
            isTemplate: portfolio.isTemplate || false,
          }))
        }

        setPortfolios(allPortfolios)
        if (allPortfolios.length > 0) {
          setSelectedPortfolioId(allPortfolios[0].id)
        }
      } catch (error) {
        console.error("Error fetching portfolios:", error)
        try {
          const demoData = await getPublishedPortfolios()
          setPublishedPortfolios(demoData)
          const portfolioCards: UnifiedPortfolio[] = demoData.map((portfolio, index) => ({
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
            selectedColor: (index % 7) as ThemeIndex,
            isLive: false,
            isTemplate: portfolio.isTemplate || false,
          }))
          setPortfolios(portfolioCards)
          if (portfolioCards.length > 0) {
            setSelectedPortfolioId(portfolioCards[0].id)
          }
        } catch (fallbackError) {
          console.error("Error loading fallback portfolios:", fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolios()
  }, [])

  const handleZoomOut = () => {
    if (activePortfolio) {
      savePortfolio(activePortfolio).catch(console.error)
    }
    setViewMode("minimized")
    setIsPreviewMode(false)
    setUseStarterTemplate(false)
  }

  const handlePortfolioSelect = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId)
    setViewMode("expanded")
    const selectedPortfolio = portfolios.find((p) => p.id === portfolioId)
    setUseStarterTemplate(selectedPortfolio?.isTemplate || false)
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
      selectedColor: Math.floor(Math.random() * 7) as ThemeIndex,
      isLive: false,
      isTemplate: false,
    }
    setPortfolios((prev) => [...prev, newPortfolio])
    setSelectedPortfolioId(newPortfolio.id)
  }

  const handleDeletePortfolio = async (portfolioId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      await deletePortfolio(portfolioId)

      setPortfolios((prev) => {
        if (prev.length <= 1) return prev
        const next = prev.filter((p) => p.id !== portfolioId)
        if (selectedPortfolioId === portfolioId && next.length > 0) {
          setSelectedPortfolioId(next[0].id)
        }
        return next
      })
    } catch (error) {
      console.error("Error deleting portfolio:", error)
      setPortfolios((prev) => {
        if (prev.length <= 1) return prev
        const next = prev.filter((p) => p.id !== portfolioId)
        if (selectedPortfolioId === portfolioId && next.length > 0) {
          setSelectedPortfolioId(next[0].id)
        }
        return next
      })
    }
  }

  const togglePreview = () => setIsPreviewMode(!isPreviewMode)
  const hasSidebar = viewMode === "expanded" && !isPreviewMode

  const handleChangeCardColor = (id: string, colorIndex: ThemeIndex) => {
    setPortfolios((prev) => prev.map((p) => (p.id === id ? { ...p, selectedColor: colorIndex } : p)))
  }

  const handleChangeActivePortfolioColor = (colorIndex: ThemeIndex) => {
    setPortfolios((prev) => prev.map((p) => (p.id === selectedPortfolioId ? { ...p, selectedColor: colorIndex } : p)))
  }

  const handleToggleLive = async (isLive: boolean) => {
    const updatedPortfolio = portfolios.find((p) => p.id === selectedPortfolioId)
    if (!updatedPortfolio) return

    const newPortfolio = { ...updatedPortfolio, isLive }

    try {
      await savePortfolio(newPortfolio)
      setPortfolios((prev) => prev.map((p) => (p.id === selectedPortfolioId ? { ...p, isLive } : p)))
    } catch (error) {
      console.error("Error updating portfolio live status:", error)
      setPortfolios((prev) => prev.map((p) => (p.id === selectedPortfolioId ? { ...p, isLive } : p)))
    }
  }

  const activePortfolio = portfolios.find((p) => p.id === selectedPortfolioId)

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading portfolios...</div>
      </div>
    )
  }

  const shouldHideNav = isPreviewMode || viewMode === "expanded"

  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden">
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{ height: NAV_H, paddingLeft: BASE_PADDING, paddingRight: BASE_PADDING }}
        animate={{
          opacity: shouldHideNav ? 0 : 1,
          y: shouldHideNav ? -20 : 0,
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

      {viewMode === "expanded" && (
        <ExpandedViewNavigation onZoomOut={handleZoomOut} onPreview={togglePreview} isPreviewMode={isPreviewMode} />
      )}

      <div className="flex" style={{ paddingTop: shouldHideNav ? (viewMode === "expanded" ? 80 : 24) : NAV_H }}>
        <div className="flex-1 max-w-5xl mx-auto" style={{ padding: viewMode === "expanded" ? 0 : BASE_PADDING }}>
          <AnimatePresence mode="wait">
            {viewMode === "minimized" ? (
              <motion.div
                key="minimized"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="min-h-screen flex items-start justify-center pt-16"
              >
                <PortfolioGrid
                  portfolios={portfolios}
                  onSelect={handlePortfolioSelect}
                  onAdd={handleAddPortfolio}
                  onDelete={handleDeletePortfolio}
                  onChangeColor={handleChangeCardColor}
                  onStartStarter={handleStartStarter}
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
                  useStarterTemplate={useStarterTemplate}
                  activeIdentity={activePortfolio}
                  onActiveIdentityChange={(next) => {
                    setPortfolios((prev) =>
                      prev.map((p) => {
                        if (p.id !== selectedPortfolioId) return p
                        const updated = {
                          ...p,
                          name: next.name ?? p.name,
                          handle: next.handle ?? p.handle,
                          avatarUrl: next.avatarUrl ?? p.avatarUrl,
                          selectedColor: (next.selectedColor ?? p.selectedColor) as ThemeIndex,
                        }
                        savePortfolio(updated).catch(console.error)
                        return updated
                      }),
                    )
                  }}
                  onSavePortfolio={async (portfolioData) => {
                    try {
                      await savePortfolio(portfolioData)
                      setPortfolios((prev) => [...prev, portfolioData])
                      setSelectedPortfolioId(portfolioData.id)
                    } catch (error) {
                      console.error("Error saving portfolio:", error)
                      setPortfolios((prev) => [...prev, portfolioData])
                      setSelectedPortfolioId(portfolioData.id)
                    }
                  }}
                  isLive={activePortfolio?.isLive || false}
                  onToggleLive={handleToggleLive}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {hasSidebar && (
          <div className="w-96 h-screen" style={{ top: isPreviewMode ? 0 : NAV_H }}>
            <SidePanel isVisible={hasSidebar} isPreviewMode={isPreviewMode} />
          </div>
        )}
      </div>

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
