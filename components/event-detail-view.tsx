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

export default function EventDetailView({ event, onBack, onAttendeeClick }: EventDetailProps) {
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
      <div className="relative rounded-3xl overflow-hidden mb-6 shadow-lg shadow-black/20">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${event.gradient} backdrop-blur-xl`}
          style={{ backgroundColor: "oklch(0.145 0 0)" }}
        />

        <div className="relative z-10 px-6 py-6">
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-sm font-medium text-white">
                  {event.type}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-sm font-medium text-white flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {event.attending} attending
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 leading-tight">{event.title}</h1>
              <p className="text-sm text-white/90 leading-relaxed">{event.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/15 backdrop-blur-xl rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-white/80 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Date</span>
              </div>
              <p className="font-semibold text-white text-sm">{event.date}</p>
              <p className="text-xs text-white/85">{event.time}</p>
            </div>

            <div className="bg-white/15 backdrop-blur-xl rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-white/80 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">Location</span>
              </div>
              <p className="font-semibold text-white text-sm">{event.location}</p>
              <p className="text-xs text-white/85">{event.venue || "In-Person"}</p>
            </div>

            <div className="bg-white/15 backdrop-blur-xl rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-white/80 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Dress Code</span>
              </div>
              <p className="font-semibold text-white text-sm">{event.dressCode || "Casual"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-5 py-2 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105"
              style={{ backgroundColor: event.accent }}
            >
              RSVP
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white rounded-xl font-semibold text-sm transition-all hover:scale-105 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left Column - About & Attendees */}
        <div className="col-span-2 space-y-5">
          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
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
                  <h4 className="font-semibold text-white text-sm mb-2">Agenda:</h4>
                  <ul className="space-y-1.5">
                    {event.agenda.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Attendees</h2>
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
                  className="w-full pl-10 pr-3 py-2 bg-zinc-800/50 rounded-xl text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All" },
                  { id: "design", label: "Design" },
                  { id: "engineering", label: "Engineering" },
                  { id: "product", label: "Product" },
                  { id: "data", label: "Data" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setAttendeeFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      attendeeFilter === filter.id
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                        : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50"
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
                <p className="text-zinc-400 text-sm">No attendees found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Host, Stats, Topics */}
        <div className="space-y-5">
          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
            <h3 className="text-sm font-bold text-white mb-4">Hosted By</h3>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${event.accent}, ${event.accent}dd)` }}
              >
                {(event.host || "TC").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{event.host || "Tech Community"}</h4>
                <p className="text-xs text-zinc-400">Organizer</p>
              </div>
            </div>
            <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
              {event.hostDescription || "Leading community for tech professionals."}
            </p>
            <button className="w-full py-2 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl text-white text-sm font-medium transition-colors">
              Follow
            </button>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
            <h3 className="text-sm font-bold text-white mb-4">Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Attendees</span>
                <span className="font-bold text-white text-base">{event.attending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Spots Left</span>
                <span className="font-bold text-green-400 text-base">27</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Format</span>
                <span className="font-bold text-white text-base">In-Person</span>
              </div>
            </div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
              <h3 className="text-sm font-bold text-white mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.slice(0, 6).map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-zinc-800/50 text-zinc-300 rounded-xl text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {event.partners && event.partners.length > 0 && (
            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
              <h3 className="text-sm font-bold text-white mb-3">Partners</h3>
              <div className="space-y-2">
                {event.partners.slice(0, 3).map((partner, i) => (
                  <div key={i} className="px-3 py-2 bg-zinc-800/50 text-zinc-300 rounded-xl text-xs">
                    {partner}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
