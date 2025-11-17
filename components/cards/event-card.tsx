"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { TimelineCard } from "@/components/ui/timeline-card"
import { colors, typography, shadows } from "@/lib/design-system"

interface EventCardProps {
  title: string
  date: string
  description: string
  time: string
  attending: number
  location?: string
  instructor?: string
  tags?: string[]
  dateLabel?: string
  onEventClick?: (eventId: string) => void
}

export function EventCard({ 
  title, 
  date, 
  description, 
  time, 
  attending, 
  location, 
  onEventClick 
}: EventCardProps) {
  const getEventAccent = (title: string) => {
    if (title.includes("Workshop") || title.includes("AI") || title.includes("Machine Learning")) {
      return colors.accent.blue
    } 
    if (title.includes("Networking") || title.includes("Mixer") || title.includes("Founder")) {
      return colors.accent.green
    } 
    if (title.includes("Masterclass") || title.includes("Design") || title.includes("Product")) {
      return colors.accent.purple
    }
    return colors.accent.blue
  }

  const getEventType = (title: string) => {
    if (title.includes("Workshop")) return "Workshop"
    if (title.includes("Mixer") || title.includes("Networking")) return "Networking"
    if (title.includes("Masterclass")) return "Masterclass"
    return "Event"
  }

  const accent = getEventAccent(title)
  const type = getEventType(title)

  const handleEventClick = () => {
    if (onEventClick) {
      if (title.includes("AI & Machine Learning")) {
        onEventClick("ai-ml-workshop")
      } else if (title.includes("Founder Networking")) {
        onEventClick("founder-networking-mixer")
      } else if (title.includes("Product Design")) {
        onEventClick("product-design-masterclass")
      }
    }
  }

  return (
    <TimelineCard
      onClick={handleEventClick}
      accentColor={accent}
      className="w-56 sm:w-64 flex-shrink-0"
    >
      <div className="flex flex-col h-full min-h-[260px]">
        <div className="mb-4">
          <div 
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
            style={{
              backgroundColor: `${accent}20`,
              color: accent,
              ...typography.caption
            }}
          >
            {type}
          </div>
          <h3 
            className="font-bold leading-tight text-balance"
            style={{
              ...typography.h2,
              color: colors.foreground.primary
            }}
          >
            {title}
          </h3>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2" style={{ ...typography.caption, color: colors.foreground.secondary }}>
            <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2" style={{ ...typography.caption, color: colors.foreground.secondary }}>
            <Clock className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
            <span>{time}</span>
          </div>
          {location && (
            <div className="flex items-center gap-2" style={{ ...typography.caption, color: colors.foreground.secondary }}>
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
              <span className="truncate">{location}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 mt-4" style={{ borderTop: `1px solid ${colors.foreground.primary}10` }}>
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: `${accent}20` }}
            >
              <Users className="w-4 h-4" style={{ color: accent }} />
              <span className="font-semibold text-sm" style={{ color: accent }}>{attending}</span>
            </div>
            <div
              className="px-4 py-2 font-semibold rounded-full text-xs transition-all"
              style={{
                backgroundColor: accent,
                color: colors.background.primary,
              }}
            >
              View
            </div>
          </div>
        </div>
      </div>
    </TimelineCard>
  )
}
