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

const templateVisuals: Record<string, { color: string; widgets: string[] }> = {
  "Blank Portfolio": {
    color: "bg-neutral-800",
    widgets: ["bg-neutral-700", "bg-neutral-600", "bg-neutral-700"],
  },
  "Designer Portfolio": {
    color: "bg-purple-600",
    widgets: ["bg-purple-500", "bg-pink-500", "bg-purple-400"],
  },
  "Developer Portfolio": {
    color: "bg-blue-600",
    widgets: ["bg-blue-500", "bg-cyan-500", "bg-blue-400"],
  },
  "Marketing Portfolio": {
    color: "bg-orange-600",
    widgets: ["bg-orange-500", "bg-amber-500", "bg-orange-400"],
  },
  "Founder Portfolio": {
    color: "bg-emerald-600",
    widgets: ["bg-emerald-500", "bg-teal-500", "bg-emerald-400"],
  },
  "Analyst Portfolio": {
    color: "bg-cyan-600",
    widgets: ["bg-cyan-500", "bg-blue-500", "bg-cyan-400"],
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 pb-2 max-h-[60vh] overflow-y-auto pr-2">
            {templates.map((template) => {
              const visual = getVisual(template.name)
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template.id)}
                  disabled={isCreating}
                  className={`group relative overflow-hidden rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 text-left ${
                    selectedTemplateId === template.id ? "ring-2 ring-white/80" : "hover:bg-neutral-900/40"
                  } ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="relative aspect-square overflow-hidden bg-neutral-900/60 rounded-t-xl">
                    <div className={`absolute inset-0 ${visual.color} p-6 flex items-center justify-center gap-3`}>
                      <div className="flex flex-col gap-3">
                        <div className={`w-16 h-16 ${visual.widgets[0]} rounded-lg`} />
                        <div className={`w-16 h-12 ${visual.widgets[1]} rounded-lg`} />
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className={`w-16 h-12 ${visual.widgets[2]} rounded-lg`} />
                        <div className={`w-16 h-16 ${visual.widgets[0]} rounded-lg`} />
                      </div>
                    </div>

                    {selectedTemplateId === template.id && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                      </div>
                    )}
                  </div>

                  <div className="bg-neutral-900/60 backdrop-blur-sm p-4 border-t border-neutral-800/50 rounded-b-xl">
                    <h3 className="text-white font-semibold text-base mb-1.5">{template.name}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                      {template.description || "A clean slate to build your unique portfolio"}
                    </p>
                  </div>

                  {selectedTemplateId === template.id && isCreating && (
                    <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
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
