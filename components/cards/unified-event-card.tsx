"use client"

import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { TimelineCard } from '@/components/ui/timeline-card'
import { typography, spacing, radius, colors, getEventTypeColor } from '@/lib/design-system'

interface UnifiedEventCardProps {
  title: string
  date: string
  description: string
  time: string
  attending: number
  location?: string
  type?: string
  onEventClick?: (eventId: string) => void
}

export function UnifiedEventCard({ 
  title, 
  date, 
  description, 
  time, 
  attending, 
  location,
  type = 'event',
  onEventClick 
}: UnifiedEventCardProps) {
  const accentColor = getEventTypeColor(type)

  const handleClick = () => {
    if (onEventClick) {
      const eventId = title.toLowerCase().replace(/\s+/g, '-')
      onEventClick(eventId)
    }
  }

  return (
    <TimelineCard onClick={handleClick} className="relative overflow-hidden">
      {/* Timeline accent */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" 
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="pl-4">
        {/* Header */}
        <div className="mb-3">
          <div 
            className="inline-block px-3 py-1 mb-2 text-xs font-medium uppercase tracking-wide rounded-full"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentColor,
              fontSize: typography.caption.size,
            }}
          >
            {type}
          </div>
          <h3 
            className="text-white font-semibold mb-1"
            style={{
              fontSize: typography.h3.size,
              fontWeight: typography.h3.weight,
              lineHeight: typography.h3.lineHeight,
              letterSpacing: typography.h3.letterSpacing,
            }}
          >
            {title}
          </h3>
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: colors.foreground.tertiary }} />
            <span 
              className="text-sm"
              style={{ 
                color: colors.foreground.secondary,
                fontSize: typography.bodySmall.size,
              }}
            >
              {date}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" style={{ color: colors.foreground.tertiary }} />
            <span 
              className="text-sm"
              style={{ 
                color: colors.foreground.secondary,
                fontSize: typography.bodySmall.size,
              }}
            >
              {time}
            </span>
          </div>
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: colors.foreground.tertiary }} />
              <span 
                className="text-sm"
                style={{ 
                  color: colors.foreground.secondary,
                  fontSize: typography.bodySmall.size,
                }}
              >
                {location}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: colors.border.subtle }}>
          <div 
            className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{ 
              backgroundColor: `${accentColor}15`,
              fontSize: typography.caption.size,
            }}
          >
            <Users className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span className="font-semibold" style={{ color: accentColor }}>{attending}</span>
          </div>
          <button
            className="px-4 py-1.5 rounded-full font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: colors.foreground.primary,
              color: colors.background.primary,
              fontSize: typography.label.size,
              fontWeight: typography.label.weight,
            }}
          >
            View
          </button>
        </div>
      </div>
    </TimelineCard>
  )
}
