"use client"

import { ArrowLeft, Plus } from "lucide-react"
import BackButton from "@/components/ui/back-button"

interface PortfolioBuilderNavProps {
  onBack: () => void
  onExport: () => void
  onAddWidget: () => void
  isPreviewMode?: boolean
}

export default function PortfolioBuilderNav({
  onBack,
  onExport,
  onAddWidget,
  isPreviewMode = false,
}: PortfolioBuilderNavProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <BackButton onClick={onBack} icon={ArrowLeft} />

      {!isPreviewMode && (
        <div className="flex gap-3">
          <button
            onClick={onExport}
            className="px-4 h-10 bg-neutral-800/90 backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-neutral-700/90 transition-colors text-sm font-medium"
          >
            Export
          </button>
          <button
            onClick={onAddWidget}
            className="px-4 h-10 bg-neutral-800/90 backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-neutral-700/90 transition-colors text-sm font-medium gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Widget
          </button>
        </div>
      )}
    </div>
  )
}
