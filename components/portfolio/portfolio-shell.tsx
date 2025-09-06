// components/portfolio/PortfolioShell.tsx
"use client"

import type React from "react"
import Image from "next/image"
import { BackButton } from "@/components/ui/back-button"

type PortfolioShellProps = {
  title: string // e.g. "jenny wilson."
  logoSrc?: string // e.g. "/logo.svg"
  isPreviewMode?: boolean // controls right-side UI if you want
  onBack?: () => void // show back button when provided
  rightSlot?: React.ReactNode // e.g. the (+) dropdown trigger
  children: React.ReactNode // your content area
  className?: string // optional wrapper class
}

export function LogoPill({ src = "/logo.svg" }: { src?: string }) {
  return (
    <div className="relative px-6 py-3 rounded-2xl bg-gradient-to-r from-neutral-800/40 via-neutral-700/60 to-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-50" />
      {/* Use next/image if your project is already using it, otherwise <img> is fine */}
      <Image
        src={src || "/placeholder.svg"}
        alt="Network / Org Logo"
        width={96}
        height={32}
        className="h-8 w-auto relative z-10 opacity-90 hover:opacity-100 transition-opacity"
      />
    </div>
  )
}

export default function PortfolioShell({
  title,
  logoSrc = "/logo.svg",
  isPreviewMode = false,
  onBack,
  rightSlot,
  children,
  className,
}: PortfolioShellProps) {
  return (
    <div className={`min-h-screen bg-neutral-950 text-white ${className ?? ""}`}>
      {/* Top Nav (consistent across all portfolios) */}
      <div className="flex justify-between items-center mb-6 lg:mb-8 max-w-5xl mx-auto relative px-4 sm:px-6 lg:px-8 pt-6">
        {/* Left: Title (or Back if supplied) */}
        <div className="flex items-center gap-3">
          {onBack ? <BackButton onClick={onBack} /> : null}
          <h1 className="text-lg font-medium">{title}</h1>
        </div>

        {/* Center: Logo pill */}
        <div className="flex-1 flex justify-center">
          <LogoPill src={logoSrc} />
        </div>

        {/* Right: configurable slot (e.g., + button). Hide when preview if you want */}
        <div className="min-w-[40px] flex justify-end">{!isPreviewMode ? rightSlot : null}</div>
      </div>

      {/* Content area — two columns by default (matches your pages) */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {children}
      </div>
    </div>
  )
}
