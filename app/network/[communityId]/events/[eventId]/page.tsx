"use client"

import { useRouter, useParams } from 'next/navigation'
import { motion } from "framer-motion"
import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { Calendar, Clock, MapPin, Users, Search, Share2, Send, UserPlus } from 'lucide-react'
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
      },
    ],
  },
  "founder-networking-mixer": {
    title: "Founder Networking Mixer",
    description:
      "Connect with fellow entrepreneurs and startup founders in a relaxed networking environment. Share experiences and build valuable connections.",
    date: "Dec 18, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "Rooftop Lounge, Downtown",
    attendees: [
      {
        id: "alex-thompson",
        name: "Alex Thompson",
        title: "Startup Founder",
        email: "alex@startupventure.com",
        location: "New York, NY",
        handle: "@alexfounder",
        initials: "AT",
        selectedColor: 5,
      },
      {
        id: "jessica-wu",
        name: "Jessica Wu",
        title: "CEO",
        email: "jessica@techcorp.io",
        location: "San Francisco, CA",
        handle: "@jessicaceo",
        initials: "JW",
        selectedColor: 3,
        avatarUrl: "/woman-analyst.png",
      },
      {
        id: "michael-brown",
        name: "Michael Brown",
        title: "Co-founder",
        email: "michael@innovationstudio.com",
        location: "Los Angeles, CA",
        handle: "@michaelco",
        initials: "MB",
        selectedColor: 4,
      },
      {
        id: "lisa-park",
        name: "Lisa Park",
        title: "Entrepreneur",
        email: "lisa@entrepreneurhub.co",
        location: "Portland, OR",
        handle: "@lisaentrepreneur",
        initials: "LP",
        selectedColor: 2,
      },
    ],
  },
}

export default function EventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { communityId, eventId } = params

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const event = eventData[eventId as keyof typeof eventData]

  if (!event) {
    return <div>Event not found</div>
  }

  const filteredAttendees = event.attendees.filter((attendee) => {
    const matchesSearch =
      searchQuery === "" ||
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "design" &&
        (attendee.title.toLowerCase().includes("design") || attendee.title.toLowerCase().includes("ux"))) ||
      (selectedFilter === "engineering" &&
        (attendee.title.toLowerCase().includes("engineer") || attendee.title.toLowerCase().includes("developer"))) ||
      (selectedFilter === "product" && attendee.title.toLowerCase().includes("product")) ||
      (selectedFilter === "data" &&
        (attendee.title.toLowerCase().includes("data") || attendee.title.toLowerCase().includes("scientist"))) ||
      (selectedFilter === "founder" && attendee.title.toLowerCase().includes("founder"))

    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-zinc-950">
      <motion.nav
        className="relative z-50 p-6"
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <BackButton
          onClick={() => router.push(`/network/${communityId}`)}
          className="text-white/80 hover:text-white transition-colors mb-6"
        />

        {/* Action Buttons Row */}
        <div className="flex items-center gap-3 mb-6">
          <button className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
            <UserPlus className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-medium">Invite Guests</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
            <Send className="w-4 h-4 text-purple-400" />
            <span className="text-white text-sm font-medium">Send a Blast</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
            <Share2 className="w-4 h-4 text-pink-400" />
            <span className="text-white text-sm font-medium">Share Event</span>
          </button>
        </div>
      </motion.nav>

      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left - Event Card with Gradient Cover */}
            <div className="rounded-3xl bg-gradient-to-br from-amber-200 via-cyan-300 to-purple-300 overflow-hidden shadow-2xl">
              <div className="p-6 space-y-4">
                {/* Cover Image Placeholder with Gradient */}
                <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-orange-300 via-yellow-200 to-cyan-400 shadow-lg" />

                {/* Event Title */}
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900 mb-2">{event.title}</h1>
                </div>

                {/* Date, Time, Location */}
                <div className="space-y-2 text-zinc-800 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{event.date}</p>
                      <p className="text-zinc-700 text-xs">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <p>Register to See Address</p>
                  </div>
                </div>

                {/* Registration Section */}
                <div className="bg-zinc-900/20 backdrop-blur-sm rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-zinc-900 text-sm">Registration</h3>
                  <p className="text-zinc-800 text-xs">Welcome! To join the event, please register below.</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500" />
                    <div className="text-xs">
                      <p className="text-zinc-900 font-medium">Oluwafemi Babaniji</p>
                      <p className="text-zinc-700">ofbabaniji@gmail.com</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-white hover:bg-white/90 text-black font-semibold rounded-xl transition-all">
                    One-Click RSVP
                  </button>
                </div>

                {/* Presented By */}
                <div className="pt-3 border-t border-zinc-800/20">
                  <p className="text-xs text-zinc-700 mb-1">Presented by</p>
                  <p className="text-sm text-zinc-900 font-medium">DMZ &gt;</p>
                </div>

                {/* Hosted By */}
                <div className="pt-2">
                  <p className="text-xs text-zinc-700 mb-2">Hosted By</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-900/20 flex items-center justify-center">
                      <span className="text-zinc-900 text-xs font-bold">OB</span>
                    </div>
                    <p className="text-sm text-zinc-900 font-medium">Oluwafemi Babaniji</p>
                  </div>
                </div>

                {/* Event Link */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/20">
                  <p className="text-xs text-zinc-800">luma.com/ebv3f82b</p>
                  <button className="text-xs text-zinc-800 hover:text-zinc-900 font-medium">COPY</button>
                </div>

                {/* Share & Edit Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button className="text-sm text-zinc-700 hover:text-zinc-900 transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Event
                  </button>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-zinc-900/10 hover:bg-zinc-900/20 text-zinc-900 text-xs rounded-lg transition-colors">
                      Edit Event
                    </button>
                    <button className="px-4 py-2 bg-zinc-900/10 hover:bg-zinc-900/20 text-zinc-900 text-xs rounded-lg transition-colors">
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
                    <div className="text-center bg-white/10 rounded-lg px-3 py-2 min-w-[60px]">
                      <p className="text-xs text-white/60 uppercase">Nov</p>
                      <p className="text-2xl font-bold text-white">19</p>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Tomorrow</p>
                      <p className="text-sm text-white/70">{event.time} EST</p>
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

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
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

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
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
                    <p className="text-white font-medium">Oluwafemi Babaniji</p>
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

          {/* Event Attendees Section */}
          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Event Attendees</h2>
              <span className="text-sm text-neutral-400">({filteredAttendees.length})</span>
            </div>

            <div className="mb-8 space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search attendees by name, title, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/50 transition-colors"
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
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedFilter === filter.id
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        : "bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800/50 border border-white/10"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Attendees Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAttendees.map((attendee) => (
                <UnifiedPortfolioCard
                  key={attendee.id}
                  portfolio={attendee}
                  onClick={(id) => {
                    if (id === "john-doe") {
                      router.push("/network/john-doe")
                    } else if (id === "sarah-chen") {
                      router.push("/network/sarah-chen")
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
                <p className="text-neutral-400 text-lg">No attendees found matching your search.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
