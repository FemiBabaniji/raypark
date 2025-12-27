"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PortfolioTemplateCard } from "@/components/cards/portfolio-template-card"
import type { PortfolioTemplate } from "@/lib/template-service"
import { cn } from "@/lib/utils"

const templateVisuals: Record<string, { bgColor: string; widgets: { color: string; size: string }[] }> = {
  "Blank Portfolio": {
    bgColor: "#111827",
    widgets: [
      { color: "#1F2937", size: "w-16 h-16" },
      { color: "#334155", size: "w-16 h-12" },
      { color: "#1F2937", size: "w-16 h-12" },
      { color: "#334155", size: "w-16 h-16" },
    ],
  },
  "Designer Portfolio": {
    bgColor: "#6D28D9",
    widgets: [
      { color: "#A855F7", size: "w-16 h-16" },
      { color: "#EC4899", size: "w-16 h-12" },
      { color: "#C084FC", size: "w-16 h-12" },
      { color: "#A855F7", size: "w-16 h-16" },
    ],
  },
  "Developer Portfolio": {
    bgColor: "#1D4ED8",
    widgets: [
      { color: "#3B82F6", size: "w-16 h-16" },
      { color: "#06B6D4", size: "w-16 h-12" },
      { color: "#60A5FA", size: "w-16 h-12" },
      { color: "#3B82F6", size: "w-16 h-16" },
    ],
  },
  "Marketing Portfolio": {
    bgColor: "#C2410C",
    widgets: [
      { color: "#F97316", size: "w-16 h-16" },
      { color: "#F59E0B", size: "w-16 h-12" },
      { color: "#FB923C", size: "w-16 h-12" },
      { color: "#F97316", size: "w-16 h-16" },
    ],
  },
  "Founder Portfolio": {
    bgColor: "#047857",
    widgets: [
      { color: "#10B981", size: "w-16 h-16" },
      { color: "#14B8A6", size: "w-16 h-12" },
      { color: "#34D399", size: "w-16 h-12" },
      { color: "#10B981", size: "w-16 h-16" },
    ],
  },
  "Analyst Portfolio": {
    bgColor: "#0E7490",
    widgets: [
      { color: "#06B6D4", size: "w-16 h-16" },
      { color: "#3B82F6", size: "w-16 h-12" },
      { color: "#22D3EE", size: "w-16 h-12" },
      { color: "#06B6D4", size: "w-16 h-16" },
    ],
  },
}

const getTemplateType = (name: string) => {
  if (name.includes("Designer")) return "CREATIVE"
  if (name.includes("Developer")) return "TECHNICAL"
  if (name.includes("Marketing")) return "MARKETING"
  if (name.includes("Founder")) return "BUSINESS"
  if (name.includes("Analyst")) return "ANALYTICAL"
  return "CUSTOM"
}

interface PortfolioTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (templateId: string) => void
  communityId?: string
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

  // UI filters (chips)
  const [activeFilter, setActiveFilter] = useState<string>("All")

  useEffect(() => {
    if (isOpen) {
      fetchTemplates()
    }
    // Reset UI state each open for a clean feel
    if (isOpen) {
      setActiveFilter("All")
      setSelectedTemplateId(null)
      setIsCreating(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, communityId])

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (communityId) params.append("communityId", communityId)

      const response = await fetch(`/api/templates?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      } else {
        setTemplates([])
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error)
      setTemplates([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = async (templateId: string) => {
    if (isCreating) return
    setIsCreating(true)
    setSelectedTemplateId(templateId)

    try {
      await onSelectTemplate(templateId)
    } finally {
      setIsCreating(false)
    }
  }

  const getVisual = (name: string) => templateVisuals[name] || templateVisuals["Blank Portfolio"]

  const filters = useMemo(() => {
    const types = Array.from(new Set(templates.map((t) => getTemplateType(t.name))))
    // Keep it stable + friendly ordering
    const ordered = ["CREATIVE", "TECHNICAL", "MARKETING", "BUSINESS", "ANALYTICAL", "CUSTOM"]
    const uniqueTypes = ordered.filter((t) => types.includes(t))
    return ["All", "Installed", ...uniqueTypes]
  }, [templates])

  const filteredTemplates = useMemo(() => {
    if (activeFilter === "All") return templates

    // "Installed" = show the one you've picked in this modal (matches the reference UX)
    if (activeFilter === "Installed") {
      return selectedTemplateId ? templates.filter((t) => t.id === selectedTemplateId) : []
    }

    return templates.filter((t) => getTemplateType(t.name) === activeFilter)
  }, [activeFilter, templates, selectedTemplateId])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isCreating) onClose()
      }}
    >
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-neutral-950/95 backdrop-blur-2xl border-neutral-800/60">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-3xl font-semibold text-white">Choose & Organise Templates</DialogTitle>
          <p className="text-neutral-400 text-base">
            Select the perfect starting point from your template library.
          </p>
        </DialogHeader>

        {/* Filter chips */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
          {filters.map((f) => {
            const active = f === activeFilter
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                  "border-white/10 bg-white/5 text-white/70 hover:bg-white/8 hover:text-white",
                  active && "bg-white text-black border-white"
                )}
              >
                {f}
              </button>
            )
          })}
        </div>

        {/* Loading / Overlay */}
        {isCreating && (
          <div className="absolute inset-0 z-50 bg-neutral-950/70 backdrop-blur-md rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-neutral-700 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <p className="text-base text-white font-medium">Creating your portfolio…</p>
              <p className="text-sm text-white/60 mt-1">Just a moment.</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="mt-6 pb-6">
            {filteredTemplates.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-white/80 font-medium">No templates in this view.</p>
                <p className="text-white/50 text-sm mt-1">Try another filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <PortfolioTemplateCard
                    key={template.id}
                    templateId={template.id}
                    name={template.name}
                    description={template.description}
                    visual={getVisual(template.name)}
                    isCreating={isCreating}
                    isSelected={selectedTemplateId === template.id}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
