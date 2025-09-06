"use client"

import PortfolioBuilder from "@/components/portfolio/builder/PortfolioBuilder"
import StarterPortfolio from "@/components/starter-portfolio"
import type { ThemeIndex } from "@/lib/theme"

export default function PortfolioCanvas({
  isPreviewMode,
  useStarterTemplate = false,
  activeIdentity,
  onActiveIdentityChange,
  onSavePortfolio, // Added onSavePortfolio prop
}: {
  isPreviewMode: boolean
  useStarterTemplate?: boolean
  activeIdentity?: {
    id: string
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
  onSavePortfolio?: (portfolioData: any) => void // Added onSavePortfolio prop type
}) {
  return (
    <div className={isPreviewMode ? "max-w-5xl mx-auto" : ""}>
      {useStarterTemplate ? (
        <StarterPortfolio
          isPreviewMode={isPreviewMode}
          activeIdentity={activeIdentity}
          onActiveIdentityChange={onActiveIdentityChange}
          onSavePortfolio={onSavePortfolio} // Pass onSavePortfolio to StarterPortfolio
        />
      ) : (
        activeIdentity &&
        onActiveIdentityChange && (
          <PortfolioBuilder
            isPreviewMode={isPreviewMode}
            identity={activeIdentity}
            onIdentityChange={onActiveIdentityChange}
          />
        )
      )}
    </div>
  )
}
