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
      { color: "#4B5563", size: "w-16 h-16" },
      { color: "#6B7280", size: "w-16 h-12" },
      { color: "#4B5563", size: "w-16 h-12" },
      { color: "#6B7280", size: "w-16 h-16" },
    ],
  },
  "Designer Portfolio": {
    bgColor: "#9333EA",
    widgets: [
      { color: "#A855F7", size: "w-16 h-16" },
      { color: "#EC4899", size: "w-16 h-12" },
      { color: "#C084FC", size: "w-16 h-12" },
      { color: "#A855F7", size: "w-16 h-16" },
    ],
  },
  "Developer Portfolio": {
    bgColor: "#2563EB",
    widgets: [
      { color: "#3B82F6", size: "w-16 h-16" },
      { color: "#06B6D4", size: "w-16 h-12" },
      { color: "#60A5FA", size: "w-16 h-12" },
      { color: "#3B82F6", size: "w-16 h-16" },
    ],
  },
  "Marketing Portfolio": {
    bgColor: "#EA580C",
    widgets: [
      { color: "#F97316", size: "w-16 h-16" },
      { color: "#F59E0B", size: "w-16 h-12" },
      { color: "#FB923C", size: "w-16 h-12" },
      { color: "#F97316", size: "w-16 h-16" },
    ],
  },
  "Founder Portfolio": {
    bgColor: "#059669",
    widgets: [
      { color: "#10B981", size: "w-16 h-16" },
      { color: "#14B8A6", size: "w-16 h-12" },
      { color: "#34D399", size: "w-16 h-12" },
      { color: "#10B981", size: "w-16 h-16" },
    ],
  },
  "Analyst Portfolio": {
    bgColor: "#0891B2",
    widgets: [
      { color: "#06B6D4", size: "w-16 h-16" },
      { color: "#3B82F6", size: "w-16 h-12" },
      { color: "#22D3EE", size: "w-16 h-12" },
      { color: "#06B6D4", size: "w-16 h-16" },
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
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-neutral-950/98 backdrop-blur-2xl border-neutral-800/50">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 pb-6">
            {templates.map((template) => {
              const visual = getVisual(template.name)
              const templateType = getTemplateType(template.name)
              const isHovered = hoveredTemplateId === template.id
              const isSelected = selectedTemplateId === template.id

              return (
                <div key={template.id} className="relative group">
                  <button
                    onClick={() => handleSelect(template.id)}
                    disabled={isCreating}
                    onMouseEnter={() => setHoveredTemplateId(template.id)}
                    onMouseLeave={() => setHoveredTemplateId(null)}
                    className={`relative rounded-xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] duration-300 w-full cursor-pointer ${
                      isCreating ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{ backgroundColor: visual.bgColor }}
                  >
                    <div className="aspect-square relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                      <div className="absolute top-0 left-0 right-0 p-5 sm:p-6 z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col gap-2">
                            <span className="text-white/60 text-xs uppercase tracking-widest font-medium">
                              {templateType}
                            </span>
                            <h3 className="text-white text-xl sm:text-2xl font-semibold leading-tight">
                              {template.name}
                            </h3>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg flex-shrink-0">
                              <div className="w-3 h-3 rounded-full bg-black" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center p-10 sm:p-12">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-[70%]">
                          {visual.widgets.map((widget, i) => (
                            <div
                              key={i}
                              className="w-full aspect-square rounded-lg opacity-80 backdrop-blur-sm transition-all group-hover:opacity-95"
                              style={{ backgroundColor: widget.color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 space-y-3 bg-gradient-to-t from-black/50 to-transparent pt-10 sm:pt-12">
                        <p className="text-white/90 text-sm sm:text-base leading-relaxed line-clamp-2">
                          {template.description || "A clean slate to build your unique portfolio"}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-white/20">
                          <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Template</span>
                          <button
                            className={`px-5 py-2 bg-white text-black rounded-full transition-all text-sm font-medium ${
                              isHovered ? "bg-white shadow-lg" : "bg-white/90"
                            }`}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </button>
                        </div>
                      </div>

                      {isSelected && isCreating && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
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
