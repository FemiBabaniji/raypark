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
    <button
      type="button"
      onClick={() => onSelect(templateId)}
      disabled={isCreating}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border text-left",
        "bg-neutral-950/35 border-white/10 hover:border-white/15",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]",
        "transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
      )}
    >
      <div className="p-4 sm:p-5">
        {/* Top: visual preview */}
        <div className="relative w-full overflow-hidden rounded-xl border border-white/10">
          {/* Keep preview proportional and consistent */}
          <div
            className="relative aspect-[16/10]"
            style={{ backgroundColor: visual.bgColor }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-white/0 to-black/35" />
            <div className="absolute inset-0 p-3 sm:p-4">
              <div className="grid h-full grid-cols-2 gap-2">
                {visual.widgets.slice(0, 4).map((w, i) => (
                  <div
                    key={i}
                    className="rounded-lg opacity-85 group-hover:opacity-95 transition-opacity"
                    style={{ backgroundColor: w.color }}
                  />
                ))}
              </div>
            </div>

            {/* Selected dot */}
            {isSelected && (
              <div className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shadow">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>

        {/* Middle: meta + title */}
        <div className="mt-4 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] tracking-wider text-white/70">
              <Sparkles className="h-3.5 w-3.5" />
              {templateType}
            </span>

            {isCreating && isSelected && (
              <span className="inline-flex items-center gap-2 text-xs text-white/55">
                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Creating…
              </span>
            )}
          </div>

          <h3 className="mt-2 text-base sm:text-lg font-semibold text-white leading-snug line-clamp-1">
            {name}
          </h3>

          <p className="mt-1 text-sm text-white/55 leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {description || "A clean slate to build your unique portfolio."}
          </p>
        </div>

        {/* Bottom: actions (kept compact) */}
        <div className="mt-4 flex items-center gap-2">
          <Button
            type="button"
            variant={isSelected ? "secondary" : "default"}
            className={cn(
              "h-9 rounded-full px-4",
              isSelected
                ? "bg-white/10 text-white hover:bg-white/14 border border-white/10"
                : "bg-white text-black hover:bg-white/90"
            )}
            disabled={isCreating}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onSelect(templateId)
            }}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-9 w-9 rounded-full p-0 text-white/70 hover:text-white hover:bg-white/5"
            disabled={isCreating}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onSelect(templateId)
            }}
            aria-label="Open template"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </button>
  )
}
