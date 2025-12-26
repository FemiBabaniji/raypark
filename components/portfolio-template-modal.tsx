"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { PortfolioTemplate } from "@/lib/template-service"
import { Sparkles, Code, Palette, BarChart3, Rocket, FileText } from "lucide-react"

interface PortfolioTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (templateId: string) => void
  communityId?: string
}

const templateIcons: Record<string, React.ReactNode> = {
  "Blank Portfolio": <FileText className="w-5 h-5 text-neutral-400" />,
  "Designer Portfolio": <Palette className="w-5 h-5 text-purple-400" />,
  "Developer Portfolio": <Code className="w-5 h-5 text-blue-400" />,
  "Marketing Portfolio": <Sparkles className="w-5 h-5 text-orange-400" />,
  "Founder Portfolio": <Rocket className="w-5 h-5 text-emerald-400" />,
  "Analyst Portfolio": <BarChart3 className="w-5 h-5 text-cyan-400" />,
}

const templateAccents: Record<string, string> = {
  "Blank Portfolio": "hover:border-neutral-600/50 group-hover:shadow-neutral-500/10",
  "Designer Portfolio": "hover:border-purple-500/30 group-hover:shadow-purple-500/10",
  "Developer Portfolio": "hover:border-blue-500/30 group-hover:shadow-blue-500/10",
  "Marketing Portfolio": "hover:border-orange-500/30 group-hover:shadow-orange-500/10",
  "Founder Portfolio": "hover:border-emerald-500/30 group-hover:shadow-emerald-500/10",
  "Analyst Portfolio": "hover:border-cyan-500/30 group-hover:shadow-cyan-500/10",
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

  const getIcon = (name: string) => {
    return templateIcons[name] || templateIcons["Blank Portfolio"]
  }

  const getAccent = (name: string) => {
    return templateAccents[name] || templateAccents["Blank Portfolio"]
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
      <DialogContent className="max-w-4xl bg-neutral-900/95 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Choose a Template</DialogTitle>
          <p className="text-neutral-400 text-sm mt-2">Select a starting point for your portfolio</p>
        </DialogHeader>

        {isCreating && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-50">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-foreground">Creating your portfolio...</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pb-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template.id)}
                disabled={isCreating}
                className={`group relative overflow-hidden rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 border ${
                  selectedTemplateId === template.id
                    ? "border-white/40 bg-white/5 shadow-lg shadow-white/10"
                    : `border-white/10 ${getAccent(template.name)}`
                } ${isCreating ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] hover:shadow-lg"}`}
              >
                <div className="bg-card/50 backdrop-blur-sm p-5 flex flex-col gap-4 min-h-[180px]">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted/50 border border-white/10 flex items-center justify-center flex-shrink-0">
                      {getIcon(template.name)}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-white font-semibold text-sm leading-tight mb-1">{template.name}</h3>
                      {selectedTemplateId === template.id && (
                        <span className="text-xs text-emerald-400 font-medium">Selected</span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {template.description || "No description available"}
                  </p>

                  {/* Loading indicator */}
                  {selectedTemplateId === template.id && isCreating && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
