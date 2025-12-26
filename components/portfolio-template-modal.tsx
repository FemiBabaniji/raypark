"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { PortfolioTemplate } from "@/lib/template-service"

interface PortfolioTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (templateId: string) => void
  communityId?: string
}

const templateVisuals: Record<string, { bgColor: string; widgets: { color: string; size: string }[] }> = {
  "Blank Portfolio": {
    bgColor: "#374151",
    widgets: [
      { color: "#4B5563", size: "w-20 h-20" },
      { color: "#6B7280", size: "w-20 h-16" },
      { color: "#4B5563", size: "w-20 h-16" },
      { color: "#6B7280", size: "w-20 h-20" },
    ],
  },
  "Designer Portfolio": {
    bgColor: "#9333EA",
    widgets: [
      { color: "#A855F7", size: "w-20 h-20" },
      { color: "#EC4899", size: "w-20 h-16" },
      { color: "#C084FC", size: "w-20 h-16" },
      { color: "#A855F7", size: "w-20 h-20" },
    ],
  },
  "Developer Portfolio": {
    bgColor: "#2563EB",
    widgets: [
      { color: "#3B82F6", size: "w-20 h-20" },
      { color: "#06B6D4", size: "w-20 h-16" },
      { color: "#60A5FA", size: "w-20 h-16" },
      { color: "#3B82F6", size: "w-20 h-20" },
    ],
  },
  "Marketing Portfolio": {
    bgColor: "#EA580C",
    widgets: [
      { color: "#F97316", size: "w-20 h-20" },
      { color: "#F59E0B", size: "w-20 h-16" },
      { color: "#FB923C", size: "w-20 h-16" },
      { color: "#F97316", size: "w-20 h-20" },
    ],
  },
  "Founder Portfolio": {
    bgColor: "#059669",
    widgets: [
      { color: "#10B981", size: "w-20 h-20" },
      { color: "#14B8A6", size: "w-20 h-16" },
      { color: "#34D399", size: "w-20 h-16" },
      { color: "#10B981", size: "w-20 h-20" },
    ],
  },
  "Analyst Portfolio": {
    bgColor: "#0891B2",
    widgets: [
      { color: "#06B6D4", size: "w-20 h-20" },
      { color: "#3B82F6", size: "w-20 h-16" },
      { color: "#22D3EE", size: "w-20 h-16" },
      { color: "#06B6D4", size: "w-20 h-20" },
    ],
  },
}

export function PortfolioTemplateModal({
  isOpen,
  onClose,
  onSelectTemplate,
  communityId,
}: PortfolioTemplateModalProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [hoveredTemplateId, setHoveredTemplateId] = useState<string | null>(null)
  const [templates, setTemplates] = useState<PortfolioTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchTemplates()
    }
  }, [isOpen, communityId])

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (communityId) {
        params.append("communityId", communityId)
      }

      const response = await fetch(`/api/templates?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = async (templateId: string) => {
    if (isCreating) return

    setIsCreating(true)
    setSelectedTemplateId(templateId)

    await onSelectTemplate(templateId)

    setIsCreating(false)
  }

  const getVisual = (name: string) => {
    return templateVisuals[name] || templateVisuals["Blank Portfolio"]
  }

  const getTemplateType = (name: string) => {
    if (name.includes("Designer")) return "CREATIVE"
    if (name.includes("Developer")) return "TECHNICAL"
    if (name.includes("Marketing")) return "MARKETING"
    if (name.includes("Founder")) return "ENTREPRENEURIAL"
    if (name.includes("Analyst")) return "ANALYTICAL"
    return "CUSTOM"
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isCreating) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-5xl bg-neutral-950/98 backdrop-blur-2xl border-neutral-800/50">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-white mb-2">Choose Your Template</DialogTitle>
          <p className="text-neutral-400 text-base">Pick a starting point for your portfolio</p>
        </DialogHeader>

        {isCreating && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-50">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-neutral-700 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <p className="text-base text-white font-medium">Creating your portfolio...</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 mt-8 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-950">
            {templates.map((template) => {
              const visual = getVisual(template.name)
              const templateType = getTemplateType(template.name)
              const isHovered = hoveredTemplateId === template.id
              const isSelected = selectedTemplateId === template.id

              return (
                <div key={template.id} className="relative group flex-shrink-0 w-[280px] snap-center">
                  <button
                    onClick={() => handleSelect(template.id)}
                    disabled={isCreating}
                    onMouseEnter={() => setHoveredTemplateId(template.id)}
                    onMouseLeave={() => setHoveredTemplateId(null)}
                    className={`relative rounded-xl p-6 shadow-lg transition-all hover:translate-y-[-2px] duration-300 h-[280px] flex flex-col w-full cursor-pointer ${
                      isCreating ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{ backgroundColor: visual.bgColor }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl pointer-events-none" />

                    <div className="relative z-10 flex items-start justify-between mb-auto">
                      <div className="flex flex-col gap-2">
                        <span className="text-white/60 text-[10px] uppercase tracking-widest font-medium">
                          {templateType}
                        </span>
                        <h3 className="text-white text-xl font-medium leading-tight pr-4">{template.name}</h3>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-lg">
                          <div className="w-2.5 h-2.5 rounded-full bg-black" />
                        </div>
                      )}
                    </div>

                    <div className="relative z-10 flex items-center justify-center gap-2 my-4">
                      <div className="flex flex-col gap-2">
                        {visual.widgets.slice(0, 2).map((widget, i) => (
                          <div
                            key={i}
                            className={`${widget.size} ${widget.color} rounded-lg opacity-80 backdrop-blur-sm`}
                          />
                        ))}
                      </div>
                      <div className="flex flex-col gap-2">
                        {visual.widgets.slice(2, 4).map((widget, i) => (
                          <div
                            key={i}
                            className={`${widget.size} ${widget.color} rounded-lg opacity-80 backdrop-blur-sm`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="relative z-10 space-y-3">
                      <p className="text-white/80 text-xs leading-relaxed line-clamp-2">
                        {template.description || "A clean slate to build your unique portfolio"}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-white/60 text-[10px] uppercase tracking-wider">Template</span>
                        <button
                          className={`px-4 py-1.5 bg-white text-black rounded-full transition-colors text-xs font-medium ${
                            isHovered ? "bg-white" : "bg-white/90"
                          }`}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </button>
                      </div>
                    </div>

                    {isSelected && isCreating && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-xl">
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
