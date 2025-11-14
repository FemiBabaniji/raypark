"use client"

import { useState } from "react"
import { Plus } from 'lucide-react'
import { MeetingsCalendarView } from "./meetings-calendar-view"
import { MeetingCard } from "@/components/cards/meeting-card"
import { Meeting } from "@/types/meeting"

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

  return (
    <div className="h-full max-h-[600px] flex flex-col">
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

      <div className="flex-1 overflow-hidden min-h-0">
        {viewMode === "list" ? (
          <div className="space-y-2 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {upcomingMeetings.map((meeting) => (
              <MeetingCard 
                key={meeting.id} 
                meeting={meeting} 
                onClick={onMeetingClick}
              />
            ))}
          </div>
        ) : (
          <MeetingsCalendarView meetings={upcomingMeetings} onMeetingClick={onMeetingClick} />
        )}
      </div>
    </div>
  )
}
