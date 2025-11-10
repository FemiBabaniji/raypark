"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
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
  const [isQuickActionsExpanded, setIsQuickActionsExpanded] = useState(false)
  const { user, loading } = useAuth()
  const [savedPortfolio, setSavedPortfolio] = useState<SavedPortfolioData | null>(null)
  const router = useRouter() // Added router for navigation

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
    <div className="fixed top-0 right-12 w-80 h-screen flex flex-col items-center justify-center space-y-4 pl-6">
      {/* org card */}
      <Panel variant="widget" className="p-5 shadow-lg shadow-black/20" style={{ backgroundColor: "#1F1F1F" }}>
        <div className="flex items-center justify-center mb-3">
          <img src="/bea-logo.svg" alt="Black Entrepreneurship Alliance" className="h-14 w-auto" />
        </div>

        {/* nested community stats */}
        <Panel variant="module" className="mt-4 p-4 shadow-lg shadow-black/20" style={{ backgroundColor: "#1F1F1F" }}>
          <div className="text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>
            Community Stats
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span style={{ color: "#B3B3B3" }}>Active Members</span>
              <span style={{ color: "#FFFFFF" }}>247</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#B3B3B3" }}>This Month's Events</span>
              <span style={{ color: "#FFFFFF" }}>8</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#B3B3B3" }}>New Members</span>
              <span style={{ color: "#FFFFFF" }}>12</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#B3B3B3" }}>Founded</span>
              <span style={{ color: "#FFFFFF" }}>2021</span>
            </div>
          </div>
        </Panel>
      </Panel>

      <Panel variant="widget" className="p-5 shadow-lg shadow-black/20" style={{ backgroundColor: "#1F1F1F" }}>
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
          className="mt-2 w-full text-center text-xs hover:text-white transition-colors"
          style={{ color: "#B3B3B3" }}
        >
          edit profile
        </button>

        <div className="mt-3 border-t border-gray-700 pt-3">
          <button
            onClick={() => setIsQuickActionsExpanded(!isQuickActionsExpanded)}
            className="w-full flex items-center justify-between text-xs font-medium mb-2 hover:text-white transition-colors"
            style={{ color: "#B3B3B3" }}
          >
            Quick Actions
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${isQuickActionsExpanded ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`transition-all duration-300 ease-out overflow-hidden ${
              isQuickActionsExpanded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              maxHeight: isQuickActionsExpanded ? "200px" : "0px",
            }}
          >
            <div className="grid grid-cols-2 gap-1.5">
              <button
                className="h-14 rounded-lg font-medium text-xs text-white transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-1"
                style={{ backgroundColor: "#2A2A2A" }}
              >
                <span className="font-semibold">View</span>
                <span className="text-xs opacity-90">Members</span>
              </button>
              <button
                className="h-14 rounded-lg text-xs transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-1"
                style={{ backgroundColor: "#2A2A2A", color: "#FFFFFF" }}
              >
                <span className="font-semibold">Create</span>
                <span className="text-xs opacity-90">Event</span>
              </button>
              <button
                className="h-14 rounded-lg text-xs transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-1"
                style={{ backgroundColor: "#2A2A2A", color: "#FFFFFF" }}
              >
                <span className="font-semibold">Post</span>
                <span className="text-xs opacity-90">Announcement</span>
              </button>
              <button
                className="h-14 rounded-lg text-xs transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-1"
                style={{ backgroundColor: "#2A2A2A", color: "#FFFFFF" }}
              >
                <span className="font-semibold">Invite</span>
                <span className="text-xs opacity-90">Members</span>
              </button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}
