"use client"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { EventCard, AnnouncementCard } from "@/components/cards"
import EventDetailView from "@/components/event-detail-view"
import {
  CategoryFilters,
  EVENT_CATEGORY_FILTERS,
  MEMBER_ROLE_FILTERS,
} from "@/components/event-nav"
import { ViewToggle } from "@/components/event-nav/view-toggle"
import { CalendarView } from "@/components/events/calendar-view"
import { MeetingsSection } from "@/components/events/meetings-section"
import type { EventDetailData } from "@/components/event-detail"

const CONTAINER_STYLES = "bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-5 shadow-lg"

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
}: {
  onEventClick?: (eventId: string) => void
  selectedEvent?: string | null
  selectedEventData?: EventDetailData | null
  onBackClick?: () => void
  activeTab?: string
  onTabChange?: (tab: string) => void
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

              <div className="w-full xl:w-[30%] xl:flex-shrink-0">
                <div className={`${CONTAINER_STYLES} min-h-[320px]`}>
                  <MeetingsSection onMeetingClick={(id) => console.log("Meeting clicked:", id)} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col lg:flex-row gap-6 w-full">
              <div className="w-full lg:w-[30%] lg:flex-shrink-0">
                <div className={CONTAINER_STYLES}>
                  <h2 className="text-xl font-bold mb-4 text-white">Announcements</h2>

                  <div className="space-y-3">
                    <AnnouncementCard
                      title="New Partnership with TechCorp"
                      content="We're excited to announce our strategic partnership with TechCorp, bringing cutting-edge AI tools and resources to our community."
                      author="Admin"
                      timeAgo="2 hours ago"
                      avatarColor="#8B5CF6"
                      isImportant={true}
                    />
                    <AnnouncementCard
                      title="Upcoming Hackathon Registration"
                      content="Registration is now open for our annual 48-hour hackathon! Teams of 2-4 members can compete for $10,000 in prizes."
                      author="Events Team"
                      timeAgo="1 day ago"
                      avatarColor="#10B981"
                    />
                    <AnnouncementCard
                      title="New Workspace Hours"
                      content="Starting next week, our co-working space will be open 24/7 for all premium members."
                      author="Facilities"
                      timeAgo="3 days ago"
                      avatarColor="#F59E0B"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[70%] lg:flex-shrink-0">
                <div className={CONTAINER_STYLES}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                    <div>
                      <h2 className="text-xl font-bold text-white">Networks</h2>
                      <p className="text-zinc-400 text-xs">Connect with community networks</p>
                    </div>
                    <button
                      onClick={() => onTabChange?.("Networks")}
                      className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-sm font-medium transition-colors backdrop-blur-sm border border-white/10 self-start sm:self-auto"
                    >
                      View All
                    </button>
                  </div>

                  <div className="mb-4">
                    <CategoryFilters
                      filters={MEMBER_ROLE_FILTERS}
                      selectedCategory={homeSelectedNetworkRole}
                      onCategoryChange={setHomeSelectedNetworkRole}
                    />
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    {filteredHomeNetworks.slice(0, 8).map((member) => (
                      <div key={member.id} className="flex-shrink-0 w-36 sm:w-44">
                        <UnifiedPortfolioCard
                          portfolio={member}
                          onClick={(id) => handleMemberClick(id)}
                          onShare={(id) => console.log("Share network:", id)}
                          onMore={(id) => console.log("More options for network:", id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "Networks" && (
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
                    onClick={(id) => handleMemberClick(id)}
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

        {activeTab === "Events" && (
          <>
            <div
              className={`mt-6 ${CONTAINER_STYLES.replace("p-5", "p-6")} min-h-[480px] flex flex-col overflow-hidden`}
            >
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

            <section className="mt-12">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Announcements</h2>
                <p className="text-zinc-400">Stay updated with the latest community news</p>
              </div>

              <div className="space-y-5">
                <AnnouncementCard
                  title="New Partnership with TechCorp"
                  content="We're excited to announce our strategic partnership with TechCorp, bringing cutting-edge AI tools and resources to our community. This collaboration will provide exclusive access to their latest machine learning platforms, mentorship opportunities with their senior engineers, and potential internship placements for our most promising members."
                  author="Admin"
                  timeAgo="2 hours ago"
                  avatarColor="#8B5CF6"
                  isImportant={true}
                />
                <AnnouncementCard
                  title="Upcoming Hackathon Registration"
                  content="Registration is now open for our annual 48-hour hackathon! Teams of 2-4 members can compete for $10,000 in prizes while building innovative solutions for real-world problems. Mentors from top tech companies will be available throughout the event."
                  author="Events Team"
                  timeAgo="1 day ago"
                  avatarColor="#10B981"
                />
                <AnnouncementCard
                  title="New Workspace Hours"
                  content="Starting next week, our co-working space will be open 24/7 for all premium members. We've also added new high-speed internet, upgraded workstations, and a dedicated quiet zone for focused work sessions."
                  author="Facilities"
                  timeAgo="3 days ago"
                  avatarColor="#F59E0B"
                />
              </div>
            </section>
          </>
        )}

        {activeTab === "Meetings" && (
          <div className={`mt-6 ${CONTAINER_STYLES.replace("p-5", "p-6")} min-h-[480px]`}>
            <div className="mb-5">
              <h1 className="text-3xl font-bold text-white mb-1.5">Meetings</h1>
              <p className="text-zinc-400 text-base">Manage your upcoming meetings and schedule</p>
            </div>
            <MeetingsSection onMeetingClick={(id) => console.log("Meeting clicked:", id)} />
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
