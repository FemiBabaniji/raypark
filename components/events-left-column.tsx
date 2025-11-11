"use client"
import { useState } from "react"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { EventCard } from "@/components/cards"
import EventDetail from "@/components/event-detail"
import {
  FilterTabs,
  EventSearch,
  CategoryFilters,
  FILTER_TABS,
  EVENT_CATEGORY_FILTERS,
  MEMBER_ROLE_FILTERS,
} from "@/components/event-nav"
import { ViewToggle } from "@/components/event-nav/view-toggle"
import { CalendarView } from "@/components/events/calendar-view"
import { MeetingsSection } from "@/components/events/meetings-section"
import type { EventDetailData } from "@/components/event-detail"

const CONTAINER_STYLES = "bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-black/20"

const mockMembers = [
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
    id: "sarah-chen",
    name: "Sarah Chen",
    title: "AI Engineer",
    email: "sarah@techstartup.io",
    location: "San Francisco, CA",
    handle: "@sarahcodes",
    initials: "SC",
    selectedColor: 3 as const,
    avatarUrl: "/professional-headshot.png",
    role: "Developer",
    isLive: true,
  },
  {
    id: "marcus-johnson",
    name: "Marcus Johnson",
    title: "Product Designer",
    email: "marcus@designstudio.com",
    location: "New York, NY",
    handle: "@marcusdesign",
    initials: "MJ",
    selectedColor: 1 as const,
    avatarUrl: "/man-developer.png",
    role: "Designer",
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
    id: "alex-thompson",
    name: "Alex Thompson",
    title: "Data Scientist",
    email: "alex@datascience.com",
    location: "Boston, MA",
    handle: "@alexdata",
    initials: "AT",
    selectedColor: 0 as const,
    avatarUrl: "/man-developer.png",
    role: "Developer",
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
}: {
  onEventClick?: (eventId: string) => void
  selectedEvent?: string | null
  selectedEventData?: EventDetailData | null
  onBackClick?: () => void
}) {
  const [active, setActive] = useState("Home")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [networkSearchQuery, setNetworkSearchQuery] = useState("")
  const [selectedNetworkRole, setSelectedNetworkRole] = useState("all")
  const [homeSelectedNetworkRole, setHomeSelectedNetworkRole] = useState("all")
  const [view, setView] = useState<"grid" | "calendar">("grid")

  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState("")
  const [attendeeFilter, setAttendeeFilter] = useState("all")

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

  return (
    <div className="w-full flex justify-center px-8 md:px-12 lg:px-16">
      <div className="w-full max-w-[1200px]">
        <div className="flex flex-col items-center space-y-4">
          <EventSearch
            value={active === "Networks" ? networkSearchQuery : active === "Meetings" ? "" : searchQuery}
            onChange={active === "Networks" ? setNetworkSearchQuery : active === "Meetings" ? () => {} : setSearchQuery}
            placeholder={
              active === "Networks"
                ? "Search networks by name, role, or location..."
                : active === "Meetings"
                  ? "Search meetings..."
                  : "Search workshops by name, description, or tags..."
            }
          />

          <FilterTabs tabs={FILTER_TABS} activeTab={active} onTabChange={setActive} />
        </div>

        {active === "Home" && selectedEvent && selectedEventData ? (
          <div className="mt-6 w-full">
            <div className={CONTAINER_STYLES}>
              {/* Use imported EventDetail component with its existing beautiful design */}
              <EventDetail
                event={{
                  id: selectedEventData.id,
                  title: selectedEventData.title,
                  date: selectedEventData.dateLabel,
                  time: selectedEventData.timeLabel,
                  location: selectedEventData.location,
                  description: selectedEventData.fullDescription,
                  attending: selectedEventData.attending,
                  capacity: selectedEventData.capacity,
                  gradient: selectedEventData.gradient,
                  host: selectedEventData.host,
                  tags: selectedEventData.tags,
                  partners: selectedEventData.partners,
                }}
                onBack={onBackClick}
                onRSVP={() => console.log("RSVP clicked")}
                onAddToCalendar={() => console.log("Add to calendar clicked")}
                onShare={(id) => console.log("Share event:", id)}
                calendarTimes={{
                  start: selectedEventData.timeLabel.split(" - ")[0],
                  end: selectedEventData.timeLabel.split(" - ")[1] || selectedEventData.timeLabel,
                }}
              />
            </div>
          </div>
        ) : active === "Home" ? (
          <div className="mt-6 flex flex-col xl:flex-row gap-6 w-full">
            {/* Events widget - left 70% */}
            <div className="w-full xl:w-[70%] xl:flex-shrink-0">
              <div className={`${CONTAINER_STYLES} min-h-[320px] flex flex-col overflow-hidden`}>
                <div className="mb-4 flex items-start justify-between flex-shrink-0">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Events</h1>
                    <p className="text-zinc-400 text-sm">Discover and join community events</p>
                  </div>
                  <ViewToggle view={view} onViewChange={setView} />
                </div>

                <div className="mt-3 flex-shrink-0">
                  <CategoryFilters
                    filters={EVENT_CATEGORY_FILTERS}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>

                <div className="flex-1 overflow-hidden mt-4 flex flex-col">
                  {view === "grid" ? (
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
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
                          />
                        ))
                      ) : (
                        <div className="w-full text-center py-12">
                          <p className="text-zinc-500">No workshops found matching your criteria.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 overflow-hidden">
                      <CalendarView events={filteredUpcomingEvents} onEventClick={onEventClick} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Meetings widget - right 30% */}
            <div className="w-full xl:w-[30%] xl:flex-shrink-0">
              <div className={`${CONTAINER_STYLES} min-h-[320px]`}>
                <MeetingsSection onMeetingClick={(id) => console.log("Meeting clicked:", id)} />
              </div>
            </div>
          </div>
        ) : null}

        {active === "Home" && !selectedEvent && (
          <div className="mt-6 space-y-6">
            {/* Announcements widget */}
            <div className={CONTAINER_STYLES}>
              <h2 className="text-xl font-bold text-white mb-4">Announcements</h2>
              <div className="space-y-3">
                <div className="bg-zinc-800/30 rounded-xl p-4">
                  <p className="text-sm text-zinc-400">New AI workshop series starting next month</p>
                </div>
                <div className="bg-zinc-800/30 rounded-xl p-4">
                  <p className="text-sm text-zinc-400">Community meetup this Friday at 6 PM</p>
                </div>
              </div>
            </div>

            {/* Networks widget */}
            <div className={CONTAINER_STYLES}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Network</h2>
                <CategoryFilters
                  filters={MEMBER_ROLE_FILTERS}
                  selectedCategory={homeSelectedNetworkRole}
                  onCategoryChange={setHomeSelectedNetworkRole}
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {filteredHomeNetworks.map((member) => (
                  <div key={member.id} className="flex-shrink-0 w-40">
                    <UnifiedPortfolioCard
                      portfolio={member}
                      onClick={(id) => console.log("View profile:", id)}
                      onShare={(id) => console.log("Share:", id)}
                      onMore={(id) => console.log("More:", id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {active === "Networks" && (
          <div className="mt-6 space-y-6">
            <CategoryFilters
              filters={MEMBER_ROLE_FILTERS}
              selectedCategory={selectedNetworkRole}
              onCategoryChange={setSelectedNetworkRole}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6">
              {filteredNetworks.length > 0 ? (
                filteredNetworks.map((member) => (
                  <UnifiedPortfolioCard
                    key={member.id}
                    portfolio={member}
                    onClick={(id) => console.log("View network profile:", id)}
                    onShare={(id) => console.log("Share network:", id)}
                    onMore={(id) => console.log("More options for network:", id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-zinc-500">No networks found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {active === "Events" && (
          <div className={`mt-6 ${CONTAINER_STYLES.replace("p-5", "p-6")} min-h-[480px] flex flex-col overflow-hidden`}>
            <div className="mb-5 flex items-start justify-between flex-shrink-0">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1.5">Events</h1>
                <p className="text-zinc-400 text-base">Discover and join community events</p>
              </div>
              <ViewToggle view={view} onViewChange={setView} />
            </div>

            <div className="mt-4 flex-shrink-0">
              <CategoryFilters
                filters={EVENT_CATEGORY_FILTERS}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            <div className="flex-1 overflow-hidden mt-5 flex flex-col">
              {view === "grid" ? (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
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
                      />
                    ))
                  ) : (
                    <div className="w-full text-center py-12">
                      <p className="text-zinc-500">No workshops found matching your criteria.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 overflow-hidden">
                  <CalendarView events={filteredUpcomingEvents} onEventClick={onEventClick} />
                </div>
              )}
            </div>
          </div>
        )}

        {active === "Meetings" && (
          <div className={`mt-6 ${CONTAINER_STYLES.replace("p-5", "p-6")} min-h-[480px]`}>
            <div className="mb-5">
              <h1 className="text-3xl font-bold text-white mb-1.5">Meetings</h1>
              <p className="text-zinc-400 text-base">Manage your upcoming meetings and schedule</p>
            </div>
            <MeetingsSection onMeetingClick={(id) => console.log("Meeting clicked:", id)} />
          </div>
        )}

        {active === "Projects" && (
          <div className="mt-8 text-center py-12">
            <p className="text-zinc-500">Projects section coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}
