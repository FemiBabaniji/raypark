"use client"

import { useState } from "react"
import { Meeting } from "@/types/meeting"

interface MeetingCardProps {
  meeting: Meeting
  onClick?: (meetingId: string) => void
}

const MEETING_ACCENT_COLORS = {
  team: "#3b82f6", // blue
  "1-on-1": "#10b981", // green
  "all-hands": "#8b5cf6", // purple
}

export function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const accentColor = MEETING_ACCENT_COLORS[meeting.type as keyof typeof MEETING_ACCENT_COLORS] || "#3b82f6"

  return (
    <button
      type="button"
      onClick={() => onClick?.(meeting.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden
        bg-zinc-900/50
        rounded-2xl 
        p-4
        transition-all duration-300 ease-out
        ${isHovered ? "scale-[1.01]" : ""}
        text-left text-white
        w-full
        shadow-lg
        border border-white/5
      `}
      style={{
        borderLeft: `3px solid ${accentColor}`
      }}
    >
      <div className="space-y-1.5">
        <h3 className="text-sm font-semibold text-white">
          {meeting.title}
        </h3>
        <p className="text-xs text-white/60">{meeting.host}</p>
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-white/50">
            {meeting.date} • {meeting.time}
          </p>
          <p className="text-xs text-white/50">
            {meeting.attendees} attending
          </p>
        </div>
      </div>
    </button>
  )
}
