"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { useAuth } from "@/lib/auth"
import type { UnifiedPortfolio } from "@/components/unified-portfolio-card"
import { createClient } from "@/lib/supabase/client"

interface SavedPortfolioData {
  name: string
  title: string
  email: string
  location: string
  handle: string
  industry: string
  skills: string[]
  goals: string[]
  linkedinUrl: string
  websiteUrl: string
  twitterUrl: string
  avatarUrl: string
  selectedColor: number
  isLive: boolean
}

export default function EventsRightColumn() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { user, loading } = useAuth()
  const [savedPortfolio, setSavedPortfolio] = useState<SavedPortfolioData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadPortfolioData = async () => {
      if (user?.id) {
        try {
          const supabase = createClient()

          // Get BEA portfolio from database
          const { data: portfolios } = await supabase
            .from("portfolios")
            .select("id, name, is_public, community_id")
            .eq("user_id", user.id)
            .not("community_id", "is", null) // Get BEA portfolios
            .order("updated_at", { ascending: false })
            .limit(1)

          if (portfolios && portfolios.length > 0) {
            const portfolio = portfolios[0]

            // Get identity widget data
            const { data: page } = await supabase
              .from("pages")
              .select("id")
              .eq("portfolio_id", portfolio.id)
              .eq("key", "main")
              .maybeSingle()

            if (page) {
              const { data: widgetType } = await supabase
                .from("widget_types")
                .select("id")
                .eq("key", "identity")
                .maybeSingle()

              if (widgetType) {
                const { data: widget } = await supabase
                  .from("widget_instances")
                  .select("props")
                  .eq("page_id", page.id)
                  .eq("widget_type_id", widgetType.id)
                  .maybeSingle()

                if (widget?.props) {
                  console.log("[v0] EventsRightColumn loaded from database:", widget.props)
                  setSavedPortfolio({
                    name: widget.props.name || portfolio.name,
                    handle: widget.props.handle || "",
                    avatarUrl: widget.props.avatarUrl,
                    selectedColor: typeof widget.props.selectedColor === "number" ? widget.props.selectedColor : 3,
                    isLive: portfolio.is_public,
                    // Add default values for required fields
                    title: widget.props.title || "Portfolio",
                    email: widget.props.email || user.email,
                    location: widget.props.location || "Location",
                    industry: "",
                    skills: [],
                    goals: [],
                    linkedinUrl: widget.props.linkedin || "",
                    websiteUrl: "",
                    twitterUrl: widget.props.twitter || "",
                  })
                  return
                }
              }
            }
          }
        } catch (error) {
          console.error("[v0] Failed to load from database, falling back to localStorage:", error)
        }
      }

      // Fallback to localStorage
      const savedData = localStorage.getItem("bea_portfolio_data")
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          console.log("[v0] EventsRightColumn loaded from localStorage:", parsed)
          setSavedPortfolio(parsed)
        } catch (error) {
          console.error("Failed to parse saved portfolio data:", error)
        }
      }
    }

    loadPortfolioData()

    // Listen for storage events (when localStorage changes in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "bea_portfolio_data") {
        loadPortfolioData()
      }
    }

    // Listen for focus events (when user returns to this page)
    const handleFocus = () => {
      loadPortfolioData()
    }

    // Listen for custom event when portfolio is updated
    const handlePortfolioUpdate = () => {
      loadPortfolioData()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("portfolio-updated", handlePortfolioUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("portfolio-updated", handlePortfolioUpdate)
    }
  }, [user?.id]) // Add user.id as dependency

  const handleEditProfile = () => {
    router.push("/portfolio/builder")
  }

  const userPortfolio: UnifiedPortfolio | null = savedPortfolio
    ? {
        id: user?.id || "saved-portfolio",
        name: savedPortfolio.name,
        title: savedPortfolio.title,
        email: savedPortfolio.email,
        location: savedPortfolio.location,
        handle: savedPortfolio.handle,
        avatarUrl: savedPortfolio.avatarUrl || undefined,
        selectedColor: savedPortfolio.selectedColor,
        isLive: savedPortfolio.isLive,
      }
    : user
      ? {
          id: user.id,
          name: user.name,
          title: user.role || "Portfolio",
          email: user.email,
          location: "Location",
          handle: user.name.toLowerCase().replace(/\s+/g, ""),
          avatarUrl: user.imageUrl,
          initials: user.name.slice(0, 2).toUpperCase(),
          selectedColor: 3,
          isLive: true,
        }
      : null

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-12 w-80 pl-6">
      <div className="space-y-6">
        {/* Profile editing card */}
        <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-1 text-white">Your Profile</h3>
            <p className="text-xs text-zinc-400">
              {user ? "Customize who you are and what you represent" : "Sign in to save your profile permanently"}
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-neutral-600/40 to-neutral-800/60 text-white shadow-lg animate-pulse">
              <div className="h-10 w-10 rounded-full bg-white/20"></div>
              <div className="mt-3 h-4 bg-white/20 rounded w-3/4"></div>
              <div className="mt-2 h-3 bg-white/20 rounded w-1/2"></div>
            </div>
          ) : userPortfolio ? (
            <div className="mb-4">
              <UnifiedPortfolioCard
                portfolio={userPortfolio}
                onClick={(id) => handleEditProfile()}
                onShare={(id) => console.log("Share profile:", id)}
                onMore={(id) => console.log("More options:", id)}
              />
            </div>
          ) : (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-neutral-600/40 to-neutral-800/60 text-white shadow-lg mb-4">
              <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center font-bold text-white">?</div>
              <div className="mt-3 text-base font-semibold text-white">Guest User</div>
              <div className="text-sm text-white/90">Portfolio</div>
              <div className="mt-2 text-xs text-white/90">Sign in to see your profile</div>
            </div>
          )}

          <button
            onClick={handleEditProfile}
            className="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-80 bg-zinc-800/60 text-white"
          >
            {user ? "Edit Profile" : "Create Profile"}
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
