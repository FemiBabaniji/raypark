"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Home } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import EventsLeftColumn from "@/components/events-left-column"
import EventsRightColumn from "@/components/events-right-column"
import EventDetail, { type EventDetailData } from "@/components/event-detail"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"

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

  const mappedEventData: EventDetailData | null = selectedEventData
    ? {
        id: selectedEvent!,
        title: selectedEventData.title,
        description: selectedEventData.description,
        fullDescription: selectedEventData.description,
        agenda: [
          "Introduction and networking (30 mins)",
          "Keynote presentation on latest AI trends (60 mins)",
          "Hands-on workshop sessions (90 mins)",
          "Q&A and closing remarks (30 mins)",
        ],
        dateLabel: selectedEventData.date,
        timeLabel: selectedEventData.time,
        attending: selectedEventData.attendees.length,
        capacity: 50,
        type: "Workshop",
        tags: ["AI", "Machine Learning", "Technology", "Networking"],
        gradient: selectedEventData.gradient,
        location: {
          name: selectedEventData.location,
          addressLine: "123 Tech Street, Innovation District, San Francisco, CA 94105",
          venue: "Main Conference Hall",
          venueDetails: "Enter through the main lobby and take the elevator to the 3rd floor",
          lat: 37.7749,
          lng: -122.4194,
          format: "in_person" as const,
        },
        host: {
          name: "Tech Community",
          description: "Leading community for tech professionals and innovators in the Bay Area.",
          avatarText: "TC",
        },
        partners: ["Google", "Microsoft", "AWS", "Meta"],
      }
    : null

  return (
    <div className="min-h-screen" style={{ backgroundColor: "oklch(0.18 0 0)", color: "#FFFFFF" }}>
      {!selectedEvent && (
        <>
          <div className="fixed top-6 left-6 z-20">
            <BackButton onClick={handleBackClick} />
          </div>
          <button
            onClick={() => (window.location.href = "/")}
            className="fixed top-6 right-6 z-20 w-10 h-10 bg-neutral-800/90 backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-neutral-700/90 transition-colors"
          >
            <Home className="w-5 h-5" fill="white" />
          </button>
        </>
      )}

      {selectedEvent && mappedEventData ? (
        <div className="pt-6">
          <EventDetail
            event={mappedEventData}
            onBack={handleBackClick}
            onRSVP={(eventId) => {
              console.log("RSVP for event:", eventId)
            }}
            onShare={(eventId) => {
              console.log("Share event:", eventId)
            }}
          />

          <div className="px-6 py-12 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 bg-cyan-600 rounded flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <h2 className="text-3xl font-bold text-white">Event Attendees</h2>
              <span className="text-lg text-neutral-400">({selectedEventData.attendees.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedEventData.attendees.map((attendee) => (
                <UnifiedPortfolioCard
                  key={attendee.id}
                  portfolio={attendee}
                  onClick={(id) => {
                    if (id === "john-doe") {
                      window.location.href = "/network/john-doe"
                    } else if (id === "sarah-chen") {
                      window.location.href = "/network/sarah-chen"
                    } else {
                      console.log("View attendee profile:", id)
                    }
                  }}
                  onShare={(id) => console.log("Share attendee:", id)}
                  onMore={(id) => console.log("More options for attendee:", id)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <main>
          <div className="w-full pl-12 px-6 relative overflow-hidden">
            <div className="flex gap-8">
              <motion.div
                className="w-[calc(100%-22rem)]"
                animate={{
                  width: "calc(100% - 22rem)",
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
