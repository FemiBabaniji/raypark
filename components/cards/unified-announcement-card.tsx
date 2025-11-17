"use client"

import { useState } from "react"
import { ChevronDown, Pin } from 'lucide-react'
import { TimelineCard } from '@/components/ui/timeline-card'
import { typography, colors, spacing, radius, animations } from '@/lib/design-system'

interface UnifiedAnnouncementCardProps {
  title: string
  content: string
  author: string
  timeAgo: string
  avatarColor: string
  isImportant?: boolean
}

export function UnifiedAnnouncementCard({
  title,
  content,
  author,
  timeAgo,
  avatarColor,
  isImportant = false,
}: UnifiedAnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <TimelineCard 
      onClick={() => setIsExpanded(!isExpanded)}
      className="relative"
    >
      {/* Important indicator rail */}
      {isImportant && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" 
          style={{ 
            background: 'linear-gradient(to bottom, #8B5CF6, #EC4899)',
          }}
        />
      )}

      <div className={isImportant ? 'pl-4' : ''}>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className="h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-white text-sm"
            style={{
              backgroundColor: avatarColor,
              fontSize: typography.label.size,
            }}
          >
            {author.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 
                    className="text-white font-semibold"
                    style={{
                      fontSize: typography.body.size,
                      fontWeight: '600',
                    }}
                  >
                    {title}
                  </h3>
                  {isImportant && <Pin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#A78BFA' }} />}
                </div>
                <div 
                  style={{
                    fontSize: typography.caption.size,
                    color: colors.foreground.tertiary,
                  }}
                >
                  {author} · {timeAgo}
                </div>
              </div>

              <button
                className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                style={{
                  backgroundColor: isExpanded ? `${colors.foreground.primary}10` : 'transparent',
                  transition: animations.transition.default,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
              >
                <ChevronDown className="h-4 w-4" style={{ color: colors.foreground.tertiary }} />
              </button>
            </div>

            {/* Content */}
            <p
              className={`leading-relaxed transition-all ${
                isExpanded ? 'line-clamp-none' : 'line-clamp-2'
              }`}
              style={{
                fontSize: typography.bodySmall.size,
                color: colors.foreground.secondary,
                lineHeight: typography.bodySmall.lineHeight,
              }}
            >
              {content}
            </p>

            {/* Actions */}
            {isExpanded && (
              <div className="mt-4 pt-4 flex gap-2" style={{ borderTop: `1px solid ${colors.border.subtle}` }}>
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: `${colors.foreground.primary}15`,
                    color: colors.foreground.primary,
                    fontSize: typography.label.size,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: `${colors.foreground.primary}05`,
                    color: colors.foreground.secondary,
                    fontSize: typography.label.size,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </TimelineCard>
  )
}
