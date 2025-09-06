"use client"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Palette, MoreHorizontal, Share } from "lucide-react"
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
}

type Props = {
  portfolio: UnifiedPortfolio
  onClick?: (id: string) => void
  onShare?: (id: string) => void
  onMore?: (id: string) => void
  onChangeColor?: (id: string, colorIndex: ThemeIndex) => void
}

export function UnifiedPortfolioCard({ portfolio, onClick, onShare, onMore, onChangeColor }: Props) {
  const [openPicker, setOpenPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!pickerRef.current) return
      if (!pickerRef.current.contains(e.target as Node)) setOpenPicker(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  const gradient = THEME_COLOR_OPTIONS[portfolio.selectedColor]?.gradient ?? "from-neutral-500/40 to-neutral-700/60"

  return (
    <div
      className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer"
      onClick={() => onClick?.(portfolio.id)}
    >
      {/* Card background */}
      <div className={`h-full w-full bg-gradient-to-br ${gradient} backdrop-blur-xl p-4 flex flex-col`}>
        {/* Top bar: actions */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-black/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-white/90" />
            <span className="text-[10px] text-white/90">{portfolio.handle}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-black/25 hover:bg-black/35"
              onClick={(e) => {
                e.stopPropagation()
                setOpenPicker((s) => !s)
              }}
              aria-label="Change card color"
            >
              <Palette className="w-4 h-4 text-white" />
            </button>

            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-black/25 hover:bg-black/35"
              onClick={(e) => {
                e.stopPropagation()
                onShare?.(portfolio.id)
              }}
              aria-label="Share"
            >
              <Share className="w-4 h-4 text-white" />
            </button>
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-black/25 hover:bg-black/35"
              onClick={(e) => {
                e.stopPropagation()
                onMore?.(portfolio.id)
              }}
              aria-label="More"
            >
              <MoreHorizontal className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Avatar / Title */}
        <div className="mt-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
            {portfolio.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={portfolio.avatarUrl || "/placeholder.svg"}
                alt={portfolio.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-white">{portfolio.initials}</span>
            )}
          </div>
          <div>
            <div className="text-white font-semibold leading-tight">{portfolio.name}</div>
            <div className="text-white/80 text-xs">{portfolio.title}</div>
          </div>
        </div>

        {/* Contact info */}
        <div className="flex-1 flex flex-col justify-center space-y-1 text-center mb-4">
          <div className="text-white text-xs font-medium">{portfolio.email}</div>
          <div className="text-white/90 text-xs">{portfolio.location}</div>
        </div>

        {/* Footer badge */}
        <div className="mt-auto">
          <Badge className="bg-white/15 text-white border-white/25 hover:bg-white/25 px-3 py-1 rounded-full text-xs font-medium">
            {portfolio.handle}
          </Badge>
        </div>
      </div>

      {openPicker && (
        <div
          ref={pickerRef}
          className="absolute top-2 right-2 z-50 bg-neutral-900/95 border border-white/10 rounded-2xl p-3 backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-4 gap-3">
            {THEME_COLOR_OPTIONS.map((c, idx) => {
              const selected = portfolio.selectedColor === idx
              return (
                <button
                  key={c.name}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.gradient} hover:ring-2 hover:ring-white/60 transition-all ${
                    selected ? "ring-2 ring-white" : ""
                  }`}
                  onClick={() => {
                    onChangeColor?.(portfolio.id, idx as ThemeIndex)
                    setOpenPicker(false)
                  }}
                  aria-label={`Set color ${c.name}`}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
