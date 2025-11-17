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

const gradientMap: Record<string, string> = {
  "Blank Portfolio": "from-neutral-400/40 to-neutral-600/60",
  "Designer Portfolio": "from-purple-400/40 to-pink-500/60",
  "Developer Portfolio": "from-blue-400/40 to-cyan-500/60",
  "Marketing Portfolio": "from-orange-400/40 to-red-500/60",
  "Founder Portfolio": "from-teal-400/40 to-emerald-500/60",
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

  const getGradient = (name: string): string => {
    return gradientMap[name] || "from-neutral-400/40 to-neutral-600/60"
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isCreating) {
        onClose()
      }
    }}>
      <DialogContent className="max-w-3xl bg-neutral-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Choose a Template</DialogTitle>
          <p className="text-white/60 text-sm mt-2">Select a starting point for your portfolio</p>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template.id)}
                disabled={isCreating}
                className={`group relative aspect-[4/5] rounded-3xl overflow-hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                  selectedTemplateId === template.id
                    ? 'ring-2 ring-white/40 scale-[0.98]'
                    : 'hover:scale-[1.02]'
                } ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`h-full w-full bg-neutral-800 bg-gradient-to-br ${getGradient(template.name)} backdrop-blur-xl p-6 flex flex-col justify-end`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  
                  <div className="relative z-10">
                    <h3 className="text-white font-bold text-lg mb-1.5 text-balance">
                      {template.name}
                    </h3>
                    <p className="text-white/70 text-xs leading-relaxed text-balance">
                      {template.description || "No description available"}
                    </p>
                  </div>

                  {selectedTemplateId === template.id && isCreating && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white flex items-center justify-center">
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
