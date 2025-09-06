"use client"

import type React from "react"
import { Plus, X } from "lucide-react"
import BackButton from "@/components/ui/back-button"
import { UnifiedPortfolioCard, type UnifiedPortfolio } from "@/components/unified-portfolio-card"
import type { ThemeIndex } from "@/lib/theme"

export default function PortfolioGrid({
  portfolios,
  onSelect,
  onAdd,
  onDelete,
  onChangeColor,
  onStartStarter, // Added onStartStarter prop for template button
}: {
  portfolios: UnifiedPortfolio[]
  onSelect: (id: string) => void
  onAdd: () => void
  onDelete: (id: string, e: React.MouseEvent) => void
  onChangeColor?: (id: string, colorIndex: ThemeIndex) => void
  onStartStarter: () => void // Added onStartStarter prop type
}) {
  return (
    <div className="max-w-7xl w-full space-y-12">
      <div className="flex items-center justify-between">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-white mb-1">Your Portfolios</h1>
          <p className="text-neutral-400">Select a portfolio to edit or create a new one</p>
        </div>
        <button
          onClick={onStartStarter}
          className="px-4 py-2 rounded-xl bg-neutral-900/80 text-white hover:bg-neutral-800/80 backdrop-blur-xl transition-colors"
        >
          Start with template
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {portfolios.map((portfolio) => (
          <div key={portfolio.id} className="w-full group relative">
            <UnifiedPortfolioCard
              portfolio={portfolio}
              onClick={onSelect}
              onShare={(id) => console.log("share portfolio:", id)}
              onMore={(id) => console.log("more options:", id)}
              onChangeColor={onChangeColor}
            />
            {portfolios.length > 1 && (
              <button
                onClick={(e) => onDelete(portfolio.id, e)}
                className="absolute top-2 left-2 w-6 h-6 bg-black/20 hover:bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
              >
                <X size={12} className="text-white" />
              </button>
            )}
          </div>
        ))}

        <div className="w-full aspect-[4/5] rounded-3xl border-2 border-dashed border-neutral-700 hover:border-neutral-500 transition-colors cursor-pointer flex flex-col items-center justify-center group backdrop-blur-sm hover:scale-105 transition-all">
          <BackButton onClick={onAdd} icon={Plus} />
          <span className="text-neutral-400 font-medium text-sm mt-2">New Portfolio</span>
        </div>
      </div>
    </div>
  )
}
