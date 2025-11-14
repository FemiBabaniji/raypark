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
      
      {(onToggleGradient || onToggleRightColumn) && (
        <div className="flex items-center gap-3 pb-3">
          {onToggleGradient && (
            <button
              onClick={onToggleGradient}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              aria-label="Toggle background"
            >
              <div className="w-4 h-4 rounded-full" style={{
                background: useGradient 
                  ? "linear-gradient(135deg, #4169E1, #8B5CF6)" 
                  : "#52525b"
              }} />
              <span className="text-sm text-white/70">{useGradient ? "Gradient" : "Grey"}</span>
            </button>
          )}
          
          {onToggleRightColumn && (
            <button
              onClick={onToggleRightColumn}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              aria-label="Toggle sidebar"
            >
              {showRightColumn ? (
                <>
                  <ChevronRight className="w-4 h-4 text-white/70" />
                  <span className="text-sm text-white/70">Hide</span>
                </>
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 text-white/70" />
                  <span className="text-sm text-white/70">Show</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
