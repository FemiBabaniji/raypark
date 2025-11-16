"use client"

import { ChevronRight, ChevronLeft } from 'lucide-react'

interface FilterTabsProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
  useGradient?: boolean
  showRightColumn?: boolean
  onToggleGradient?: () => void
  onToggleRightColumn?: () => void
}

export function FilterTabs({ 
  tabs, 
  activeTab, 
  onTabChange,
  useGradient,
  showRightColumn,
  onToggleGradient,
  onToggleRightColumn
}: FilterTabsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              pb-3 px-1 text-base font-medium transition-all duration-200 relative
              ${activeTab === tab ? "text-white" : "text-zinc-400 hover:text-zinc-200"}
            `}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
