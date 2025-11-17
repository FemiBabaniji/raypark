"use client"

import { useState } from "react"
import { ChevronDown, Pin } from 'lucide-react'
import { TimelineCard } from "@/components/ui/timeline-card"
import { colors, typography } from "@/lib/design-system"

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
    <TimelineCard
      onClick={() => setIsExpanded(!isExpanded)}
      accentColor={isImportant ? colors.accent.purple : undefined}
      className="cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div
          className="h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-sm"
          style={{
            backgroundColor: avatarColor,
            color: colors.foreground.primary,
            ...typography.body
          }}
        >
          {author.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 style={{ ...typography.h3, color: colors.foreground.primary }}>{title}</h3>
                {isImportant && <Pin className="h-4 w-4 flex-shrink-0" style={{ color: colors.accent.purple }} />}
              </div>
              <div style={{ ...typography.caption, color: colors.foreground.tertiary }}>
                {author} · {timeAgo}
              </div>
            </div>

            <button
              className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all flex-shrink-0 hover:bg-white/5 ${
                isExpanded ? "rotate-180 bg-white/5" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
            >
              <ChevronDown className="h-4 w-4" style={{ color: colors.foreground.secondary }} />
            </button>
          </div>

          <p
            className={`leading-relaxed transition-all ${isExpanded ? "line-clamp-none" : "line-clamp-2"}`}
            style={{ ...typography.body, color: colors.foreground.secondary }}
          >
            {content}
          </p>

          {isExpanded && (
            <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${colors.foreground.primary}10` }}>
              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: `${colors.accent.blue}20`,
                    color: colors.accent.blue,
                    ...typography.caption
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: colors.background.secondary,
                    color: colors.foreground.secondary,
                    ...typography.caption
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </TimelineCard>
  )
}
