"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  X,
  GripVertical,
  Palette,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { THEME_COLOR_OPTIONS } from "@/lib/theme"
import type { ThemeIndex } from "@/lib/theme"

export type MeetingSchedulerContent = {
  mode?: "custom" | "calendly"
  calendlyUrl?: string
}

export default function MeetingSchedulerWidget({
  widgetId,
  column,
  isPreviewMode = false,
  onDelete,
  selectedColor = 5 as ThemeIndex,
  onColorChange,
  content,
  onContentChange,
}: {
  widgetId: string
  column: "left" | "right"
  isPreviewMode?: boolean
  onDelete?: () => void
  selectedColor?: ThemeIndex
  onColorChange?: (color: ThemeIndex) => void
  content?: MeetingSchedulerContent
  onContentChange?: (content: MeetingSchedulerContent) => void
}) {
  const [mode, setMode] = useState<"custom" | "calendly">(content?.mode || "custom")
  const [calendlyUrl, setCalendlyUrl] = useState(content?.calendlyUrl || "https://calendly.com/your-username/30min")
  const [isEditingUrl, setIsEditingUrl] = useState(false)

  const [view, setView] = useState<"calendar" | "events" | "zones" | "slots" | "confirmation">("calendar")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [selectedZone, setSelectedZone] = useState<any>(null)
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const gradient = THEME_COLOR_OPTIONS[selectedColor]?.gradient ?? "from-teal-400/40 to-teal-600/60"

  useEffect(() => {
    if (onContentChange) {
      onContentChange({ mode, calendlyUrl })
    }
  }, [mode, calendlyUrl, onContentChange])

  useEffect(() => {
    if (mode === "calendly") {
      const script = document.createElement("script")
      script.src = "https://assets.calendly.com/assets/external/widget.js"
      script.async = true
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [mode])

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
    <div
      className={`bg-gradient-to-br ${gradient} backdrop-blur-xl rounded-3xl p-6 group cursor-grab active:cursor-grabbing relative`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          {mode === "custom" && view !== "calendar" && (
            <button onClick={handleBack} className="text-white/70 hover:text-white transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <Calendar className="w-4 h-4" />
          <h2 className="text-sm font-bold">
            {mode === "calendly" && "Schedule Meeting"}
            {mode === "custom" && view === "calendar" && "Schedule Meeting"}
            {mode === "custom" && view === "events" && "Select Event"}
            {mode === "custom" && view === "zones" && "Select Zone"}
            {mode === "custom" && view === "slots" && "Pick Time"}
            {mode === "custom" && view === "confirmation" && "Confirm"}
          </h2>
        </div>
        {!isPreviewMode && (
          <div className="flex items-center gap-2">
            <div className="relative">
              {showColorPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-4 z-50 min-w-[200px]">
                  <div className="grid grid-cols-3 gap-3">
                    {THEME_COLOR_OPTIONS.map((color, idx) => (
                      <button
                        key={color.name}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient} ${
                          selectedColor === idx ? "ring-2 ring-white" : ""
                        } hover:ring-2 hover:ring-white/50 transition-all`}
                        onClick={() => {
                          const i = idx as ThemeIndex
                          onColorChange?.(i)
                          setShowColorPicker(false)
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 text-white p-2"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <Palette className="w-4 h-4" />
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2"
              onClick={onDelete}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-5 h-5 text-white/70" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("custom")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition ${
            mode === "custom" ? "bg-white/30 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          Custom Scheduler
        </button>
        <button
          onClick={() => setMode("calendly")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition ${
            mode === "calendly" ? "bg-white/30 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          Calendly
        </button>
      </div>

      {mode === "calendly" && (
        <div className="space-y-3">
          {!isPreviewMode && (
            <div className="bg-white/20 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-white/90">Calendly URL</label>
                <button
                  onClick={() => setIsEditingUrl(!isEditingUrl)}
                  className="text-xs text-white/70 hover:text-white transition"
                >
                  {isEditingUrl ? "Done" : "Edit"}
                </button>
              </div>
              {isEditingUrl ? (
                <input
                  type="text"
                  value={calendlyUrl}
                  onChange={(e) => setCalendlyUrl(e.target.value)}
                  placeholder="https://calendly.com/your-username/30min"
                  className="w-full bg-white/20 text-white placeholder:text-white/50 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              ) : (
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <span className="truncate">{calendlyUrl}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </div>
              )}
            </div>
          )}

          <div className="bg-white/10 rounded-xl overflow-hidden" style={{ minHeight: "500px" }}>
            <div
              className="calendly-inline-widget"
              data-url={calendlyUrl}
              style={{ minWidth: "100%", height: "500px" }}
            />
          </div>
        </div>
      )}

      {mode === "custom" && (
        <>
          {view === "calendar" && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-1 hover:bg-white/20 rounded-lg transition"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <h3 className="text-xs font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-1 hover:bg-white/20 rounded-lg transition"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div key={i} className="text-center text-xs text-white/70 font-medium py-0.5">
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
                          ? "bg-white/30 hover:bg-white/40 cursor-pointer font-medium"
                          : "bg-white/10 text-white/40 cursor-default"
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
                  className="w-full bg-white/20 hover:bg-white/30 rounded-xl p-3 text-left transition"
                >
                  <h3 className="font-semibold text-xs mb-1.5">{event.name}</h3>
                  <div className="flex items-start gap-1.5 text-xs text-white/80 mb-1">
                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="text-xs">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/80">
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
                      ? "bg-white/30 hover:bg-white/40 cursor-pointer"
                      : "bg-white/10 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="text-base font-bold mb-1">{zone.name}</div>
                  <div className="text-xs text-white/80">
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
                      ? "bg-white/30 hover:bg-white/40 cursor-pointer"
                      : "bg-white/10 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className={`font-semibold text-xs ${!slot.available ? "line-through" : ""}`}>{slot.time}</div>
                  <div className="text-xs text-white/80 mt-0.5">25 min</div>
                </button>
              ))}
            </div>
          )}

          {view === "confirmation" && (
            <div className="space-y-3">
              <div className="bg-white/20 rounded-xl p-3 space-y-2">
                <div>
                  <div className="text-xs text-white/70 mb-0.5">Event</div>
                  <div className="font-semibold text-xs">{selectedEvent.name}</div>
                </div>
                <div>
                  <div className="text-xs text-white/70 mb-0.5">Location</div>
                  <div className="font-medium text-xs">{selectedEvent.location}</div>
                </div>
                <div>
                  <div className="text-xs text-white/70 mb-0.5">Networking Zone</div>
                  <div className="font-medium text-xs">{selectedZone.name}</div>
                </div>
                <div>
                  <div className="text-xs text-white/70 mb-0.5">Time</div>
                  <div className="font-medium text-xs">{selectedSlot.time} (25 minutes)</div>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full bg-white/30 hover:bg-white/40 font-semibold py-2 rounded-xl transition text-xs"
              >
                Send Meeting Invitation
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
