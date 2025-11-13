"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { useAuth } from "@/lib/auth"
import type { UnifiedPortfolio } from "@/components/unified-portfolio-card"
import { createClient } from "@/lib/supabase/client"

export default function EventsRightColumn() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { user, loading } = useAuth()
  const [portfolio, setPortfolio] = useState<UnifiedPortfolio | null>(null)
  const [portfolioLoading, setPortfolioLoading] = useState(true)
  const [hasPortfolio, setHasPortfolio] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadBEAPortfolio() {
      console.log("[v0] ========== EVENTS PAGE: LOADING PORTFOLIO ==========")
      console.log("[v0] User:", user?.id, user?.email)

      if (!user?.id) {
        console.log("[v0] ❌ No authenticated user, cannot load portfolio")
        setPortfolioLoading(false)
        setHasPortfolio(false)
        return
      }

      setPortfolioLoading(true)

      try {
        const supabase = createClient()

        console.log("[v0] Step 1: Querying portfolios for user:", user.id)
        const { data: portfolios, error: portfoliosError } = await supabase
          .from("portfolios")
          .select("id, name, is_public, community_id, slug")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })

        if (portfoliosError) {
          console.error("[v0] ❌ Database error loading portfolios:", portfoliosError)
          throw portfoliosError
        }

        console.log("[v0] ✅ Found portfolios:", portfolios?.length || 0)
        portfolios?.forEach((p, i) => {
          console.log(`[v0]   Portfolio ${i + 1}:`, p.name, "| community_id:", p.community_id)
        })

        if (!portfolios || portfolios.length === 0) {
          console.log("[v0] No portfolio found for this user")
          setHasPortfolio(false)
          setPortfolio(null)
          setPortfolioLoading(false)
          return
        }

        // Prioritize BEA portfolio (has community_id)
        const beaPortfolio = portfolios.find((p) => p.community_id)
        const targetPortfolio = beaPortfolio || portfolios[0]

        console.log("[v0] Step 2: Selected portfolio:", targetPortfolio.id, "| Is BEA:", !!beaPortfolio)

        // Get page ID
        console.log("[v0] Step 3: Fetching page for portfolio:", targetPortfolio.id)
        const { data: page, error: pageError } = await supabase
          .from("pages")
          .select("id")
          .eq("portfolio_id", targetPortfolio.id)
          .eq("key", "main")
          .maybeSingle()

        if (pageError || !page) {
          console.log("[v0] ⚠️ No page found for portfolio, using basic data")
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

        console.log("[v0] ✅ Page found:", page.id)

        // Get identity widget type
        console.log("[v0] Step 4: Fetching identity widget type")
        const { data: widgetType, error: widgetTypeError } = await supabase
          .from("widget_types")
          .select("id")
          .eq("key", "identity")
          .maybeSingle()

        if (widgetTypeError || !widgetType) {
          console.log("[v0] ⚠️ Identity widget type not found")
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

        console.log("[v0] ✅ Identity widget type found:", widgetType.id)

        // Get identity widget instance
        console.log("[v0] Step 5: Fetching identity widget instance")
        const { data: widget, error: widgetError } = await supabase
          .from("widget_instances")
          .select("props")
          .eq("page_id", page.id)
          .eq("widget_type_id", widgetType.id)
          .maybeSingle()

        if (widgetError || !widget?.props) {
          console.log("[v0] ⚠️ No identity widget found or no props")
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

        console.log("[v0] ✅ Identity widget props loaded:")
        console.log("[v0]   - name:", widget.props.name)
        console.log("[v0]   - handle:", widget.props.handle)
        console.log("[v0]   - selectedColor:", widget.props.selectedColor, typeof widget.props.selectedColor)

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

        console.log(
          "[v0] ✅ PORTFOLIO LOADED FROM DATABASE:",
          loadedPortfolio.name,
          "| Color:",
          loadedPortfolio.selectedColor,
        )
        setHasPortfolio(true)
        setPortfolio(loadedPortfolio)
      } catch (error) {
        console.error("[v0] ❌ Failed to load portfolio from database:", error)
        setHasPortfolio(false)
        setPortfolio(null)
      } finally {
        setPortfolioLoading(false)
        console.log("[v0] ========== PORTFOLIO LOAD COMPLETE ==========")
      }
    }

    loadBEAPortfolio()

    // Listen for portfolio updates
    const handlePortfolioUpdate = () => {
      console.log("[v0] Portfolio update event received, reloading...")
      loadBEAPortfolio()
    }

    window.addEventListener("portfolio-updated", handlePortfolioUpdate)
    window.addEventListener("focus", handlePortfolioUpdate)

    return () => {
      window.removeEventListener("portfolio-updated", handlePortfolioUpdate)
      window.removeEventListener("focus", handlePortfolioUpdate)
    }
  }, [user?.id])

  const handleEditProfile = () => {
    router.push("/portfolio/builder")
  }

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-12 w-80 pl-6">
      <div className="space-y-6">
        {/* Profile editing card */}
        <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-1 text-white">Your Profile</h3>
            <p className="text-xs text-zinc-400">Customize who you are and what you represent</p>
          </div>

          {loading || portfolioLoading ? (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-neutral-600/40 to-neutral-800/60 text-white shadow-lg animate-pulse">
              <div className="h-10 w-10 rounded-full bg-white/20"></div>
              <div className="mt-3 h-4 bg-white/20 rounded w-3/4"></div>
              <div className="mt-2 h-3 bg-white/20 rounded w-1/2"></div>
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
            <div className="rounded-2xl p-4 bg-gradient-to-br from-neutral-600/40 to-neutral-800/60 text-white shadow-lg mb-4">
              <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center font-bold text-white">?</div>
              <div className="mt-3 text-base font-semibold text-white">No Profile Yet</div>
              <div className="text-sm text-white/90">Create your portfolio</div>
            </div>
          )}

          <button
            onClick={handleEditProfile}
            className="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-80 bg-zinc-800/60 text-white"
          >
            {hasPortfolio ? "Edit Profile" : "Create New Profile"}
          </button>
        </div>

        {/* AI Assistant */}
        <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
          </div>

          <p className="text-xs mb-4 text-zinc-400">
            Get instant help with events, networking, and profile optimization
          </p>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-80 flex items-center justify-center gap-2 bg-zinc-800/60 text-white"
          >
            {isChatOpen ? "Close Chat" : "Start Chat"}
          </button>

          {isChatOpen && (
            <div className="mt-4 rounded-lg p-4 bg-zinc-800/40">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                <div className="text-xs text-white">
                  <p className="mb-2">Hi! I'm your AI assistant. I can help you with:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-zinc-400">
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
                  className="flex-1 px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600 bg-zinc-900/60 text-white border border-zinc-700 placeholder:text-zinc-500"
                />
                <button className="px-3 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80 bg-zinc-800/60 text-white">
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
