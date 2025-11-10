"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Panel } from "@/components/ui/panel"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { useAuth } from "@/lib/auth"
import type { UnifiedPortfolio } from "@/components/unified-portfolio-card"

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
    const savedData = localStorage.getItem("bea_portfolio_data")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setSavedPortfolio(parsed)
      } catch (error) {
        console.error("Failed to parse saved portfolio data:", error)
      }
    }
  }, [])

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
        <Panel variant="widget" className="p-6 shadow-lg shadow-black/20" style={{ backgroundColor: "#1F1F1F" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
              Your Profile
            </h3>
          </div>

          {loading ? (
            <div className="rounded-3xl p-5 bg-gradient-to-br from-neutral-600/40 to-neutral-800/60 text-white shadow-lg animate-pulse">
              <div className="h-10 w-10 rounded-full bg-white/20"></div>
              <div className="mt-3 h-4 bg-white/20 rounded w-3/4"></div>
              <div className="mt-2 h-3 bg-white/20 rounded w-1/2"></div>
            </div>
          ) : userPortfolio ? (
            <div
              className="h-56 cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => router.push("/portfolio/builder")}
            >
              <UnifiedPortfolioCard
                portfolio={userPortfolio}
                onClick={(id) => router.push("/portfolio/builder")}
                onShare={(id) => console.log("Share profile:", id)}
                onMore={(id) => console.log("More options:", id)}
              />
            </div>
          ) : (
            <div className="rounded-3xl p-5 bg-gradient-to-br from-neutral-600/40 to-neutral-800/60 text-white shadow-lg">
              <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center font-bold text-white">?</div>
              <div className="mt-3 text-base font-semibold text-white">Guest User</div>
              <div className="text-sm text-white/90">Portfolio</div>
              <div className="mt-2 text-xs text-white/90">Sign in to see your profile</div>
            </div>
          )}

          <button
            onClick={() => router.push("/portfolio/builder")}
            className="mt-4 w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
            style={{ backgroundColor: "#393939", color: "#FFFFFF" }}
          >
            Edit Profile
          </button>

          <p className="mt-3 text-xs text-center" style={{ color: "#B3B3B3" }}>
            Customize who you are and what you represent
          </p>
        </Panel>

        <Panel variant="widget" className="p-5 shadow-lg shadow-black/20" style={{ backgroundColor: "#1F1F1F" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
              AI Assistant
            </h3>
          </div>

          <p className="text-xs mb-4" style={{ color: "#B3B3B3" }}>
            Get instant help with events, networking, and profile optimization
          </p>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-80 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#393939", color: "#FFFFFF" }}
          >
            {isChatOpen ? "Close Chat" : "Start Chat"}
          </button>

          {isChatOpen && (
            <div className="mt-4 rounded-lg p-4" style={{ backgroundColor: "#2A2A2A" }}>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                <div className="text-xs" style={{ color: "#E5E5E5" }}>
                  <p className="mb-2">Hi! I'm your AI assistant. I can help you with:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs" style={{ color: "#B3B3B3" }}>
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
                  className="flex-1 px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-1"
                  style={{ backgroundColor: "#1F1F1F", color: "#FFFFFF", border: "1px solid #444" }}
                />
                <button
                  className="px-3 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                  style={{ backgroundColor: "#393939", color: "#FFFFFF" }}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
