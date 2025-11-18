"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Search, ArrowLeft, Clock, Mail, MessageSquare, Share2, Copy, ExternalLink, Facebook, Twitter, Linkedin, Plus, Edit, Camera, AlertTriangle } from 'lucide-react'
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
    navigator.clipboard.writeText(`luma.com/ebv3f82b`)
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
      <div className="flex items-center gap-3 mb-6">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl text-white text-sm font-medium transition-all">
          <Mail className="w-4 h-4 text-blue-400" />
          Invite Guests
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl text-white text-sm font-medium transition-all">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          Send a Blast
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl text-white text-sm font-medium transition-all">
          <Share2 className="w-4 h-4 text-pink-400" />
          Share Event
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Left: Event Card */}
        <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/5">
          <div className={`relative w-full aspect-[4/3] rounded-xl mb-4 bg-gradient-to-br ${gradient} overflow-hidden`}>
            <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">{event.title}</h2>

          {/* Date & Time */}
          <div className="bg-zinc-800/60 rounded-xl p-3 mb-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-zinc-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-white font-semibold text-sm mb-1">{event.date}</div>
                <div className="text-zinc-400 text-xs">{event.time}</div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-zinc-800/60 rounded-xl p-3 mb-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-zinc-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">Register to See Address</div>
              </div>
            </div>
          </div>

          {/* Registration Section */}
          <div className="bg-zinc-800/40 rounded-xl p-4 mb-4">
            <h3 className="text-white font-semibold text-sm mb-2">Registration</h3>
            <p className="text-zinc-400 text-sm mb-3">Welcome! To join the event, please register below.</p>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div>
                <div className="text-white font-medium text-sm">{event.host || "Oluwafemi Babaniji"}</div>
                <div className="text-zinc-400 text-xs">ofbabaniji@gmail.com</div>
              </div>
            </div>

            <button className="w-full py-2.5 bg-white hover:bg-white/90 text-black font-semibold rounded-lg text-sm transition-all">
              One-Click RSVP
            </button>
          </div>

          {/* Presented by */}
          <div className="mb-4">
            <h3 className="text-zinc-400 text-xs mb-2">Presented by</h3>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                <span className="text-xs font-bold">DMZ</span>
              </div>
              <span className="text-white font-medium text-sm">DMZ</span>
            </div>
          </div>

          {/* Hosted By */}
          <div className="mb-4">
            <h3 className="text-zinc-400 text-xs mb-2">Hosted By</h3>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <span className="text-white font-medium text-sm">{event.host || "Oluwafemi Babaniji"}</span>
            </div>
          </div>

          {/* Event URL */}
          <div className="flex items-center gap-2 bg-zinc-800/60 rounded-lg p-2.5 mb-4">
            <span className="text-zinc-400 text-sm flex-1 truncate">luma.com/ebv3f82b</span>
            <button 
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-zinc-700/60 hover:bg-zinc-700 rounded text-white text-xs font-medium transition-all"
            >
              {copied ? "Copied!" : "COPY"}
            </button>
          </div>

          {/* Share & Edit buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-1">
              <span className="text-zinc-400 text-sm mr-2">Share Event</span>
              <button className="w-8 h-8 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 flex items-center justify-center transition-all">
                <Facebook className="w-4 h-4 text-zinc-400" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 flex items-center justify-center transition-all">
                <Twitter className="w-4 h-4 text-zinc-400" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 flex items-center justify-center transition-all">
                <Linkedin className="w-4 h-4 text-zinc-400" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 flex items-center justify-center transition-all">
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-zinc-800/60 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-all">
                Edit Event
              </button>
              <button className="px-4 py-2 bg-zinc-800/60 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-all">
                Change Photo
              </button>
            </div>
          </div>
        </div>

        {/* Right: When & Where */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/5">
            <h2 className="text-xl font-bold text-white mb-4">When & Where</h2>
            
            {/* Date/Time */}
            <div className="bg-zinc-800/40 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="bg-zinc-700/60 rounded-lg px-2.5 py-1.5 text-center">
                  <div className="text-zinc-400 text-xs uppercase">NOV</div>
                  <div className="text-white font-bold text-lg">19</div>
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold mb-1">Tomorrow</div>
                  <div className="text-zinc-400 text-sm">{event.time} EST</div>
                </div>
              </div>
            </div>

            {/* Location Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-yellow-500 font-semibold text-sm mb-1">Location Missing</div>
                  <div className="text-yellow-500/80 text-xs">Please enter the location of the event before it starts.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Invites</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800/60 hover:bg-zinc-800 rounded-lg text-white text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />
            Invite Guests
          </button>
        </div>
        <p className="text-zinc-400 text-sm mb-4">Invite subscribers, contacts and past guests via email or SMS.</p>
        
        <div className="bg-zinc-800/40 rounded-xl p-6 text-center">
          <div className="w-12 h-12 rounded-lg bg-zinc-700/60 flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6 text-zinc-400" />
          </div>
          <h3 className="text-white font-semibold mb-1">No Invites Sent</h3>
          <p className="text-zinc-400 text-sm">You can invite subscribers, contacts and past guests to the event.</p>
        </div>
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Hosts</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800/60 hover:bg-zinc-800 rounded-lg text-white text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />
            Add Host
          </button>
        </div>
        <p className="text-zinc-400 text-sm mb-4">Add hosts, special guests, and event managers.</p>
        
        <div className="flex items-center justify-between bg-zinc-800/40 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{event.host || "Oluwafemi Babaniji"}</div>
              <div className="text-zinc-400 text-xs">ofbabaniji@gmail.com</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-green-500/20 text-green-400 rounded-md text-xs font-medium">Creator</span>
            <button className="w-8 h-8 rounded-lg bg-zinc-700/60 hover:bg-zinc-700 flex items-center justify-center transition-all">
              <Edit className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-zinc-400" />
          <h2 className="text-xl font-bold text-white">Event Attendees</h2>
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

        <div className="grid grid-cols-5 gap-4">
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
    </motion.div>
  )
}
