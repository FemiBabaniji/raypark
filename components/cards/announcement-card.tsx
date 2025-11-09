"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

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

  const gradientClass = isImportant
    ? "from-purple-900/20 via-violet-900/20 to-fuchsia-900/20"
    : "from-zinc-900/40 via-zinc-800/40 to-zinc-900/40"

  return (
    <li className="group">
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientClass} backdrop-blur-xl border border-white/5 transition-all duration-500 ease-out cursor-pointer hover:scale-[1.02] hover:border-white/10 hover:shadow-2xl ${
          isExpanded ? "shadow-2xl scale-[1.02]" : ""
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E\")",
        }}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div
                className="h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-white text-xs shadow-lg"
                style={{
                  backgroundColor: avatarColor,
                  boxShadow: `0 4px 14px ${avatarColor}40`,
                }}
              >
                {author.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white/95 truncate">{title}</h3>
                  {isImportant && (
                    <span className="px-2.5 py-0.5 bg-gradient-to-r from-violet-500/80 to-fuchsia-500/80 text-white text-[10px] font-semibold rounded-full tracking-wide uppercase backdrop-blur-sm">
                      Important
                    </span>
                  )}
                </div>

                <div className="text-xs text-white/40 font-medium mb-2 tracking-wide">
                  {author} · {timeAgo}
                </div>

                <div
                  className={`text-sm text-white/70 leading-relaxed transition-all duration-500 ${
                    isExpanded ? "line-clamp-none" : "line-clamp-2"
                  }`}
                >
                  {content}
                </div>
              </div>
            </div>

            <button
              className={`h-8 w-8 flex items-center justify-center rounded-full transition-all duration-500 hover:bg-white/10 flex-shrink-0 ${
                isExpanded ? "rotate-180 bg-white/5" : ""
              }`}
            >
              <ChevronDown className="h-4 w-4 text-white/40" />
            </button>
          </div>

          <div
            className={`transition-all duration-500 ease-out ${
              isExpanded ? "opacity-100 max-h-96 mt-4" : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <div className="border-t border-white/5 pt-4">
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-white/80 leading-relaxed mb-3">{content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white/90 text-xs font-medium rounded-full transition-all duration-300 backdrop-blur-sm">
                      Read More
                    </button>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium rounded-full transition-all duration-300 backdrop-blur-sm">
                      Mark as Read
                    </button>
                  </div>
                  <div className="text-xs text-white/30 font-medium">12 reactions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
