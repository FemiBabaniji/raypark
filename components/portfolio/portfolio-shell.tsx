// components/portfolio/PortfolioShell.tsx
"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { BackButton } from "@/components/ui/back-button"
import type { StaticImageData } from "next/image"

type PortfolioShellProps = {
  title: string // e.g. "jenny wilson."
  logoSrc?: string | StaticImageData // e.g. "/logo.svg"
  logoHref?: string // Added logoHref prop to pass to LogoPill
  isPreviewMode?: boolean // controls right-side UI if you want
  onBack?: () => void // show back button when provided
  rightSlot?: React.ReactNode // e.g. the (+) dropdown trigger
  children: React.ReactNode // your content area
  className?: string // optional wrapper class
}

export function LogoPill({
  src = "/logo.svg",
  href,
}: {
  src?: string | StaticImageData
  href?: string
}) {
  const pillContent = (
    <div className="relative px-6 py-3 rounded-2xl bg-gradient-to-r from-neutral-800/40 via-neutral-700/60 to-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-50" />
      <Image
        src={src || "/placeholder.svg"}
        alt="Network / Org Logo"
        width={96}
        height={32}
        className="h-8 w-auto relative z-10 opacity-90 hover:opacity-100 transition-opacity"
        priority
      />
    </div>
  )

  return href ? (
    <Link href={href} className="block">
      {pillContent}
    </Link>
  ) : (
    pillContent
  )
}

export default function PortfolioShell({
  title,
  logoSrc = "/logo.svg",
  logoHref, // Added logoHref prop to pass to LogoPill
  isPreviewMode = false,
  onBack,
  rightSlot,
  children,
  className,
}: PortfolioShellProps & { logoHref?: string }) {
  return (
    <div className={`min-h-screen relative text-white ${className ?? ""}`} style={{ backgroundColor: "oklch(0.18 0 0)" }}>
      {/* Apple-style gradient orbs background layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large blue gradient orb - top left */}
        <div 
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, #4169E1 0%, transparent 70%)",
          }}
        />
        
        {/* Purple gradient orb - top right */}
        <div 
          className="absolute -top-1/3 right-0 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
          style={{
            background: "radial-gradient(circle, #7B68EE 0%, transparent 70%)",
          }}
        />
        
        {/* Blue gradient orb - middle left */}
        <div 
          className="absolute top-1/2 -left-1/4 w-[700px] h-[700px] rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #4169E1 0%, transparent 70%)",
          }}
        />
        
        {/* Purple/Violet gradient orb - bottom right */}
        <div 
          className="absolute bottom-0 right-1/4 w-[900px] h-[900px] rounded-full opacity-25 blur-3xl"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
          }}
        />
        
        {/* Smaller accent blue orb - bottom left */}
        <div 
          className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, #0EA5E9 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content layer with relative positioning to appear above gradient */}
      <div className="relative z-10">
        {/* Top Nav (consistent across all portfolios) */}
        <div className="flex justify-between items-center mb-6 lg:mb-8 max-w-5xl mx-auto relative px-4 sm:px-6 lg:px-8 pt-6">
          {/* Left: Title (or Back if supplied) */}
          <div className="flex items-center gap-3">
            {onBack ? <BackButton onClick={onBack} /> : null}
            <h1 className="text-lg font-medium">{title}</h1>
          </div>

          {/* Center: Logo pill */}
          <div className="flex-1 flex justify-center">
            <LogoPill src={logoSrc} href={logoHref} />
          </div>

          {/* Right: configurable slot (e.g., + button). Hide when preview if you want */}
          <div className="min-w-[40px] flex justify-end">{!isPreviewMode ? rightSlot : null}</div>
        </div>

        {/* Content area — two columns by default (matches your pages) */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {children}
        </div>
      </div>
    </div>
  )
}
