"use client"
import { Search, Home } from "lucide-react"
import BackButton from "@/components/back-button"

export default function AIMLWorkshopPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#191919", color: "#FFFFFF" }}>
      {/* Back button in top left corner - matches ExpandedViewNavigation */}
      <div className="fixed top-8 left-8 z-50">
        <BackButton onClick={() => window.history.back()} />
      </div>

      {/* Home button in top right corner - matches ExpandedViewNavigation preview button position */}
      <div className="fixed top-8 right-8 z-50">
        <button
          onClick={() => (window.location.href = "/")}
          className="px-4 py-2 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors text-sm font-medium"
        >
          <Home className="w-5 h-5" fill="white" />
        </button>
      </div>

      {/* Search bar centered - matches ExpandedViewNavigation center positioning */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40">
        <div className="relative h-10 w-full max-w-md rounded-2xl" style={{ backgroundColor: "#393939" }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: "#B3B3B3" }} />
          <input
            placeholder="Search"
            className="h-full w-full bg-transparent outline-none pl-12 pr-4 text-sm border-none shadow-none"
            style={{ color: "#FFFFFF" }}
          />
        </div>
      </div>

      <main className="px-6 py-4" style={{ paddingTop: "5rem" }}>
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400/80 via-blue-600/80 to-blue-800/80 p-8 md:p-12">
            <div className="relative z-10">
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AI & Machine Learning Workshop</h1>
                <div className="flex flex-wrap gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>September 1, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕕</span>
                    <span>6:00 PM - 9:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>Tech Hub, 3rd Floor</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors">
                  RSVP Now
                </button>
                <button className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm">
                  Add to Calendar
                </button>
                <button className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm">
                  Share Event
                </button>
              </div>
            </div>
          </div>

          {/* Attendees section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Attendees (23)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-neutral-800 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-semibold">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="text-white text-sm font-medium">Member {i + 1}</div>
                  <div className="text-gray-400 text-xs">Entrepreneur</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
