"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles } from 'lucide-react'
import { PORTFOLIO_TEMPLATES, type PortfolioTemplate } from "@/lib/portfolio-templates"
import { THEME_COLOR_OPTIONS } from "@/lib/theme"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: PortfolioTemplate | null) => void
}

export function TemplateLibraryModal({ isOpen, onClose, onSelectTemplate }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelectTemplate = (templateId: string) => {
    setSelectedId(templateId)
  }

  const handleSelectBlank = () => {
    setSelectedId("blank")
  }

  const handleUseTemplate = () => {
    if (selectedId === "blank") {
      onSelectTemplate(null)
    } else if (selectedId) {
      const template = PORTFOLIO_TEMPLATES.find(t => t.id === selectedId)
      if (template) {
        onSelectTemplate(template)
      }
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-[#0a0a12] border border-white/10 shadow-2xl pointer-events-auto">
              {/* Header */}
              <div className="relative px-8 py-6 border-b border-white/10">
                <button
                  onClick={onClose}
                  className="absolute right-6 top-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">Choose Your Template</h2>
                </div>
                <p className="text-white/60 text-sm">
                  Start with a pre-configured portfolio tailored to your profession
                </p>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-160px)] p-8">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {PORTFOLIO_TEMPLATES.map((template) => {
                    const gradient = THEME_COLOR_OPTIONS[template.selectedColor]?.gradient ?? "from-neutral-600/40 to-neutral-800/60"
                    const isSelected = selectedId === template.id

                    return (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template.id)}
                        className={`
                          relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-200
                          ${isSelected ? 'ring-2 ring-white scale-[1.02]' : 'hover:scale-[1.01]'}
                        `}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
                        <div className="relative z-10">
                          <div className="text-4xl mb-3">{template.icon}</div>
                          <h3 className="text-white font-bold text-lg mb-2">{template.name}</h3>
                          <p className="text-white/80 text-sm leading-relaxed">{template.description}</p>
                          
                          {/* Widget Preview */}
                          <div className="mt-4 pt-4 border-t border-white/20">
                            <div className="text-white/60 text-xs font-medium mb-2">Includes:</div>
                            <div className="flex flex-wrap gap-2">
                              {[...template.presets.widgets.left, ...template.presets.widgets.right]
                                .slice(0, 4)
                                .map((widget, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 rounded-md bg-white/10 text-white/80 text-xs capitalize"
                                  >
                                    {widget}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Blank Option */}
                <button
                  onClick={handleSelectBlank}
                  className={`
                    w-full rounded-2xl p-6 border-2 border-dashed transition-all duration-200
                    ${selectedId === "blank" ? 'border-white bg-white/5 ring-2 ring-white' : 'border-white/20 hover:border-white/40 hover:bg-white/5'}
                  `}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3">📄</div>
                    <h3 className="text-white font-bold text-lg mb-2">Start from Scratch</h3>
                    <p className="text-white/60 text-sm">
                      Begin with a blank canvas and build your portfolio from the ground up
                    </p>
                  </div>
                </button>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl text-white/80 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUseTemplate}
                  disabled={!selectedId}
                  className="px-8 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedId === "blank" ? 'Create Blank Portfolio' : selectedId ? 'Use This Template' : 'Select an Option'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
