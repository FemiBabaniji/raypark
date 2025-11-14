"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import EventsLeftColumn from "@/components/events-left-column"
import EventsRightColumn from "@/components/events-right-column"
import type { EventDetailData } from "@/components/event-detail"
import { FilterTabs, FILTER_TABS } from "@/components/event-nav"

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

export default function EventsPage({ 
  logo = "/bea-logo.svg",
  communityName = "BEA" 
}: { 
  logo?: string
  communityName?: string 
}) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("Home")

  const handleEventClick = (eventId: string) => {
    setSelectedEvent(eventId)
  }

  const handleBackClick = () => {
    setSelectedEvent(null)
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
        attendees: selectedEventData.attendees,
      }
    : null

  return (
    <div className="min-h-screen pt-12" style={{ backgroundColor: "oklch(0.18 0 0)", color: "#FFFFFF" }}>
      <div className="px-8 md:px-12 lg:px-16 pt-6 pb-12">
        <div className="ml-6 flex items-center gap-3">
          <img src={logo || "/placeholder.svg"} alt="Community Logo" className="w-10 h-10" />
          <h1 className="text-3xl font-bold text-white">Welcome to {communityName} Hub</h1>
        </div>
      </div>
      
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5" style={{ backgroundColor: "oklch(0.18 0 0 / 0.8)" }}>
        <div className="px-8 md:px-12 lg:px-16">
          <div className="ml-6">
            <FilterTabs tabs={FILTER_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </div>

      <main className="w-full px-8 md:px-12 lg:px-16 relative overflow-hidden mt-8">
        <div className="flex gap-8 pl-6">
          <motion.div
            className="w-[calc(100%-22rem)]"
            animate={{
              width: "calc(100% - 22rem)",
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <EventsLeftColumn
              onEventClick={handleEventClick}
              selectedEvent={selectedEvent}
              selectedEventData={mappedEventData}
              onBackClick={handleBackClick}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
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
      </main>
    </div>
  )
}
