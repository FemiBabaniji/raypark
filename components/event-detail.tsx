"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin, Calendar, Users, Sparkles, Search } from "lucide-react"
import clsx from "clsx"
import { spotsRemaining, makeMapSrc, generateICS, sanitizeFilename, initials } from "@/utils"
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
  attending: number
  capacity: number
  gradient?: string
  host?: {
    name?: string
    description?: string
    avatarText?: string
  }
  tags?: string[]
  partners?: string[]
  id: string
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

  const mockAttendees = [
    {
      id: "1",
      name: "Sarah Johnson",
      title: "Product Designer",
      department: "design",
      avatar: "SJ",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "Senior Engineer",
      department: "engineering",
      avatar: "MC",
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      title: "UX Researcher",
      department: "design",
      avatar: "ER",
      color: "from-violet-500 to-purple-500",
    },
    {
      id: "4",
      name: "David Kim",
      title: "Product Manager",
      department: "product",
      avatar: "DK",
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "5",
      name: "Lisa Wang",
      title: "Data Scientist",
      department: "data",
      avatar: "LW",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "6",
      name: "James Wilson",
      title: "Frontend Developer",
      department: "engineering",
      avatar: "JW",
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "7",
      name: "Ana Martinez",
      title: "AI Engineer",
      department: "data",
      avatar: "AM",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "8",
      name: "Robert Taylor",
      title: "Design Lead",
      department: "design",
      avatar: "RT",
      color: "from-teal-500 to-cyan-500",
    },
  ]

  const filteredAttendees = mockAttendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
      attendee.title.toLowerCase().includes(attendeeSearchQuery.toLowerCase())
    const matchesFilter = attendeeFilter === "all" || attendee.department === attendeeFilter
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
    <div className="max-w-6xl mx-auto px-6 space-y-8">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-all duration-200 hover:gap-3"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to Events</span>
        </button>
      </div>

      <div
        className={clsx(
          "rounded-3xl p-10 mb-2 bg-gradient-to-br relative overflow-hidden backdrop-blur-xl",
          "shadow-2xl shadow-black/20 transition-all duration-300 hover:shadow-3xl",
          e.gradient || "from-sky-400/35 to-blue-600/20",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-white/80" />
            <span className="text-sm font-medium text-white/80 uppercase tracking-wider">Featured Event</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 text-white leading-tight">{e.title}</h1>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-200 hover:bg-white/20">
              <Calendar className="w-4 h-4 text-white/90" />
              <span className="text-sm font-medium text-white/90">
                {e.date} • {e.time}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-200 hover:bg-white/20">
              <MapPin className="w-4 h-4 text-white/90" />
              <span className="text-sm font-medium text-white/90">{e.location.name}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-200 hover:bg-white/20">
              <Users className="w-4 h-4 text-white/90" />
              <span className="text-sm font-medium text-white/90">{e.attending} attending</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={onRSVP}
              className="bg-white text-zinc-900 hover:bg-white/90 rounded-xl px-8 py-3 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              RSVP Now
            </Button>
            <Button
              onClick={onAddToCalendar}
              className="bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:scale-105"
            >
              Add to Calendar
            </Button>
            <Button
              onClick={handleShare}
              className="bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:scale-105"
            >
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left content */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#1a1a1a] backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-white">About This Event</h3>
            <div className="space-y-4 text-base text-neutral-300 leading-relaxed">
              <p>{e.description}</p>
            </div>
          </section>

          <section className="bg-[#1a1a1a] backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-cyan-400" />
              <h3 className="text-2xl font-bold text-white">Event Attendees</h3>
              <span className="text-sm text-neutral-400">({filteredAttendees.length})</span>
            </div>

            <div className="space-y-4 mb-6">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search attendees by name, title..."
                  value={attendeeSearchQuery}
                  onChange={(e) => setAttendeeSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              {/* Filter Buttons */}
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      attendeeFilter === filter.id
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                        : "bg-neutral-800/50 text-neutral-300 hover:bg-neutral-800/70 border border-neutral-700/50"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {filteredAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="bg-neutral-800/40 backdrop-blur-xl rounded-xl p-4 border border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-200 hover:bg-neutral-800/60 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${attendee.color} flex items-center justify-center text-white font-semibold shadow-lg`}
                    >
                      {attendee.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate">{attendee.name}</h4>
                      <p className="text-sm text-neutral-400 truncate">{attendee.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAttendees.length === 0 && (
              <p className="text-center text-neutral-500 py-8">No attendees found matching your search.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          {/* Host */}
          {(e.host || e.host?.name) && (
            <section className="bg-[#1a1a1a] backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-white">Hosted By</h3>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {e.host?.avatarText || (e.host?.name ? initials(e.host.name) : "EV")}
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-white">{e.host?.name || "Organizer"}</h4>
                  <p className="text-xs text-neutral-400">Event Organizer</p>
                </div>
              </div>
              {e.host?.description && (
                <p className="text-sm text-neutral-300 mb-5 leading-relaxed">{e.host.description}</p>
              )}
              <button className="w-full py-3 bg-neutral-800/50 hover:bg-neutral-800/70 rounded-xl text-sm font-semibold transition-all duration-200 text-white">
                Follow Organizer
              </button>
            </section>
          )}

          {e.location && (
            <section className="bg-[#1a1a1a] backdrop-blur-xl rounded-3xl p-8 space-y-6 shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-bold text-white">Location</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-base text-white">{e.location.name}</p>
                    {e.location.addressLine && <p className="text-sm text-neutral-400">{e.location.addressLine}</p>}
                    {e.location.venue && <p className="text-sm text-neutral-400">{e.location.venue}</p>}
                    {e.location.venueDetails && <p className="text-xs text-neutral-500">{e.location.venueDetails}</p>}
                    {e.location.format && (
                      <p className="text-xs text-neutral-500 capitalize">
                        Format: {e.location.format.replace("_", " ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {mapSrc && (
                <div className="w-full h-48 rounded-2xl overflow-hidden shadow-lg bg-neutral-800/50 backdrop-blur-sm">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder={0}
                    scrolling="no"
                    src={mapSrc}
                    style={{ border: 0 }}
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                {e.location.addressLine && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      e.location.addressLine,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-xs font-semibold transition-all duration-200 text-center text-white shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Get Directions
                  </a>
                )}
                {(e.location.addressLine || e.location.name) && (
                  <a
                    href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(
                      e.location.addressLine || e.location.name,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-neutral-800/50 hover:bg-neutral-800/70 rounded-xl text-xs font-medium transition-all duration-200 text-white"
                  >
                    OSM
                  </a>
                )}
              </div>
            </section>
          )}

          {!!e.tags?.length && (
            <section className="bg-[#1a1a1a] backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-white">Topics</h3>
              <div className="flex flex-wrap gap-2.5">
                {e.tags.map((t, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-neutral-800/50 hover:bg-neutral-800/70 rounded-xl text-xs font-medium text-neutral-300 transition-all duration-200 cursor-pointer"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {!!e.partners?.length && (
            <section className="bg-[#1a1a1a] backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-white">Official Partners</h3>
              <div className="flex flex-wrap gap-2.5">
                {e.partners.map((p, i) => (
                  <span
                    key={i}
                    className="px-4 py-2.5 bg-neutral-800/50 hover:bg-neutral-800/70 rounded-xl text-xs font-medium transition-all duration-200 text-neutral-300 cursor-pointer"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

function KV({
  label,
  value,
  emphasis,
}: {
  label: string
  value: string
  emphasis?: "positive" | "neutral"
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-neutral-400">{label}</span>
      <span className={clsx("font-bold text-white", emphasis === "positive" && "text-green-400")}>{value}</span>
    </div>
  )
}
