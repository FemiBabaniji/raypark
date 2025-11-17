"use client"

import { Meeting } from "@/types/meeting"
import { TimelineCard } from '@/components/ui/timeline-card'
import { typography, colors } from '@/lib/design-system'
import { Clock, Users } from 'lucide-react'

interface UnifiedMeetingCardProps {
  meeting: Meeting
  onClick?: (meetingId: string) => void
}

export function UnifiedMeetingCard({ meeting, onClick }: UnifiedMeetingCardProps) {
  return (
    <TimelineCard onClick={() => onClick?.(meeting.id)} className="py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 
            className="text-white font-medium mb-1 truncate"
            style={{
              fontSize: typography.body.size,
              fontWeight: '500',
            }}
          >
            {meeting.title}
          </h3>
          <p 
            className="truncate mb-2"
            style={{ 
              color: colors.foreground.tertiary,
              fontSize: typography.caption.size,
            }}
          >
            {meeting.host}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: colors.foreground.tertiary }} />
              <span 
                style={{ 
                  color: colors.foreground.secondary,
                  fontSize: typography.caption.size,
                }}
              >
                {meeting.date} • {meeting.time}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" style={{ color: colors.foreground.tertiary }} />
              <span 
                style={{ 
                  color: colors.foreground.secondary,
                  fontSize: typography.caption.size,
                }}
              >
                {meeting.attendees}
              </span>
            </div>
          </div>
        </div>
      </div>
    </TimelineCard>
  )
}
