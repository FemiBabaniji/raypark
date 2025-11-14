"use client"
import { useState } from "react"
import { ChevronDown, Search } from 'lucide-react'
import { Panel } from "@/components/ui/panel"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"

const FILTERS = ["Events", "Meetings", "Projects", "Members"]

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3 font-medium transition-all duration-200 border rounded-2xl text-xs"
      style={{
        backgroundColor: active ? "#393939" : "transparent",
        color: active ? "#FFFFFF" : "#B3B3B3",
        borderColor: "#444",
      }}
    >
      {label}
    </button>
  )
}

function CardSkeleton({
  title,
  date,
  description,
  time,
  attending,
  location,
  instructor,
  tags,
  dateLabel,
  onEventClick, // Added onEventClick prop
}: {
  title: string
  date: string
  description: string
  time: string
  attending: number
  location?: string
  instructor?: string
  tags?: string[]
  dateLabel?: string
  onEventClick?: (eventId: string) => void // Added onEventClick prop type
}) {
  const [isHovered, setIsHovered] = useState(false)

  const getEventColors = (title: string) => {
    if (title.includes("AI") || title.includes("Machine Learning")) {
      return {
        accent: "#0EA5E9", // Electric Blue
        gradient: "from-sky-400/35 to-blue-600/20",
      }
    } else if (title.includes("Networking") || title.includes("Founder")) {
      return {
        accent: "#10B981", // Emerald
        gradient: "from-emerald-400/35 to-teal-600/20",
      }
    } else if (title.includes("Design") || title.includes("Product")) {
      return {
        accent: "#8B5CF6", // Purple
        gradient: "from-violet-400/35 to-purple-600/20",
      }
    }
    return {
      accent: "#06B6D4", // Cyan
      gradient: "from-cyan-400/35 to-blue-600/20",
    }
  }

  const colors = getEventColors(title)

  const handleEventClick = () => {
    if (onEventClick) {
      if (title.includes("AI & Machine Learning")) {
        onEventClick("ai-ml-workshop")
      } else if (title.includes("Founder Networking")) {
        onEventClick("founder-networking-mixer")
      } else if (title.includes("Product Design")) {
        onEventClick("product-design-masterclass")
      }
    }
  }

  return (
    <div className="w-64 flex-shrink-0">
      <Panel
        variant="tile"
        className={`transition-all duration-300 ease-out overflow-visible group relative bg-gradient-to-br ${colors.gradient} cursor-pointer`}
        style={{
          backgroundColor: "#1F1F1F",
          width: "255px",
          height: isHovered ? "360px" : "276px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleEventClick}
      >
        <div className="relative z-10 h-full flex flex-col text-center">
          <div className="flex-shrink-0 mb-4">
            <div className="text-lg font-semibold mb-3 line-clamp-2" style={{ color: "#FFFFFF" }}>
              {title}
            </div>
            <div className="text-sm leading-relaxed line-clamp-3" style={{ color: "#B3B3B3" }}>
              {description.split(".")[0]}.
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex-shrink-0 space-y-4">
            <div className="text-center">
              <div className="text-sm mb-2" style={{ color: "#B3B3B3" }}>
                {time}
              </div>
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: colors.accent,
                  color: "#FFFFFF",
                }}
              >
                {attending} attending
              </div>
            </div>

            <div
              className={`transition-all duration-300 ease-out ${
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                maxHeight: isHovered ? "120px" : "0px",
                overflow: "hidden",
              }}
            >
              {location && instructor && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div
                    className="p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5"
                    style={{ backdropFilter: "blur(10px)" }}
                  >
                    <div className="text-xs font-medium mb-1" style={{ color: "#B3B3B3" }}>
                      LOCATION
                    </div>
                    <div className="text-xs font-medium truncate" style={{ color: "#FFFFFF" }}>
                      {location.split(",")[0]}
                    </div>
                  </div>
                  <div
                    className="p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5"
                    style={{ backdropFilter: "blur(10px)" }}
                  >
                    <div className="text-xs font-medium mb-1" style={{ color: "#B3B3B3" }}>
                      INSTRUCTOR
                    </div>
                    <div className="text-xs font-medium truncate" style={{ color: "#FFFFFF" }}>
                      {instructor.split(",")[0]}
                    </div>
                  </div>
                </div>
              )}

              {tags && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: colors.accent,
                        color: "#FFFFFF",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}

function AnnouncementItem({
  title,
  content,
  author,
  timeAgo,
  avatarColor,
  isImportant = false,
}: {
  title: string
  content: string
  author: string
  timeAgo: string
  avatarColor: string
  isImportant?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <li className="group">
      <Panel
        variant="module"
        className={`transition-all duration-300 ease-out overflow-hidden cursor-pointer hover:shadow-lg ${
          isExpanded ? "shadow-xl" : ""
        }`}
        style={{
          backgroundColor: isImportant ? "#2A1A4A" : "#1F1F1F",
          border: "none",
          boxShadow: "none",
          height: isExpanded ? "auto" : "80px",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div
                className="h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-sm"
                style={{ backgroundColor: avatarColor }}
              >
                {author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-white truncate">{title}</h3>
                  {isImportant && (
                    <span className="px-2 py-0.5 bg-violet-500 text-white text-xs rounded-full font-medium">
                      Important
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  {author} • {timeAgo}
                </div>
                <div
                  className={`text-sm text-gray-300 leading-relaxed transition-all duration-300 ${
                    isExpanded ? "line-clamp-none" : "line-clamp-1"
                  }`}
                >
                  {content}
                </div>
              </div>
            </div>
            <button
              className={`h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/10 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Expanded content */}
          <div
            className={`transition-all duration-300 ease-out ${
              isExpanded ? "opacity-100 mt-4" : "opacity-0 h-0 overflow-hidden"
            }`}
          >
            <div className="border-t border-gray-700 pt-4">
              <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-gray-200 leading-relaxed mb-3">{content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-blue-500/20 text-blue-300 text-xs rounded-lg hover:bg-blue-500/30 transition-colors">
                      Read More
                    </button>
                    <button className="px-3 py-1.5 bg-gray-500/20 text-gray-300 text-xs rounded-lg hover:bg-gray-500/30 transition-colors">
                      Mark as Read
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">12 reactions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </li>
  )
}

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
  const [active, setActive] = useState("Events")
  const [showPastEvents, setShowPastEvents] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  const [selectedMemberRole, setSelectedMemberRole] = useState("all")

  const pastEvents = [
    {
      title: "Startup Pitch Competition",
      date: "15 Aug 2025",
      description: "Entrepreneurs pitched their innovative ideas to a panel of investors and industry experts.",
      time: "6:00 PM - 9:00 PM",
      attending: 67,
      location: "Main Auditorium",
      instructor: "Panel of VCs",
      tags: ["Pitching", "Investment", "Competition", "Startups"],
      category: "networking",
    },
    {
      title: "Blockchain & Web3 Summit",
      date: "8 Aug 2025",
      description: "Exploring the future of decentralized technologies and cryptocurrency innovations.",
      time: "1:00 PM - 6:00 PM",
      attending: 89,
      location: "Conference Hall A",
      instructor: "Crypto Industry Leaders",
      tags: ["Blockchain", "Web3", "Crypto", "DeFi"],
      category: "technical",
    },
  ]

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
  const filteredPastEvents = filterEvents(pastEvents)
  const filteredMembers = filterMembers()

  return (
    <div className="w-full">
      <div className="flex gap-4">
        {FILTERS.map((f) => (
          <Chip key={f} label={f} active={f === active} onClick={() => setActive(f)} />
        ))}
      </div>

      {active === "Members" && (
        <div className="mt-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search members by name, role, or location..."
              value={memberSearchQuery}
              onChange={(e) => setMemberSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          {/* Role Filters */}
          <div className="flex gap-2">
            {[
              { key: "all", label: "All" },
              { key: "Designer", label: "Designers" },
              { key: "Developer", label: "Developers" },
              { key: "Manager", label: "Managers" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedMemberRole(filter.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedMemberRole === filter.key
                    ? "bg-white text-zinc-900"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
          <div className="mt-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search workshops by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
              />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2">
              {[
                { key: "all", label: "All Events" },
                { key: "workshop", label: "Workshops" },
                { key: "mixer", label: "Mixers" },
                { key: "masterclass", label: "Masterclasses" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedCategory(filter.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedCategory === filter.key
                      ? "bg-white text-zinc-900"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-8 text-sm">
            <button onClick={() => setShowPastEvents(false)} className="relative transition-colors duration-200">
              <div className={`font-semibold text-xl py-0.5 ${!showPastEvents ? "text-white" : "text-gray-400"}`}>
                Upcoming
              </div>
              {!showPastEvents && <div className="absolute left-0 -bottom-2 h-[2px] w-10 rounded-full bg-white" />}
            </button>
            <button onClick={() => setShowPastEvents(true)} className="relative transition-colors duration-200">
              <div className={`text-xl px-14 py-2 ${showPastEvents ? "text-white font-semibold" : "text-gray-400"}`}>
                Past
              </div>
              {showPastEvents && <div className="absolute left-14 -bottom-2 h-[2px] w-10 rounded-full bg-white" />}
            </button>
          </div>

          <div className="mt-6 flex gap-6 overflow-x-auto pb-2">
            {!showPastEvents ? (
              filteredUpcomingEvents.length > 0 ? (
                filteredUpcomingEvents.map((event, index) => (
                  <CardSkeleton
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
              )
            ) : filteredPastEvents.length > 0 ? (
              filteredPastEvents.map((event, index) => (
                <CardSkeleton
                  key={index}
                  title={event.title}
                  date={event.date}
                  description={event.description}
                  time={event.time}
                  attending={event.attending}
                  location={event.location}
                  instructor={event.instructor}
                  tags={event.tags}
                  onEventClick={onEventClick}
                />
              ))
            ) : (
              <div className="w-full text-center py-12">
                <p className="text-zinc-500">No past workshops found matching your criteria.</p>
              </div>
            )}
          </div>

          <section className="mt-12">
            <h2 className="text-3xl font-bold mb-8" style={{ color: "#FFFFFF" }}>
              Announcements
            </h2>

            <div className="space-y-4">
              <AnnouncementItem
                title="New Partnership with TechCorp"
                content="We're excited to announce our strategic partnership with TechCorp, bringing cutting-edge AI tools and resources to our community. This collaboration will provide exclusive access to their latest machine learning platforms, mentorship opportunities with their senior engineers, and potential internship placements for our most promising members."
                author="Admin"
                timeAgo="2 hours ago"
                avatarColor="#8B5CF6"
                isImportant={true}
              />
              <AnnouncementItem
                title="Upcoming Hackathon Registration"
                content="Registration is now open for our annual 48-hour hackathon! Teams of 2-4 members can compete for $10,000 in prizes while building innovative solutions for real-world problems. Mentors from top tech companies will be available throughout the event."
                author="Events Team"
                timeAgo="1 day ago"
                avatarColor="#10B981"
              />
              <AnnouncementItem
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
        <div className="mt-8 space-y-8">
          {/* My Meetings header with Create button */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">My Meetings</h2>
            <button className="px-4 py-2 bg-neutral-800/90 backdrop-blur-xl rounded-xl text-white text-sm font-medium hover:bg-neutral-700/90 transition-colors flex items-center gap-2">
              <span className="text-lg">+</span>
              Create
            </button>
          </div>

          {/* Meetings list - vertical cards */}
          <div className="space-y-4">
            {/* Meeting Card 1 */}
            <Panel
              variant="module"
              className="p-6 hover:shadow-lg transition-all cursor-pointer"
              style={{ backgroundColor: "#1F1F1F", border: "none" }}
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400/20 to-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white text-xs font-bold">
                    SC
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white mb-1">1:1 with Sarah Chen</h3>
                  <div className="text-sm text-gray-400 mb-2">Tomorrow, Dec 15 at 2:00 PM</div>
                  <div className="text-sm text-gray-300 line-clamp-1">
                    Discuss AI implementation strategy and project roadmap
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="px-3 py-1 bg-sky-500/20 text-sky-300 text-xs rounded-lg font-medium">30 min</div>
                </div>
              </div>
            </Panel>

            {/* Meeting Card 2 */}
            <Panel
              variant="module"
              className="p-6 hover:shadow-lg transition-all cursor-pointer"
              style={{ backgroundColor: "#1F1F1F", border: "none" }}
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/20 to-teal-600/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                    MJ
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white mb-1">Team Sync with Marcus</h3>
                  <div className="text-sm text-gray-400 mb-2">Dec 16 at 10:00 AM</div>
                  <div className="text-sm text-gray-300 line-clamp-1">Weekly sync on product design and feedback</div>
                </div>
                <div className="flex-shrink-0">
                  <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-lg font-medium">
                    45 min
                  </div>
                </div>
              </div>
            </Panel>

            {/* Meeting Card 3 */}
            <Panel
              variant="module"
              className="p-6 hover:shadow-lg transition-all cursor-pointer"
              style={{ backgroundColor: "#1F1F1F", border: "none" }}
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    ER
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white mb-1">Coffee Chat with Elena</h3>
                  <div className="text-sm text-gray-400 mb-2">Dec 18 at 3:30 PM</div>
                  <div className="text-sm text-gray-300 line-clamp-1">Casual conversation about career growth</div>
                </div>
                <div className="flex-shrink-0">
                  <div className="px-3 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-lg font-medium">
                    60 min
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          {/* No meetings state (optional, hidden when there are meetings) */}
          {/* <Panel
            variant="module"
            className="p-8 text-center"
            style={{ backgroundColor: "#1F1F1F", border: "none" }}
          >
            <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Meetings Scheduled</h3>
            <p className="text-sm text-gray-400 mb-4">You have no upcoming meetings. Create one to get started.</p>
            <button className="px-6 py-2 bg-white text-zinc-900 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
              Schedule Meeting
            </button>
          </Panel> */}
        </div>
      )}
    </div>
  )
}
