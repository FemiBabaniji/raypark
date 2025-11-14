"use client"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { useAuth } from "@/lib/auth"
import type { UnifiedPortfolio } from "@/components/unified-portfolio-card"
import { createClient } from "@/lib/supabase/client"
import { Upload } from 'lucide-react'

export default function EventsRightColumn() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { user, loading } = useAuth()
  const [portfolio, setPortfolio] = useState<UnifiedPortfolio | null>(null)
  const [portfolioLoading, setPortfolioLoading] = useState(true)
  const [hasPortfolio, setHasPortfolio] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadBEAPortfolio() {
      if (!user?.id) {
        setPortfolioLoading(false)
        setHasPortfolio(false)
        setPortfolio(null)
        return
      }

      setPortfolioLoading(true)

      try {
        const supabase = createClient()

        const { data: portfolios, error: portfoliosError } = await supabase
          .from("portfolios")
          .select("id, name, is_public, community_id, slug")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })

        if (portfoliosError) {
          throw portfoliosError
        }

        if (!portfolios || portfolios.length === 0) {
          setHasPortfolio(false)
          setPortfolio(null)
          setPortfolioLoading(false)
          return
        }

        // Priority: BEA portfolio (has community_id) > Most recently updated
        const beaPortfolio = portfolios.find((p) => p.community_id !== null && p.community_id !== undefined)
        const targetPortfolio = beaPortfolio || portfolios[0]

        console.log("[v0] Portfolio selection:", {
          totalPortfolios: portfolios.length,
          beaPortfolioFound: !!beaPortfolio,
          selectedPortfolio: {
            id: targetPortfolio.id,
            name: targetPortfolio.name,
            hasCommunityId: !!targetPortfolio.community_id,
            communityId: targetPortfolio.community_id,
          },
        })

        // Get page ID
        const { data: page, error: pageError } = await supabase
          .from("pages")
          .select("id")
          .eq("portfolio_id", targetPortfolio.id)
          .eq("key", "main")
          .maybeSingle()

        if (pageError || !page) {
          setHasPortfolio(true)
          setPortfolio({
            id: targetPortfolio.id,
            name: targetPortfolio.name,
            title: "Portfolio",
            email: user.email,
            location: "Location",
            handle: `@${targetPortfolio.slug}`,
            selectedColor: 3,
            isLive: targetPortfolio.is_public,
          })
          setPortfolioLoading(false)
          return
        }

        // Get identity widget type
        const { data: widgetType, error: widgetTypeError } = await supabase
          .from("widget_types")
          .select("id")
          .eq("key", "identity")
          .maybeSingle()

        if (widgetTypeError || !widgetType) {
          setHasPortfolio(true)
          setPortfolio({
            id: targetPortfolio.id,
            name: targetPortfolio.name,
            title: "Portfolio",
            email: user.email,
            location: "Location",
            handle: `@${targetPortfolio.slug}`,
            selectedColor: 3,
            isLive: targetPortfolio.is_public,
          })
          setPortfolioLoading(false)
          return
        }

        // Get identity widget instance
        const { data: widget, error: widgetError } = await supabase
          .from("widget_instances")
          .select("props")
          .eq("page_id", page.id)
          .eq("widget_type_id", widgetType.id)
          .maybeSingle()

        if (widgetError || !widget?.props) {
          setHasPortfolio(true)
          setPortfolio({
            id: targetPortfolio.id,
            name: targetPortfolio.name,
            title: "Portfolio",
            email: user.email,
            location: "Location",
            handle: `@${targetPortfolio.slug}`,
            selectedColor: 3,
            isLive: targetPortfolio.is_public,
          })
          setPortfolioLoading(false)
          return
        }

        const loadedPortfolio: UnifiedPortfolio = {
          id: targetPortfolio.id,
          name: widget.props.name || targetPortfolio.name,
          title: widget.props.title || "Portfolio",
          email: widget.props.email || user.email,
          location: widget.props.location || "Location",
          handle: widget.props.handle || `@${targetPortfolio.slug}`,
          avatarUrl: widget.props.avatarUrl,
          selectedColor: typeof widget.props.selectedColor === "number" ? widget.props.selectedColor : 3,
          isLive: targetPortfolio.is_public,
        }

        setHasPortfolio(true)
        setPortfolio(loadedPortfolio)
      } catch (error) {
        console.error("[v0] Failed to load portfolio:", error)
        setHasPortfolio(false)
        setPortfolio(null)
      } finally {
        setPortfolioLoading(false)
      }
    }

    if (!loading) {
      loadBEAPortfolio()
    }
  }, [user?.id, loading, user?.email])

  useEffect(() => {
    if (!user?.id) return

    const handlePortfolioUpdate = () => {
      // Reload will be triggered by the main useEffect
    }

    window.addEventListener("portfolio-updated", handlePortfolioUpdate)
    window.addEventListener("focus", handlePortfolioUpdate)

    return () => {
      window.removeEventListener("portfolio-updated", handlePortfolioUpdate)
      window.removeEventListener("focus", handlePortfolioUpdate)
    }
  }, [user?.id])

  const handleEditProfile = () => {
    if (!user) {
      router.push("/login?redirect=/portfolio/builder")
      return
    }
    router.push("/portfolio/builder")
  }

  const handleCreateProfile = () => {
    if (!user) {
      router.push("/login?redirect=/portfolio/builder")
      return
    }
    router.push("/onboarding/resume")
  }

  const handleUpdateFromResume = () => {
    if (!user) {
      router.push("/login?redirect=/onboarding/resume")
      return
    }
    router.push("/onboarding/resume?mode=update")
  }

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-8 w-[340px]">
      <div className="space-y-5">
        {/* Profile editing card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/5">
          <div className="mb-5">
            <h3 className="text-base font-semibold mb-1.5 text-white">Your Profile</h3>
            <p className="text-sm text-zinc-400">Customize who you are and what you represent</p>
          </div>

          {loading || portfolioLoading ? (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-neutral-600/40 to-neutral-800/60 text-white backdrop-blur-xl border border-white/5 animate-pulse aspect-square mb-5">
              <div className="h-12 w-12 rounded-2xl bg-white/20"></div>
              <div className="mt-4 h-5 bg-white/20 rounded w-3/4"></div>
              <div className="mt-3 h-4 bg-white/20 rounded w-1/2"></div>
            </div>
          ) : !user ? (
            <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-600/40 to-cyan-600/40 text-white backdrop-blur-xl border border-white/5 mb-5 aspect-square flex flex-col">
              <div className="h-12 w-12 rounded-2xl bg-white/20 grid place-items-center font-bold text-white text-xl">→</div>
              <div className="mt-auto">
                <div className="text-lg font-semibold text-white">Sign In Required</div>
                <div className="text-sm text-white/90 mt-1">Create your portfolio</div>
              </div>
            </div>
          ) : portfolio ? (
            <div className="mb-5">
              <UnifiedPortfolioCard
                portfolio={portfolio}
                onClick={(id) => handleEditProfile()}
                onShare={(id) => console.log("Share profile:", id)}
                onMore={(id) => console.log("More options:", id)}
              />
            </div>
          ) : (
            <div className="rounded-2xl p-6 bg-gradient-to-br from-neutral-600/40 to-neutral-800/60 text-white backdrop-blur-xl border border-white/5 mb-5 aspect-square flex flex-col">
              <div className="h-12 w-12 rounded-2xl bg-white/20 grid place-items-center font-bold text-white text-xl">?</div>
              <div className="mt-auto">
                <div className="text-lg font-semibold text-white">No Profile Yet</div>
                <div className="text-sm text-white/90 mt-1">Create your portfolio</div>
              </div>
            </div>
          )}

          <button
            onClick={!user ? () => router.push("/login") : hasPortfolio ? handleEditProfile : handleCreateProfile}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-zinc-700/60 bg-zinc-800/60 text-white"
          >
            {!user ? "Sign In" : hasPortfolio ? "Edit Profile" : "Create New Profile"}
          </button>

          {hasPortfolio && user && (
            <button
              onClick={handleUpdateFromResume}
              className="w-full mt-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-zinc-700/60 flex items-center justify-center gap-2 bg-zinc-800/60 text-white"
            >
              <Upload className="w-4 h-4" />
              Update from Resume
            </button>
          )}
        </div>

        {/* AI Assistant */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">AI Assistant</h3>
          </div>

          <p className="text-sm mb-5 text-zinc-400">
            Get instant help with events, networking, and profile optimization
          </p>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-zinc-100 flex items-center justify-center gap-2 bg-white text-zinc-900"
          >
            {isChatOpen ? "Close Chat" : "Start Chat"}
          </button>

          {isChatOpen && (
            <div className="mt-4 rounded-xl p-4 bg-zinc-800/40 border border-white/5">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                <div className="text-sm text-white">
                  <p className="mb-2">Hi! I'm your AI assistant. I can help you with:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
                    <li>Finding relevant events</li>
                    <li>Networking suggestions</li>
                    <li>Profile improvements</li>
                    <li>Community insights</li>
                  </ul>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 bg-zinc-900/60 text-white border border-zinc-700 placeholder:text-zinc-500"
                />
                <button className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-zinc-700/60 bg-zinc-800/60 text-white">
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
