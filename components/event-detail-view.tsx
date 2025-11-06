"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Search } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
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

export function EventDetailView({ event, onBack, onAttendeeClick }: EventDetailProps) {
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
      className="min-h-screen"
      style={{ backgroundColor: "oklch(0.18 0 0)" }}
    >
      {/* Event Header with Gradient */}
      <div className="relative">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-90`}
          style={{ backgroundColor: "oklch(0.145 0 0)" }}
        />

        <motion.nav
          className="absolute top-6 left-6 z-50"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <BackButton onClick={onBack} className="text-white/80 hover:text-white" />
        </motion.nav>

        <div className="relative z-10 px-6 pb-12 pt-20 text-center max-w-7xl mx-auto">
          {/* Event Type Badge and Attendee Count */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-full text-sm font-medium text-white">
              {event.type}
            </span>
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-full text-sm font-medium text-white flex items-center gap-2">
              <Users className="w-4 h-4" />
              {event.attending} attending
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white mb-6">{event.title}</h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">{event.description}</p>

          {/* Event Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-2 text-white/70 mb-3">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Date & Time</span>
              </div>
              <p className="font-semibold text-white text-lg">{event.date}</p>
              <p className="text-base text-white/90 mt-1">{event.time}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-2 text-white/70 mb-3">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <p className="font-semibold text-white text-lg">{event.location}</p>
              <p className="text-base text-white/90 mt-1">{event.venue || "In-Person Event"}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-2 text-white/70 mb-3">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Dress Code</span>
              </div>
              <p className="font-semibold text-white text-lg">{event.dressCode || "Casual"}</p>
              <p className="text-base text-white/90 mt-1">
                {event.dressCode === "Business Casual"
                  ? "Professional but comfortable"
                  : event.dressCode === "Business Attire"
                    ? "Formal business wear"
                    : "Come as you are"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
              style={{ backgroundColor: event.accent }}
            >
              RSVP Now
            </button>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Add to Calendar
            </button>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share Event
            </button>
          </div>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - About & Location */}
          <div className="lg:col-span-2 space-y-8">
            {/* About This Event */}
            <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">About This Event</h3>
              <div className="space-y-4 text-neutral-300">
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
                  <div className="mt-6">
                    <h4 className="font-semibold text-white text-lg mb-3">Event Agenda:</h4>
                    <ul className="space-y-2">
                      {event.agenda.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-cyan-400 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.dressCode && (
                  <div className="flex items-center gap-3 px-6 py-4 bg-neutral-800/50 rounded-xl mt-6">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span className="font-semibold text-white">Dress Code:</span>
                    <span className="text-neutral-300">{event.dressCode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location & Directions */}
            {event.fullAddress && (
              <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Location & Directions</h3>

                <div className="space-y-6">
                  {/* Venue Details */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-white text-lg">{event.location}</p>
                      <p className="text-neutral-400 mt-1">{event.fullAddress}</p>
                      {event.venue && <p className="text-neutral-400 mt-1">{event.venue}</p>}
                      {event.venueDetails && <p className="text-sm text-neutral-500 mt-1">{event.venueDetails}</p>}
                    </div>
                  </div>

                  {/* Map Embed */}
                  <div className="w-full h-80 bg-neutral-800/50 rounded-xl overflow-hidden border border-white/10">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src="https://www.openstreetmap.org/export/embed.html?bbox=-79.5115,43.7710,-79.4915,43.7860&layer=mapnik&marker=43.7785,-79.5015"
                      style={{ border: 0 }}
                    />
                  </div>

                  {/* Directions Buttons */}
                  <div className="flex items-center gap-3">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.fullAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-medium transition-all text-center"
                    >
                      Get Directions in Google Maps
                    </a>
                    <a
                      href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(event.fullAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-xl text-white font-medium transition-all border border-white/10"
                    >
                      Open in OSM
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Host, Stats, Topics, Partners */}
          <div className="space-y-6">
            {/* Host Card */}
            <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Hosted By</h3>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${event.accent}, ${event.accent}dd)` }}
                >
                  {(event.host || "TC").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{event.host || "Tech Community"}</h4>
                  <p className="text-sm text-neutral-400">Event Organizer</p>
                </div>
              </div>
              <p className="text-sm text-neutral-300 mb-4 leading-relaxed">
                {event.hostDescription || "Leading community for tech professionals and innovators."}
              </p>
              <button className="w-full py-2.5 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-xl text-white font-medium transition-all border border-white/10">
                Follow Organizer
              </button>
            </div>

            {/* Event Stats */}
            <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Event Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Total Attendees</span>
                  <span className="font-bold text-white">{event.attending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Spots Remaining</span>
                  <span className="font-bold text-green-400">27</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Engagement</span>
                  <span className="font-bold text-white">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Event Format</span>
                  <span className="font-bold text-white">In-Person</span>
                </div>
              </div>
            </div>

            {/* Topics/Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-neutral-800/50 text-neutral-300 rounded-lg text-sm border border-white/10 hover:bg-neutral-700/50 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Partners */}
            {event.partners && event.partners.length > 0 && (
              <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Official Partners</h3>
                <div className="flex flex-wrap gap-2">
                  {event.partners.map((partner, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-300 rounded-lg text-sm transition-colors border border-white/10"
                    >
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Event Attendees Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-7 h-7 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Event Attendees</h2>
            <span className="text-lg text-neutral-400">({filteredAttendees.length})</span>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search attendees by name, title, or location..."
                value={attendeeSearchQuery}
                onChange={(e) => setAttendeeSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Attendees" },
                { id: "design", label: "Design" },
                { id: "engineering", label: "Engineering" },
                { id: "product", label: "Product" },
                { id: "data", label: "Data & AI" },
                { id: "founder", label: "Founder" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setAttendeeFilter(filter.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    attendeeFilter === filter.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
                      : "bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800/50 border border-white/10"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Attendees Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAttendees.map((attendee) => (
              <UnifiedPortfolioCard
                key={attendee.id}
                portfolio={attendee}
                onClick={(id) => {
                  if (onAttendeeClick) {
                    onAttendeeClick(id)
                  } else {
                    console.log("View attendee profile:", id)
                  }
                }}
                onShare={(id) => console.log("Share attendee:", id)}
                onMore={(id) => console.log("More options for attendee:", id)}
              />
            ))}
          </div>

          {filteredAttendees.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-400 text-lg">No attendees found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
