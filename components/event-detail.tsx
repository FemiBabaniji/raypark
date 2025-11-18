"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin, Calendar, Users, Search } from 'lucide-react'
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { spotsRemaining, makeMapSrc, generateICS, sanitizeFilename } from "@/utils"
import { useState } from "react"

interface Event {
  title: string
  date: string
  time: string
  location: {
    name: string
    addressLine?: string
    venue?: string
    venueDetails?: string
    format?: string
  }
  description: string
  fullDescription?: string
  attending: number
  capacity: number
  gradient?: string
  accent?: string
  type?: string
  host?: {
    name?: string
    description?: string
    avatarText?: string
  }
  tags?: string[]
  partners?: string[]
  agenda?: string[]
  dressCode?: string
  id: string
  attendees?: Array<{
    id: string
    name: string
    title: string
    email: string
    location: string
    handle: string
    initials?: string
    selectedColor: number
    avatarUrl?: string
  }>
}

interface EventDetailProps {
  event: Event
  onBack: () => void
  onRSVP: () => void
  onAddToCalendar: () => void
  onShare?: (eventId: string) => void
  calendarTimes: {
    start: string
    end: string
  }
}

export default function EventDetail({
  event: e,
  onBack,
  onRSVP,
  onAddToCalendar,
  onShare,
  calendarTimes,
}: EventDetailProps) {
  const remaining = spotsRemaining(e.attending, e.capacity)
  const mapSrc = makeMapSrc(e.location)

  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState("")
  const [attendeeFilter, setAttendeeFilter] = useState("all")

  const mockAttendees = e.attendees || [
    {
      id: "1",
      name: "Sarah Johnson",
      title: "Product Designer",
      email: "sarah.j@company.com",
      location: "San Francisco, CA",
      handle: "@sarahj",
      initials: "SJ",
      selectedColor: 0,
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "Senior Engineer",
      email: "michael.c@company.com",
      location: "New York, NY",
      handle: "@michaelc",
      initials: "MC",
      selectedColor: 1,
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      title: "UX Researcher",
      email: "emily.r@company.com",
      location: "Austin, TX",
      handle: "@emilyr",
      initials: "ER",
      selectedColor: 2,
    },
    {
      id: "4",
      name: "David Kim",
      title: "Product Manager",
      email: "david.k@company.com",
      location: "Seattle, WA",
      handle: "@davidk",
      initials: "DK",
      selectedColor: 3,
    },
    {
      id: "5",
      name: "Lisa Wang",
      title: "Data Scientist",
      email: "lisa.w@company.com",
      location: "Boston, MA",
      handle: "@lisaw",
      initials: "LW",
      selectedColor: 4,
    },
    {
      id: "6",
      name: "James Wilson",
      title: "Frontend Developer",
      email: "james.w@company.com",
      location: "Portland, OR",
      handle: "@jamesw",
      initials: "JW",
      selectedColor: 5,
    },
    {
      id: "7",
      name: "Ana Martinez",
      title: "AI Engineer",
      email: "ana.m@company.com",
      location: "Denver, CO",
      handle: "@anam",
      initials: "AM",
      selectedColor: 0,
    },
    {
      id: "8",
      name: "Robert Taylor",
      title: "Design Lead",
      email: "robert.t@company.com",
      location: "Chicago, IL",
      handle: "@robertt",
      initials: "RT",
      selectedColor: 1,
    },
  ]

  const filteredAttendees = mockAttendees.filter((attendee) => {
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

  const handleShare = () => {
    if (onShare) return onShare(e.id)
    const shareData = {
      title: e.title,
      text: e.description,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    }
    if (navigator.share) navigator.share(shareData).catch(() => {})
  }

  const handleICS = () => {
    const blob = generateICS(e, calendarTimes)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = sanitizeFilename(`${e.title}.ics`)
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">Invite Guests</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
        >
          <span className="text-white text-sm font-medium">Send a Blast</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
        >
          <span className="text-white text-sm font-medium">Share Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Event Card */}
        <div
          className={`rounded-3xl bg-gradient-to-br ${e.gradient || "from-sky-400/35 to-blue-600/20"} overflow-hidden shadow-2xl`}
        >
          <div className="p-6 space-y-4">
            {/* Cover Image Placeholder with Gradient */}
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-amber-200 via-cyan-300 to-purple-300 shadow-lg" />

            {/* Event Title */}
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{e.title}</h1>
            </div>

            {/* Date, Time, Location */}
            <div className="space-y-2 text-white/90 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{e.date}</p>
                  <p className="text-white/70 text-xs">{e.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <p className="text-white/90">Register to See Address</p>
              </div>
            </div>

            {/* Registration Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-white text-sm">Registration</h3>
              <p className="text-white/90 text-xs">Welcome! To join the event, please register below.</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500" />
                <div className="text-xs">
                  <p className="text-white font-medium">{e.host?.name || "Event Host"}</p>
                  <p className="text-white/70">{e.host?.description?.substring(0, 30) || "ofbabaniji@gmail.com"}</p>
                </div>
              </div>
              <button
                onClick={onRSVP}
                className="w-full py-3 bg-white hover:bg-white/90 text-black font-semibold rounded-xl transition-all"
              >
                One-Click RSVP
              </button>
            </div>

            {/* Presented By */}
            <div className="pt-3 border-t border-white/10">
              <p className="text-xs text-white/60 mb-1">Presented by</p>
              <p className="text-sm text-white font-medium">{e.host?.name || "Tech Community"} &gt;</p>
            </div>

            {/* Hosted By */}
            <div className="pt-2">
              <p className="text-xs text-white/60 mb-2">Hosted By</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {(e.host?.avatarText || e.host?.name || "TC").substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-white font-medium">{e.host?.name || "Event Organizer"}</p>
              </div>
            </div>

            {/* Event Link */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <p className="text-xs text-white/90">luma.com/{e.id}</p>
              <button className="text-xs text-white/90 hover:text-white">COPY</button>
            </div>

            {/* Share & Edit Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handleShare}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Share Event
              </button>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors">
                  Edit Event
                </button>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors">
                  Change Photo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right - When & Where */}
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4">When & Where</h2>
            
            <div className="space-y-4">
              {/* Date & Time */}
              <div className="flex items-start gap-4">
                <div className="text-center bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs text-white/60 uppercase">Nov</p>
                  <p className="text-2xl font-bold text-white">19</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Tomorrow</p>
                  <p className="text-sm text-white/70">{e.time} EST</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 pt-4 border-t border-white/10">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-amber-400 text-sm mb-1">Location Missing</p>
                  <p className="text-xs text-white/70">Please enter the location of the event before it starts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Invites</h2>
            <p className="text-sm text-white/60">Invite subscribers, contacts and past guests via email or SMS.</p>
          </div>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-colors flex items-center gap-2">
            <span>+</span> Invite Guests
          </button>
        </div>
        
        <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
          <div className="w-12 h-12 bg-white/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <Users className="w-6 h-6 text-white/40" />
          </div>
          <h3 className="font-semibold text-white mb-1">No Invites Sent</h3>
          <p className="text-sm text-white/60">You can invite subscribers, contacts and past guests to the event.</p>
        </div>
      </section>

      <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Hosts</h2>
            <p className="text-sm text-white/60">Add hosts, special guests, and event managers.</p>
          </div>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-colors flex items-center gap-2">
            <span>+</span> Add Host
          </button>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500" />
              <div>
                <p className="text-white font-medium">{e.host?.name || "Oluwafemi Babaniji"}</p>
                <p className="text-sm text-white/60">ofbabaniji@gmail.com</p>
              </div>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">Creator</span>
            </div>
            <button className="text-white/60 hover:text-white transition-colors">
              <span className="text-lg">✎</span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-5">
          <Users className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Event Attendees</h2>
          <span className="text-sm text-white/60">({filteredAttendees.length})</span>
        </div>

        {/* Search and Filter Bar */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search attendees by name, title, or location..."
              value={attendeeSearchQuery}
              onChange={(e) => setAttendeeSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

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
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  attendeeFilter === filter.id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAttendees.map((attendee) => (
            <UnifiedPortfolioCard
              key={attendee.id}
              portfolio={attendee}
              onClick={(id) => console.log("View attendee profile:", id)}
              onShare={(id) => console.log("Share attendee:", id)}
              onMore={(id) => console.log("More options for attendee:", id)}
            />
          ))}
        </div>

        {filteredAttendees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">No attendees found matching your search.</p>
          </div>
        )}
      </section>
    </div>
  )
}

function KV({ label, value, emphasis }: { label: string; value: string; emphasis?: "positive" | "neutral" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-neutral-400">{label}</span>
      <span className={`font-bold text-white text-sm ${emphasis === "positive" ? "text-green-400" : ""}`}>{value}</span>
    </div>
  )
}
