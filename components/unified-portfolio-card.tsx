"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Share, Upload } from "lucide-react"
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
  isTemplate?: boolean
}

type Props = {
  portfolio: UnifiedPortfolio
  onClick?: (id: string) => void
  onShare?: (id: string) => void
  onMore?: (id: string) => void
  onChangeColor?: (id: string, colorIndex: ThemeIndex) => void
  onUpload?: (id: string) => void
}

export function UnifiedPortfolioCard({ portfolio, onClick, onShare, onMore, onUpload }: Props) {
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
      className="relative w-full aspect-[4/5] rounded-[30px] overflow-hidden cursor-pointer focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-white/70 transition-transform duration-200 hover:scale-[1.01]
                 shadow-[0_22px_55px_rgba(0,0,0,0.4)]"
    >
      {onUpload && (
        <button
          type="button"
          aria-label="Upload photo"
          className="absolute top-3 left-3 p-1.5 rounded-md bg-white/10 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 z-10"
          onClick={(e) => {
            e.stopPropagation()
            onUpload(portfolio.id)
          }}
        >
          <Upload className="w-4 h-4 text-white" />
        </button>
      )}

      {portfolio.isLive && (
        <div className="absolute top-3 left-12 w-3 h-3 bg-green-500 rounded-full z-10 shadow-lg">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        </div>
      )}

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

        <div className="flex flex-col mb-6">
          <div className="text-white font-bold text-2xl leading-tight truncate">{portfolio.name}</div>
        </div>

        <div className="relative mx-auto my-auto">
          {/* Circular blur gradient that fades into background */}
          <div className="absolute inset-0 -m-12">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%)`,
                filter: "blur(20px)",
              }}
            />
          </div>

          {/* Avatar container with subtle glow */}
          <div className="relative w-[180px] h-[180px] rounded-full overflow-hidden bg-white/20 flex items-center justify-center ring-2 ring-white/10">
            {portfolio.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={portfolio.avatarUrl || "/placeholder.svg"}
                alt={`${portfolio.name || "User"} avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-7xl font-bold text-white">{initials}</span>
            )}
          </div>
        </div>
        {/* </CHANGE> */}

        <div className="mt-auto space-y-2">
          {portfolio.handle && (
            <Badge className="bg-white/15 text-white border-white/25 px-3 py-1 rounded-full text-xs font-medium">
              @{portfolio.handle.replace(/^@/, "")}
            </Badge>
          )}
          <div className="text-white/90 text-base font-medium leading-snug">{portfolio.title}</div>
        </div>

        <button
          type="button"
          aria-label="Share portfolio"
          className="absolute bottom-3 right-3 p-2 rounded-md bg-white/10 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70"
          onClick={(e) => {
            e.stopPropagation()
            onShare?.(portfolio.id)
          }}
        >
          <Share className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}
