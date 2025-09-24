"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Panel } from "@/components/ui/panel"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { useAuth } from "@/lib/auth"
import type { UnifiedPortfolio } from "@/components/unified-portfolio-card"

export default function EventsRightColumn() {
  const [isQuickActionsExpanded, setIsQuickActionsExpanded] = useState(false)
  const { user, loading } = useAuth()

  const userPortfolio: UnifiedPortfolio | null = user
    ? {
        id: user.id,
        name: user.name,
        title: user.role || "Portfolio",
        email: user.email,
        location: "Location", // Default location since not in auth
        handle: user.name.toLowerCase().replace(/\s+/g, ""),
        avatarUrl: user.imageUrl,
        initials: user.name.slice(0, 2).toUpperCase(),
        selectedColor: 3, // Default orange theme
        isLive: true,
      }
    : null

  return (
    <div className="fixed top-14 right-6 w-80 space-y-6 h-[calc(100vh-3.5rem)] overflow-y-auto pl-6">
      {/* org card */}
      <Panel variant="widget" className="p-6" style={{ backgroundColor: "#1F1F1F", boxShadow: "none" }}>
        <div className="flex items-center justify-center mb-4">
          <img src="/bea-logo.svg" alt="Black Entrepreneurship Alliance" className="h-16 w-auto" />
        </div>

        {/* nested community stats */}
        <Panel variant="module" className="mt-6 p-5" style={{ backgroundColor: "#1F1F1F", boxShadow: "none" }}>
          <div className="text-sm font-medium mb-3" style={{ color: "#FFFFFF" }}>
            Community Stats
          </div>
          <div className="space-y-2 text-sm">
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

      <Panel variant="widget" className="p-6" style={{ backgroundColor: "#1F1F1F", boxShadow: "none" }}>
        {loading ? (
          <div className="rounded-3xl p-5 bg-gradient-to-br from-neutral-600/40 to-neutral-800/60 text-white shadow-lg animate-pulse">
            <div className="h-10 w-10 rounded-full bg-white/20"></div>
            <div className="mt-3 h-4 bg-white/20 rounded w-3/4"></div>
            <div className="mt-2 h-3 bg-white/20 rounded w-1/2"></div>
          </div>
        ) : userPortfolio ? (
          <div className="h-64">
            <UnifiedPortfolioCard
              portfolio={userPortfolio}
              onClick={(id) => console.log("View profile:", id)}
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

        <div className="mt-3 text-center text-xs" style={{ color: "#B3B3B3" }}>
          edit profile
        </div>

        <div className="mt-4 border-t border-gray-700 pt-4">
          <button
            onClick={() => setIsQuickActionsExpanded(!isQuickActionsExpanded)}
            className="w-full flex items-center justify-between text-xs font-medium mb-3 hover:text-white transition-colors"
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
            <div className="grid grid-cols-2 gap-2">
              <button
                className="h-16 rounded-lg font-medium text-xs text-white transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-1"
                style={{ backgroundColor: "#2A2A2A" }}
              >
                <span className="font-semibold">View</span>
                <span className="text-xs opacity-90">Members</span>
              </button>
              <button
                className="h-16 rounded-lg text-xs transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-1"
                style={{ backgroundColor: "#2A2A2A", color: "#FFFFFF" }}
              >
                <span className="font-semibold">Create</span>
                <span className="text-xs opacity-90">Event</span>
              </button>
              <button
                className="h-16 rounded-lg text-xs transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-1"
                style={{ backgroundColor: "#2A2A2A", color: "#FFFFFF" }}
              >
                <span className="font-semibold">Post</span>
                <span className="text-xs opacity-90">Announcement</span>
              </button>
              <button
                className="h-16 rounded-lg text-xs transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-1"
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
