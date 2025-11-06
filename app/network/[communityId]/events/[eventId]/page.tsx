"use client"

import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Shirt,
  Navigation,
  ExternalLink,
  UserCircle,
  TrendingUp,
  Tag,
  Building2,
} from "lucide-react"
import { useState } from "react"

const eventData = {
  "ai-ml-workshop": {
    title: "AI & Machine Learning Workshop",
    description: "Deep dive into cutting-edge AI technologies and practical ML implementations for startups.",
    fullDescription:
      "Join us for an intensive workshop exploring the latest developments in artificial intelligence and machine learning. This hands-on session will cover practical implementations, real-world use cases, and emerging trends in AI technology. Perfect for developers, data scientists, and tech enthusiasts looking to expand their knowledge and network with like-minded professionals.",
    date: "September 15, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Innovation Centre",
    fullAddress: "123 Tech Boulevard, Innovation District, San Francisco, CA 94103",
    dressCode: "Business Casual",
    dressCodeDetails:
      "Smart casual attire recommended. Comfortable clothing suitable for a professional tech environment.",
    agenda: [
      { time: "6:00 PM", item: "Registration & Networking" },
      { time: "6:30 PM", item: "Opening Keynote: The Future of AI" },
      { time: "7:15 PM", item: "Hands-on Workshop: Building ML Models" },
      { time: "8:30 PM", item: "Q&A and Closing Remarks" },
    ],
    host: {
      name: "Dr. Emily Chen",
      title: "AI Research Lead",
      bio: "Leading AI researcher with 10+ years of experience in machine learning and neural networks. Published author and frequent speaker at tech conferences.",
      avatarUrl: "/professional-woman-headshot.png",
    },
    stats: {
      totalAttendees: 45,
      spotsRemaining: 15,
      engagement: "High",
      format: "In-Person",
    },
    topics: ["Artificial Intelligence", "Machine Learning", "Neural Networks", "Deep Learning", "Data Science"],
    partners: ["TechCorp", "AI Labs", "Innovation Hub", "DataScience Institute"],
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
    fullDescription:
      "An exclusive evening designed for startup founders and entrepreneurs to connect, share experiences, and build meaningful relationships. This relaxed networking event provides the perfect atmosphere to discuss challenges, celebrate wins, and explore potential collaborations with fellow founders.",
    date: "Dec 18, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "Rooftop Lounge, Downtown",
    fullAddress: "456 Skyline Avenue, Rooftop Level, Downtown District, San Francisco, CA 94102",
    dressCode: "Smart Casual",
    dressCodeDetails:
      "Comfortable yet professional attire. Perfect for mingling and networking in a relaxed rooftop setting.",
    agenda: [
      { time: "6:00 PM", item: "Welcome Reception & Drinks" },
      { time: "6:45 PM", item: "Speed Networking Sessions" },
      { time: "7:30 PM", item: "Panel Discussion: Founder Journeys" },
      { time: "8:30 PM", item: "Open Networking & Closing" },
    ],
    host: {
      name: "Marcus Johnson",
      title: "Serial Entrepreneur",
      bio: "Three-time founder with successful exits. Passionate about helping early-stage startups navigate growth challenges and build sustainable businesses.",
      avatarUrl: "/man-developer.png",
    },
    stats: {
      totalAttendees: 60,
      spotsRemaining: 8,
      engagement: "Very High",
      format: "In-Person",
    },
    topics: ["Entrepreneurship", "Startups", "Networking", "Business Growth", "Venture Capital"],
    partners: ["Startup Accelerator", "Venture Partners", "Founder Institute"],
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
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-cyan-600/80 to-indigo-600/80"></div>
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

        <div className="relative z-10 px-6 pb-12 pt-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white font-medium">
                  Workshop
                </span>
                <span className="text-white/80 text-sm">{event.attendees.length} attending</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
              <p className="text-white/90 text-lg max-w-3xl mx-auto">{event.description}</p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-white" />
                  <span className="text-white/70 text-sm font-medium">Date & Time</span>
                </div>
                <p className="text-white font-semibold">{event.date}</p>
                <p className="text-white/80 text-sm">{event.time}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-white" />
                  <span className="text-white/70 text-sm font-medium">Location</span>
                </div>
                <p className="text-white font-semibold">{event.location}</p>
                <p className="text-white/80 text-sm">{event.fullAddress?.split(",")[0]}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Shirt className="w-5 h-5 text-white" />
                  <span className="text-white/70 text-sm font-medium">Dress Code</span>
                </div>
                <p className="text-white font-semibold">{event.dressCode}</p>
                <p className="text-white/80 text-sm">Professional attire</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button className="bg-white text-blue-600 hover:bg-white/90 px-8">RSVP Now</Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                Add to Calendar
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                Share Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column - Event Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* About This Event */}
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
                <p className="text-neutral-300 leading-relaxed mb-6">{event.fullDescription}</p>

                {/* Agenda */}
                <h3 className="text-xl font-semibold text-white mb-4">Event Agenda</h3>
                <div className="space-y-3">
                  {event.agenda?.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-neutral-800/50 rounded-xl">
                      <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-blue-400 font-medium text-sm">{item.time}</p>
                        <p className="text-white">{item.item}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dress Code Details */}
                <div className="mt-6 p-4 bg-neutral-800/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Shirt className="w-5 h-5 text-cyan-400" />
                    <h4 className="text-white font-semibold">Dress Code</h4>
                  </div>
                  <p className="text-neutral-300 text-sm">{event.dressCodeDetails}</p>
                </div>
              </div>

              {/* Location & Directions */}
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Location & Directions</h2>
                <div className="mb-4">
                  <p className="text-white font-semibold mb-1">{event.location}</p>
                  <p className="text-neutral-400 text-sm">{event.fullAddress}</p>
                </div>

                {/* Embedded Map */}
                <div className="relative w-full h-64 bg-neutral-800 rounded-xl overflow-hidden mb-4">
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-122.4194%2C37.7749%2C-122.4094%2C37.7849&layer=mapnik&marker=37.7799,-122.4144"
                    className="w-full h-full"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>

                {/* Direction Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/5 bg-transparent"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Host & Quick Info */}
            <div className="space-y-6">
              {/* Hosted By */}
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Hosted By</h3>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {event.host?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{event.host?.name}</h4>
                    <p className="text-neutral-400 text-sm">{event.host?.title}</p>
                  </div>
                </div>
                <p className="text-neutral-300 text-sm mb-4">{event.host?.bio}</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <UserCircle className="w-4 h-4 mr-2" />
                  Follow Host
                </Button>
              </div>

              {/* Event Stats */}
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">Total Attendees</span>
                    <span className="text-white font-semibold">{event.stats?.totalAttendees}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">Spots Remaining</span>
                    <span className="text-green-400 font-semibold">{event.stats?.spotsRemaining}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">Engagement</span>
                    <span className="text-blue-400 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {event.stats?.engagement}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">Format</span>
                    <span className="text-white font-semibold">{event.stats?.format}</span>
                  </div>
                </div>
              </div>

              {/* Topics */}
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">Topics</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.topics?.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium border border-blue-500/30"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Partners */}
              {event.partners && event.partners.length > 0 && (
                <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">Official Partners</h3>
                  </div>
                  <div className="space-y-2">
                    {event.partners.map((partner, index) => (
                      <div
                        key={index}
                        className="p-3 bg-neutral-800/50 rounded-lg text-neutral-300 text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        {partner}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Attendees Section */}
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
        </div>
      </div>
    </div>
  )
}
