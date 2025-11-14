"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronLeft, Clock, MapPin, X, GripVertical, Palette, ExternalLink, Video, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { THEME_COLOR_OPTIONS } from "@/lib/theme"
import type { ThemeIndex } from "@/lib/theme"

export type MeetingSchedulerContent = {
  mode?: "custom" | "calendly"
  calendlyUrl?: string
}

const mockMeetings = [
  {
    id: "1",
    title: "Product Strategy Discussion",
    date: "Nov 15, 2025",
    time: "2:00 PM - 3:00 PM",
    location: "Virtual - Zoom",
    attendees: 5,
    host: "Sarah Chen",
    description: "Quarterly product roadmap review and strategic planning session.",
    type: "strategy",
  },
  {
    id: "2",
    title: "1:1 with Alex",
    date: "Nov 18, 2025",
    time: "10:00 AM - 10:30 AM",
    location: "Office - Conference Room B",
    attendees: 2,
    host: "Alex Thompson",
    description: "Weekly check-in to discuss project progress and upcoming milestones.",
    type: "one-on-one",
  },
  {
    id: "3",
    title: "Design Review Session",
    date: "Nov 20, 2025",
    time: "3:30 PM - 4:30 PM",
    location: "Virtual - Google Meet",
    attendees: 8,
    host: "Jessica Wu",
    description: "Review and provide feedback on the latest design iterations for the mobile app.",
    type: "review",
  },
]

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
  const [showColorPicker, setShowColorPicker] = useState(false)
  
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(null)

  const gradient = THEME_COLOR_OPTIONS[selectedColor]?.gradient ?? "from-teal-400/40 to-teal-600/60"

  useEffect(() => {
    if (onContentChange) {
      onContentChange({ mode, calendlyUrl })
    }
  }, [mode, calendlyUrl, onContentChange])

  useEffect(() => {
    if (content) {
      setMode(content.mode || "custom")
      setCalendlyUrl(content.calendlyUrl || "https://calendly.com/your-username/30min")
    }
  }, [content])

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

  const getMeetingGradient = (type: string) => {
    if (type === "strategy") return "from-[#3B82F6]/70 to-[#06B6D4]/70"
    if (type === "one-on-one") return "from-[#34D399]/70 to-[#6EE7B7]/70"
    if (type === "review") return "from-[#A855F7]/70 to-[#7C3AED]/70"
    return "from-[#F87171]/70 to-[#FB7185]/70"
  }

  const handleMeetingClick = (meetingId: string) => {
    setExpandedMeetingId(expandedMeetingId === meetingId ? null : meetingId)
  }

  return (
    <div
      className={`bg-gradient-to-br ${gradient} backdrop-blur-xl rounded-3xl p-6 group cursor-grab active:cursor-grabbing relative`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          {mode === "custom" && expandedMeetingId && (
            <button
              onClick={() => setExpandedMeetingId(null)}
              className="text-white/70 hover:text-white transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <Calendar className="w-4 h-4" />
          <h2 className="text-sm font-bold">
            {mode === "calendly" && "Schedule Meeting"}
            {mode === "custom" && !expandedMeetingId && "Upcoming Meetings"}
            {mode === "custom" && expandedMeetingId && "Meeting Details"}
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

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("custom")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition ${
            mode === "custom" ? "bg-white/30 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          My Meetings
        </button>
        <button
          onClick={() => setMode("calendly")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition ${
            mode === "calendly" ? "bg-white/30 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          Schedule New
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
        <div className="space-y-4">
          {!expandedMeetingId ? (
            <>
              {mockMeetings.map((meeting) => {
                const meetingGradient = getMeetingGradient(meeting.type)
                return (
                  <button
                    key={meeting.id}
                    onClick={() => handleMeetingClick(meeting.id)}
                    className={`
                      w-full text-left
                      relative overflow-hidden
                      bg-gradient-to-br ${meetingGradient}
                      backdrop-blur-xl
                      rounded-2xl 
                      p-4
                      transition-all duration-300 ease-out
                      hover:scale-[1.02] hover:shadow-2xl
                      shadow-lg
                    `}
                  >
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
                    
                    <div className="relative">
                      <h3 className="text-base font-bold mb-2 text-white">{meeting.title}</h3>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-white/85">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                          <span className="font-medium">{meeting.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/85">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                          <span className="font-medium">{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/85">
                          {meeting.location.includes("Virtual") ? (
                            <Video className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                          )}
                          <span className="font-medium">{meeting.location}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                          <User className="w-3.5 h-3.5" />
                          <span className="font-semibold text-xs">{meeting.attendees}</span>
                        </div>
                        <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                          View Details
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </>
          ) : (
            <>
              {mockMeetings
                .filter((m) => m.id === expandedMeetingId)
                .map((meeting) => {
                  const meetingGradient = getMeetingGradient(meeting.type)
                  return (
                    <div key={meeting.id} className="space-y-4">
                      <div
                        className={`
                          relative overflow-hidden
                          bg-gradient-to-br ${meetingGradient}
                          backdrop-blur-xl
                          rounded-2xl 
                          p-5
                        `}
                      >
                        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
                        
                        <div className="relative">
                          <h3 className="text-xl font-bold mb-3 text-white">{meeting.title}</h3>
                          
                          <p className="text-white/80 text-sm mb-4 leading-relaxed">{meeting.description}</p>
                          
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-2 text-sm text-white/90">
                              <Calendar className="w-4 h-4 flex-shrink-0 opacity-70" />
                              <span className="font-medium">{meeting.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/90">
                              <Clock className="w-4 h-4 flex-shrink-0 opacity-70" />
                              <span className="font-medium">{meeting.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/90">
                              {meeting.location.includes("Virtual") ? (
                                <Video className="w-4 h-4 flex-shrink-0 opacity-70" />
                              ) : (
                                <MapPin className="w-4 h-4 flex-shrink-0 opacity-70" />
                              )}
                              <span className="font-medium">{meeting.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/90">
                              <User className="w-4 h-4 flex-shrink-0 opacity-70" />
                              <span className="font-medium">Hosted by {meeting.host}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        className="w-full bg-white/30 hover:bg-white/40 backdrop-blur-sm font-semibold py-3 rounded-xl transition text-sm text-white"
                      >
                        Join Meeting
                      </button>
                    </div>
                  )
                })}
            </>
          )}
        </div>
      )}
    </div>
  )
}
