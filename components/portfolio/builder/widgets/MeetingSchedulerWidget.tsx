"use client"

import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, X, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MeetingSchedulerWidget({
  widgetId,
  column,
  isPreviewMode = false,
  onDelete,
}: {
  widgetId: string
  column: "left" | "right"
  isPreviewMode?: boolean
  onDelete?: () => void
}) {
  const [view, setView] = useState<"calendar" | "events" | "zones" | "slots" | "confirmation">("calendar")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [selectedZone, setSelectedZone] = useState<any>(null)
  const [selectedSlot, setSelectedSlot] = useState<any>(null)

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

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const startingDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const events = [
    {
      id: 1,
      name: "Tech Networking Mixer",
      location: "Downtown Hub",
      time: "6:00 PM - 9:00 PM",
      date: 15,
    },
    {
      id: 2,
      name: "Startup Founders Meetup",
      location: "Innovation Center",
      time: "5:30 PM - 8:30 PM",
      date: 22,
    },
  ]

  const zones = [
    { id: 1, name: "Zone A", available: 5 },
    { id: 2, name: "Zone B", available: 3 },
    { id: 3, name: "Zone C", available: 0 },
    { id: 4, name: "Zone D", available: 2 },
  ]

  const timeSlots = [
    { id: 1, time: "6:00 PM", available: true },
    { id: 2, time: "6:30 PM", available: true },
    { id: 3, time: "7:00 PM", available: false },
    { id: 4, time: "7:30 PM", available: true },
    { id: 5, time: "8:00 PM", available: true },
    { id: 6, time: "8:30 PM", available: false },
  ]

  const hasEvent = (day: number) => {
    return events.some((event) => event.date === day)
  }

  const getEventsForDay = (day: number) => {
    return events.filter((event) => event.date === day)
  }

  const handleDayClick = (day: number) => {
    if (hasEvent(day)) {
      setSelectedDay(day)
      setView("events")
    }
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setView("zones")
  }

  const handleZoneClick = (zone: any) => {
    if (zone.available > 0) {
      setSelectedZone(zone)
      setView("slots")
    }
  }

  const handleSlotClick = (slot: any) => {
    if (slot.available) {
      setSelectedSlot(slot)
      setView("confirmation")
    }
  }

  const handleBack = () => {
    if (view === "events") setView("calendar")
    else if (view === "zones") setView("events")
    else if (view === "slots") setView("zones")
    else if (view === "confirmation") setView("slots")
  }

  const handleConfirm = () => {
    alert("Meeting invitation sent!")
    setView("calendar")
    setSelectedDay(null)
    setSelectedEvent(null)
    setSelectedZone(null)
    setSelectedSlot(null)
  }

  return (
    <div className="bg-gradient-to-br from-teal-800 to-teal-900 rounded-3xl p-6 group cursor-grab active:cursor-grabbing">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          {view !== "calendar" && (
            <button onClick={handleBack} className="text-teal-200 hover:text-white transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <Calendar className="w-4 h-4" />
          <h2 className="text-sm font-bold">
            {view === "calendar" && "Schedule Meeting"}
            {view === "events" && "Select Event"}
            {view === "zones" && "Select Zone"}
            {view === "slots" && "Pick Time"}
            {view === "confirmation" && "Confirm"}
          </h2>
        </div>
        {!isPreviewMode && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2"
              onClick={onDelete}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-5 h-5 text-teal-200" />
            </div>
          </div>
        )}
      </div>

      {view === "calendar" && (
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-1 hover:bg-teal-700 rounded-lg transition"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <h3 className="text-xs font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-1 hover:bg-teal-700 rounded-lg transition"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={i} className="text-center text-xs text-teal-200 font-medium py-0.5">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isEventDay = hasEvent(day)
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  disabled={!isEventDay}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition text-xs ${
                    isEventDay
                      ? "bg-teal-600 hover:bg-teal-500 cursor-pointer font-medium"
                      : "bg-teal-800/50 text-teal-400 cursor-default"
                  }`}
                >
                  <span>{day}</span>
                  {isEventDay && <div className="absolute bottom-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {view === "events" && (
        <div className="space-y-2">
          {getEventsForDay(selectedDay!).map((event) => (
            <button
              key={event.id}
              onClick={() => handleEventClick(event)}
              className="w-full bg-teal-700 hover:bg-teal-600 rounded-xl p-3 text-left transition"
            >
              <h3 className="font-semibold text-xs mb-1.5">{event.name}</h3>
              <div className="flex items-start gap-1.5 text-xs text-teal-100 mb-1">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="text-xs">{event.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-teal-100">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span className="text-xs">{event.time}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {view === "zones" && (
        <div className="grid grid-cols-2 gap-2">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone)}
              disabled={zone.available === 0}
              className={`rounded-xl p-3 text-center transition ${
                zone.available > 0
                  ? "bg-teal-600 hover:bg-teal-500 cursor-pointer"
                  : "bg-teal-800/50 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="text-base font-bold mb-1">{zone.name}</div>
              <div className="text-xs text-teal-100">
                {zone.available > 0 ? `${zone.available} slots` : "Fully booked"}
              </div>
            </button>
          ))}
        </div>
      )}

      {view === "slots" && (
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot)}
              disabled={!slot.available}
              className={`rounded-xl p-2.5 text-center transition ${
                slot.available
                  ? "bg-teal-600 hover:bg-teal-500 cursor-pointer"
                  : "bg-teal-800/50 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className={`font-semibold text-xs ${!slot.available ? "line-through" : ""}`}>{slot.time}</div>
              <div className="text-xs text-teal-100 mt-0.5">25 min</div>
            </button>
          ))}
        </div>
      )}

      {view === "confirmation" && (
        <div className="space-y-3">
          <div className="bg-teal-700/60 rounded-xl p-3 space-y-2">
            <div>
              <div className="text-xs text-teal-200 mb-0.5">Event</div>
              <div className="font-semibold text-xs">{selectedEvent.name}</div>
            </div>
            <div>
              <div className="text-xs text-teal-200 mb-0.5">Location</div>
              <div className="font-medium text-xs">{selectedEvent.location}</div>
            </div>
            <div>
              <div className="text-xs text-teal-200 mb-0.5">Networking Zone</div>
              <div className="font-medium text-xs">{selectedZone.name}</div>
            </div>
            <div>
              <div className="text-xs text-teal-200 mb-0.5">Time</div>
              <div className="font-medium text-xs">{selectedSlot.time} (25 minutes)</div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-teal-600 hover:bg-teal-500 font-semibold py-2 rounded-xl transition text-xs"
          >
            Send Meeting Invitation
          </button>
        </div>
      )}
    </div>
  )
}
