"use client"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { useAuth } from "@/lib/auth"
import type { UnifiedPortfolio } from "@/components/unified-portfolio-card"
import { createClient } from "@/lib/supabase/client"
import { Upload, ChevronRight, Plus } from 'lucide-react'

export default function EventsRightColumn({ 
  onToggleRightColumn,
  communityId,
  hasUserPortfolio = false,
  userPortfolio = null
}: { 
  onToggleRightColumn?: () => void
  communityId?: string
  hasUserPortfolio?: boolean
  userPortfolio?: any
}) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { user, loading } = useAuth()
  const [portfolio, setPortfolio] = useState<UnifiedPortfolio | null>(null)
  const [portfolioLoading, setPortfolioLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadCommunityPortfolio() {
      if (!user?.id || !communityId) {
        setPortfolioLoading(false)
        setPortfolio(null)
        return
      }

      if (hasUserPortfolio && userPortfolio) {
        console.log("[v0] Using portfolio from props:", userPortfolio)
        setPortfolioLoading(true)

        try {
          const supabase = createClient()

          // Get page ID
          const { data: page, error: pageError } = await supabase
            .from("pages")
            .select("id")
            .eq("portfolio_id", userPortfolio.id)
            .eq("key", "main")
            .maybeSingle()

          if (pageError || !page) {
            setPortfolio({
              id: userPortfolio.id,
              name: userPortfolio.name,
              title: "Portfolio",
              email: user.email,
              location: "Location",
              handle: `@${userPortfolio.slug}`,
              selectedColor: 3,
              isLive: userPortfolio.is_public,
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
            setPortfolio({
              id: userPortfolio.id,
              name: userPortfolio.name,
              title: "Portfolio",
              email: user.email,
              location: "Location",
              handle: `@${userPortfolio.slug}`,
              selectedColor: 3,
              isLive: userPortfolio.is_public,
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
            setPortfolio({
              id: userPortfolio.id,
              name: userPortfolio.name,
              title: "Portfolio",
              email: user.email,
              location: "Location",
              handle: `@${userPortfolio.slug}`,
              selectedColor: 3,
              isLive: userPortfolio.is_public,
            })
            setPortfolioLoading(false)
            return
          }

          const loadedPortfolio: UnifiedPortfolio = {
            id: userPortfolio.id,
            name: widget.props.name || userPortfolio.name,
            title: widget.props.title || "Portfolio",
            email: widget.props.email || user.email,
            location: widget.props.location || "Location",
            handle: widget.props.handle || `@${userPortfolio.slug}`,
            avatarUrl: widget.props.avatarUrl,
            selectedColor: typeof widget.props.selectedColor === "number" ? widget.props.selectedColor : 3,
            isLive: userPortfolio.is_public,
          }

          setPortfolio(loadedPortfolio)
        } catch (error) {
          console.error("[v0] Failed to load portfolio:", error)
          setPortfolio(null)
        } finally {
          setPortfolioLoading(false)
        }
        return
      }

      console.log("[v0] No portfolio for this community")
      setPortfolio(null)
      setPortfolioLoading(false)
    }

    if (!loading) {
      loadCommunityPortfolio()
    }
  }, [user?.id, loading, user?.email, communityId, hasUserPortfolio, userPortfolio])

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
    <div className="w-full">
      {onToggleRightColumn && (
        <div className="mb-4">
          <button
            onClick={onToggleRightColumn}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
            aria-label="Hide sidebar"
          >
            <ChevronRight className="w-4 h-4 text-white/70" />
          </button>
        </div>
      )}
      
      <div className="space-y-5">
        {/* Profile editing card */}
        <div className="rounded-3xl p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-1 text-white">Your Profile</h3>
            <p className="text-sm text-zinc-400">Customize who you are and what you represent</p>
          </div>

          {loading || portfolioLoading ? (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-neutral-600/40 to-neutral-800/60 text-white backdrop-blur-xl border border-white/5 animate-pulse aspect-square mb-4">
              <div className="h-10 w-10 rounded-2xl bg-white/20"></div>
              <div className="mt-3 h-4 bg-white/20 rounded w-3/4"></div>
              <div className="mt-2 h-3 bg-white/20 rounded w-1/2"></div>
            </div>
          ) : !user ? (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-600/40 to-cyan-600/40 text-white backdrop-blur-xl border border-white/5 mb-4 aspect-square flex flex-col">
              <div className="h-10 w-10 rounded-2xl bg-white/20 grid place-items-center font-bold text-white text-lg">→</div>
              <div className="mt-auto">
                <div className="text-lg font-semibold text-white">Sign In Required</div>
                <div className="text-sm text-white/90 mt-1">Create your portfolio</div>
              </div>
            </div>
          ) : portfolio ? (
            <div className="mb-4">
              <UnifiedPortfolioCard
                portfolio={portfolio}
                onClick={(id) => handleEditProfile()}
                onShare={(id) => console.log("Share profile:", id)}
                onMore={(id) => console.log("More options:", id)}
              />
            </div>
          ) : (
            <div 
              onClick={handleCreateProfile}
              className="mb-4 relative w-full aspect-square rounded-3xl overflow-hidden cursor-pointer focus:outline-none
                         focus-visible:ring-2 focus-visible:ring-white/70 transition-transform duration-200 hover:scale-[1.01]"
            >
              {/* Card background with same gradient style as UnifiedPortfolioCard */}
              <div className="h-full w-full bg-neutral-900 bg-gradient-to-br from-neutral-600/40 to-neutral-800/60 backdrop-blur-xl p-6 flex flex-col">
                
                {/* Avatar with Plus icon - matching UnifiedPortfolioCard avatar style */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center mb-5">
                  <Plus className="w-8 h-8 text-white/60" />
                </div>

                {/* Identity section - matching UnifiedPortfolioCard structure */}
                <div className="flex flex-col mb-4">
                  <div className="text-white/40 font-bold text-xl leading-tight">Your Name</div>
                  <div className="text-white/30 text-sm leading-snug">Your Title</div>
                </div>

                {/* Contact section - matching UnifiedPortfolioCard contact area */}
                <div className="mt-auto space-y-1.5">
                  <div className="text-white/30 font-medium text-sm">your@email.com</div>
                  <div className="text-white/25 text-sm">Your Location</div>
                </div>

                {/* Footer: handle - matching UnifiedPortfolioCard footer */}
                <div className="mt-4">
                  <div className="inline-block bg-white/15 text-white/40 border border-white/25 px-3 py-1.5 rounded-full text-xs font-medium">
                    @yourhandle
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={!user ? () => router.push("/login") : portfolio ? handleEditProfile : handleCreateProfile}
            className="w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-zinc-700/60 bg-zinc-800/60 text-white"
          >
            {!user ? "Sign In" : portfolio ? "Edit Profile" : "Create New Portfolio"}
          </button>

          {portfolio && user && (
            <button
              onClick={handleUpdateFromResume}
              className="w-full mt-2 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-zinc-800/60 text-white hover:bg-zinc-700/60"
            >
              <Upload className="w-3.5 h-3.5" />
              Update from Resume
            </button>
          )}
        </div>

        {/* AI Assistant */}
        <div className="rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-white">AI Assistant</h3>
          </div>

          <p className="text-sm mb-4 text-zinc-400">
            Get instant help with events, networking, and profile optimization
          </p>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-zinc-100 flex items-center justify-center gap-2 bg-white text-zinc-900"
          >
            {isChatOpen ? "Close Chat" : "Start Chat"}
          </button>

          {isChatOpen && (
            <div className="mt-3 rounded-xl p-3 bg-zinc-800/40 border border-white/5">
              <div className="space-y-2 max-h-48 overflow-y-auto">
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
                  className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 bg-zinc-900/60 text-white border border-zinc-700 placeholder:text-zinc-500"
                />
                <button className="px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-zinc-700/60 bg-zinc-800/60 text-white">
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
