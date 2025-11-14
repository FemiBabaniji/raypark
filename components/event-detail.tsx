"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin, Calendar, Users, Search } from "lucide-react"
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
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-all duration-200 hover:gap-3 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="relative">
        <div
          className={`rounded-3xl p-8 bg-gradient-to-br ${e.gradient || "from-sky-400/35 to-blue-600/20"} relative overflow-hidden backdrop-blur-xl shadow-2xl shadow-black/20`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Type badge and attending count */}
            <div className="flex items-center gap-3">
              {e.type && (
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-full text-sm font-medium text-white">
                  {e.type}
                </span>
              )}
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-full text-sm font-medium text-white flex items-center gap-2">
                <Users className="w-4 h-4" />
                {e.attending} attending
              </span>
            </div>

            {/* Title and description */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 leading-tight">{e.title}</h1>
              <p className="text-lg text-white/90 leading-relaxed">{e.description}</p>
            </div>

            {/* Info cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 text-white/70 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">Date & Time</span>
                </div>
                <p className="font-semibold text-white">{e.date}</p>
                <p className="text-sm text-white/90">{e.time}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 text-white/70 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-medium">Location</span>
                </div>
                <p className="font-semibold text-white">{e.location.name}</p>
                <p className="text-sm text-white/90">{e.location.venue || "In-Person Event"}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 text-white/70 mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-medium">Dress Code</span>
                </div>
                <p className="font-semibold text-white">{e.dressCode || "Casual"}</p>
                <p className="text-sm text-white/90">Come as you are</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={onRSVP}
                className="px-6 py-2.5 rounded-xl font-semibold text-white transition-all hover:scale-105"
                style={{ backgroundColor: e.accent || "#06b6d4" }}
              >
                RSVP Now
              </Button>
              <Button
                onClick={handleICS}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white rounded-xl font-semibold transition-all hover:scale-105"
              >
                Add to Calendar
              </Button>
              <Button
                onClick={handleShare}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white rounded-xl font-semibold transition-all hover:scale-105"
              >
                Share Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - About Event */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-black/20">
            <h3 className="text-xl font-bold mb-4 text-white">About This Event</h3>
            <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
              {e.fullDescription ? (
                e.fullDescription.split("\n\n").map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))
              ) : (
                <p>{e.description}</p>
              )}

              {e.agenda && e.agenda.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-white mb-2">Event Agenda:</h4>
                  <ul className="space-y-1.5">
                    {e.agenda.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Location & Map */}
          {e.location.addressLine && (
            <section className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-black/20">
              <h3 className="text-xl font-bold mb-4 text-white">Location & Directions</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">{e.location.name}</p>
                    <p className="text-sm text-neutral-400 mt-1">{e.location.addressLine}</p>
                    {e.location.venueDetails && (
                      <p className="text-xs text-neutral-500 mt-1">{e.location.venueDetails}</p>
                    )}
                  </div>
                </div>

                {mapSrc && (
                  <div className="w-full h-48 bg-neutral-800/50 rounded-xl overflow-hidden border border-white/10">
                    <iframe width="100%" height="100%" frameBorder="0" src={mapSrc} style={{ border: 0 }} />
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          {/* Host Card */}
          {e.host && (
            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
              <h3 className="text-sm font-bold text-white mb-3">Hosted By</h3>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${e.accent || "#06b6d4"}, ${e.accent || "#06b6d4"}dd)`,
                  }}
                >
                  {(e.host.avatarText || e.host.name || "TC").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{e.host.name || "Tech Community"}</h4>
                  <p className="text-xs text-neutral-400">Event Organizer</p>
                </div>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {e.host.description || "Leading community for tech professionals."}
              </p>
            </div>
          )}

          {/* Event Stats */}
          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
            <h3 className="text-sm font-bold text-white mb-3">Event Stats</h3>
            <div className="space-y-2.5">
              <KV label="Total Attendees" value={e.attending.toString()} />
              <KV label="Spots Remaining" value={remaining.toString()} emphasis="positive" />
              <KV label="Engagement" value="High" />
              <KV label="Event Format" value={e.location.format || "In-Person"} />
            </div>
          </div>

          {/* Topics/Tags */}
          {e.tags && e.tags.length > 0 && (
            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
              <h3 className="text-sm font-bold text-white mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {e.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-neutral-800/50 text-neutral-300 rounded-lg text-xs border border-white/10 hover:bg-neutral-700/50 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Partners */}
          {e.partners && e.partners.length > 0 && (
            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20">
              <h3 className="text-sm font-bold text-white mb-3">Official Partners</h3>
              <div className="flex flex-wrap gap-2">
                {e.partners.map((partner, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-300 rounded-lg text-xs transition-colors border border-white/10"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3 mb-5">
          <Users className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Event Attendees</h2>
          <span className="text-sm text-neutral-400">({filteredAttendees.length})</span>
        </div>

        {/* Search and Filter Bar */}
        <div className="space-y-4 mb-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search attendees by name, title, or location..."
              value={attendeeSearchQuery}
              onChange={(e) => setAttendeeSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
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
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  attendeeFilter === filter.id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
                    : "bg-neutral-800/50 text-neutral-300 hover:bg-neutral-800/70 border border-neutral-700/50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Attendees Grid with UnifiedPortfolioCard */}
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
            <p className="text-neutral-400">No attendees found matching your search.</p>
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
