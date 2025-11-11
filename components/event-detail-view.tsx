"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Search, ArrowLeft, Clock } from "lucide-react"
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

  const getGradient = (title: string) => {
    if (title.includes("AI") || title.includes("Machine Learning")) {
      return "from-[#3B82F6]/70 to-[#06B6D4]/70"
    } else if (title.includes("Networking") || title.includes("Founder")) {
      return "from-[#34D399]/70 to-[#6EE7B7]/70"
    } else if (title.includes("Design") || title.includes("Product")) {
      return "from-[#A855F7]/70 to-[#7C3AED]/70"
    }
    return "from-[#F87171]/70 to-[#FB7185]/70"
  }

  const getTitleGradient = (title: string) => {
    if (title.includes("AI") || title.includes("Machine Learning")) {
      return "from-white via-white to-[#3B82F6]"
    } else if (title.includes("Networking") || title.includes("Founder")) {
      return "from-white via-white to-[#34D399]"
    } else if (title.includes("Design") || title.includes("Product")) {
      return "from-white via-white to-[#A855F7]"
    }
    return "from-white via-white to-[#F87171]"
  }

  const gradient = getGradient(event.title)
  const titleGradient = getTitleGradient(event.title)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="w-full"
    >
      <div className={`relative rounded-3xl overflow-hidden mb-4 bg-gradient-to-br ${gradient} backdrop-blur-xl`}>
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

        <div className="relative z-10 px-5 py-5">
          <button
            onClick={onBack}
            className="mb-3 flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-xl rounded-full text-xs font-medium text-white uppercase tracking-wide">
                  {event.type}
                </span>
                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-xl rounded-full text-xs font-medium text-white flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {event.attending}
                </span>
              </div>
              <h1
                className={`text-2xl font-bold mb-2 leading-tight bg-gradient-to-br ${titleGradient} bg-clip-text text-transparent`}
              >
                {event.title}
              </h1>
              <p className="text-sm text-white/90 leading-relaxed">{event.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-white/70 mb-1">
                <Calendar className="w-3.5 h-3.5 opacity-70" />
                <span className="text-xs font-medium">Date</span>
              </div>
              <p className="font-semibold text-white text-xs">{event.date}</p>
              <p className="text-xs text-white/85 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 opacity-70" />
                {event.time}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-white/70 mb-1">
                <MapPin className="w-3.5 h-3.5 opacity-70" />
                <span className="text-xs font-medium">Location</span>
              </div>
              <p className="font-semibold text-white text-xs">{event.location}</p>
              <p className="text-xs text-white/85">{event.venue || "In-Person"}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-white/70 mb-1">
                <Users className="w-3.5 h-3.5 opacity-70" />
                <span className="text-xs font-medium">Dress Code</span>
              </div>
              <p className="font-semibold text-white text-xs">{event.dressCode || "Casual"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-5 py-2 rounded-full font-semibold text-black bg-white/95 hover:bg-white text-sm transition-all hover:scale-105 shadow-lg">
              RSVP
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white rounded-full font-semibold text-sm transition-all hover:scale-105 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Add to Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left Column - About & Attendees */}
        <div className="col-span-2 space-y-4">
          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
            <h3 className="text-lg font-bold text-white mb-3">About This Event</h3>
            <div className="space-y-2.5 text-zinc-300 text-sm">
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
                <div className="mt-4 pt-4 border-t border-zinc-700/50">
                  <h4 className="font-semibold text-white text-sm mb-2">Agenda:</h4>
                  <ul className="space-y-1.5">
                    {event.agenda.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                        <span className="text-zinc-500 mt-0.5">•</span>
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
              <Users className="w-4 h-4 text-zinc-400" />
              <h2 className="text-lg font-bold text-white">Attendees</h2>
              <span className="text-sm text-zinc-400">({filteredAttendees.length})</span>
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search attendees..."
                  value={attendeeSearchQuery}
                  onChange={(e) => setAttendeeSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-800/60 rounded-xl text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all"
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
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      attendeeFilter === filter.id
                        ? `bg-gradient-to-br ${gradient} text-white`
                        : "bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {filteredAttendees.map((attendee) => (
                <div key={attendee.id} className="flex-shrink-0 w-32">
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
              <div className="text-center py-6">
                <p className="text-zinc-500 text-xs">No attendees found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Host, Stats, Topics */}
        <div className="space-y-4">
          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-4 shadow-lg shadow-black/20">
            <h3 className="text-sm font-bold text-white mb-3">Hosted By</h3>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800/60 flex items-center justify-center text-sm font-bold text-white">
                {(event.host || "TC").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{event.host || "Tech Community"}</h4>
                <p className="text-xs text-zinc-400">Organizer</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
              {event.hostDescription || "Leading community for tech professionals."}
            </p>
            <button className="w-full py-2 bg-zinc-800/60 hover:bg-zinc-800 rounded-xl text-white text-xs font-medium transition-all">
              Follow
            </button>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-4 shadow-lg shadow-black/20">
            <h3 className="text-sm font-bold text-white mb-3">Stats</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Attendees</span>
                <span className="font-bold text-white text-sm">{event.attending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Spots Left</span>
                <span className="font-bold text-white text-sm">27</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Format</span>
                <span className="font-bold text-white text-sm">In-Person</span>
              </div>
            </div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-4 shadow-lg shadow-black/20">
              <h3 className="text-sm font-bold text-white mb-2.5">Topics</h3>
              <div className="flex flex-wrap gap-1.5">
                {event.tags.slice(0, 6).map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-zinc-800/60 text-zinc-300 rounded-lg text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {event.partners && event.partners.length > 0 && (
            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-4 shadow-lg shadow-black/20">
              <h3 className="text-sm font-bold text-white mb-2.5">Partners</h3>
              <div className="space-y-2">
                {event.partners.slice(0, 3).map((partner, i) => (
                  <div key={i} className="px-2.5 py-1.5 bg-zinc-800/60 text-zinc-300 rounded-lg text-xs font-medium">
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
