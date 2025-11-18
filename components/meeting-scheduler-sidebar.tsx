"use client"

import { useState } from "react"
import { X, Calendar, Clock, MapPin, Users, Video, AlignLeft, Bell, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"

type Tab = "event" | "task" | "appointment"

type MeetingSidebarProps = {
  isOpen: boolean
  onClose: () => void
  googleConnected?: boolean
  onGoogleConnect?: () => void
}

export default function MeetingSchedulerSidebar({
  isOpen,
  onClose,
  googleConnected = false,
  onGoogleConnect,
}: MeetingSidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>("event")
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "9:30pm",
    endTime: "10:30pm",
    timezone: "Eastern Time",
    guests: [] as string[],
    addGoogleMeet: false,
    location: "",
    description: "",
    reminder: 30,
  })

  const [guestInput, setGuestInput] = useState("")

  const addGuest = () => {
    if (guestInput.trim() && formData.guests.length < 10) {
      setFormData({ ...formData, guests: [...formData.guests, guestInput.trim()] })
      setGuestInput("")
    }
  }

  const removeGuest = (index: number) => {
    setFormData({ ...formData, guests: formData.guests.filter((_, i) => i !== index) })
  }

  const handleSave = async () => {
    // TODO: Implement Google Calendar API call
    console.log("Creating meeting:", formData)
    // This would call the backend API to create the meeting
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="relative ml-auto w-full max-w-md bg-zinc-900 shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
          <h2 className="text-lg font-semibold text-white">Create Event</h2>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Google Connection Banner */}
        {!googleConnected && (
          <div className="p-4 bg-blue-950/30 border-b border-blue-900/50">
            <p className="text-sm text-blue-200 mb-2">
              Connect your Google account to create meetings with Google Meet links
            </p>
            <Button 
              onClick={onGoogleConnect}
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Connect Google Calendar
            </Button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-900">
          <button
            onClick={() => setActiveTab("event")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "event"
                ? "text-blue-400 bg-zinc-800/50"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
            }`}
          >
            Event
            {activeTab === "event" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("task")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "task"
                ? "text-blue-400 bg-zinc-800/50"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
            }`}
          >
            Task
          </button>
          <button
            onClick={() => setActiveTab("appointment")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "appointment"
                ? "text-blue-400 bg-zinc-800/50"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
            }`}
          >
            Appointment schedule
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Add title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-0 py-2 text-2xl font-normal text-white placeholder:text-zinc-500 bg-transparent border-0 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Date and Time */}
            <div className="flex items-start gap-3 py-3">
              <Clock className="w-5 h-5 text-zinc-400 mt-1 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm text-white">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-20 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-white"
                  />
                  <span className="text-zinc-500">–</span>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-20 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-white"
                  />
                </div>
                <button className="text-sm text-zinc-400 hover:text-zinc-200 flex items-center gap-1">
                  {formData.timezone}
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="text-sm text-zinc-400 hover:text-zinc-200">
                  Does not repeat
                </button>
              </div>
            </div>

            {/* Add Guests */}
            <div className="flex items-start gap-3 py-3 border-t border-zinc-800">
              <Users className="w-5 h-5 text-zinc-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Add guests"
                  value={guestInput}
                  onChange={(e) => setGuestInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addGuest()}
                  className="w-full text-sm text-white placeholder:text-zinc-500 bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
                />
                {formData.guests.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {formData.guests.map((guest, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-zinc-300">{guest}</span>
                        <button
                          onClick={() => removeGuest(i)}
                          className="text-zinc-500 hover:text-zinc-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Add Google Meet */}
            {googleConnected && (
              <button
                onClick={() => setFormData({ ...formData, addGoogleMeet: !formData.addGoogleMeet })}
                className="flex items-start gap-3 py-3 w-full hover:bg-zinc-800/50 rounded-lg transition-colors border-t border-zinc-800"
              >
                <Video className="w-5 h-5 text-zinc-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-white">
                  {formData.addGoogleMeet ? "Google Meet added" : "Add Google Meet video conferencing"}
                </span>
              </button>
            )}

            {/* Add Location */}
            <div className="flex items-start gap-3 py-3 border-t border-zinc-800">
              <MapPin className="w-5 h-5 text-zinc-400 mt-1 flex-shrink-0" />
              <input
                type="text"
                placeholder="Add location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="flex-1 text-sm text-white placeholder:text-zinc-500 bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
              />
            </div>

            {/* Add Description */}
            <div className="flex items-start gap-3 py-3 border-t border-zinc-800">
              <AlignLeft className="w-5 h-5 text-zinc-400 mt-1 flex-shrink-0" />
              <textarea
                placeholder="Add description or a Google Drive attachment"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="flex-1 text-sm text-white placeholder:text-zinc-500 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 resize-none"
              />
            </div>

            {/* Calendar Owner Info */}
            <div className="flex items-start gap-3 py-3 border-t border-zinc-800">
              <Calendar className="w-5 h-5 text-zinc-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">Oluwafemi Babaniji</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  Busy • Default visibility • Notify 30 minutes before
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-400 hover:bg-zinc-800 hover:text-blue-300"
          >
            More options
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.title || !formData.date}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
