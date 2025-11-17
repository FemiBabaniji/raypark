"use client"

import { useState } from "react"
import { ChevronDown, Pin } from 'lucide-react'

interface AnnouncementCardProps {
  title: string
  content: string
  author: string
  timeAgo: string
  avatarColor: string
  isImportant?: boolean
}

export function AnnouncementCard({
  title,
  content,
  author,
  timeAgo,
  avatarColor,
  isImportant = false,
}: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const gradient = isImportant 
    ? "from-violet-600/90 via-purple-600/90 to-fuchsia-600/80" 
    : "from-slate-700/90 via-slate-600/90 to-slate-500/80"

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`cursor-pointer rounded-2xl bg-gradient-to-br ${gradient} backdrop-blur-xl p-5 
        transition-all duration-300 hover:scale-[1.01] shadow-lg border border-white/10`}
    >
      <div className="flex items-start gap-4">
        <div
          className="h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-sm text-white"
          style={{ backgroundColor: avatarColor }}
        >
          {author.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-white">{title}</h3>
                {isImportant && <Pin className="h-4 w-4 flex-shrink-0 text-white" />}
              </div>
              <div className="text-xs text-white/70">
                {author} · {timeAgo}
              </div>
            </div>

            <button
              className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all flex-shrink-0 hover:bg-white/10 ${
                isExpanded ? "rotate-180 bg-white/10" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
            >
              <ChevronDown className="h-4 w-4 text-white/70" />
            </button>
          </div>

          <p
            className={`leading-relaxed transition-all text-sm text-white/90 ${isExpanded ? "line-clamp-none" : "line-clamp-2"}`}
          >
            {content}
          </p>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white/10 text-white/80 hover:bg-white/15"
                  onClick={(e) => e.stopPropagation()}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
