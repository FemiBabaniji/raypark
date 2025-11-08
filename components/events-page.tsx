"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { BackButton } from "@/components/ui/back-button"
import { Navigation } from "@/components/navigation"
import { NavbarContent, FILTER_TABS } from "@/components/event-nav"
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
  const [currentView, setCurrentView] = useState("network")
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [active, setActive] = useState("Events")
  const [searchQuery, setSearchQuery] = useState("")

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

  const navbarContent = !selectedEvent ? (
    <NavbarContent
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder={
        active === "Events"
          ? "Search workshops by name, description, or tags..."
          : active === "Members"
            ? "Search members by name, role, or location..."
            : "Search projects..."
      }
      tabs={FILTER_TABS}
      activeTab={active}
      onTabChange={setActive}
    />
  ) : undefined

  return (
    <div className="min-h-screen" style={{ backgroundColor: "oklch(0.18 0 0)", color: "#FFFFFF" }}>
      <Navigation
        currentView={currentView}
        isLoggedIn={isLoggedIn}
        isSearchExpanded={isSearchExpanded}
        isUserDropdownOpen={isUserDropdownOpen}
        setCurrentView={setCurrentView}
        setIsSearchExpanded={setIsSearchExpanded}
        setIsUserDropdownOpen={setIsUserDropdownOpen}
        setIsLoggedIn={setIsLoggedIn}
        centerContent={navbarContent}
      />

      {selectedEvent && mappedEventData ? (
        <div className="pt-16">
          <div className="px-6 pt-6">
            <BackButton onClick={handleBackClick} />
          </div>
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
        <main className="pt-16 px-6 py-4">
          <div className="max-w-6xl mx-auto relative overflow-hidden">
            <div className="flex gap-6">
              <motion.div
                className="flex-1"
                animate={{
                  width: "auto",
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <EventsLeftColumn onEventClick={handleEventClick} activeTab={active} searchQuery={searchQuery} />
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
