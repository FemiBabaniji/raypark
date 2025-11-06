"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Panel } from "@/components/ui/panel"

interface CalendarEvent {
  id: string
  title: string
  type: "event" | "meeting"
  time: string
  color: string
}

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  events: CalendarEvent[]
  meetings: CalendarEvent[]
}

export function CalendarView({ onDayClick }: { onDayClick?: (date: Date, events: CalendarEvent[]) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedFilter, setSelectedFilter] = useState<"all" | "events" | "meetings">("all")
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  // Mock calendar data
  const calendarEvents: Record<string, CalendarEvent[]> = {
    "2024-12-15": [
      { id: "1", title: "AI & ML Workshop", type: "event", time: "2:00 PM", color: "#0EA5E9" },
      { id: "2", title: "1:1 with Sarah Chen", type: "meeting", time: "4:30 PM", color: "#8B5CF6" },
    ],
    "2024-12-18": [{ id: "3", title: "Founder Networking Mixer", type: "event", time: "6:00 PM", color: "#10B981" }],
    "2024-12-20": [
      { id: "4", title: "Product Design Masterclass", type: "event", time: "10:00 AM", color: "#8B5CF6" },
      { id: "5", title: "1:1 with Marcus Johnson", type: "meeting", time: "2:00 PM", color: "#8B5CF6" },
    ],
  }

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: CalendarDay[] = []

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        events: [],
        meetings: [],
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
      const dayEvents = calendarEvents[dateKey] || []
      days.push({
        date: i,
        isCurrentMonth: true,
        events: dayEvents.filter((e) => e.type === "event"),
        meetings: dayEvents.filter((e) => e.type === "meeting"),
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        events: [],
        meetings: [],
      })
    }

    return days
  }

  const days = getDaysInMonth(currentDate)
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

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDayClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date)
    setSelectedDay(clickedDate)
    const allItems = [...day.events, ...day.meetings]
    onDayClick?.(clickedDate, allItems)
  }

  const getFilteredItems = (day: CalendarDay) => {
    if (selectedFilter === "events") return day.events
    if (selectedFilter === "meetings") return day.meetings
    return [...day.events, ...day.meetings]
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Panel variant="widget" className="p-6 bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={previousMonth} className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={nextMonth} className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all", label: "All" },
            { key: "events", label: "Events" },
            { key: "meetings", label: "Meetings" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key as typeof selectedFilter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedFilter === filter.key
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-zinc-400 py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const filteredItems = getFilteredItems(day)
            const hasItems = filteredItems.length > 0
            const isToday =
              day.isCurrentMonth &&
              day.date === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()

            return (
              <button
                key={index}
                onClick={() => handleDayClick(day)}
                disabled={!day.isCurrentMonth}
                className={`
                  aspect-square rounded-xl p-2 transition-all relative
                  ${day.isCurrentMonth ? "bg-zinc-800 hover:bg-zinc-700" : "bg-transparent"}
                  ${isToday ? "ring-2 ring-blue-500" : ""}
                  ${hasItems && day.isCurrentMonth ? "ring-1 ring-zinc-600" : ""}
                `}
              >
                <div
                  className={`text-sm font-medium ${
                    day.isCurrentMonth ? "text-white" : "text-zinc-600"
                  } ${isToday ? "text-blue-400" : ""}`}
                >
                  {day.date}
                </div>

                {/* Event indicators */}
                {hasItems && day.isCurrentMonth && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                    {filteredItems.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </Panel>

      {/* Selected Day Details */}
      {selectedDay && (
        <Panel variant="widget" className="p-6 bg-zinc-900 border border-zinc-800">
          <h3 className="text-xl font-bold text-white mb-4">
            {selectedDay.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </h3>
          <div className="space-y-3">
            {days
              .find((d) => d.date === selectedDay.getDate() && d.isCurrentMonth)
              ?.events.concat(days.find((d) => d.date === selectedDay.getDate() && d.isCurrentMonth)?.meetings || [])
              .map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium text-white">{item.title}</span>
                      </div>
                      <div className="text-xs text-zinc-400">{item.time}</div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        item.type === "event" ? "bg-blue-500/20 text-blue-300" : "bg-purple-500/20 text-purple-300"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Panel>
      )}
    </div>
  )
}
