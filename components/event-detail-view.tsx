"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Search, ArrowLeft, ExternalLink, Facebook, Twitter, Linkedin, AlertTriangle } from "lucide-react"
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
  const [copied, setCopied] = useState(false)

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
      return "from-blue-400/90 via-cyan-400/90 to-teal-400/90"
    } else if (title.includes("Networking") || title.includes("Founder")) {
      return "from-emerald-400/90 via-green-400/90 to-lime-400/90"
    } else if (title.includes("Design") || title.includes("Product")) {
      return "from-purple-400/90 via-violet-400/90 to-fuchsia-400/90"
    }
    return "from-orange-400/90 via-amber-400/90 to-yellow-400/90"
  }

  const gradient = getGradient(event.title)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`pathwai.com/ebv3f82b`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="w-full pb-12"
    >
      <div className="space-y-6">
        {/* Left side - Registration & Event Details */}
        <div className="bg-zinc-900/50 rounded-2xl shadow-lg border border-white/5 overflow-hidden">
          <div className={`relative w-full h-48 bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

            <button
              onClick={onBack}
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm hover:bg-black/40 rounded-lg transition-all border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
              <span className="text-sm text-white">Back to Events</span>
            </button>

            <div className="absolute top-4 right-4">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-center mb-2 border border-white/20">
                <div className="text-white/80 text-xs uppercase">NOV</div>
                <div className="text-white font-bold text-lg">19</div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
              <div className="text-white/90 text-sm">Wednesday, November 19 • {event.time} EST</div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side - Registration & Event Details */}
            <div className="space-y-5">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-yellow-500 font-semibold text-sm mb-1">Location Missing</div>
                    <div className="text-yellow-500/80 text-xs">
                      Please enter the location of the event before it starts.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/40 rounded-xl p-4">
                <h3 className="text-white font-semibold text-sm mb-2">Registration</h3>
                <p className="text-zinc-400 text-sm mb-3">Welcome! To join the event, please register below.</p>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{event.host || "Tech Community"}</div>
                    <div className="text-zinc-400 text-xs">ofbabaniji@gmail.com</div>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-white hover:bg-white/90 text-black font-semibold rounded-lg text-sm transition-all">
                  One-Click RSVP
                </button>
              </div>

              <div className="flex items-center gap-2 bg-zinc-800/60 rounded-lg p-2.5">
                <span className="text-zinc-400 text-sm flex-1 truncate">pathwai.com/ebv3f82b</span>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-zinc-700/60 hover:bg-zinc-700 rounded text-white text-xs font-medium transition-all"
                >
                  {copied ? "Copied!" : "COPY"}
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-1">
                  <span className="text-zinc-400 text-xs mr-2">Share Event</span>
                  <button className="w-7 h-7 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 flex items-center justify-center transition-all">
                    <Facebook className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 flex items-center justify-center transition-all">
                    <Twitter className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 flex items-center justify-center transition-all">
                    <Linkedin className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 flex items-center justify-center transition-all">
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-zinc-800/60 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-all">
                    Edit Event
                  </button>
                  <button className="px-3 py-1.5 bg-zinc-800/60 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-all">
                    Change Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Right side - About this Event */}
            <div className="bg-zinc-800/20 rounded-xl p-4">
              <h3 className="text-white font-semibold text-base mb-3">About this Event</h3>
              <div className="text-zinc-300 text-sm space-y-2 leading-relaxed">
                <p>{event.description}</p>
                {event.fullDescription && <p>{event.fullDescription}</p>}
                {!event.fullDescription && (
                  <>
                    <p>
                      Join us for an exciting exploration of artificial intelligence and machine learning technologies.
                      This event brings together industry experts, researchers, and enthusiasts.
                    </p>
                    <p>
                      Network with fellow professionals, learn from hands-on workshops, and discover how AI is
                      transforming various industries.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Event Attendees Section */}
        <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-zinc-400" />
            <h3 className="text-lg font-bold text-white">Event Attendees</h3>
            <span className="text-sm text-zinc-400">({filteredAttendees.length})</span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search attendees..."
                value={attendeeSearchQuery}
                onChange={(e) => setAttendeeSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/60 rounded-xl text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all"
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
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    attendeeFilter === filter.id
                      ? "bg-white text-black"
                      : "bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {filteredAttendees.map((attendee) => (
              <UnifiedPortfolioCard
                key={attendee.id}
                portfolio={attendee}
                onClick={(id) => {
                  if (onAttendeeClick) {
                    onAttendeeClick(id)
                  }
                }}
                onShare={(id) => console.log("Share attendee:", id)}
                onMore={(id) => console.log("More options for attendee:", id)}
              />
            ))}
          </div>

          {filteredAttendees.length === 0 && (
            <div className="text-center py-8">
              <p className="text-zinc-500 text-sm">No attendees found.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
