"use client"

import BackButton from "@/components/ui/back-button"
import TopRail from "@/components/layout/top-rail"

interface ExpandedNavbarProps {
  onZoomOut: () => void
  onPreview: () => void
  isPreviewMode: boolean
}

export default function ExpandedNavbar({ onZoomOut, onPreview, isPreviewMode }: ExpandedNavbarProps) {
  return isPreviewMode ? (
    <TopRail left={<BackButton onClick={onPreview} aria-label="Back" />} center={null} right={null} />
  ) : (
    <TopRail
      left={<BackButton onClick={onZoomOut} aria-label="Back to Dashboard" />}
      center={null}
      right={
        <button
          onClick={onPreview}
          className="h-10 px-4 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors text-sm font-medium"
        >
          Preview
        </button>
      }
    />
  )
}
