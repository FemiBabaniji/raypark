"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import EventsLeftColumn from "@/components/events-left-column"
import EventsRightColumn from "@/components/events-right-column"
import EventsHeader from "@/components/events-header"
import type { EventDetailData } from "@/components/event-detail"
import { FilterTabs, FILTER_TABS } from "@/components/event-nav"
import { ChevronRight, ChevronLeft } from 'lucide-react'

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
  communityName = "BEA",
  communityId,
  hasUserPortfolio = false,
  userPortfolio = null,
  initialTab = "Home"
}: { 
  logo?: string
  communityName?: string
  communityId?: string
  hasUserPortfolio?: boolean
  userPortfolio?: any
  initialTab?: string
}) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [useGradient, setUseGradient] = useState(true)
  const [showRightColumn, setShowRightColumn] = useState(true)

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
    <div className="min-h-screen relative pt-0" style={{ backgroundColor: "oklch(0.18 0 0)", color: "#FFFFFF" }}>
      {useGradient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large blue gradient orb - top left */}
          <div 
            className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
            style={{
              background: "radial-gradient(circle, #4169E1 0%, transparent 70%)",
            }}
          />
          
          {/* Purple gradient orb - top right */}
          <div 
            className="absolute -top-1/3 right-0 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
            style={{
              background: "radial-gradient(circle, #7B68EE 0%, transparent 70%)",
            }}
          />
          
          {/* Blue gradient orb - middle left */}
          <div 
            className="absolute top-1/2 -left-1/4 w-[700px] h-[700px] rounded-full opacity-20 blur-3xl"
            style={{
              background: "radial-gradient(circle, #4169E1 0%, transparent 70%)",
            }}
          />
          
          {/* Purple/Violet gradient orb - bottom right */}
          <div 
            className="absolute bottom-0 right-1/4 w-[900px] h-[900px] rounded-full opacity-25 blur-3xl"
            style={{
              background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
            }}
          />
          
          {/* Smaller accent blue orb - bottom left */}
          <div 
            className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
            style={{
              background: "radial-gradient(circle, #0EA5E9 0%, transparent 70%)",
            }}
          />
        </div>
      )}
      
      {/* Content layer */}
      <div className="relative z-10">
        <EventsHeader 
          communityName={communityName} 
          useGradient={useGradient}
          showRightColumn={showRightColumn}
          onToggleGradient={() => setUseGradient(!useGradient)}
          onToggleRightColumn={() => setShowRightColumn(!showRightColumn)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Main content area */}
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-16 xl:px-20">
          <main className="w-full relative mt-4">
            <div className={`flex items-start gap-6 md:gap-8 transition-all duration-300 ease-out ${showRightColumn ? 'justify-between' : 'justify-center'}`}>
              <div className={`flex-1 min-w-0 transition-all duration-300 ease-out ${showRightColumn ? 'max-w-[600px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1200px]' : 'max-w-[600px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1200px]'}`}>
                <EventsLeftColumn
                  onEventClick={handleEventClick}
                  selectedEvent={selectedEvent}
                  selectedEventData={mappedEventData}
                  onBackClick={handleBackClick}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  showRightColumn={showRightColumn}
                  onToggleRightColumn={() => setShowRightColumn(!showRightColumn)}
                />
              </div>

              <div 
                className={`w-64 flex-shrink-0 sticky top-24 self-start transition-all duration-300 ease-out ${showRightColumn ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}
              >
                <EventsRightColumn 
                  onToggleRightColumn={() => setShowRightColumn(!showRightColumn)} 
                  communityId={communityId}
                  hasUserPortfolio={hasUserPortfolio}
                  userPortfolio={userPortfolio}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
