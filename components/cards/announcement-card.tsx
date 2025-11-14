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

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 ${isExpanded ? "" : ""}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-zinc-900/40 backdrop-blur-xl border transition-all duration-300 ${
          isImportant
            ? "border-purple-500/30 hover:border-purple-500/50 shadow-lg shadow-purple-500/10"
            : "border-zinc-700/50 hover:border-zinc-600/50 shadow-lg"
        } ${isExpanded ? "" : "hover:bg-zinc-900/60"}`}
      >
        {isImportant && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-fuchsia-500" />
        )}

        <div className="p-5">
          <div className="flex items-start gap-4">
            <div
              className="h-11 w-11 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-sm shadow-lg"
              style={{
                backgroundColor: avatarColor,
                boxShadow: `0 4px 12px ${avatarColor}50`,
              }}
            >
              {author.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    {isImportant && <Pin className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />}
                  </div>
                  <div className="text-xs text-zinc-400 font-medium">
                    {author} · {timeAgo}
                  </div>
                </div>

                <button
                  className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all duration-300 hover:bg-white/5 flex-shrink-0 ${
                    isExpanded ? "rotate-180 bg-white/5" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(!isExpanded)
                  }}
                >
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </button>
              </div>

              <p
                className={`text-sm text-zinc-300 leading-relaxed transition-all duration-300 ${
                  isExpanded ? "line-clamp-none" : "line-clamp-2"
                }`}
              >
                {content}
              </p>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-zinc-700/50">
                  <div className="flex items-center gap-2">
                    <button
                      className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-lg transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details
                    </button>
                    <button
                      className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800/70 text-zinc-300 text-xs font-medium rounded-lg transition-all"
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
      </div>
    </div>
  )
}
