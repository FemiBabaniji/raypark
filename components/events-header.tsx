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
    <div className="pt-1 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center justify-center rounded-xl aspect-square"
            style={{
              height: '3rem',
              background: 'linear-gradient(135deg, #FEF08A 0%, #BFDBFE 40%, #DDD6FE 80%, #E9D5FF 100%)',
              boxShadow: '0 4px 24px rgba(191, 219, 254, 0.2)'
            }}
          >
            <span className="text-zinc-900 font-bold text-xl tracking-tight">
              {communityName}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            <span className="text-white">Your hub. </span>
            <span style={{ color: "#4169E1" }}>Your community.</span>
          </h1>
        </div>
        
      </div>
    </div>
  )
}
