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

const templateVisuals: Record<string, { gradient: string; pattern: string }> = {
  "Blank Portfolio": {
    gradient: "from-neutral-800 to-neutral-900",
    pattern: "Minimal",
  },
  "Designer Portfolio": {
    gradient: "from-purple-900/40 via-pink-900/40 to-neutral-900",
    pattern: "Creative",
  },
  "Developer Portfolio": {
    gradient: "from-blue-900/40 via-cyan-900/40 to-neutral-900",
    pattern: "Technical",
  },
  "Marketing Portfolio": {
    gradient: "from-orange-900/40 via-amber-900/40 to-neutral-900",
    pattern: "Dynamic",
  },
  "Founder Portfolio": {
    gradient: "from-emerald-900/40 via-teal-900/40 to-neutral-900",
    pattern: "Bold",
  },
  "Analyst Portfolio": {
    gradient: "from-cyan-900/40 via-blue-900/40 to-neutral-900",
    pattern: "Structured",
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 pb-2 max-h-[60vh] overflow-y-auto pr-2">
            {templates.map((template) => {
              const visual = getVisual(template.name)
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template.id)}
                  disabled={isCreating}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                    selectedTemplateId === template.id ? "ring-2 ring-white/80 scale-[0.98]" : "hover:scale-[1.02]"
                  } ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} transition-transform duration-500 group-hover:scale-105`}
                    >
                      {/* Pattern overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white/5 text-7xl font-bold select-none">{visual.pattern}</div>
                      </div>

                      {/* Selection indicator */}
                      {selectedTemplateId === template.id && (
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                          <div className="w-3 h-3 rounded-full bg-neutral-900" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-neutral-900/80 backdrop-blur-sm p-5 border-t border-neutral-800/50">
                    <h3 className="text-white font-semibold text-lg mb-2 text-left">{template.name}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed text-left line-clamp-2">
                      {template.description || "A clean slate to build your unique portfolio"}
                    </p>
                  </div>

                  {selectedTemplateId === template.id && isCreating && (
                    <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
