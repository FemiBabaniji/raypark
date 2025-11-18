"use client"

import { ChevronDown } from 'lucide-react'

interface AnnouncementCardProps {
  title: string
  initials: string
  gradientFrom: string
  gradientTo: string
}

export function AnnouncementCard({ title, initials, gradientFrom, gradientTo }: AnnouncementCardProps) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-4">
      <div className="flex items-center gap-4">
        <div 
          className="flex h-12 w-12 items-center justify-center rounded-full flex-shrink-0"
          style={{
            background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
          }}
        >
          <span className="text-xl font-bold">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-white truncate">{title}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <ChevronDown className="h-5 w-5 text-gray-400" />
              <button className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div> 
    </div>
  )
}
