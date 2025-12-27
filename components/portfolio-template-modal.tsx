"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PortfolioTemplateCard } from "@/components/cards/portfolio-template-card"
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
            {templates.map((template) => (
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
      </DialogContent>
    </Dialog>
  )
}
