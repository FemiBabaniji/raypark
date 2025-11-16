"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"
import MusicAppInterface from "@/components/music-app-interface"
import BackButton from "@/components/ui/back-button"
import { getPublishedPortfolios } from "@/lib/portfolio-data"
import { DebugPanel } from "@/components/debug-panel"
import type { Portfolio } from "@/lib/portfolio-data"
import type { UnifiedPortfolio } from "@/components/unified-portfolio-card"
import type { ThemeIndex } from "@/lib/theme"
import PortfolioCanvas from "@/components/home/PortfolioCanvas"
import { savePortfolio, loadUserPortfolios, deletePortfolio, createPortfolioOnce } from "@/lib/portfolio-service"
import { useAuth } from "@/lib/auth"
import { safeUUID } from "@/lib/utils"
import { THEME_COLOR_OPTIONS } from "@/lib/theme"
import { Plus, MoreVertical } from 'lucide-react'

interface ExtendedPortfolio extends UnifiedPortfolio {
  community?: {
    id: string
    name: string
  }
}

const DashboardHeader = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#1a1a1a] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        {/* Left: Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-white font-bold text-xl">
            Pathwai
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/events" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
              Events
            </Link>
            <Link href="/dashboard" className="text-white text-sm font-medium">
              Portfolios
            </Link>
            <Link href="/network" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
              Network
            </Link>
          </nav>
        </div>

        {/* Right: Actions and Icons */}
        <div className="flex items-center gap-4">
          <div className="text-white/70 text-sm">
            {new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              timeZoneName: "short",
            })}
          </div>

          {/* Icon buttons matching the screenshot */}
          <div className="flex items-center gap-2">
            <button
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
              aria-label="Search"
            >
              {/* Search icon here */}
            </button>
            <button
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
              aria-label="Notifications"
            >
              {/* Bell icon here */}
            </button>
            <div className="relative z-50">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
                aria-label="User menu"
              >
                {/* User icon here */}
              </button>
              {isUserDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 rounded-xl shadow-lg border border-white/10 overflow-hidden z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 text-white hover:bg-white/5 transition-colors text-sm"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-3 text-white hover:bg-white/5 transition-colors text-sm"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

const PortfolioCard = ({
  portfolio,
  onClick,
  onSyncCommunity,
}: {
  portfolio: ExtendedPortfolio
  onClick: () => void
  onSyncCommunity: (portfolioId: string, communityId: string) => void
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const gradient = THEME_COLOR_OPTIONS[portfolio.selectedColor]?.gradient ?? "from-neutral-600/40 to-neutral-800/60"
  
  const initials = portfolio.initials || portfolio.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  
  const communityText = portfolio.community?.name || "No Community"

  // Sample communities - in production, fetch from database
  const availableCommunities = [
    { id: "design-collective", name: "Design Collective" },
    { id: "tech-innovators", name: "Tech Innovators" },
    { id: "creative-minds", name: "Creative Minds" },
  ]

  return (
    <div className="relative w-full bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-sm rounded-2xl transition-all duration-200 border border-white/[0.08] group">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsMenuOpen(!isMenuOpen)
        }}
        className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-neutral-900/90 backdrop-blur-sm hover:bg-neutral-800/90 border border-white/10 transition-colors flex items-center justify-center z-20"
        aria-label="Portfolio options"
      >
        <MoreVertical className="w-4 h-4 text-white/70" />
      </button>

      <button
        onClick={onClick}
        className="w-full p-6 text-left"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
              {portfolio.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={portfolio.avatarUrl || "/placeholder.svg"} alt={portfolio.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-white font-bold text-lg">{initials}</span>
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[2.5px] border-[#1a1a1a] ${portfolio.isLive ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </div>
        </div>
        
        <h3 className="text-white font-semibold text-lg mb-1.5 group-hover:text-white/90 transition-colors">
          {portfolio.name}
        </h3>
        
        <p className="text-xs text-white/40">
          {communityText}
        </p>
      </button>

      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={(e) => {
              e.stopPropagation()
              setIsMenuOpen(false)
            }} 
          />
          <div className="absolute right-0 top-10 w-56 bg-neutral-900/95 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 overflow-hidden z-50">
            <div className="p-2">
              <div className="px-3 py-2 text-xs text-white/50 font-medium uppercase tracking-wider">
                Sync to Community
              </div>
              {availableCommunities.map((community) => (
                <button
                  key={community.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSyncCommunity(portfolio.id, community.id)
                    setIsMenuOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    portfolio.community?.id === community.id
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {community.name}
                  {portfolio.community?.id === community.id && (
                    <span className="ml-2 text-emerald-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const EmptyState = ({ onCreatePortfolio }: { onCreatePortfolio: () => void }) => {
  return (
    <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
      <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
        <div className="w-8 h-8 text-white/40">📁</div>
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">No Portfolios</h3>
      <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto">
        You haven't created any portfolios yet. Get started by creating your first portfolio.
      </p>
      <button
        onClick={onCreatePortfolio}
        className="px-6 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white text-sm font-medium transition-colors"
      >
        Create Portfolio
      </button>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [portfolios, setPortfolios] = useState<ExtendedPortfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "editor">("list")
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    if (authLoading) return

    const fetchPortfolios = async () => {
      try {
        const userPortfolios = await loadUserPortfolios(user)
        
        if (userPortfolios.length > 0) {
          setPortfolios(userPortfolios)
        } else {
          const demoData = await getPublishedPortfolios()
          const portfolioCards: ExtendedPortfolio[] = demoData.map((portfolio, index) => ({
            id: portfolio.slug,
            name: portfolio.title,
            title: "Portfolio",
            email: `${portfolio.slug}@example.com`,
            location: "Location",
            handle: `@${portfolio.slug}`,
            initials: portfolio.title
              ? portfolio.title.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
              : "??",
            selectedColor: (index % 7) as ThemeIndex,
            isLive: false,
            isTemplate: portfolio.isTemplate || false,
            community: undefined,
          }))
          setPortfolios(portfolioCards)
        }
      } catch (error) {
        console.error("Error fetching portfolios:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolios()
  }, [authLoading, user])

  const handleCreatePortfolio = async () => {
    if (!user?.id) {
      const newPortfolio: ExtendedPortfolio = {
        id: safeUUID(),
        name: "New Portfolio",
        title: "Portfolio",
        email: "new@example.com",
        location: "Location",
        handle: "@newuser",
        initials: "NP",
        selectedColor: Math.floor(Math.random() * 7) as ThemeIndex,
        isLive: false,
        isTemplate: false,
        community: undefined,
      }
      setPortfolios((prev) => [...prev, newPortfolio])
      setSelectedPortfolioId(newPortfolio.id)
      setViewMode("editor")
      return
    }

    try {
      const portfolioData = await createPortfolioOnce({
        userId: user.id,
        name: "New Portfolio",
        theme_id: "default",
        description: "A new portfolio",
      })

      const newPortfolio: ExtendedPortfolio = {
        id: portfolioData.id,
        name: portfolioData.name,
        title: "Portfolio",
        email: `${portfolioData.slug}@example.com`,
        location: "Location",
        handle: `@${portfolioData.slug}`,
        initials: portfolioData.name.slice(0, 2).toUpperCase(),
        selectedColor: Math.floor(Math.random() * 7) as ThemeIndex,
        isLive: portfolioData.is_public || false,
        isTemplate: false,
        community: undefined,
      }

      setPortfolios((prev) => [...prev, newPortfolio])
      setSelectedPortfolioId(newPortfolio.id)
      setViewMode("editor")
    } catch (error) {
      console.error("Error creating portfolio:", error)
    }
  }

  const handlePortfolioClick = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId)
    setViewMode("editor")
  }

  const handleBackToList = () => {
    setViewMode("list")
    setSelectedPortfolioId(null)
    setIsPreviewMode(false)
  }

  const handleSyncCommunity = (portfolioId: string, communityId: string) => {
    const communityMap: Record<string, string> = {
      "design-collective": "Design Collective",
      "tech-innovators": "Tech Innovators",
      "creative-minds": "Creative Minds",
    }

    setPortfolios((prev) =>
      prev.map((p) =>
        p.id === portfolioId
          ? { ...p, community: { id: communityId, name: communityMap[communityId] } }
          : p
      )
    )
  }

  const activePortfolio = portfolios.find((p) => p.id === selectedPortfolioId)

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (viewMode === "editor" && activePortfolio) {
    return (
      <div className="min-h-screen bg-background">
        {!isPreviewMode && (
          <>
            <div className="fixed top-8 left-8 z-50">
              <BackButton onClick={handleBackToList} aria-label="Back to Dashboard" />
            </div>
            <div className="fixed top-8 right-8 z-50">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="px-4 py-2 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors text-sm font-medium"
              >
                Preview
              </button>
            </div>
          </>
        )}
        
        {isPreviewMode && (
          <div className="fixed top-8 left-8 z-50">
            <BackButton onClick={() => setIsPreviewMode(false)} />
          </div>
        )}

        <div className="pt-24">
          <PortfolioCanvas
            isPreviewMode={isPreviewMode}
            activeIdentity={{
              id: activePortfolio.id,
              name: activePortfolio.name,
              handle: activePortfolio.handle || "",
              avatarUrl: activePortfolio.avatarUrl,
              selectedColor: activePortfolio.selectedColor,
              isLive: activePortfolio.isLive,
            }}
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
                  savePortfolio(updated, user).catch(console.error)
                  return updated
                }),
              )
            }}
            onSavePortfolio={async (portfolioData) => {
              try {
                await savePortfolio(portfolioData, user)
                setPortfolios((prev) => prev.map((p) => (p.id === selectedPortfolioId ? portfolioData : p)))
              } catch (error) {
                console.error("Error saving portfolio:", error)
              }
            }}
            isLive={activePortfolio.isLive || false}
            onToggleLive={async (isLive: boolean) => {
              const updated = { ...activePortfolio, isLive }
              try {
                await savePortfolio(updated, user)
                setPortfolios((prev) => prev.map((p) => (p.id === selectedPortfolioId ? { ...p, isLive } : p)))
              } catch (error) {
                console.error("Error updating portfolio live status:", error)
              }
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "oklch(0.18 0 0)" }}>
      {/* Gradient background orbs matching events page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large blue gradient orb - top left */}
        <div 
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, #4169E1 0%, transparent 70%)",
          }}
        />
        
        {/* Purple gradient orb - top right */}
        <div 
          className="absolute -top-1/3 right-0 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
          style={{
            background: "radial-gradient(circle, #7B68EE 0%, transparent 70%)",
          }}
        />
        
        {/* Blue gradient orb - middle left */}
        <div 
          className="absolute top-1/2 -left-1/4 w-[700px] h-[700px] rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #4169E1 0%, transparent 70%)",
          }}
        />
        
        {/* Purple/Violet gradient orb - bottom right */}
        <div 
          className="absolute bottom-0 right-1/4 w-[900px] h-[900px] rounded-full opacity-25 blur-3xl"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
          }}
        />
        
        {/* Smaller accent blue orb - bottom left */}
        <div 
          className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, #0EA5E9 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content layer with relative z-index */}
      <div className="relative z-10">
        <div className="fixed top-8 left-8 z-50">
          <BackButton onClick={() => router.back()} aria-label="Back" />
        </div>
        
        <main className="pt-20 pb-16 px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-12">Portfolios</h1>

            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">My Portfolios</h2>
                <button
                  onClick={handleCreatePortfolio}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-colors border border-white/10"
                >
                  <Plus className="w-4 h-4" />
                  Create
                </button>
              </div>

              {portfolios.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
                  {portfolios.map((portfolio) => (
                    <PortfolioCard
                      key={portfolio.id}
                      portfolio={portfolio}
                      onClick={() => handlePortfolioClick(portfolio.id)}
                      onSyncCommunity={handleSyncCommunity}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState onCreatePortfolio={handleCreatePortfolio} />
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Shared With Me</h2>
              <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 text-white/40">👥</div>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">No Shared Portfolios</h3>
                <p className="text-white/60 text-sm max-w-sm mx-auto">
                  Portfolios that others share with you will appear here.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
