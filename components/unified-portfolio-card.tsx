"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Share } from "lucide-react"
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
}

type Props = {
  portfolio: UnifiedPortfolio
  onClick?: (id: string) => void
  onShare?: (id: string) => void
  onMore?: (id: string) => void
  onChangeColor?: (id: string, colorIndex: ThemeIndex) => void
}

export function UnifiedPortfolioCard({ portfolio, onClick, onShare, onMore, onChangeColor }: Props) {
  const gradient = THEME_COLOR_OPTIONS[portfolio.selectedColor]?.gradient ?? "from-neutral-600/40 to-neutral-800/60"

  const initials = useMemo(() => {
    if (portfolio.initials && portfolio.initials.trim()) return portfolio.initials.trim().toUpperCase()
    if (!portfolio.name) return "•"
    const parts = portfolio.name.trim().split(/\s+/).slice(0, 2)
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "•"
  }, [portfolio.initials, portfolio.name])

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(portfolio.id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.(portfolio.id)}
      className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-white/70 transition-transform duration-200 hover:scale-[1.01]"
    >
      {portfolio.isLive && (
        <div className="absolute top-3 left-3 w-3 h-3 bg-green-500 rounded-full z-10 shadow-lg">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        </div>
      )}

      {/* Card background */}
      <div className={`h-full w-full bg-neutral-900 bg-gradient-to-br ${gradient} backdrop-blur-xl p-6 flex flex-col`}>
        {/* Top-right 'More' */}
        <button
          type="button"
          aria-label="More options"
          className="absolute top-3 right-3 p-1.5 rounded-md bg-white/10 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70"
          onClick={(e) => {
            e.stopPropagation()
            onMore?.(portfolio.id)
          }}
        >
          <MoreHorizontal className="w-4 h-4 text-white" />
        </button>

        {/* Avatar */}
        <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20 flex items-center justify-center mb-4">
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
        <div className="flex flex-col mb-4">
          <div className="text-white font-bold text-xl leading-tight truncate">{portfolio.name}</div>
          <div className="text-white/90 text-sm leading-snug truncate">{portfolio.title}</div>
        </div>

        {/* Contact */}
        <div className="mt-auto space-y-1">
          {portfolio.email ? <div className="text-white font-semibold text-sm truncate">{portfolio.email}</div> : null}
          {portfolio.location ? <div className="text-white/90 text-sm truncate">{portfolio.location}</div> : null}
        </div>

        {/* Footer: handle + share */}
        <div className="mt-4 flex items-center justify-between">
          {portfolio.handle ? (
            <Badge className="bg-white/15 text-white border-white/25 px-3 py-1 rounded-full text-xs font-medium">
              @{portfolio.handle.replace(/^@/, "")}
            </Badge>
          ) : (
            <span />
          )}

          <button
            type="button"
            aria-label="Share portfolio"
            className="p-2 rounded-md bg-white/10 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70"
            onClick={(e) => {
              e.stopPropagation()
              onShare?.(portfolio.id)
            }}
          >
            <Share className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
