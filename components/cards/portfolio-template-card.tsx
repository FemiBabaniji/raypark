"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUpRight, Check, Sparkles } from "lucide-react"

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
  if (name.includes("Founder")) return "BUSINESS"
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
    <div className="relative">
      <button
        type="button"
        onClick={() => onSelect(templateId)}
        disabled={isCreating}
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl border text-left",
          "bg-neutral-950/40 border-neutral-800/70 hover:border-neutral-700/80",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        )}
      >
        {/* subtle top glow */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute -top-24 left-1/2 h-48 w-[28rem] -translate-x-1/2 rounded-full blur-3xl bg-white/5" />
        </div>

        <div className="relative p-5 sm:p-6">
          {/* Header row */}
          <div className="flex items-start gap-4">
            {/* Visual tile */}
            <div
              className={cn(
                "relative shrink-0 rounded-2xl border",
                "h-[92px] w-[112px] sm:h-[96px] sm:w-[120px]",
                "border-white/10 overflow-hidden"
              )}
              style={{ backgroundColor: visual.bgColor }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-white/0 to-black/30" />
              <div className="relative z-10 h-full w-full p-3">
                <div className="grid grid-cols-2 gap-2 h-full place-items-stretch">
                  {visual.widgets.slice(0, 4).map((w, i) => (
                    <div
                      key={i}
                      className="rounded-lg opacity-85 group-hover:opacity-95 transition-opacity"
                      style={{ backgroundColor: w.color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] tracking-wider text-white/70">
                      <Sparkles className="h-3.5 w-3.5" />
                      {templateType}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base sm:text-lg font-semibold text-white leading-snug line-clamp-2">
                    {name}
                  </h3>

                  <p className="mt-1.5 text-sm text-white/60 leading-relaxed line-clamp-2">
                    {description || "A clean slate to build your unique portfolio."}
                  </p>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="shrink-0 mt-1 inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/10 px-2.5 py-1 text-xs text-white/80">
                    <Check className="h-3.5 w-3.5" />
                    Selected
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2">
                <Button
                  type="button"
                  variant={isSelected ? "secondary" : "default"}
                  className={cn(
                    "rounded-full",
                    isSelected
                      ? "bg-white/10 text-white hover:bg-white/14 border border-white/10"
                      : "bg-white text-black hover:bg-white/90"
                  )}
                  disabled={isCreating}
                >
                  {isSelected ? "Selected" : "Select"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full text-white/70 hover:text-white hover:bg-white/5"
                  disabled={isCreating}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onSelect(templateId)
                  }}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Button>

                {isCreating && isSelected && (
                  <div className="ml-auto inline-flex items-center gap-2 text-xs text-white/60">
                    <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    Creating…
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}
