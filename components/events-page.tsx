"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Home } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import EventsLeftColumn from "@/components/events-left-column"
import EventsRightColumn from "@/components/events-right-column"

const eventData = {
  "ai-ml-workshop": {
    title: "AI & Machine Learning Workshop",
    date: "Dec 15, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Tech Hub, Building A",
    description:
      "Join us for an intensive workshop on the latest AI and machine learning technologies. Learn hands-on techniques and network with industry experts.",
    attendees: [
      {
        id: "sarah-chen",
        name: "Sarah Chen",
        title: "AI Engineer",
        email: "sarah@techstartup.io",
        location: "San Francisco, CA",
        handle: "@sarahcodes",
        initials: "SC",
        selectedColor: 3,
        avatarUrl: "/professional-headshot.png",
      },
      {
        id: "marcus-johnson",
        name: "Marcus Johnson",
        title: "Data Scientist",
        email: "marcus@datascience.edu",
        location: "Boston, MA",
        handle: "@marcusdata",
        initials: "MJ",
        selectedColor: 1,
      },
      {
        id: "elena-rodriguez",
        name: "Elena Rodriguez",
        title: "ML Researcher",
        email: "elena@researchlab.com",
        location: "Austin, TX",
        handle: "@elenaml",
        initials: "ER",
        selectedColor: 2,
      },
      {
        id: "david-kim",
        name: "David Kim",
        title: "Tech Lead",
        email: "david@innovationlabs.com",
        location: "Seattle, WA",
        handle: "@davidtech",
        initials: "DK",
        selectedColor: 4,
      },
    ],
    gradient: "from-sky-400/35 to-blue-600/20",
    accent: "#0EA5E9",
  },
  "founder-networking-mixer": {
    title: "Founder Networking Mixer",
    date: "Dec 18, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "Rooftop Lounge, Downtown",
    description:
      "Connect with fellow entrepreneurs and startup founders in a relaxed networking environment. Share experiences and build valuable connections.",
    attendees: [
      {
        id: "alex-thompson",
        name: "Alex Thompson",
        title: "Startup Founder",
        email: "alex@startupventure.com",
        location: "New York, NY",
        handle: "@alexfounder",
        initials: "AT",
        selectedColor: 2,
      },
      {
        id: "jessica-wu",
        name: "Jessica Wu",
        title: "CEO",
        email: "jessica@techcorp.io",
        location: "San Francisco, CA",
        handle: "@jessicaceo",
        initials: "JW",
        selectedColor: 5,
        avatarUrl: "/woman-designer.png",
      },
      {
        id: "michael-brown",
        name: "Michael Brown",
        title: "Co-founder",
        email: "michael@innovationstudio.com",
        location: "Los Angeles, CA",
        handle: "@michaelco",
        initials: "MB",
        selectedColor: 3,
      },
      {
        id: "lisa-park",
        name: "Lisa Park",
        title: "Entrepreneur",
        email: "lisa@entrepreneurhub.co",
        location: "Portland, OR",
        handle: "@lisaentrepreneur",
        initials: "LP",
        selectedColor: 1,
      },
    ],
    gradient: "from-emerald-400/35 to-teal-600/20",
    accent: "#10B981",
  },
  "product-design-masterclass": {
    title: "Product Design Masterclass",
    date: "Dec 20, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Design Studio, Creative District",
    description:
      "Master the art of product design with hands-on workshops covering user research, prototyping, and design systems from industry veterans.",
    attendees: [
      {
        id: "emma-wilson",
        name: "Emma Wilson",
        title: "UX Designer",
        email: "emma@designstudio.co",
        location: "Chicago, IL",
        handle: "@emmaux",
        initials: "EW",
        selectedColor: 4,
      },
      {
        id: "ryan-martinez",
        name: "Ryan Martinez",
        title: "Product Designer",
        email: "ryan@productdesign.io",
        location: "Denver, CO",
        handle: "@ryandesign",
        initials: "RM",
        selectedColor: 0,
      },
      {
        id: "sophie-taylor",
        name: "Sophie Taylor",
        title: "Design Lead",
        email: "sophie@creativestudio.com",
        location: "Miami, FL",
        handle: "@sophielead",
        initials: "ST",
        selectedColor: 5,
        avatarUrl: "/woman-analyst.png",
      },
      {
        id: "james-anderson",
        name: "James Anderson",
        title: "Creative Director",
        email: "james@creativedirection.co",
        location: "Nashville, TN",
        handle: "@jamescreative",
        initials: "JA",
        selectedColor: 2,
      },
    ],
    gradient: "from-violet-400/35 to-purple-600/20",
    accent: "#8B5CF6",
  },
}

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  const handleEventClick = (eventId: string) => {
    setSelectedEvent(eventId)
  }

  const handleBackClick = () => {
    if (selectedEvent) {
      setSelectedEvent(null)
    } else {
      window.history.back()
    }
  }

  const selectedEventData = selectedEvent ? eventData[selectedEvent as keyof typeof eventData] : null

  return (
    <div className="min-h-screen" style={{ backgroundColor: "oklch(0.18 0 0)", color: "#FFFFFF" }}>
      {!selectedEvent && (
        <header className="h-14 flex items-center px-6">
          <div className="absolute top-6 left-6">
            <BackButton onClick={handleBackClick} />
          </div>
          <div className="flex-1 ml-20">
            <div className="max-w-6xl mx-auto">
              <div
                className="relative h-10 w-full max-w-md rounded-2xl"
                style={{ backgroundColor: "oklch(0.145 0 0)" }}
              >
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
            className="w-10 h-10 bg-neutral-800/90 backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-neutral-700/90 transition-colors"
          >
            <Home className="w-5 h-5" fill="white" />
          </button>
        </header>
      )}

      {selectedEvent && selectedEventData ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-50"
          style={{ backgroundColor: "oklch(0.18 0 0)" }}
        >
          <div className="min-h-screen">
            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${selectedEventData.gradient}`}
                style={{ backgroundColor: "oklch(0.145 0 0)" }}
              ></div>

              <motion.nav
                className="absolute top-6 left-6 z-50"
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BackButton onClick={handleBackClick} />
              </motion.nav>

              <div className="relative z-10 px-6 pb-12 pt-4 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">{selectedEventData.title}</h1>
                <div className="flex items-center justify-center gap-6 text-white/90 mb-6">
                  <div className="flex items-center gap-2">
                    <span>{selectedEventData.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{selectedEventData.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{selectedEventData.location}</span>
                  </div>
                </div>

                <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                  {selectedEventData.description}
                </p>

                <div className="flex items-center justify-center gap-4">
                  <button
                    className="px-6 py-2 rounded-lg font-medium text-white transition-colors"
                    style={{ backgroundColor: selectedEventData.accent }}
                  >
                    RSVP Now
                  </button>
                  <button className="border border-white/30 text-white hover:bg-white/10 bg-transparent px-6 py-2 rounded-lg transition-colors">
                    Add to Calendar
                  </button>
                  <button className="border border-white/30 text-white hover:bg-white/10 bg-transparent px-6 py-2 rounded-lg transition-colors">
                    Share Event
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-12">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-8">Event Attendees</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {selectedEventData.attendees.map((attendee) => (
                    <UnifiedPortfolioCard
                      key={attendee.id}
                      portfolio={attendee}
                      onClick={(id) => {
                        console.log("View attendee profile:", id)
                      }}
                      onShare={(id) => console.log("Share attendee:", id)}
                      onMore={(id) => console.log("More options for attendee:", id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <main className="px-6 py-4">
          <div className="max-w-6xl mx-auto relative overflow-hidden">
            <div className="flex gap-6">
              <motion.div
                className="flex-1"
                animate={{
                  width: "auto",
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <EventsLeftColumn onEventClick={handleEventClick} />
              </motion.div>

              <motion.div
                className="w-80 flex-shrink-0"
                animate={{
                  x: "0%",
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <EventsRightColumn />
              </motion.div>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
