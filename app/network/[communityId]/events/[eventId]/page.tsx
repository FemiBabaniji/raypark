"use client"

import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { Calendar, Clock, MapPin, Users, Search } from "lucide-react"
import { useState } from "react"

const eventData = {
  "ai-ml-workshop": {
    title: "AI & Machine Learning Workshop",
    description: "Deep dive into cutting-edge AI technologies and practical ML implementations for startups.",
    date: "September 15, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Innovation Centre",
    attendees: [
      {
        id: "jenny-wilson",
        name: "Jenny Wilson",
        title: "Digital Product Designer",
        email: "jenny@acme.com",
        location: "New York, NY",
        handle: "@jennywilson",
        initials: "JW",
        selectedColor: 1,
        avatarUrl: "/woman-designer.png",
        role: "attendee",
      },
      {
        id: "john-doe",
        name: "John Doe",
        title: "Data Scientist",
        email: "john@datastam.edu",
        location: "Boston, MA",
        handle: "@johndoe",
        initials: "JD",
        selectedColor: 2,
        role: "speaker",
      },
      {
        id: "sarah-chen",
        name: "Sarah Chen",
        title: "Frontend Developer",
        email: "sarah@techstartup.io",
        location: "San Francisco, CA",
        handle: "@sarahcodes",
        initials: "SC",
        selectedColor: 3,
        avatarUrl: "/professional-headshot.png",
        role: "attendee",
      },
      {
        id: "mike-rodriguez",
        name: "Mike Rodriguez",
        title: "Product Manager",
        email: "mike@innovationlabs.com",
        location: "Austin, TX",
        handle: "@mikepm",
        initials: "MR",
        selectedColor: 4,
        role: "organizer",
      },
      {
        id: "alex-thompson",
        name: "Alex Thompson",
        title: "Software Engineer",
        email: "alex@techsolutions.com",
        location: "Seattle, WA",
        handle: "@alexdev",
        initials: "AT",
        selectedColor: 2,
        role: "attendee",
      },
      {
        id: "lisa-martinez",
        name: "Lisa Martinez",
        title: "UX Researcher",
        email: "lisa@designstudio.co",
        location: "Portland, OR",
        handle: "@lisamartinez",
        initials: "LM",
        selectedColor: 5,
        role: "speaker",
      },
    ],
  },
}

export default function EventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { communityId, eventId } = params

  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const event = eventData[eventId as keyof typeof eventData]

  if (!event) {
    return <div>Event not found</div>
  }

  const filteredAttendees = event.attendees.filter((attendee) => {
    const matchesFilter = selectedFilter === "all" || attendee.role === selectedFilter
    const matchesSearch =
      searchQuery === "" ||
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-blue-600/80 to-indigo-600/80"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <motion.nav
          className="relative z-50 p-6 flex items-center justify-between"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <BackButton
            onClick={() => router.push(`/network/${communityId}`)}
            className="text-white/80 hover:text-white transition-colors"
          />
        </motion.nav>

        <div className="relative z-10 px-6 pb-12 pt-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
          <div className="flex items-center justify-center gap-6 text-white/90 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button className="bg-white text-purple-600 hover:bg-white/90">RSVP Now</Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
              Add to Calendar
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
              Share Event
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Event Attendees</h2>
          </div>

          <div className="mb-8 space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search attendees by name or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-2xl pl-12 pr-4 py-3 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All Attendees", value: "all" },
                { label: "Speakers", value: "speaker" },
                { label: "Organizers", value: "organizer" },
                { label: "Attendees", value: "attendee" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedFilter === filter.value
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl text-neutral-300 hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAttendees.map((attendee) => (
              <UnifiedPortfolioCard
                key={attendee.id}
                portfolio={attendee}
                onClick={(id) => {
                  if (id === "john-doe") {
                    router.push("/network/john-doe")
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
            <div className="text-center py-12">
              <p className="text-neutral-400 text-lg">No attendees found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
