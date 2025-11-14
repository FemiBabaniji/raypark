"use client"

import { useState } from "react"
import { Calendar, Clock, Users } from 'lucide-react'
import { Meeting } from "@/types/meeting"

interface MeetingCardProps {
  meeting: Meeting
  onClick?: (meetingId: string) => void
}

export function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getTagColor = (type: Meeting["type"]) => {
    switch (type) {
      case "1-on-1":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "team":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "all-hands":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
      default:
        return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
    }
  }

  const getTypeLabel = (type: Meeting["type"]) => {
    switch (type) {
      case "1-on-1":
        return "One-on-One"
      case "team":
        return "Team Meeting"
      case "all-hands":
        return "All Hands"
      default:
        return "Meeting"
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
        border border-white/10
        rounded-3xl 
        p-5
        transition-all duration-300 ease-out
        ${isHovered ? "scale-[1.02] border-white/20" : ""}
        text-left text-white
        w-full
        shadow-lg
      `}
      style={{
        minHeight: "200px",
      }}
    >
      <div className="relative flex flex-col justify-between h-full">
        <div className="mb-3">
          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border mb-2 ${getTagColor(meeting.type)}`}>
            {getTypeLabel(meeting.type)}
          </div>
          <h3 className="text-xl font-bold leading-tight text-balance text-white mb-1">
            {meeting.title}
          </h3>
          <p className="text-sm text-white/60">{meeting.host}</p>
        </div>

        <div className="mt-auto space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-white/85">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
              <span className="font-medium">{meeting.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/85">
              <Clock className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
              <span className="font-medium">{meeting.time}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
              <Users className="w-3.5 h-3.5" />
              <span className="font-semibold text-xs">{meeting.attendees}</span>
            </div>
            <div
              className={`
                px-4 py-2 
                bg-white/95 text-black 
                font-semibold rounded-full text-xs
                transition-all
                ${isHovered ? "bg-white" : ""}
              `}
            >
              View
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
