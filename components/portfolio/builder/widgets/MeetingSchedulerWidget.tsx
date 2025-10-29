"use client"

import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

type MeetingSchedulerContent = {
  title: string
  events: Array<{
    id: number
    name: string
    location: string
    time: string
    date: number
  }>
  zones: Array<{
    id: number
    name: string
    available: number
  }>
  timeSlots: Array<{
    id: number
    time: string
    available: boolean
  }>
}

type Props = {
  widgetId: string
  column: "left" | "right"
  isPreviewMode: boolean
  content: MeetingSchedulerContent
  onContentChange: (content: MeetingSchedulerContent) => void
  onDelete: () => void
  onMove: () => void
}

export default function MeetingSchedulerWidget({
  widgetId,
  column,
  isPreviewMode,
  content,
  onContentChange,
  onDelete,
  onMove,
}: Props) {
  const [view, setView] = useState<"calendar" | "events" | "zones" | "slots" | "confirmation">("calendar")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [selectedZone, setSelectedZone] = useState<any>(null)
  const [selectedSlot, setSelectedSlot] = useState<any>(null)

  const safeContent = content || {
    title: "Schedule Meeting",
    events: [
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
    ],
    zones: [
      { id: 1, name: "Zone A", available: 5 },
      { id: 2, name: "Zone B", available: 3 },
      { id: 3, name: "Zone C", available: 0 },
      { id: 4, name: "Zone D", available: 2 },
    ],
    timeSlots: [
      { id: 1, time: "6:00 PM", available: true },
      { id: 2, time: "6:30 PM", available: true },
      { id: 3, time: "7:00 PM", available: false },
      { id: 4, time: "7:30 PM", available: true },
      { id: 5, time: "8:00 PM", available: true },
      { id: 6, time: "8:30 PM", available: false },
    ],
  }

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

  const hasEvent = (day: number) => {
    return safeContent.events.some((event) => event.date === day)
  }

  const getEventsForDay = (day: number) => {
    return safeContent.events.filter((event) => event.date === day)
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-colors group relative overflow-hidden"
    >
      {/* Widget Controls */}
      {!isPreviewMode && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
          <Button
            size="sm"
            variant="ghost"
            onClick={onMove}
            className="p-1 h-7 w-7 bg-white/10 hover:bg-white/20 text-white"
            title={`Move to ${column === "left" ? "right" : "left"} column`}
          >
            <ArrowRight className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="p-1 h-7 w-7 bg-red-500/20 hover:bg-red-500/30 text-white"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            {view !== "calendar" && (
              <button onClick={handleBack} className="text-white/70 hover:text-white transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <Calendar className="w-4 h-4" />
            <h2 className="text-sm font-bold">
              {view === "calendar" && safeContent.title}
              {view === "events" && "Select Event"}
              {view === "zones" && "Select Zone"}
              {view === "slots" && "Pick Time"}
              {view === "confirmation" && "Confirm"}
            </h2>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {view === "calendar" && (
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="p-1 hover:bg-white/10 rounded-lg transition"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <h3 className="text-xs font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="p-1 hover:bg-white/10 rounded-lg transition"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div key={i} className="text-center text-xs text-white/50 font-medium py-0.5">
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
                            ? "bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 cursor-pointer font-medium"
                            : "bg-white/5 text-white/30 cursor-default"
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
                    className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-3 text-left transition"
                  >
                    <h3 className="font-semibold text-xs mb-1.5">{event.name}</h3>
                    <div className="flex items-start gap-1.5 text-xs text-white/70 mb-1">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/70">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs">{event.time}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {view === "zones" && (
              <div className="grid grid-cols-2 gap-2">
                {safeContent.zones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => handleZoneClick(zone)}
                    disabled={zone.available === 0}
                    className={`rounded-xl p-3 text-center transition ${
                      zone.available > 0
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 cursor-pointer"
                        : "bg-white/5 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-base font-bold mb-1">{zone.name}</div>
                    <div className="text-xs text-white/70">
                      {zone.available > 0 ? `${zone.available} slots` : "Fully booked"}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {view === "slots" && (
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {safeContent.timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotClick(slot)}
                    disabled={!slot.available}
                    className={`rounded-xl p-2.5 text-center transition ${
                      slot.available
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 cursor-pointer"
                        : "bg-white/5 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className={`font-semibold text-xs ${!slot.available ? "line-through" : ""}`}>{slot.time}</div>
                    <div className="text-xs text-white/70 mt-0.5">25 min</div>
                  </button>
                ))}
              </div>
            )}

            {view === "confirmation" && (
              <div className="space-y-3">
                <div className="bg-white/10 rounded-xl p-3 space-y-2">
                  <div>
                    <div className="text-xs text-white/50 mb-0.5">Event</div>
                    <div className="font-semibold text-xs">{selectedEvent.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-0.5">Location</div>
                    <div className="font-medium text-xs">{selectedEvent.location}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-0.5">Networking Zone</div>
                    <div className="font-medium text-xs">{selectedZone.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-0.5">Time</div>
                    <div className="font-medium text-xs">{selectedSlot.time} (25 minutes)</div>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  className="w-full bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 font-semibold py-2 rounded-xl transition text-xs"
                >
                  Send Meeting Invitation
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
