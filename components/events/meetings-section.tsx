import { useState } from "react"
import { Plus, LayoutGrid, List } from 'lucide-react'
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
  ]

  const getGradientColors = (type: string) => {
    const gradients = {
      team: { from: '#3b82f6', to: '#1e40af' }, // blue
      '1-on-1': { from: '#10b981', to: '#059669' }, // green
      'all-hands': { from: '#a855f7', to: '#7c3aed' }, // purple
      default: { from: '#f97316', to: '#ea580c' } // orange
    }
    return gradients[type as keyof typeof gradients] || gradients.default
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-4 flex-shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Meetings</h2>
          <p className="text-zinc-400 text-sm">Manage your meetings</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list" 
                ? "bg-zinc-800 text-white" 
                : "bg-transparent text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30"
            }`}
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "calendar" 
                ? "bg-zinc-800 text-white" 
                : "bg-transparent text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30"
            }`}
            aria-label="Calendar view"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-0 mb-4">
        {viewMode === "list" ? (
          <div className="space-y-2 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {upcomingMeetings.map((meeting) => {
              const colors = getGradientColors(meeting.type)
              return (
                <MeetingCard 
                  key={meeting.id} 
                  title={meeting.title}
                  organizer={meeting.host}
                  date={meeting.date}
                  time={meeting.time}
                  attendees={meeting.attendees}
                  gradientFrom={colors.from}
                  gradientTo={colors.to}
                  subtext={meeting.type === "team" ? "Team Meeting" : meeting.type === "1-on-1" ? "1:1 Meeting" : "All Hands Meeting"}
                />
              )
            })}
          </div>
        ) : (
          <MeetingsCalendarView meetings={upcomingMeetings} onMeetingClick={onMeetingClick} />
        )}
      </div>

      <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-zinc-800/50 hover:bg-zinc-700/50 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
        <Plus className="h-4 w-4" />
        Create
      </button>
    </div>
  )
}
