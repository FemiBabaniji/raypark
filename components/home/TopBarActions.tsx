"use client"

import { ZoomOut } from "lucide-react"
import BackButton from "@/components/ui/back-button"

export default function TopBarActions({
  onZoomOut,
  onPreview,
  isPreviewMode,
}: {
  onZoomOut: () => void
  onPreview: () => void
  isPreviewMode: boolean
}) {
  if (isPreviewMode) {
    return (
      <div className="absolute top-6 left-6 z-50">
        <BackButton onClick={() => onPreview()} />
      </div>
    )
  }

  return (
    <div className="flex justify-end gap-2 mb-4">
      <button
        onClick={onZoomOut}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors"
      >
        <ZoomOut size={16} />
        Dashboard
      </button>
      <button
        onClick={onPreview}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors"
      >
        Preview Mode
      </button>
    </div>
  )
}
