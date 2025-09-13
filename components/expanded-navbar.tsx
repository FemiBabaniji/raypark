"use client"

import BackButton from "@/components/ui/back-button"
import TopRail from "@/components/ui/top-rail"

interface ExpandedNavbarProps {
  onZoomOut: () => void
  onPreview: () => void
  isPreviewMode: boolean
}

export default function ExpandedNavbar({ onZoomOut, onPreview, isPreviewMode }: ExpandedNavbarProps) {
  if (isPreviewMode) {
    return <TopRail leftSlot={<BackButton onClick={() => onPreview()} />} />
  }

  return (
    <TopRail
      leftSlot={<BackButton onClick={onZoomOut} aria-label="Back to Dashboard" />}
      rightSlot={
        <button
          onClick={onPreview}
          className="px-4 py-2 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors text-sm font-medium"
        >
          Preview
        </button>
      }
    />
  )
}
