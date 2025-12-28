"use client"

import PortfolioBuilder from "@/components/portfolio/builder/PortfolioBuilder"
import { BackButton } from "@/components/ui/back-button"
import type { ThemeIndex } from "@/lib/theme"

export default function PortfolioCanvas({
  isPreviewMode,
  imagesOnlyMode = false,
  useStarterTemplate = false,
  activeIdentity,
  onActiveIdentityChange,
  onSavePortfolio,
  isLive = false,
  onToggleLive,
  onBack,
  communityId,
}: {
  isPreviewMode: boolean
  imagesOnlyMode?: boolean
  useStarterTemplate?: boolean
  activeIdentity?: {
    id: string | null
    name: string
    handle: string
    avatarUrl?: string
    selectedColor: ThemeIndex
  }
  onActiveIdentityChange?: (
    next: Partial<{
      name: string
      handle: string
      avatarUrl?: string
      selectedColor: ThemeIndex
    }>,
  ) => void
  onSavePortfolio?: (portfolioData: any) => void
  isLive?: boolean
  onToggleLive?: (isLive: boolean) => void
  onBack?: () => void
  communityId?: string | null
}) {
  return (
    <div className={isPreviewMode ? "max-w-5xl mx-auto" : ""}>
      {!isPreviewMode && onBack && (
        <div className="absolute top-6 left-6 z-10">
          <BackButton
            onClick={onBack}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Back to portfolio grid"
          />
        </div>
      )}

      {activeIdentity && onActiveIdentityChange && (
        <PortfolioBuilder
          isPreviewMode={isPreviewMode}
          imagesOnlyMode={imagesOnlyMode}
          identity={activeIdentity}
          onIdentityChange={onActiveIdentityChange}
          onSavePortfolio={onSavePortfolio}
          isLive={isLive}
          onToggleLive={onToggleLive}
          communityId={communityId}
        />
      )}
    </div>
  )
}
