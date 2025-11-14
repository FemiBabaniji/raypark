"use client"

import { useState } from "react"
import { LayoutGrid, Calendar, ChevronRight, ChevronDown, Users, Clock, MapPin } from 'lucide-react'
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
  const [expandedMeeting, setExpandedMeeting] = useState<string | null>(null)

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
        return "bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-l-4 border-purple-500/70"
      case "team":
        return "bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-l-4 border-blue-500/70"
      case "all-hands":
        return "bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-l-4 border-cyan-500/70"
      default:
        return "bg-gradient-to-br from-zinc-500/10 to-zinc-600/5 border-l-4 border-zinc-500/70"
    }
  }

  const handleMeetingClick = (meetingId: string) => {
    setExpandedMeeting(expandedMeeting === meetingId ? null : meetingId)
    onMeetingClick?.(meetingId)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Meetings</h3>
          <p className="text-zinc-400 text-sm">Your upcoming schedule</p>
        </div>
        <div className="flex gap-1.5 bg-zinc-900/50 rounded-xl p-1.5 border border-zinc-800/50">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list" ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "calendar" ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
            }`}
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {viewMode === "list" ? (
          <div className="space-y-6 h-full overflow-y-auto pr-2">
            {upcomingMeetings.map((meeting) => {
              const isExpanded = expandedMeeting === meeting.id
              return (
                <div key={meeting.id} className="transition-all duration-300">
                  <button
                    onClick={() => handleMeetingClick(meeting.id)}
                    className={`w-full text-left ${getTypeStyles(meeting.type)} backdrop-blur-sm rounded-2xl p-6 transition-all hover:scale-[1.01] shadow-lg shadow-black/20 border border-white/5`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg mb-2 line-clamp-1">{meeting.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-zinc-400 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{meeting.date} • {meeting.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            <span>{meeting.attendees}</span>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-500">Hosted by {meeting.host}</p>
                      </div>
                      <div className="ml-4">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-zinc-400 transition-transform" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-zinc-400 transition-transform" />
                        )}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-4 bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-lg shadow-black/20 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wide">Description</h4>
                          <p className="text-white text-base leading-relaxed">
                            Join us for an important discussion about project progress, team updates, and upcoming milestones. Come prepared with your questions and updates.
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wide">Location</h4>
                          <div className="flex items-start gap-3 text-white">
                            <MapPin className="h-5 w-5 text-zinc-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Virtual Meeting</p>
                              <p className="text-sm text-zinc-400 mt-1">Zoom link will be sent 15 minutes before</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wide">Attendees</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {[...Array(Math.min(meeting.attendees, 5))].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-zinc-900 flex items-center justify-center text-xs font-semibold text-white"
                                >
                                  {String.fromCharCode(65 + i)}
                                </div>
                              ))}
                            </div>
                            {meeting.attendees > 5 && (
                              <span className="text-sm text-zinc-400 ml-2">
                                +{meeting.attendees - 5} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-800/50">
                          <button className="w-full py-3 px-4 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-zinc-100 transition-colors">
                            Join Meeting
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <MeetingsCalendarView meetings={upcomingMeetings} onMeetingClick={onMeetingClick} />
        )}
      </div>
    </div>
  )
}
