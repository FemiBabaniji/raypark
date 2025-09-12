"use client"

import type React from "react"
import { X } from "lucide-react"
import AddButton from "@/components/ui/add-button"
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
  if (portfolios.length === 0) {
    return (
      <div className="max-w-7xl w-full space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-1">Welcome to Pathwai</h1>
          <p className="text-neutral-400">Get started by creating your first portfolio</p>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
              <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white">Create Your First Portfolio</h2>
            <p className="text-neutral-400 max-w-md">
              Start with our guided template to build a professional portfolio in minutes
            </p>
          </div>

          <button
            onClick={onStartStarter}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Start with template
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl w-full space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-semibold text-white tracking-tight">Your Portfolios</h1>
        <p className="text-lg text-neutral-400 font-normal">Select a portfolio to edit or create a new one</p>

        <div className="pt-4">
          <button
            onClick={onStartStarter}
            className="px-6 py-3 rounded-2xl bg-neutral-900/80 text-white hover:bg-neutral-800/80 backdrop-blur-xl transition-all duration-200 font-medium text-sm"
          >
            Start with template
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl">
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

          <AddButton onClick={onAdd} label="New Portfolio" variant="card" aria-label="Create new portfolio" />
        </div>
      </div>
    </div>
  )
}
