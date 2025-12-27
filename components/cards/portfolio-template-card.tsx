"use client"

import { useMemo } from "react"

interface TemplateVisual {
  bgColor: string
  widgets: { color: string; size: string }[]
}

interface PortfolioTemplateCardProps {
  templateId: string
  name: string
  description: string | null
  visual: TemplateVisual
  isCreating: boolean
  isSelected: boolean
  onSelect: (templateId: string) => void
}

const getTemplateType = (name: string) => {
  if (name.includes("Designer")) return "CREATIVE"
  if (name.includes("Developer")) return "TECHNICAL"
  if (name.includes("Marketing")) return "MARKETING"
  if (name.includes("Founder")) return "ENTREPRENEURIAL"
  if (name.includes("Analyst")) return "ANALYTICAL"
  return "CUSTOM"
}

export function PortfolioTemplateCard({
  templateId,
  name,
  description,
  visual,
  isCreating,
  isSelected,
  onSelect,
}: PortfolioTemplateCardProps) {
  const templateType = useMemo(() => getTemplateType(name), [name])

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => onSelect(templateId)}
        disabled={isCreating}
        className={[
          "relative w-full rounded-xl overflow-hidden shadow-lg transition-all duration-300",
          "hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        ].join(" ")}
        style={{ backgroundColor: visual.bgColor }}
      >
        <div className="aspect-square relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <div className="relative z-10 h-full grid grid-rows-[auto,1fr,auto]">
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="block text-white/60 text-xs uppercase tracking-widest font-medium">
                    {templateType}
                  </span>
                  <h3 className="mt-1 text-white text-lg sm:text-2xl font-semibold leading-snug line-clamp-2">
                    {name}
                  </h3>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-black" />
                  </div>
                )}
              </div>
            </div>
            <div className="px-8 sm:px-10 flex items-center justify-center">
              <div className="w-full max-w-[72%] grid grid-cols-2 gap-3 sm:gap-4">
                {visual.widgets.slice(0, 4).map((widget, i) => (
                  <div
                    key={i}
                    className="w-full aspect-square rounded-lg opacity-80 backdrop-blur-sm transition-opacity group-hover:opacity-95"
                    style={{ backgroundColor: widget.color }}
                  />
                ))}
              </div>
            </div>
            <div className="p-5 sm:p-6 bg-gradient-to-t from-black/55 to-transparent">
              <p className="text-white/90 text-sm sm:text-base leading-relaxed line-clamp-2">
                {description || "A clean slate to build your unique portfolio"}
              </p>
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/20">
                <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Template</span>
                <div
                  className={[
                    "px-5 py-2 rounded-full text-sm font-medium transition-all",
                    "bg-white/90 text-black group-hover:bg-white group-hover:shadow-lg",
                  ].join(" ")}
                >
                  {isSelected ? "Selected" : "Select"}
                </div>
              </div>
            </div>
          </div>
          {isSelected && isCreating && (
            <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      </button>
    </div>
  )
}
