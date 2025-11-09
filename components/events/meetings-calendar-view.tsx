"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  host: string
  attendees: number
  type: "1-on-1" | "team" | "all-hands"
}

interface MeetingsCalendarViewProps {
  meetings: Meeting[]
  onMeetingClick?: (meetingId: string) => void
}

export function MeetingsCalendarView({ meetings, onMeetingClick }: MeetingsCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const parseMeetingDate = (dateStr: string) => {
    // Parse "Sept 2" format
    const parts = dateStr.split(" ")
    const month = monthNames.findIndex((m) => m.toLowerCase().startsWith(parts[0].toLowerCase()))
    const day = Number.parseInt(parts[1])
    const year = currentDate.getFullYear()
    return { day, month, year }
  }

  const getMeetingsForDay = (day: number) => {
    return meetings.filter((meeting) => {
      const meetingDate = parseMeetingDate(meeting.date)
      return (
        meetingDate.day === day &&
        meetingDate.month === currentDate.getMonth() &&
        meetingDate.year === currentDate.getFullYear()
      )
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const getMeetingColor = (type: Meeting["type"]) => {
    switch (type) {
      case "1-on-1":
        return "from-blue-500/20 to-cyan-500/20 border-blue-400/30"
      case "team":
        return "from-purple-500/20 to-pink-500/20 border-purple-400/30"
      case "all-hands":
        return "from-emerald-500/20 to-teal-500/20 border-emerald-400/30"
      default:
        return "from-zinc-500/20 to-zinc-600/20 border-zinc-400/30"
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-sm font-semibold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={previousMonth}
            className="p-1 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
          >
            <ChevronLeft className="h-3 w-3 text-zinc-400" />
          </button>
          <button onClick={nextMonth} className="p-1 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
            <ChevronRight className="h-3 w-3 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 flex-1 overflow-y-auto">
        {/* Day headers */}
        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
          <div key={`${day}-${idx}`} className="text-center py-1 text-[10px] font-medium text-zinc-500">
            {day}
          </div>
        ))}

        {/* Empty days */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const dayMeetings = getMeetingsForDay(day)
          const isToday =
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()

          return (
            <div
              key={day}
              className={`
                aspect-square border rounded p-1 transition-all
                ${isToday ? "border-blue-500/50 bg-blue-500/5" : "border-zinc-800 bg-zinc-900/30"}
                ${dayMeetings.length > 0 ? "cursor-pointer hover:border-zinc-700" : ""}
              `}
            >
              <div className="h-full flex flex-col">
                <div className={`text-[10px] font-medium mb-0.5 ${isToday ? "text-blue-400" : "text-zinc-400"}`}>
                  {day}
                </div>
                <div className="flex-1 space-y-0.5 overflow-hidden">
                  {dayMeetings.slice(0, 1).map((meeting) => (
                    <div
                      key={meeting.id}
                      onClick={() => onMeetingClick?.(meeting.id)}
                      className={`
                        text-[8px] p-0.5 rounded border bg-gradient-to-br
                        ${getMeetingColor(meeting.type)}
                        hover:scale-105 transition-transform cursor-pointer
                      `}
                    >
                      <div className="font-medium text-white/90 truncate leading-tight">{meeting.title}</div>
                    </div>
                  ))}
                  {dayMeetings.length > 1 && (
                    <div className="text-[8px] text-zinc-500 text-center">+{dayMeetings.length - 1}</div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
