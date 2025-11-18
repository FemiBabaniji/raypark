"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Share } from 'lucide-react'
import { THEME_COLOR_OPTIONS, type ThemeIndex } from "@/lib/theme"

export interface UnifiedPortfolio {
  id: string
  name: string
  title: string
  email?: string
  location?: string
  handle?: string
  avatarUrl?: string
  initials?: string
  selectedColor: ThemeIndex
  isLive?: boolean
  isTemplate?: boolean // Added isTemplate property to track template-based portfolios
}

type Props = {
  portfolio: UnifiedPortfolio
  communityId?: string // Added communityId prop to preserve community context when editing
  onClick?: (id: string) => void
  onShare?: (id: string) => void
  onMore?: (id: string) => void
  onChangeColor?: (id: string, colorIndex: ThemeIndex) => void
}

export function UnifiedPortfolioCard({ portfolio, communityId, onClick, onShare, onMore, onChangeColor }: Props) {
  const gradient = THEME_COLOR_OPTIONS[portfolio.selectedColor]?.gradient ?? "from-neutral-600/40 to-neutral-800/60"

  const initials = useMemo(() => {
    if (portfolio.initials && portfolio.initials.trim()) return portfolio.initials.trim().toUpperCase()
    if (!portfolio.name) return "•"
    const parts = portfolio.name.trim().split(/\s+/).slice(0, 2)
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "•"
  }, [portfolio.initials, portfolio.name])

  const handleClick = () => {
    if (!onClick) return
    
    console.log("[v0] Portfolio card clicked - ID:", portfolio.id, "Community:", communityId)
    
    // If we have a communityId, navigate with full context
    if (communityId && typeof window !== 'undefined') {
      window.location.href = `/portfolio/builder?portfolio=${portfolio.id}&community=${communityId}`
    } else {
      onClick(portfolio.id)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
      className="relative w-full aspect-square rounded-3xl overflow-hidden cursor-pointer focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-white/70 transition-transform duration-200 hover:scale-[1.01]"
    >
      {portfolio.isLive && (
        <div className="absolute top-3 left-3 w-3 h-3 bg-green-500 rounded-full z-10 shadow-lg">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        </div>
      )}

      {/* Card background */}
      <div className={`h-full w-full bg-neutral-900 bg-gradient-to-br ${gradient} backdrop-blur-xl p-4 flex flex-col`}>
        {/* Top-right 'More' */}
        <button
          type="button"
          aria-label="More options"
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/70 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onMore?.(portfolio.id)
          }}
        >
          <MoreHorizontal className="w-4 h-4 text-white" />
        </button>

        {/* Avatar */}
        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center mb-3">
          {portfolio.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portfolio.avatarUrl || "/placeholder.svg"}
              alt={`${portfolio.name || "User"} avatar`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-base font-semibold text-white">{initials}</span>
          )}
        </div>

        {/* Identity */}
        <div className="flex flex-col mb-3">
          <div className="text-white font-bold text-base leading-tight line-clamp-2">{portfolio.name}</div>
          <div className="text-white/90 text-xs leading-snug line-clamp-2 mt-0.5">{portfolio.title}</div>
        </div>

        {/* Contact */}
        <div className="mt-auto space-y-1">
          {portfolio.email ? <div className="text-white font-medium text-xs line-clamp-1 break-all">{portfolio.email}</div> : null}
          {portfolio.location ? <div className="text-white/90 text-xs line-clamp-1">{portfolio.location}</div> : null}
        </div>

        {/* Footer: handle */}
        <div className="mt-2">
          {portfolio.handle ? (
            <Badge className="bg-white/15 text-white border-white/25 px-2 py-1 rounded-full text-[10px] font-medium">
              @{portfolio.handle.replace(/^@/, "")}
            </Badge>
          ) : null}
        </div>
      </div>
    </div>
  )
}
