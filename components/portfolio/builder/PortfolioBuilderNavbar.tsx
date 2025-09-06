"use client"

import { Eye, MoreHorizontal } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"

interface PortfolioBuilderNavbarProps {
  onBack?: () => void
  onPreview?: () => void
  onMenu?: () => void
  isPreviewMode?: boolean
}

export default function PortfolioBuilderNavbar({
  onBack,
  onPreview,
  onMenu,
  isPreviewMode = false,
}: PortfolioBuilderNavbarProps) {
  return (
    <div className="flex justify-between items-center mb-6 lg:mb-8 max-w-5xl mx-auto relative px-4 sm:px-6 lg:px-8 pt-6">
      {/* Left: Back button */}
      <div className="flex items-center">{onBack && <BackButton onClick={onBack} />}</div>

      {/* Right: Preview and Menu buttons */}
      <div className="flex items-center gap-2">
        {onPreview && (
          <button
            onClick={onPreview}
            className="w-10 h-10 bg-neutral-800/90 backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-neutral-700/90 transition-colors"
            aria-label="Preview"
          >
            <Eye className="w-5 h-5" />
          </button>
        )}

        {onMenu && (
          <button
            onClick={onMenu}
            className="w-10 h-10 bg-neutral-800/90 backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-neutral-700/90 transition-colors"
            aria-label="Menu"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
