"use client"
import { Search, Home } from "lucide-react"
import BackButton from "@/components/back-button"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AIMLWorkshopPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const attendees = [
    { id: 1, name: "Sarah Chen", title: "ML Engineer", location: "San Francisco, CA", initial: "SC" },
    { id: 2, name: "David Kim", title: "Data Scientist", location: "New York, NY", initial: "DK" },
    { id: 3, name: "Emily Rodriguez", title: "AI Researcher", location: "Boston, MA", initial: "ER" },
    { id: 4, name: "Michael Zhang", title: "Product Manager", location: "Seattle, WA", initial: "MZ" },
    { id: 5, name: "Jessica Lee", title: "Software Engineer", location: "Austin, TX", initial: "JL" },
    { id: 6, name: "Alex Johnson", title: "UX Designer", location: "Portland, OR", initial: "AJ" },
    { id: 7, name: "Rachel Park", title: "Data Analyst", location: "Chicago, IL", initial: "RP" },
    { id: 8, name: "Tom Wilson", title: "ML Engineer", location: "Denver, CO", initial: "TW" },
  ]

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      searchQuery === "" ||
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "engineering" && (attendee.title.includes("Engineer") || attendee.title.includes("Developer"))) ||
      (roleFilter === "data" &&
        (attendee.title.includes("Data") || attendee.title.includes("ML") || attendee.title.includes("AI"))) ||
      (roleFilter === "product" && attendee.title.includes("Product")) ||
      (roleFilter === "design" && attendee.title.includes("Design"))

    return matchesSearch && matchesRole
  })

  const roleFilters = [
    { key: "all", label: "All Attendees" },
    { key: "engineering", label: "Engineering" },
    { key: "data", label: "Data & AI" },
    { key: "product", label: "Product" },
    { key: "design", label: "Design" },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#191919", color: "#FFFFFF" }}>
      <header className="h-14 flex items-center">
        <BackButton onClick={() => window.history.back()} className="ml-6" />
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative h-10 w-full max-w-md rounded-2xl" style={{ backgroundColor: "#393939" }}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: "#B3B3B3" }} />
              <input
                placeholder="Search"
                className="h-full w-full bg-transparent outline-none pl-12 pr-4 text-sm border-none shadow-none"
                style={{ color: "#FFFFFF" }}
              />
            </div>
          </div>
        </div>
        <button
          onClick={() => (window.location.href = "/")}
          className="w-10 h-10 bg-neutral-800/90 backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-neutral-700/90 transition-colors mr-6"
        >
          <Home className="w-5 h-5" fill="white" />
        </button>
      </header>

      <main className="px-6 py-4">
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

          <div className="mt-8 mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search attendees by name, title, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-neutral-900/50 backdrop-blur-xl rounded-2xl text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {roleFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setRoleFilter(filter.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    roleFilter === filter.key
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800/50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Attendees section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Attendees ({filteredAttendees.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  onClick={() => {
                    if (attendee.name === "Sarah Chen") {
                      router.push("/network/sarah-chen")
                    }
                  }}
                  className="bg-neutral-800 rounded-xl p-4 text-center hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-semibold">
                    {attendee.initial}
                  </div>
                  <div className="text-white text-sm font-medium">{attendee.name}</div>
                  <div className="text-gray-400 text-xs">{attendee.title}</div>
                  <div className="text-gray-500 text-xs mt-1">{attendee.location}</div>
                </div>
              ))}
            </div>
            {filteredAttendees.length === 0 && (
              <div className="text-center py-12 text-neutral-500">
                No attendees found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
