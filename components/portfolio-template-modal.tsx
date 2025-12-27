"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PortfolioTemplateCard } from "@/components/cards/portfolio-template-card"
import type { PortfolioTemplate } from "@/lib/template-service"
import { cn } from "@/lib/utils"
import { ShieldCheck } from "lucide-react"

interface PortfolioTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (templateId: string) => void
  communityId?: string
}

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
  const [activeFilter, setActiveFilter] = useState<string>("All")
  const [mandatoryTemplate, setMandatoryTemplate] = useState<PortfolioTemplate | null>(null)

  useEffect(() => {
    if (!isOpen) return
    fetchTemplates()
    setActiveFilter("All")
    setSelectedTemplateId(null)
    setIsCreating(false)
  }, [isOpen, communityId])

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (communityId) params.append("communityId", communityId)

      console.log("[v0] 📋 Fetching templates with params:")
      console.log("[v0]   - communityId:", communityId)
      console.log("[v0]   - API URL:", `/api/templates?${params.toString()}`)

      const response = await fetch(`/api/templates?${params.toString()}`)

      console.log("[v0] 📋 API Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] 📋 API returned data:", data)
        console.log("[v0] 📋 Number of templates:", data.templates?.length || 0)
        console.log(
          "[v0] 📋 Templates:",
          data.templates?.map((t: PortfolioTemplate) => ({
            id: t.id,
            name: t.name,
            community_id: t.community_id,
            is_mandatory: t.is_mandatory,
            is_active: t.is_active,
          })),
        )

        setTemplates(data.templates || [])

        const mandatory = data.templates?.find((t: PortfolioTemplate) => t.is_mandatory)
        if (mandatory) {
          console.log("[v0] ✅ Found mandatory template:", mandatory.name, "ID:", mandatory.id)
          setMandatoryTemplate(mandatory)
          setSelectedTemplateId(mandatory.id)
        } else {
          console.log("[v0] ℹ️ No mandatory template found")
          setMandatoryTemplate(null)
        }
      } else {
        console.error("[v0] ❌ API request failed with status:", response.status)
        const errorText = await response.text()
        console.error("[v0] ❌ Error response:", errorText)
        setTemplates([])
        setMandatoryTemplate(null)
      }
    } catch (error) {
      console.error("[v0] ❌ Failed to fetch templates:", error)
      setTemplates([])
      setMandatoryTemplate(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = async (templateId: string) => {
    if (isCreating) return

    if (mandatoryTemplate && templateId !== mandatoryTemplate.id) {
      console.log("[v0] Cannot select non-mandatory template when mandatory template exists")
      return
    }

    setIsCreating(true)
    setSelectedTemplateId(templateId)
    try {
      await onSelectTemplate(templateId)
    } finally {
      setIsCreating(false)
    }
  }

  const filters = useMemo(() => {
    const types = Array.from(new Set(templates.map((t) => getTemplateType(t.name))))
    const ordered = ["CREATIVE", "TECHNICAL", "MARKETING", "BUSINESS", "ANALYTICAL", "CUSTOM"]
    const uniqueTypes = ordered.filter((t) => types.includes(t))
    return ["All", "Installed", ...uniqueTypes]
  }, [templates])

  const filteredTemplates = useMemo(() => {
    if (activeFilter === "All") return templates
    if (activeFilter === "Installed") {
      return selectedTemplateId ? templates.filter((t) => t.id === selectedTemplateId) : []
    }
    return templates.filter((t) => getTemplateType(t.name) === activeFilter)
  }, [activeFilter, templates, selectedTemplateId])

  const getVisual = (name: string) => templateVisuals[name] || templateVisuals["Blank Portfolio"]

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isCreating) onClose()
      }}
    >
      <DialogContent
        className={cn(
          "p-0 overflow-hidden",
          "bg-[#1a1a1d] backdrop-blur-xl border-white/10",
          "w-[95vw] sm:w-[90vw] lg:w-[85vw] xl:w-[1200px]",
          "!max-w-none",
          "h-[92vh] max-h-[900px]",
        )}
      >
        <div className="relative h-full flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10 shrink-0">
            <DialogTitle className="text-2xl sm:text-3xl font-semibold text-white">
              Choose & Organise Templates
            </DialogTitle>
            <p className="text-white/60 text-sm sm:text-base mt-1">
              Select the perfect starting point from your template library.
            </p>

            {mandatoryTemplate && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-amber-200">Required Template</p>
                  <p className="text-sm text-amber-300/70 mt-1">
                    Your community requires using the "{mandatoryTemplate.name}" template. This ensures consistency
                    across member portfolios.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="flex items-center gap-2 overflow-x-auto pr-2 sm:flex-wrap sm:overflow-visible">
                {filters.map((f) => {
                  const active = f === activeFilter
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setActiveFilter(f)}
                      className={cn(
                        "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                        "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                        active && "bg-white/15 text-white border-white/20",
                      )}
                    >
                      {f}
                    </button>
                  )
                })}
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-hidden">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <div className="h-full overflow-y-auto px-6 pb-6 pt-6">
                {filteredTemplates.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
                    <p className="text-white/85 font-medium">No templates in this view.</p>
                    <p className="text-white/55 text-sm mt-1">Try another filter.</p>
                  </div>
                ) : (
                  <div className={cn("grid gap-5", "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", "2xl:grid-cols-4")}>
                    {filteredTemplates.map((template) => (
                      <PortfolioTemplateCard
                        key={template.id}
                        templateId={template.id}
                        name={template.name}
                        description={template.description}
                        visual={getVisual(template.name)}
                        isCreating={isCreating}
                        isSelected={selectedTemplateId === template.id}
                        isMandatory={template.is_mandatory}
                        isDisabled={mandatoryTemplate ? template.id !== mandatoryTemplate.id : false}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {isCreating && (
            <div className="absolute inset-0 z-50 bg-[#1a1a1d]/90 backdrop-blur-md flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-base text-white font-medium">Creating your portfolio…</p>
                <p className="text-sm text-white/60 mt-1">Just a moment.</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
