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

const backgroundMap: Record<string, string> = {
  "Blank Portfolio": "bg-neutral-800/50",
  "Designer Portfolio": "bg-neutral-800/70",
  "Developer Portfolio": "bg-neutral-800/60",
  "Marketing Portfolio": "bg-neutral-800/65",
  "Founder Portfolio": "bg-neutral-800/55",
}

const accentMap: Record<string, string> = {
  "Blank Portfolio": "hover:border-neutral-600",
  "Designer Portfolio": "hover:border-purple-500/30",
  "Developer Portfolio": "hover:border-blue-500/30",
  "Marketing Portfolio": "hover:border-orange-500/30",
  "Founder Portfolio": "hover:border-teal-500/30",
}

const iconColorMap: Record<string, string> = {
  "Blank Portfolio": "bg-neutral-600",
  "Designer Portfolio": "bg-purple-500/60",
  "Developer Portfolio": "bg-blue-500/60",
  "Marketing Portfolio": "bg-orange-500/60",
  "Founder Portfolio": "bg-teal-500/60",
}

export function PortfolioTemplateModal({ isOpen, onClose, onSelectTemplate, communityId }: PortfolioTemplateModalProps) {
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

  const getBackground = (name: string): string => {
    return backgroundMap[name] || "bg-neutral-800/50"
  }

  const getAccent = (name: string): string => {
    return accentMap[name] || "hover:border-neutral-600"
  }

  const getIconColor = (name: string): string => {
    return iconColorMap[name] || "bg-neutral-600"
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isCreating) {
        onClose()
      }
    }}>
      <DialogContent className="max-w-4xl bg-neutral-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Choose a Template</DialogTitle>
          <p className="text-neutral-400 text-sm mt-2">Select a starting point for your portfolio</p>
        </DialogHeader>

        {isCreating && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-50">
            <div className="text-white text-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Creating your portfolio...</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-8 pb-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template.id)}
                disabled={isCreating}
                className={`group relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 border-2 ${
                  selectedTemplateId === template.id
                    ? 'border-white/60 scale-[0.98]'
                    : `border-white/5 ${getAccent(template.name)}`
                } ${isCreating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
              >
                <div className={`h-full w-full ${getBackground(template.name)} backdrop-blur-sm p-6 flex flex-col justify-between`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
                  
                  <div className="relative z-10 flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <div className={`w-4 h-4 rounded ${getIconColor(template.name)}`} />
                    </div>
                    <h3 className="text-white font-semibold text-xs text-left leading-tight flex-1">
                      {template.name}
                    </h3>
                  </div>

                  <div className="relative z-10">
                    <p className="text-neutral-400 text-[11px] leading-relaxed text-balance">
                      {template.description || "No description available"}
                    </p>
                  </div>

                  {selectedTemplateId === template.id && isCreating && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-neutral-900 animate-pulse" />
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
