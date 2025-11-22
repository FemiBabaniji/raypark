"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { EventCard, AnnouncementCard } from "@/components/cards"
import EventDetailView from "@/components/event-detail-view"
import { CategoryFilters, EVENT_CATEGORY_FILTERS, MEMBER_ROLE_FILTERS } from "@/components/event-nav"
import { CalendarView } from "@/components/events/calendar-view"
import { MeetingsWidget } from "@/components/events/meetings-widget"
import type { EventDetailData } from "@/components/event-detail"
import { ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react"
import type { EventCategory } from "@/lib/theme-colors"

const CONTAINER_STYLES = "bg-[#1a1a1a] rounded-2xl p-8 shadow-sm"

const mockMembers = [
  {
    id: "marcus-johnson",
    name: "Marcus Johnson",
    title: "Software Engineer",
    email: "marcus@techstartup.io",
    location: "San Francisco, CA",
    handle: "@marcuscodes",
    initials: "MJ",
    selectedColor: 1 as const,
    avatarUrl: "/man-developer.png",
    role: "Developer",
    isLive: true,
    portfolioUrl: "/network/bfn/members/marcus-johnson",
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    title: "Product Designer",
    email: "sarah@designstudio.io",
    location: "Toronto, ON",
    handle: "@sarahdesigns",
    initials: "SC",
    selectedColor: 5 as const,
    avatarUrl: "/woman-designer.png",
    role: "Designer",
    isLive: true,
    portfolioUrl: "/network/dmz/members/sarah-chen",
  },
  {
    id: "alex-thompson",
    name: "Alex Thompson",
    title: "Startup Founder",
    email: "alex@startup.co",
    location: "Toronto, ON",
    handle: "@alexfounder",
    initials: "AT",
    selectedColor: 3 as const,
    avatarUrl: "/man-developer.png",
    role: "Manager",
    isLive: true,
    portfolioUrl: "/network/dmz/members/alex-thompson",
  },
  {
    id: "oluwafemi-babaniji",
    name: "Oluwafemi Babaniji",
    title: "Senior Data Scientist",
    email: "oluwafemi@datascience.ai",
    location: "Toronto, ON",
    handle: "@oluwafemidata",
    initials: "OB",
    selectedColor: 3 as const,
    avatarUrl: "/man-developer.png",
    role: "Developer",
    isLive: true,
  },
  {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    title: "Marketing Manager",
    email: "elena@marketingpro.com",
    location: "Austin, TX",
    handle: "@elenamarketing",
    initials: "ER",
    selectedColor: 2 as const,
    avatarUrl: "/woman-analyst.png",
    role: "Manager",
    isLive: true,
  },
  {
    id: "david-kim",
    name: "David Kim",
    title: "Full Stack Developer",
    email: "david@techsolutions.com",
    location: "Seattle, WA",
    handle: "@daviddev",
    initials: "DK",
    selectedColor: 4 as const,
    avatarUrl: "/man-developer.png",
    role: "Developer",
    isLive: true,
  },
  {
    id: "jessica-wu",
    name: "Jessica Wu",
    title: "UX Designer",
    email: "jessica@uxstudio.io",
    location: "Los Angeles, CA",
    handle: "@jessicaux",
    initials: "JW",
    selectedColor: 5 as const,
    avatarUrl: "/woman-designer.png",
    role: "Designer",
    isLive: true,
  },
  {
    id: "amara-okafor",
    name: "Amara Okafor",
    title: "Founder & CEO",
    email: "amara@techventures.co",
    location: "Lagos, Nigeria",
    handle: "@amarafounder",
    initials: "AO",
    selectedColor: 2 as const,
    avatarUrl: "/professional-woman-headshot.png",
    role: "Manager",
    isLive: true,
  },
]

export default function EventsLeftColumn({
  onEventClick,
  selectedEvent,
  selectedEventData,
  onBackClick,
  activeTab = "Home",
  onTabChange,
  showRightColumn,
  onToggleRightColumn,
}: {
  onEventClick?: (eventId: string) => void
  selectedEvent?: string | null
  selectedEventData?: EventDetailData | null
  onBackClick?: () => void
  activeTab?: string
  onTabChange?: (tab: string) => void
  showRightColumn?: boolean
  onToggleRightColumn?: () => void
}) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [networkSearchQuery, setNetworkSearchQuery] = useState("")
  const [selectedNetworkRole, setSelectedNetworkRole] = useState("all")
  const [homeSelectedNetworkRole, setHomeSelectedNetworkRole] = useState("all")
  const [view, setView] = useState<"grid" | "calendar">("grid")

  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState("")
  const [attendeeFilter, setAttendeeFilter] = useState("all")

  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const [currentEventPage, setCurrentEventPage] = useState(0)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setShowLeftArrow(target.scrollLeft > 0)
    setShowRightArrow(target.scrollLeft < target.scrollWidth - target.clientWidth - 10)

    const cardWidth = 240 // approximate card width + gap
    const currentPage = Math.round(target.scrollLeft / cardWidth)
    setCurrentEventPage(currentPage)
  }

  const scrollContainer = (direction: "left" | "right", containerId: string) => {
    const container = document.getElementById(containerId)
    if (container) {
      const scrollAmount = 400
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const upcomingEvents = [
    {
      title: "AI & Machine Learning Workshop",
      date: "1 Sept 2025",
      description: "Deep dive into cutting-edge AI technologies and practical ML implementations for startups.",
      time: "6:00 PM - 9:00 PM",
      attending: 23,
      dateLabel: "Sep 1",
      location: "Tech Hub, 3rd Floor",
      instructor: "Dr. Sarah Chen, AI Researcher",
      tags: ["AI/ML", "Deep Learning", "Workshop", "Hands-on"],
      type: "workshop",
    },
    {
      title: "Founder Networking Mixer",
      date: "22 Sept 2025",
      description: "Connect with fellow founders, share experiences, and build meaningful relationships.",
      time: "7:00 PM - 10:00 PM",
      attending: 45,
      dateLabel: "Sep 22",
      location: "Rooftop Lounge",
      instructor: "Panel of Founders",
      tags: ["Networking", "Founders", "Mixer", "Community"],
      type: "mixer",
    },
    {
      title: "Product Design Masterclass",
      date: "28 Sept 2025",
      description: "Learn advanced UX/UI principles and design thinking methodologies from industry experts.",
      time: "2:00 PM - 5:00 PM",
      attending: 31,
      dateLabel: "Sep 28",
      location: "Design Studio, 2nd Floor",
      instructor: "Maria Rodriguez, Lead UX Designer",
      tags: ["UX/UI", "Design Thinking", "Masterclass", "Portfolio Review"],
      type: "masterclass",
    },
    {
      title: "Startup Pitch Competition",
      date: "5 Oct 2025",
      description: "Present your startup idea to investors and win funding opportunities.",
      time: "4:00 PM - 8:00 PM",
      attending: 67,
      dateLabel: "Oct 5",
      location: "Main Auditorium",
      instructor: "Investment Panel",
      tags: ["Pitch", "Funding", "Competition", "Investors"],
      type: "conference",
    },
    {
      title: "Tech Social Meetup",
      date: "12 Oct 2025",
      description: "Casual meetup for tech professionals to connect and share ideas.",
      time: "6:30 PM - 9:00 PM",
      attending: 52,
      dateLabel: "Oct 12",
      location: "Cafe Lounge",
      instructor: "Community Organizers",
      tags: ["Social", "Networking", "Casual", "Tech"],
      type: "meetup",
    },
  ]

  const filterEvents = (events: typeof upcomingEvents) => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      if (selectedCategory === "all") return matchesSearch
      return matchesSearch && event.type === selectedCategory
    })
  }

  const filterNetworks = () => {
    return mockMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(networkSearchQuery.toLowerCase()) ||
        member.title.toLowerCase().includes(networkSearchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(networkSearchQuery.toLowerCase()) ||
        member.location?.toLowerCase().includes(networkSearchQuery.toLowerCase())

      if (selectedNetworkRole === "all") return matchesSearch
      return matchesSearch && member.role === selectedNetworkRole
    })
  }

  const filterHomeNetworksByRole = () => {
    if (homeSelectedNetworkRole === "all") return mockMembers
    return mockMembers.filter((member) => member.role === homeSelectedNetworkRole)
  }

  const eventAttendees = selectedEventData ? selectedEventData.attendees || [] : []

  const filterAttendees = () => {
    if (!selectedEventData) return []

    const attendees = eventAttendees
    return attendees.filter((attendee) => {
      const matchesSearch =
        attendee.name?.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
        attendee.title?.toLowerCase().includes(attendeeSearchQuery.toLowerCase())

      const department = attendee.title?.toLowerCase() || ""
      const matchesFilter =
        attendeeFilter === "all" ||
        (attendeeFilter === "design" && (department.includes("design") || department.includes("ux"))) ||
        (attendeeFilter === "engineering" && (department.includes("engineer") || department.includes("developer"))) ||
        (attendeeFilter === "product" && department.includes("product")) ||
        (attendeeFilter === "data" && (department.includes("data") || department.includes("scientist")))

      return matchesSearch && matchesFilter
    })
  }

  const filteredUpcomingEvents = filterEvents(upcomingEvents)
  const filteredNetworks = filterNetworks()
  const filteredHomeNetworks = filterHomeNetworksByRole()
  const filteredAttendees = filterAttendees()

  const handleMemberClick = (memberId: string) => {
    const member = mockMembers.find((m) => m.id === memberId)
    if (member?.portfolioUrl) {
      router.push(member.portfolioUrl)
    }
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1200px]">
        {activeTab === "Home" && selectedEvent && selectedEventData ? (
          <div className="mt-6 w-full">
            <EventDetailView
              event={{
                id: selectedEventData.id,
                title: selectedEventData.title,
                description: selectedEventData.description,
                fullDescription: selectedEventData.fullDescription,
                date: selectedEventData.date,
                time: selectedEventData.time,
                location: selectedEventData.location?.name || "Location TBD",
                fullAddress: selectedEventData.location?.addressLine,
                venue: selectedEventData.location?.venue,
                venueDetails: selectedEventData.location?.venueDetails,
                dressCode: selectedEventData.dressCode,
                host: selectedEventData.host?.name,
                hostDescription: selectedEventData.host?.description,
                agenda: selectedEventData.agenda,
                partners: selectedEventData.partners,
                tags: selectedEventData.tags,
                attending: selectedEventData.attending,
                gradient: selectedEventData.gradient || "from-sky-400/35 to-blue-600/20",
                accent: selectedEventData.accent || "#06b6d4",
                type: selectedEventData.type || "workshop",
                attendees:
                  selectedEventData.attendees ||
                  mockMembers.slice(0, 8).map((m) => ({
                    ...m,
                    selectedColor: m.selectedColor as number,
                  })),
              }}
              onBack={onBackClick || (() => {})}
            />
          </div>
        ) : activeTab === "Home" ? (
          <>
            <div className="mt-6 flex flex-col xl:flex-row gap-6 w-full">
              <div className="w-full xl:w-[70%] xl:flex-shrink-0">
                <div className={`${CONTAINER_STYLES} min-h-[320px] flex flex-col overflow-hidden`}>
                  <div className="mb-8 flex items-start justify-between flex-shrink-0">
                    <div>
                      <h2 className="text-white text-2xl mb-1">Events</h2>
                      <p className="text-gray-400 text-sm">Discover and join community events</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setView("grid")}
                        className={`p-2 rounded-lg transition-colors ${
                          view === "grid"
                            ? "bg-zinc-800 text-white"
                            : "bg-transparent text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30"
                        }`}
                        aria-label="Grid view"
                      >
                        <LayoutGrid className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setView("calendar")}
                        className={`p-2 rounded-lg transition-colors ${
                          view === "calendar"
                            ? "bg-zinc-800 text-white"
                            : "bg-transparent text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30"
                        }`}
                        aria-label="Calendar view"
                      >
                        <List className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-shrink-0 mb-8">
                    <CategoryFilters
                      filters={EVENT_CATEGORY_FILTERS}
                      selectedCategory={selectedCategory}
                      onCategoryChange={setSelectedCategory}
                    />
                  </div>

                  <div className="flex-shrink-0 flex-1 flex flex-col">
                    {view === "grid" ? (
                      <>
                        <div className="relative group flex-1">
                          {showLeftArrow && (
                            <button
                              onClick={() => scrollContainer("left", "events-scroll-home")}
                              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                              aria-label="Scroll left"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                          )}
                          <div
                            id="events-scroll-home"
                            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
                            onScroll={handleScroll}
                          >
                            {filteredUpcomingEvents.length > 0 ? (
                              filteredUpcomingEvents.map((event, index) => (
                                <EventCard
                                  key={index}
                                  title={event.title}
                                  date={event.date}
                                  description={event.description}
                                  time={event.time}
                                  attending={event.attending}
                                  dateLabel={event.dateLabel}
                                  location={event.location}
                                  instructor={event.instructor}
                                  tags={event.tags}
                                  onEventClick={onEventClick}
                                  category={event.type as EventCategory}
                                />
                              ))
                            ) : (
                              <div className="w-full text-center py-12">
                                <p className="text-zinc-500">No workshops found matching your criteria.</p>
                              </div>
                            )}
                          </div>
                          {showRightArrow && (
                            <button
                              onClick={() => scrollContainer("right", "events-scroll-home")}
                              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                              aria-label="Scroll right"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        {filteredUpcomingEvents.length > 0 && (
                          <div className="flex items-center justify-center gap-2 mt-4 pb-2">
                            {filteredUpcomingEvents.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  const container = document.getElementById("events-scroll-home")
                                  if (container) {
                                    const cardWidth = 240
                                    container.scrollTo({
                                      left: index * cardWidth,
                                      behavior: "smooth",
                                    })
                                  }
                                }}
                                className={`h-2 rounded-full transition-all ${
                                  index === currentEventPage ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                                }`}
                                aria-label={`Go to event ${index + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="h-full">
                        <CalendarView events={filteredUpcomingEvents} onEventClick={onEventClick} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full xl:w-[30%] xl:flex-shrink-0">
                <div className={`${CONTAINER_STYLES} min-h-[320px] flex flex-col overflow-hidden`}>
                  <MeetingsWidget onMeetingClick={(id) => console.log("Meeting clicked:", id)} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col lg:flex-row gap-6 w-full">
              <div className="w-full lg:w-[30%] lg:flex-shrink-0">
                <div className={CONTAINER_STYLES}>
                  <h2 className="text-white text-2xl mb-8">Announcements</h2>

                  <div className="space-y-4">
                    <AnnouncementCard
                      title="New Partnership Announced"
                      initials="TC"
                      gradientFrom="#8B5CF6"
                      gradientTo="#6366F1"
                    />
                    <AnnouncementCard
                      title="Upcoming Hackathon Registration"
                      initials="HR"
                      gradientFrom="#10B981"
                      gradientTo="#059669"
                    />
                    <AnnouncementCard
                      title="New Workspace Opening Soon"
                      initials="WH"
                      gradientFrom="#F59E0B"
                      gradientTo="#D97706"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[70%] lg:flex-shrink-0">
                <div className={CONTAINER_STYLES}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-white text-2xl mb-1">Networks</h2>
                      <p className="text-gray-400 text-sm">Connect with community networks</p>
                    </div>
                    <button
                      onClick={() => onTabChange?.("Networks")}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      View All
                    </button>
                  </div>

                  <div className="mb-8">
                    <CategoryFilters
                      filters={MEMBER_ROLE_FILTERS}
                      selectedCategory={homeSelectedNetworkRole}
                      onCategoryChange={setHomeSelectedNetworkRole}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {filteredHomeNetworks.slice(0, 3).map((member) => {
                      const gradients = [
                        "from-blue-500/20 to-blue-600/20",
                        "from-green-500/20 to-green-600/20",
                        "from-emerald-500/20 to-emerald-600/20",
                        "from-purple-500/20 to-purple-600/20",
                        "from-orange-500/20 to-orange-600/20",
                      ]
                      const gradient = gradients[member.selectedColor % gradients.length]

                      return (
                        <div
                          key={member.id}
                          onClick={() => handleMemberClick(member.id)}
                          className={`bg-gradient-to-br ${gradient} bg-[#222] rounded-xl p-5 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}
                        >
                          <div className="absolute top-3 right-3">
                            <button className="text-white/60 hover:text-white transition-colors">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="10" cy="4" r="1.5" fill="currentColor" />
                                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                                <circle cx="10" cy="16" r="1.5" fill="currentColor" />
                              </svg>
                            </button>
                          </div>

                          <div className="flex flex-col items-center text-center mb-4">
                            <div className="relative mb-3">
                              {member.avatarUrl ? (
                                <img
                                  src={member.avatarUrl || "/placeholder.svg"}
                                  alt={member.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
                                  {member.initials}
                                </div>
                              )}
                              {member.isLive && (
                                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-[#222]" />
                              )}
                            </div>
                            <h3 className="text-white text-base font-semibold truncate w-full px-2">{member.name}</h3>
                            <p className="text-white/60 text-sm truncate w-full px-2">{member.title}</p>
                          </div>

                          <div className="space-y-1 text-xs">
                            <p className="text-white/50 truncate">{member.email}</p>
                            <p className="text-white/50 truncate">{member.location}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "Networks" && (
          <div className="mt-6 bg-[#1a1a1a] rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-white text-2xl mb-1">Networks</h2>
                <p className="text-gray-400 text-sm">Connect with community networks</p>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors text-sm">View All</button>
            </div>

            <div className="mb-8">
              <CategoryFilters
                filters={MEMBER_ROLE_FILTERS}
                selectedCategory={selectedNetworkRole}
                onCategoryChange={setSelectedNetworkRole}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {filteredNetworks.length > 0 ? (
                filteredNetworks.map((member) => {
                  const gradients = [
                    "from-blue-500/20 to-blue-600/20",
                    "from-green-500/20 to-green-600/20",
                    "from-emerald-500/20 to-emerald-600/20",
                    "from-purple-500/20 to-purple-600/20",
                    "from-orange-500/20 to-orange-600/20",
                  ]
                  const gradient = gradients[member.selectedColor % gradients.length]

                  return (
                    <div
                      key={member.id}
                      onClick={() => handleMemberClick(member.id)}
                      className={`bg-gradient-to-br ${gradient} bg-[#222] rounded-xl p-5 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}
                    >
                      <div className="absolute top-3 right-3">
                        <button className="text-white/60 hover:text-white transition-colors">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="10" cy="4" r="1.5" fill="currentColor" />
                            <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                            <circle cx="10" cy="16" r="1.5" fill="currentColor" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="relative mb-3">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl || "/placeholder.svg"}
                              alt={member.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
                              {member.initials}
                            </div>
                          )}
                          {member.isLive && (
                            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-[#222]" />
                          )}
                        </div>
                        <h3 className="text-white text-base font-semibold truncate w-full px-2">{member.name}</h3>
                        <p className="text-white/60 text-sm truncate w-full px-2">{member.title}</p>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="text-white/50 truncate">{member.email}</p>
                        <p className="text-white/50 truncate">{member.location}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-zinc-500">No networks found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Events" && (
          <>
            <div className={`mt-6 ${CONTAINER_STYLES} min-h-[480px] flex flex-col overflow-hidden`}>
              <div className="mb-8 flex items-start justify-between flex-shrink-0">
                <div>
                  <h1 className="text-white text-2xl mb-1">Events</h1>
                  <p className="text-gray-400 text-sm">Discover and join community events</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      view === "grid"
                        ? "bg-zinc-800 text-white"
                        : "bg-transparent text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30"
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setView("calendar")}
                    className={`p-2 rounded-lg transition-colors ${
                      view === "calendar"
                        ? "bg-zinc-800 text-white"
                        : "bg-transparent text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30"
                    }`}
                    aria-label="Calendar view"
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-shrink-0 mb-8">
                <CategoryFilters
                  filters={EVENT_CATEGORY_FILTERS}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                {view === "grid" ? (
                  <div className="relative group">
                    {showLeftArrow && (
                      <button
                        onClick={() => scrollContainer("left", "events-scroll-events-tab")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                    <div
                      id="events-scroll-events-tab"
                      className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
                      onScroll={handleScroll}
                    >
                      {filteredUpcomingEvents.length > 0 ? (
                        filteredUpcomingEvents.map((event, index) => (
                          <EventCard
                            key={index}
                            title={event.title}
                            date={event.date}
                            description={event.description}
                            time={event.time}
                            attending={event.attending}
                            dateLabel={event.dateLabel}
                            location={event.location}
                            instructor={event.instructor}
                            tags={event.tags}
                            onEventClick={onEventClick}
                            category={event.type as EventCategory}
                          />
                        ))
                      ) : (
                        <div className="w-full text-center py-12">
                          <p className="text-zinc-500">No workshops found matching your criteria.</p>
                        </div>
                      )}
                    </div>
                    {showRightArrow && (
                      <button
                        onClick={() => scrollContainer("right", "events-scroll-events-tab")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 overflow-hidden">
                    <CalendarView events={filteredUpcomingEvents} onEventClick={onEventClick} />
                  </div>
                )}
              </div>
            </div>

            <section className="mt-6">
              <div className={CONTAINER_STYLES}>
                <h2 className="text-white text-2xl mb-8">Announcements</h2>

                <div className="space-y-4">
                  <AnnouncementCard
                    title="New Partnership with TechCorp"
                    initials="TC"
                    gradientFrom="#8B5CF6"
                    gradientTo="#6366F1"
                  />
                  <AnnouncementCard
                    title="Upcoming Hackathon Registration"
                    initials="HR"
                    gradientFrom="#10B981"
                    gradientTo="#059669"
                  />
                  <AnnouncementCard
                    title="New Workspace Hours"
                    initials="WH"
                    gradientFrom="#F59E0B"
                    gradientTo="#D97706"
                  />
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "Meetings" && (
          <div className={`mt-6 ${CONTAINER_STYLES} min-h-[480px] flex flex-col`}>
            <MeetingsWidget onMeetingClick={(id) => console.log("Meeting clicked:", id)} />
          </div>
        )}

        {activeTab === "Projects" && (
          <div className="mt-8 text-center py-12">
            <p className="text-zinc-500">Projects section coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}
