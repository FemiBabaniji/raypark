"use client"

import { useState } from "react"
import { Meeting } from "@/types/meeting"
import { TimelineCard } from "@/components/ui/timeline-card"
import { Clock, Users } from 'lucide-react'
import { colors, typography } from "@/lib/design-system"

interface MeetingCardProps {
  meeting: Meeting
  onClick?: (meetingId: string) => void
}

export function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <TimelineCard
      onClick={() => onClick?.(meeting.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer"
      isHovered={isHovered}
      accentColor={colors.accent.purple}
    >
      <div className="flex flex-col min-h-[140px]">
        <div className="mb-4">
          <h3 
            className="font-bold leading-tight text-balance"
            style={{
              ...typography.h2,
              color: colors.foreground.primary
            }}
          >
            {meeting.title}
          </h3>
          <p 
            className="mt-2"
            style={{ 
              ...typography.caption, 
              color: colors.foreground.secondary 
            }}
          >
            {meeting.host}
          </p>
        </div>

        <div className="mt-auto space-y-2">
          <div 
            className="flex items-center gap-2" 
            style={{ 
              ...typography.caption, 
              color: colors.foreground.secondary 
            }}
          >
            <Clock className="w-4 h-4 flex-shrink-0" style={{ color: colors.accent.purple }} />
            <span>{meeting.date} • {meeting.time}</span>
          </div>

          <div 
            className="flex items-center justify-between pt-4 mt-4" 
            style={{ borderTop: `1px solid ${colors.foreground.primary}10` }}
          >
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: `${colors.accent.purple}20` }}
            >
              <Users className="w-4 h-4" style={{ color: colors.accent.purple }} />
              <span className="font-semibold text-sm" style={{ color: colors.accent.purple }}>
                {meeting.attendees}
              </span>
            </div>
          </div>
        </div>
      </div>
    </TimelineCard>
  )
}
