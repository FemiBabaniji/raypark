"use client"

import { ChevronRight, ChevronLeft } from 'lucide-react'

interface EventsHeaderProps {
  communityName: string
  useGradient: boolean
  showRightColumn: boolean
  onToggleGradient: () => void
  onToggleRightColumn: () => void
}

export default function EventsHeader({
  communityName,
  useGradient,
  showRightColumn,
  onToggleGradient,
  onToggleRightColumn
}: EventsHeaderProps) {
  return (
    <div className="pt-1 pb-4 px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center justify-center rounded-xl aspect-square"
            style={{
              height: '4rem',
              background: 'linear-gradient(135deg, #FEF08A 0%, #BFDBFE 40%, #DDD6FE 80%, #E9D5FF 100%)',
              boxShadow: '0 4px 24px rgba(191, 219, 254, 0.2)'
            }}
          >
            <span className="text-zinc-900 font-bold text-2xl tracking-tight">
              {communityName}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-white">Your hub. </span>
            <span style={{ color: "#4169E1" }}>Your community.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
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
        </div>
      </div>
    </div>
  )
}
