"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export type PortfolioTemplateType = "blank" | "designer" | "developer" | "marketing" | "founder"

interface PortfolioTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: PortfolioTemplateType) => void
}

const templates = [
  {
    type: "blank" as const,
    name: "Blank Portfolio",
    description: "Start from scratch with just the identity widget",
    gradient: "from-neutral-400/40 to-neutral-600/60",
  },
  {
    type: "designer" as const,
    name: "Designer",
    description: "Showcase design work with portfolio gallery and projects",
    gradient: "from-purple-400/40 to-pink-500/60",
  },
  {
    type: "developer" as const,
    name: "Developer",
    description: "Highlight technical skills, projects, and repositories",
    gradient: "from-blue-400/40 to-cyan-500/60",
  },
  {
    type: "marketing" as const,
    name: "Marketing",
    description: "Display campaigns, metrics, and brand partnerships",
    gradient: "from-orange-400/40 to-red-500/60",
  },
  {
    type: "founder" as const,
    name: "Founder",
    description: "Present company vision, milestones, and funding",
    gradient: "from-teal-400/40 to-emerald-500/60",
  },
]

export function PortfolioTemplateModal({ isOpen, onClose, onSelectTemplate }: PortfolioTemplateModalProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplateType | null>(null)

  const handleSelect = async (template: PortfolioTemplateType) => {
    if (isCreating) return
    
    setIsCreating(true)
    setSelectedTemplate(template)
    
    await onSelectTemplate(template)
    
    // Note: Modal will close via parent component after successful creation
    // If there's an error, parent handles it and we reset the state
    setIsCreating(false)
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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          {templates.map((template) => (
            <button
              key={template.type}
              onClick={() => handleSelect(template.type)}
              disabled={isCreating}
              className={`group relative aspect-[4/5] rounded-3xl overflow-hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                selectedTemplate === template.type
                  ? 'ring-2 ring-white/40 scale-[0.98]'
                  : 'hover:scale-[1.02]'
              } ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`h-full w-full bg-neutral-800 bg-gradient-to-br ${template.gradient} backdrop-blur-xl p-6 flex flex-col justify-end`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                
                <div className="relative z-10">
                  <h3 className="text-white font-bold text-lg mb-1.5 text-balance">
                    {template.name}
                  </h3>
                  <p className="text-white/70 text-xs leading-relaxed text-balance">
                    {template.description}
                  </p>
                </div>

                {selectedTemplate === template.type && isCreating && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-neutral-900 animate-pulse" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
