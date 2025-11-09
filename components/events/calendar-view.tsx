"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Event {
  title: string
  date: string
  description: string
  time: string
  attending: number
  dateLabel: string
  location?: string
  instructor?: string
  tags?: string[]
  type: string
}

interface CalendarViewProps {
  events: Event[]
  onEventClick?: (eventId: string) => void
}

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
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

  const parseEventDate = (dateStr: string) => {
    // Parse "1 Sept 2025" format
    const parts = dateStr.split(" ")
    const day = Number.parseInt(parts[0])
    const month = monthNames.findIndex((m) => m.toLowerCase().startsWith(parts[1].toLowerCase()))
    const year = Number.parseInt(parts[2])
    return { day, month, year }
  }

  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = parseEventDate(event.date)
      return (
        eventDate.day === day &&
        eventDate.month === currentDate.getMonth() &&
        eventDate.year === currentDate.getFullYear()
      )
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const getEventColor = (type: string) => {
    switch (type) {
      case "workshop":
        return "from-cyan-500/20 to-blue-500/20 border-cyan-400/30"
      case "mixer":
        return "from-emerald-500/20 to-teal-500/20 border-emerald-400/30"
      case "masterclass":
        return "from-purple-500/20 to-pink-500/20 border-purple-400/30"
      default:
        return "from-zinc-500/20 to-zinc-600/20 border-zinc-400/30"
    }
  }

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-zinc-400" />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
            <ChevronRight className="h-5 w-5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center py-3 text-sm font-medium text-zinc-500">
            {day}
          </div>
        ))}

        {/* Empty days */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const dayEvents = getEventsForDay(day)
          const isToday =
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()

          return (
            <div
              key={day}
              className={`
                aspect-square border rounded-xl p-2 transition-all
                ${isToday ? "border-blue-500/50 bg-blue-500/5" : "border-zinc-800 bg-zinc-900/30"}
                ${dayEvents.length > 0 ? "cursor-pointer hover:border-zinc-700" : ""}
              `}
            >
              <div className="h-full flex flex-col">
                <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-400" : "text-zinc-400"}`}>{day}</div>
                <div className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
                  {dayEvents.map((event, idx) => (
                    <div
                      key={idx}
                      onClick={() => onEventClick?.(event.title)}
                      className={`
                        text-xs p-1.5 rounded-md border bg-gradient-to-br
                        ${getEventColor(event.type)}
                        hover:scale-105 transition-transform cursor-pointer
                      `}
                    >
                      <div className="font-medium text-white/90 truncate">{event.title}</div>
                      <div className="text-white/60 text-[10px] mt-0.5">{event.time.split(" - ")[0]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
