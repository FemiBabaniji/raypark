"use client"

import { useState } from "react"
import { LayoutGrid, Calendar, Plus } from 'lucide-react'
import { MeetingsCalendarView } from "./meetings-calendar-view"

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  host: string
  attendees: number
  type: "1-on-1" | "team" | "all-hands"
}

interface MeetingsSectionProps {
  onMeetingClick?: (meetingId: string) => void
}

export function MeetingsSection({ onMeetingClick }: MeetingsSectionProps) {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")

  const upcomingMeetings: Meeting[] = [
    {
      id: "1",
      title: "Weekly Sync",
      date: "Sept 2",
      time: "10:00 AM",
      host: "Sarah Chen",
      attendees: 8,
      type: "team",
    },
    {
      id: "2",
      title: "1:1 Check-in",
      date: "Sept 3",
      time: "2:00 PM",
      host: "Marcus J.",
      attendees: 2,
      type: "1-on-1",
    },
    {
      id: "3",
      title: "All Hands",
      date: "Sept 5",
      time: "11:00 AM",
      host: "Leadership",
      attendees: 45,
      type: "all-hands",
    },
    {
      id: "4",
      title: "Project Review",
      date: "Sept 6",
      time: "3:00 PM",
      host: "Elena R.",
      attendees: 12,
      type: "team",
    },
  ]

  const getTypeStyles = (type: Meeting["type"]) => {
    switch (type) {
      case "1-on-1":
        return "bg-zinc-800/50 hover:bg-zinc-800/70 border-l-4 border-l-purple-500/70"
      case "team":
        return "bg-zinc-800/50 hover:bg-zinc-800/70 border-l-4 border-l-blue-500/70"
      case "all-hands":
        return "bg-zinc-800/50 hover:bg-zinc-800/70 border-l-4 border-l-cyan-500/70"
      default:
        return "bg-zinc-800/50 hover:bg-zinc-800/70 border-l-4 border-l-zinc-500/70"
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-white">My Meetings</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
            <Plus className="h-4 w-4" />
            Create
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <button
          onClick={() => setViewMode("list")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "list" 
              ? "bg-zinc-700 text-white" 
              : "bg-zinc-800/30 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
          }`}
        >
          List
        </button>
        <button
          onClick={() => setViewMode("calendar")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "calendar" 
              ? "bg-zinc-700 text-white" 
              : "bg-zinc-800/30 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
          }`}
        >
          Calendar
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === "list" ? (
          <div className="space-y-3 h-full overflow-y-auto pr-2">
            {upcomingMeetings.map((meeting) => (
              <button
                key={meeting.id}
                onClick={() => onMeetingClick?.(meeting.id)}
                className={`w-full text-left ${getTypeStyles(meeting.type)} rounded-xl p-4 transition-all border border-white/5`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-base mb-1">{meeting.title}</h3>
                    <p className="text-sm text-zinc-400">{meeting.host}</p>
                  </div>
                  <div className="text-xs text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded">
                    {meeting.type}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-white/5 pt-3">
                  <div className="text-zinc-400">
                    <div>{meeting.date}</div>
                    <div className="text-xs">{meeting.time}</div>
                  </div>
                  <span className="text-zinc-400 text-xs">{meeting.attendees} attending</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <MeetingsCalendarView meetings={upcomingMeetings} onMeetingClick={onMeetingClick} />
        )}
      </div>
    </div>
  )
}
