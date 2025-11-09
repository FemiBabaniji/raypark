"use client"
import { useState } from "react"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { EventCard, AnnouncementCard } from "@/components/cards"
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

export default function EventsLeftColumn({ onEventClick }: { onEventClick?: (eventId: string) => void }) {
  const [active, setActive] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  const [selectedMemberRole, setSelectedMemberRole] = useState("all")
  const [view, setView] = useState<"grid" | "calendar">("grid")

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

  const filterMembers = () => {
    return mockMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        member.title.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        member.location?.toLowerCase().includes(memberSearchQuery.toLowerCase())

      if (selectedMemberRole === "all") return matchesSearch
      return matchesSearch && member.role === selectedMemberRole
    })
  }

  const filteredUpcomingEvents = filterEvents(upcomingEvents)
  const filteredMembers = filterMembers()

  return (
    <div className="w-full">
      <div className="flex flex-col items-center space-y-4">
        <EventSearch
          value={active === "Members" ? memberSearchQuery : active === "Meetings" ? "" : searchQuery}
          onChange={active === "Members" ? setMemberSearchQuery : active === "Meetings" ? () => {} : setSearchQuery}
          placeholder={
            active === "Members"
              ? "Search members by name, role, or location..."
              : active === "Meetings"
                ? "Search meetings..."
                : "Search workshops by name, description, or tags..."
          }
        />

        <FilterTabs tabs={FILTER_TABS} activeTab={active} onTabChange={setActive} />
      </div>

      {active === "" && (
        <div className="mt-6 flex flex-col lg:flex-row gap-6 w-full">
          {/* Events Section - 75% on large screens, full width on smaller */}
          <div className="w-full lg:w-3/4 lg:flex-shrink-0">
            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-8 shadow-lg shadow-black/20">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-white mb-2">Events</h1>
                <p className="text-zinc-400 text-lg">Discover and join community events</p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <CategoryFilters
                  filters={EVENT_CATEGORY_FILTERS}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
                <ViewToggle view={view} onViewChange={setView} />
              </div>

              {view === "grid" ? (
                <div className="mt-6 flex gap-6 overflow-x-auto pb-2">
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
                <div className="mt-6">
                  <CalendarView events={filteredUpcomingEvents} onEventClick={onEventClick} />
                </div>
              )}
            </div>
          </div>

          {/* Meetings Section - 25% on large screens, full width on smaller */}
          <div className="w-full lg:w-1/4 lg:flex-shrink-0">
            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-black/20">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-1">Meetings</h2>
                <p className="text-zinc-400 text-sm">Your upcoming schedule</p>
              </div>
              <MeetingsSection onMeetingClick={(id) => console.log("Meeting clicked:", id)} />
            </div>
          </div>
        </div>
      )}

      {active === "Members" && (
        <div className="mt-6 space-y-6">
          <CategoryFilters
            filters={MEMBER_ROLE_FILTERS}
            selectedCategory={selectedMemberRole}
            onCategoryChange={setSelectedMemberRole}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <UnifiedPortfolioCard
                  key={member.id}
                  portfolio={member}
                  onClick={(id) => console.log("View member profile:", id)}
                  onShare={(id) => console.log("Share member:", id)}
                  onMore={(id) => console.log("More options for member:", id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-zinc-500">No members found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {active === "Events" && (
        <>
          <div className="mt-8 bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-8 shadow-lg shadow-black/20">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-white mb-2">Events</h1>
              <p className="text-zinc-400 text-lg">Discover and join community events</p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <CategoryFilters
                filters={EVENT_CATEGORY_FILTERS}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <ViewToggle view={view} onViewChange={setView} />
            </div>

            {view === "grid" ? (
              <div className="mt-6 flex gap-6 overflow-x-auto pb-2">
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
              <div className="mt-6">
                <CalendarView events={filteredUpcomingEvents} onEventClick={onEventClick} />
              </div>
            )}
          </div>

          <section className="mt-12">
            <h2 className="text-3xl font-bold mb-8" style={{ color: "#FFFFFF" }}>
              Announcements
            </h2>

            <div className="space-y-4">
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

      {active === "Meetings" && (
        <div className="mt-8 bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-8 shadow-lg shadow-black/20">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">Meetings</h1>
            <p className="text-zinc-400 text-lg">Manage your upcoming meetings and schedule</p>
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
  )
}
