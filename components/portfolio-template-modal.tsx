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
  "Blank Portfolio": "bg-gradient-to-br from-neutral-700 to-neutral-800",
  "Designer Portfolio": "bg-gradient-to-br from-purple-600 to-pink-600",
  "Developer Portfolio": "bg-gradient-to-br from-blue-600 to-cyan-600",
  "Marketing Portfolio": "bg-gradient-to-br from-orange-600 to-red-700",
  "Founder Portfolio": "bg-gradient-to-br from-teal-600 to-emerald-700",
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
    return backgroundMap[name] || "bg-gradient-to-br from-neutral-700 to-neutral-800"
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isCreating) {
        onClose()
      }
    }}>
      <DialogContent className="max-w-5xl bg-neutral-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-white">Choose a Template</DialogTitle>
          <p className="text-neutral-400 text-base mt-2">Select a starting point for your portfolio</p>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 pb-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template.id)}
                disabled={isCreating}
                className={`group relative aspect-square rounded-3xl overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                  selectedTemplateId === template.id
                    ? 'scale-[0.98] ring-2 ring-white/60'
                    : ''
                } ${isCreating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-2xl'}`}
              >
                <div className={`h-full w-full ${getBackground(template.name)} p-6 flex flex-col justify-between`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40" />
                  
                  <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center">
                    <h3 className="text-white font-bold text-xl mb-3 leading-tight px-2">
                      {template.name}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed px-4">
                      {template.description || "No description available"}
                    </p>
                  </div>

                  {selectedTemplateId === template.id && isCreating && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white flex items-center justify-center z-20">
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
