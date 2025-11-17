"use client"

import { useState } from "react"
import { Meeting } from "@/types/meeting"

interface MeetingCardProps {
  meeting: Meeting
  onClick?: (meetingId: string) => void
}

export function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      type="button"
      onClick={() => onClick?.(meeting.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-zinc-800 to-zinc-900
        rounded-2xl 
        p-4
        transition-all duration-300 ease-out
        ${isHovered ? "scale-[1.01]" : ""}
        text-left text-white
        w-full
        shadow-lg
      `}
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
