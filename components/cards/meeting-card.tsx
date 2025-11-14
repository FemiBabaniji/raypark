"use client"

import { useState } from "react"
import { Meeting } from "@/types/meeting"

interface MeetingCardProps {
  meeting: Meeting
  onClick?: (meetingId: string) => void
}

export function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getBorderColor = (type: Meeting["type"]) => {
    switch (type) {
      case "1-on-1":
        return "border-l-purple-500"
      case "team":
        return "border-l-blue-500"
      case "all-hands":
        return "border-l-cyan-500"
      default:
        return "border-l-zinc-500"
    }
  }

  return (
    <button
      type="button"
      onClick={() => onClick?.(meeting.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden
        bg-zinc-900/80
        backdrop-blur-xl
        border-l-4 border-y border-r border-white/10
        ${getBorderColor(meeting.type)}
        rounded-2xl 
        p-4
        transition-all duration-300 ease-out
        ${isHovered ? "scale-[1.01] border-r-white/20 border-y-white/20" : ""}
        text-left text-white
        w-full
        shadow-lg
      `}
    >
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">
          {meeting.title}
        </h3>
        <p className="text-xs text-white/50">{meeting.date}</p>
        <p className="text-xs text-white/50">{meeting.time}</p>
      </div>
    </button>
  )
}
