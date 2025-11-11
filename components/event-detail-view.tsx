"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Search, ArrowLeft } from "lucide-react"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"

interface EventDetailProps {
  event: {
    id: string
    title: string
    description: string
    fullDescription?: string
    date: string
    time: string
    location: string
    fullAddress?: string
    venue?: string
    venueDetails?: string
    dressCode?: string
    host?: string
    hostDescription?: string
    agenda?: string[]
    partners?: string[]
    tags?: string[]
    attending: number
    gradient: string
    accent: string
    type: string
    attendees: Array<{
      id: string
      name: string
      title: string
      email: string
      location: string
      handle: string
      initials: string
      selectedColor: number
      avatarUrl?: string
    }>
  }
  onBack: () => void
  onAttendeeClick?: (id: string) => void
}

function EventDetailView({ event, onBack, onAttendeeClick }: EventDetailProps) {
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState("")
  const [attendeeFilter, setAttendeeFilter] = useState("all")

  const filteredAttendees = event.attendees.filter((attendee) => {
    const matchesSearch =
      attendeeSearchQuery === "" ||
      attendee.name.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
      attendee.title.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
      attendee.location.toLowerCase().includes(attendeeSearchQuery.toLowerCase())

    const matchesFilter =
      attendeeFilter === "all" ||
      (attendeeFilter === "design" &&
        (attendee.title.toLowerCase().includes("design") || attendee.title.toLowerCase().includes("ux"))) ||
      (attendeeFilter === "engineering" &&
        (attendee.title.toLowerCase().includes("engineer") || attendee.title.toLowerCase().includes("developer"))) ||
      (attendeeFilter === "product" && attendee.title.toLowerCase().includes("product")) ||
      (attendeeFilter === "data" &&
        (attendee.title.toLowerCase().includes("data") || attendee.title.toLowerCase().includes("scientist"))) ||
      (attendeeFilter === "founder" &&
        (attendee.title.toLowerCase().includes("founder") || attendee.title.toLowerCase().includes("ceo")))

    return matchesSearch && matchesFilter
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="w-full"
    >
      <div className="relative rounded-3xl overflow-hidden mb-6">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-80`}
          style={{ backgroundColor: "oklch(0.145 0 0)" }}
        />

        <div className="relative z-10 px-5 py-6">
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-xs font-medium text-white">
                  {event.type}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-xs font-medium text-white flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {event.attending} attending
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{event.title}</h1>
              <p className="text-sm text-white/90 leading-relaxed">{event.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-1.5 text-white/70 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Date & Time</span>
              </div>
              <p className="font-semibold text-white text-sm">{event.date}</p>
              <p className="text-xs text-white/80 mt-0.5">{event.time}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-1.5 text-white/70 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">Location</span>
              </div>
              <p className="font-semibold text-white text-sm">{event.location}</p>
              <p className="text-xs text-white/80 mt-0.5">{event.venue || "In-Person"}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-1.5 text-white/70 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Dress Code</span>
              </div>
              <p className="font-semibold text-white text-sm">{event.dressCode || "Casual"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              className="px-5 py-2 rounded-lg font-semibold text-white text-sm transition-all hover:scale-105"
              style={{ backgroundColor: event.accent }}
            >
              RSVP Now
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white rounded-lg font-semibold text-sm transition-all hover:scale-105 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Add to Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-3">About This Event</h3>
          <div className="space-y-3 text-zinc-300 text-sm">
            {event.fullDescription ? (
              event.fullDescription.split("\n\n").map((para, i) => (
                <p key={i} className="whitespace-pre-line leading-relaxed">
                  {para}
                </p>
              ))
            ) : (
              <p className="leading-relaxed">{event.description}</p>
            )}

            {event.agenda && event.agenda.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-white text-base mb-2">Event Agenda:</h4>
                <ul className="space-y-1.5">
                  {event.agenda.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Hosted By</h4>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${event.accent}, ${event.accent}dd)` }}
                >
                  {(event.host || "TC").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{event.host || "Tech Community"}</p>
                  <p className="text-xs text-zinc-400">Event Organizer</p>
                </div>
              </div>
            </div>

            {event.tags && event.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Topics</h4>
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.slice(0, 4).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-zinc-800/50 text-zinc-300 rounded text-xs border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Event Attendees</h2>
            <span className="text-sm text-zinc-400">({filteredAttendees.length})</span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search attendees..."
                value={attendeeSearchQuery}
                onChange={(e) => setAttendeeSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-zinc-800/50 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All" },
                { id: "design", label: "Design" },
                { id: "engineering", label: "Engineering" },
                { id: "product", label: "Product" },
                { id: "data", label: "Data & AI" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setAttendeeFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    attendeeFilter === filter.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 border border-white/10"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {filteredAttendees.map((attendee) => (
              <div key={attendee.id} className="flex-shrink-0 w-36">
                <UnifiedPortfolioCard
                  portfolio={attendee}
                  onClick={(id) => {
                    if (onAttendeeClick) {
                      onAttendeeClick(id)
                    }
                  }}
                  onShare={(id) => console.log("Share attendee:", id)}
                  onMore={(id) => console.log("More options for attendee:", id)}
                />
              </div>
            ))}
          </div>

          {filteredAttendees.length === 0 && (
            <div className="text-center py-8">
              <p className="text-zinc-400 text-sm">No attendees found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default EventDetailView
