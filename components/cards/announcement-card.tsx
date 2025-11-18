"use client"

import { ChevronDown, MoreHorizontal } from 'lucide-react'

interface AnnouncementCardProps {
  title: string
  initials: string
  gradientFrom: string
  gradientTo: string
}

export function AnnouncementCard({ title, initials, gradientFrom, gradientTo }: AnnouncementCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1a1a] p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0"
          style={{
            background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
          }}
        >
          <span className="text-sm font-semibold">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-medium text-white truncate">{title}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <ChevronDown className="h-4 w-4 text-gray-400" />
              <button className="text-gray-400 hover:text-white transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div> 
    </div>
  )
}
