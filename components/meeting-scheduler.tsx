"use client"
import { useState } from "react"
import type React from "react"

import { Clock, User, Calendar } from "lucide-react"
import { Panel } from "@/components/ui/panel"

interface TimeSlot {
  time: string
  available: boolean
}

interface MeetingRequest {
  name: string
  email: string
  topic: string
  date: string
  time: string
}

export function MeetingScheduler() {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [formData, setFormData] = useState<Partial<MeetingRequest>>({})
  const [step, setStep] = useState<"date" | "time" | "details" | "confirmation">("date")

  const availableDates = [
    { date: "2024-12-16", label: "Mon, Dec 16" },
    { date: "2024-12-17", label: "Tue, Dec 17" },
    { date: "2024-12-18", label: "Wed, Dec 18" },
    { date: "2024-12-19", label: "Thu, Dec 19" },
    { date: "2024-12-20", label: "Fri, Dec 20" },
  ]

  const timeSlots: TimeSlot[] = [
    { time: "9:00 AM", available: true },
    { time: "10:00 AM", available: false },
    { time: "11:00 AM", available: true },
    { time: "1:00 PM", available: true },
    { time: "2:00 PM", available: true },
    { time: "3:00 PM", available: false },
    { time: "4:00 PM", available: true },
    { time: "5:00 PM", available: true },
  ]

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setStep("time")
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep("details")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("confirmation")
  }

  return (
    <Panel variant="widget" className="p-6 bg-zinc-900 border border-zinc-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Schedule a 1:1 Meeting</h2>
        <p className="text-sm text-zinc-400">Book a time to connect and discuss opportunities</p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-8">
        {["date", "time", "details"].map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`h-2 rounded-full flex-1 transition-colors ${
                step === s || (i === 0 && step === "time") || (i <= 1 && step === "details") || step === "confirmation"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                  : "bg-zinc-700"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Date Selection */}
      {step === "date" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Select a Date</h3>
          </div>
          {availableDates.map((date) => (
            <button
              key={date.date}
              onClick={() => handleDateSelect(date.date)}
              className="w-full p-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all text-left"
            >
              <div className="text-white font-medium">{date.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Time Selection */}
      {step === "time" && (
        <div className="space-y-4">
          <button onClick={() => setStep("date")} className="text-sm text-zinc-400 hover:text-white transition-colors">
            ← Back to dates
          </button>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Select a Time</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && handleTimeSelect(slot.time)}
                disabled={!slot.available}
                className={`p-3 rounded-xl border transition-all ${
                  slot.available
                    ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 hover:border-zinc-600 text-white"
                    : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
                }`}
              >
                <div className="text-sm font-medium">{slot.time}</div>
                <div className="text-xs mt-1">{slot.available ? "Available" : "Booked"}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Details Form */}
      {step === "details" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <button onClick={() => setStep("time")} className="text-sm text-zinc-400 hover:text-white transition-colors">
            ← Back to times
          </button>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Your Details</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Meeting Topic</label>
            <textarea
              required
              value={formData.topic || ""}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 resize-none"
              placeholder="What would you like to discuss?"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            Confirm Meeting
          </button>
        </form>
      )}

      {/* Confirmation */}
      {step === "confirmation" && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Meeting Confirmed!</h3>
          <div className="p-4 rounded-xl bg-zinc-800 border border-zinc-700">
            <div className="text-sm text-zinc-400 mb-2">Your meeting is scheduled for:</div>
            <div className="text-white font-medium">
              {availableDates.find((d) => d.date === selectedDate)?.label} at {selectedTime}
            </div>
          </div>
          <p className="text-sm text-zinc-400">A calendar invite has been sent to {formData.email}</p>
          <button
            onClick={() => {
              setStep("date")
              setSelectedDate("")
              setSelectedTime("")
              setFormData({})
            }}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Schedule another meeting
          </button>
        </div>
      )}
    </Panel>
  )
}
