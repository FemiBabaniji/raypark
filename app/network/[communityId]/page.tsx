"use client"

import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Users, Clock, ChevronRight, BarChart3 } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"

const communityData = {
  "tech-innovators-sf": {
    name: "Tech Innovators SF",
    subtitle: "Community Hub - Announcements & Events",
    memberCount: 247,
    announcements: [
      {
        id: 1,
        title: "New Partnership with TechCorp",
        author: "Admin",
        time: "2 hours ago",
        content: "Exciting news about our latest partnership opportunity",
      },
      {
        id: 2,
        title: "Q4 Community Mixer Planning",
        author: "Events Team",
        time: "1 day ago",
        content: "Planning our biggest networking event of the year",
      },
      {
        id: 3,
        title: "Welcome New Members - October Batch",
        author: "Community Manager",
        time: "3 days ago",
        content: "Welcoming 15 new members to our growing community",
      },
    ],
    events: [
      {
        id: "ai-ml-workshop",
        title: "AI & Machine Learning Workshop",
        description: "Deep dive into cutting-edge AI technologies and practical ML implementations for startups.",
        date: "Sep 15",
        time: "6:00 PM - 9:00 PM",
        location: "Innovation Centre",
        attendeeCount: 23,
      },
      {
        id: "founder-networking",
        title: "Founder Networking Mixer",
        description: "Connect with fellow founders, share experiences, and build meaningful relationships.",
        date: "Sep 22",
        time: "7:00 PM - 10:00 PM",
        location: "Tech Hub SF",
        attendeeCount: 45,
      },
      {
        id: "product-design-masterclass",
        title: "Product Design Masterclass",
        description: "Learn advanced UX/UI principles and design thinking methodologies from industry experts.",
        date: "Sep 28",
        time: "2:00 PM - 5:00 PM",
        location: "Design Studio",
        attendeeCount: 31,
      },
    ],
  },
  "black-entrepreneurship-alliance": {
    name: "Black Entrepreneurship Alliance",
    subtitle: "Community Hub - Announcements & Events",
    memberCount: 312,
    announcements: [
      {
        id: 1,
        title: "Mentorship Program Launch",
        author: "Program Director",
        time: "4 hours ago",
        content: "New mentorship program connecting experienced entrepreneurs with emerging talent",
      },
      {
        id: 2,
        title: "Funding Workshop Series",
        author: "Finance Team",
        time: "2 days ago",
        content: "Monthly workshop series on accessing capital and investment opportunities",
      },
    ],
    events: [
      {
        id: "pitch-competition",
        title: "Quarterly Pitch Competition",
        description: "Present your business ideas to a panel of investors and industry leaders.",
        date: "Oct 5",
        time: "1:00 PM - 6:00 PM",
        location: "Business Center",
        attendeeCount: 67,
      },
      {
        id: "leadership-summit",
        title: "Leadership & Growth Summit",
        description: "Strategic insights on scaling businesses and building effective teams.",
        date: "Oct 12",
        time: "9:00 AM - 4:00 PM",
        location: "Convention Hall",
        attendeeCount: 89,
      },
    ],
  },
}

export default function CommunityHubPage() {
  const router = useRouter()
  const params = useParams()
  const communityId = params.communityId as string

  const community = communityData[communityId as keyof typeof communityData]

  if (!community) {
    return <div>Community not found</div>
  }

  const stats = [
    { label: "members", value: community.memberCount.toString(), icon: Users, change: "+12" },
    { label: "events", value: community.events.length.toString(), icon: Calendar, change: "+3" },
    { label: "activity", value: "94", icon: BarChart3, change: "+8%" },
  ]

  return (
    <div className="h-full overflow-y-auto bg-zinc-950">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8 items-start"
        >
          {/* Welcome Section */}
          <div className="text-center lg:text-left py-8">
            <div className="flex items-center gap-4 mb-6">
              <BackButton onClick={() => router.push("/network")} aria-label="Back to communities" />
            </div>

            <h1 className="text-3xl font-light text-white mb-2">{community.name}</h1>
            <p className="text-zinc-400 text-lg mb-6">{community.subtitle}</p>

            {/* Inline Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center group cursor-pointer"
                >
                  <div className="w-20 h-20 bg-zinc-800/30 rounded-2xl mx-auto mb-2 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="text-lg font-light text-white">{stat.value}</div>
                    <div className="text-zinc-400 text-xs">{stat.label}</div>
                  </div>
                  <span className="text-green-400 text-xs font-medium">{stat.change}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-zinc-800/30 rounded-2xl p-6 text-center">
              <h2 className="text-lg font-medium text-white mb-1">{community.name}</h2>
              <p className="text-zinc-400 text-sm mb-2">{community.memberCount} active members</p>
              <p className="text-zinc-300 text-xs mb-3 leading-relaxed">
                building connections and fostering innovation
              </p>
              <button
                onClick={() => router.push(`/network/${communityId}/members`)}
                className="w-full py-2 px-4 bg-white text-black text-sm rounded-xl hover:bg-gray-100 transition-colors"
              >
                view members
              </button>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
          {/* Left Column: Announcements + Events */}
          <div className="space-y-6">
            {/* Latest Announcements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-zinc-800/30 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">latest announcements</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors">
                  view all <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-4">
                {community.announcements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="bg-zinc-700/30 rounded-xl p-4 hover:bg-zinc-700/50 transition-colors cursor-pointer"
                  >
                    <h4 className="text-white font-medium text-sm leading-tight mb-1">{announcement.title}</h4>
                    <p className="text-zinc-400 text-xs mb-2">
                      by {announcement.author} • {announcement.time}
                    </p>
                    <p className="text-zinc-300 text-xs leading-relaxed">{announcement.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-zinc-800/30 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">upcoming events</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors">
                  view all <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-4">
                {community.events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    onClick={() => router.push(`/network/${communityId}/events/${event.id}`)}
                    className="bg-zinc-700/30 rounded-xl p-4 hover:bg-zinc-700/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm leading-tight">{event.title}</h4>
                      <span className="px-2 py-0.5 bg-zinc-600 text-white text-xs rounded-full ml-2 flex-shrink-0">
                        {event.date}
                      </span>
                    </div>

                    <p className="text-zinc-400 text-xs mb-2 leading-relaxed">{event.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span className="text-zinc-400 text-xs">{event.time}</span>
                      </div>
                      <span className="text-green-400 text-xs font-medium">{event.attendeeCount} attending</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Actions & Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-zinc-800/30 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">quick actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/network/${communityId}/members`)}
                  className="w-full bg-white hover:bg-gray-100 text-black font-medium rounded-xl py-3 px-4 transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  View Members
                </button>
                <button className="w-full bg-zinc-700/50 hover:bg-zinc-700/70 text-white font-medium rounded-xl py-3 px-4 transition-colors">
                  Create Event
                </button>
                <button className="w-full bg-zinc-700/50 hover:bg-zinc-700/70 text-white font-medium rounded-xl py-3 px-4 transition-colors">
                  Post Announcement
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-800/30 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">recent activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b border-zinc-700/50 last:border-0 last:pb-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-300 text-sm leading-relaxed">5 new members joined</p>
                    <span className="text-zinc-500 text-xs">2h ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-zinc-700/50 last:border-0 last:pb-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-300 text-sm leading-relaxed">workshop scheduled</p>
                    <span className="text-zinc-500 text-xs">1d ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-zinc-700/50 last:border-0 last:pb-0">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-300 text-sm leading-relaxed">new partnership announced</p>
                    <span className="text-zinc-500 text-xs">3d ago</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
