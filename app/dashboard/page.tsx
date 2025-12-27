"use client"
import "@/lib/polyfills"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/ui/back-button"
import { getPublishedPortfolios } from "@/lib/portfolio-data"
import type { ThemeIndex } from "@/lib/theme"
import PortfolioCanvas from "@/components/home/PortfolioCanvas"
import { savePortfolio, loadUserPortfolios, deletePortfolio } from "@/lib/portfolio-service"
import { useAuth } from "@/lib/auth"
import { Shield } from "lucide-react"
import { DashboardPortfolioGrid, type ExtendedPortfolio } from "@/components/dashboard-portfolio-grid"
import { loadUserCommunities, getPortfolioForCommunity, swapPortfolioToCommunity } from "@/lib/community-service"
import { linkPortfolioToCommunity } from "@/lib/community-service"
import type { Community } from "@/lib/community-service"
import { PortfolioTemplateModal } from "@/components/portfolio-template-modal"
import { useIsAdmin } from "@/hooks/use-is-admin"

const DashboardHeader = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const { isAdmin } = useIsAdmin()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10">
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
                    <div className="border-t border-white/5" />
                    <Link
                      href="/settings"
                      className="block px-4 py-3 text-white hover:bg-white/5 transition-colors text-sm"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    {isAdmin && (
                      <>
                        <div className="border-t border-white/5" />
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/5 transition-colors text-sm"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Shield className="w-4 h-4" />
                          Admin
                        </Link>
                      </>
                    )}
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

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [portfolios, setPortfolios] = useState<ExtendedPortfolio[]>([])
  const [userCommunities, setUserCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "editor">("list")
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [templateCommunityId, setTemplateCommunityId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    const fetchPortfolios = async () => {
      try {
        const [userPortfolios, communities] = await Promise.all([
          loadUserPortfolios(user),
          loadUserCommunities(user?.id),
        ])

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
            community: undefined,
          }))
          setPortfolios(portfolioCards)
        }

        setUserCommunities(communities)
      } catch (error) {
        console.error("Error fetching portfolios:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolios()

    const handlePortfolioUpdate = () => {
      console.log("[v0] Portfolio update detected, refreshing...")
      fetchPortfolios()
    }

    window.addEventListener("portfolio-updated", handlePortfolioUpdate)

    return () => {
      window.removeEventListener("portfolio-updated", handlePortfolioUpdate)
    }
  }, [authLoading, user])

  const handleCreatePortfolio = () => {
    if (!user?.id) {
      router.push("/login?redirect=/dashboard")
      return
    }

    const defaultCommunityId = userCommunities.length > 0 ? userCommunities[0].id : null
    setTemplateCommunityId(defaultCommunityId)
    setIsTemplateModalOpen(true)
  }

  const handleTemplateSelect = async (templateId: string) => {
    if (!user?.id) return

    try {
      const response = await fetch("/api/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "New Portfolio",
          description: "A new portfolio",
          templateId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || error.error || "Failed to create portfolio")
      }

      const { portfolio } = await response.json()

      setIsTemplateModalOpen(false)

      window.dispatchEvent(new CustomEvent("portfolio-updated"))

      router.push(`/portfolio/builder?portfolio=${portfolio.id}`)
    } catch (error) {
      console.error("Error creating portfolio:", error)
      alert(error instanceof Error ? error.message : "Failed to create portfolio")
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

  const handleSyncCommunity = async (portfolioId: string, communityId: string | null) => {
    if (!user?.id) {
      return
    }

    try {
      if (communityId === null) {
        await linkPortfolioToCommunity(portfolioId, null, user.id)
      } else {
        await swapPortfolioToCommunity(portfolioId, communityId, user.id)
      }

      const updatedPortfolios = await loadUserPortfolios(user)
      setPortfolios(updatedPortfolios)
    } catch (error) {
      console.error("[v0] Error syncing portfolio to community:", error)
      alert(error instanceof Error ? error.message : "Failed to sync portfolio")
    }
  }

  const handleCheckExistingPortfolio = async (communityId: string) => {
    if (!user?.id) return null

    try {
      const existing = await getPortfolioForCommunity(user.id, communityId)
      return existing
    } catch (error) {
      console.error("[v0] Error checking existing portfolio:", error)
      return null
    }
  }

  const handleDeletePortfolio = async (portfolioId: string) => {
    if (!user?.id) {
      return
    }

    try {
      await deletePortfolio(portfolioId)

      const updatedPortfolios = await loadUserPortfolios(user)
      setPortfolios(updatedPortfolios)
    } catch (error) {
      console.error("[v0] Error deleting portfolio:", error)
      alert(error instanceof Error ? error.message : "Failed to delete portfolio")
    }
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
    <div className="min-h-screen relative bg-background overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "linear-gradient(135deg, #0d0d15 0%, #12121d 15%, #0a0a12 30%, #15152a 45%, #0f0f1a 60%, #1a1a28 75%, #0e0e16 90%, #13132a 100%)",
            filter: "blur(20px)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.008]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="fixed top-8 left-8 z-50">
          <BackButton onClick={() => router.back()} aria-label="Back" />
        </div>

        <main className="pt-20 pb-16 px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-12">Workspace</h1>

            <DashboardPortfolioGrid
              portfolios={portfolios}
              onPortfolioClick={handlePortfolioClick}
              onCreatePortfolio={handleCreatePortfolio}
              onSyncCommunity={handleSyncCommunity}
              onDeletePortfolio={handleDeletePortfolio}
              userCommunities={userCommunities}
              onCheckExistingPortfolio={handleCheckExistingPortfolio}
            />

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

      <PortfolioTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleTemplateSelect}
        communityId={templateCommunityId || undefined}
      />
    </div>
  )
}
