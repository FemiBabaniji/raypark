"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin } from "lucide-react"
import clsx from "clsx"
import { spotsRemaining, makeMapSrc, generateICS, sanitizeFilename, initials, formatLabel } from "@/utils"

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
    <div className="max-w-6xl mx-auto px-6 space-y-6">
      {/* Back */}
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="flex items-center gap-2 text-neutral-400 hover:text-white transition">
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Events</span>
        </button>
      </div>

      {/* Header */}
      <div className={clsx("rounded-2xl p-8 mb-2 bg-gradient-to-r", e.gradient || "from-sky-400/35 to-blue-600/20")}>
        <h1 className="text-4xl font-bold mb-4 text-white">{e.title}</h1>
        <p className="text-lg mb-6 text-white/90">
          {e.date} • {e.time} • {e.location.name}
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={onRSVP}
            className="bg-white/20 border border-white/30 text-white hover:bg-white/30 rounded-xl px-6 py-2 font-medium transition-colors"
          >
            RSVP Now
          </Button>
          <Button
            onClick={onAddToCalendar}
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-xl px-6 py-2 font-medium transition-colors"
          >
            Add to Calendar
          </Button>
          <Button
            onClick={handleShare}
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-xl px-6 py-2 font-medium transition-colors"
          >
            Share Event
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <section className="rounded-2xl p-6 border border-neutral-800" style={{ backgroundColor: "#1F1F1F" }}>
            <h3 className="text-xl font-bold mb-4 text-white">About This Event</h3>
            <div className="space-y-4 text-sm text-neutral-300">
              <p>{e.description}</p>
            </div>
          </section>

          {/* Location */}
          {e.location && (
            <section
              className="rounded-2xl p-6 border border-neutral-800 space-y-4"
              style={{ backgroundColor: "#1F1F1F" }}
            >
              <h3 className="text-xl font-bold text-white">Location & Directions</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">{e.location.name}</p>
                    {e.location.addressLine && <p className="text-sm text-neutral-400">{e.location.addressLine}</p>}
                    {e.location.venue && <p className="text-sm text-neutral-400 mt-1">{e.location.venue}</p>}
                    {e.location.venueDetails && (
                      <p className="text-xs text-neutral-500 mt-1">{e.location.venueDetails}</p>
                    )}
                    {e.location.format && (
                      <p className="text-xs text-neutral-500 mt-1 capitalize">
                        Format: {e.location.format.replace("_", " ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {mapSrc && (
                <div
                  className="w-full h-64 rounded-lg overflow-hidden border"
                  style={{ backgroundColor: "#2A2A2A", borderColor: "#444" }}
                >
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
              <div className="flex items-center gap-3">
                {e.location.addressLine && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      e.location.addressLine,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium transition text-center text-white"
                  >
                    Get Directions in Google Maps
                  </a>
                )}
                {(e.location.addressLine || e.location.name) && (
                  <a
                    href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(
                      e.location.addressLine || e.location.name,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition border text-white"
                    style={{ backgroundColor: "#2A2A2A", borderColor: "#444" }}
                  >
                    Open in OSM
                  </a>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right rail */}
        <aside className="space-y-6">
          {/* Host */}
          {(e.host || e.host?.name) && (
            <section className="rounded-2xl p-6 border border-neutral-800" style={{ backgroundColor: "#1F1F1F" }}>
              <h3 className="text-lg font-bold mb-4 text-white">Hosted By</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
                  {e.host?.avatarText || (e.host?.name ? initials(e.host.name) : "EV")}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{e.host?.name || "Organizer"}</h4>
                  <p className="text-xs text-neutral-400">Event Organizer</p>
                </div>
              </div>
              {e.host?.description && <p className="text-sm text-neutral-300 mb-4">{e.host.description}</p>}
              <button
                className="w-full py-2 rounded-lg text-sm font-medium transition border text-white"
                style={{ backgroundColor: "#2A2A2A", borderColor: "#444" }}
              >
                Follow Organizer
              </button>
            </section>
          )}

          {/* Stats */}
          <section className="rounded-2xl p-6 border border-neutral-800" style={{ backgroundColor: "#1F1F1F" }}>
            <h3 className="text-lg font-bold mb-4 text-white">Event Stats</h3>
            <div className="space-y-4">
              <KV label="Total Attendees" value={String(e.attending)} />
              {typeof remaining === "number" && (
                <KV label="Spots Remaining" value={String(remaining)} emphasis="positive" />
              )}
              <KV label="Event Format" value={formatLabel(e.location?.format)} />
            </div>
          </section>

          {/* Topics */}
          {!!e.tags?.length && (
            <section className="rounded-2xl p-6 border border-neutral-800" style={{ backgroundColor: "#1F1F1F" }}>
              <h3 className="text-lg font-bold mb-4 text-white">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {e.tags.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg text-xs border text-neutral-300"
                    style={{ backgroundColor: "#2A2A2A", borderColor: "#444" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Partners */}
          {!!e.partners?.length && (
            <section className="rounded-2xl p-6 border border-neutral-800" style={{ backgroundColor: "#1F1F1F" }}>
              <h3 className="text-lg font-bold mb-4 text-white">Official Partners</h3>
              <div className="flex flex-wrap gap-2">
                {e.partners.map((p, i) => (
                  <span
                    key={i}
                    className="px-3 py-2 rounded-lg text-xs transition border text-neutral-300"
                    style={{ backgroundColor: "#2A2A2A", borderColor: "#444" }}
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
