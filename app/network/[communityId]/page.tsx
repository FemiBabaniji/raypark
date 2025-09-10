"use client"

import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
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

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <BackButton onClick={() => router.push("/network")} aria-label="Back to communities" />
          <div>
            <h1 className="text-2xl font-medium text-white">{community.name}</h1>
            <p className="text-zinc-400">{community.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
          {/* Left Column: Announcements + Events */}
          <div className="space-y-8">
            {/* Latest Announcements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-zinc-800/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h2 className="text-lg font-medium text-white">Latest Announcements</h2>
              </div>

              <div className="space-y-4">
                {community.announcements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="bg-zinc-700/50 rounded-xl p-4 hover:bg-zinc-700/70 transition-colors cursor-pointer relative"
                  >
                    <div className="absolute top-4 right-4 text-xs text-zinc-500 bg-zinc-600/50 px-2 py-1 rounded">
                      Preview
                    </div>
                    <h3 className="text-white font-medium mb-2">{announcement.title}</h3>
                    <p className="text-zinc-400 text-sm">
                      Posted {announcement.time} • {announcement.author}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-zinc-800/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h2 className="text-lg font-medium text-white">Upcoming Events</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {community.events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    onClick={() => router.push(`/network/${communityId}/events/${event.id}`)}
                    className="bg-zinc-700/50 rounded-xl p-4 hover:bg-zinc-700/70 transition-colors cursor-pointer"
                  >
                    <div className="mb-3">
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">{event.date}</span>
                    </div>

                    <h3 className="text-white font-medium mb-2 leading-tight">{event.title}</h3>
                    <p className="text-zinc-400 text-sm mb-3 leading-relaxed">{event.description}</p>

                    <div className="space-y-1">
                      <p className="text-zinc-400 text-sm">{event.time}</p>
                      <p className="text-zinc-500 text-sm">{event.attendeeCount} attending</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Community Stats */}
            <div className="bg-zinc-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Active Members</span>
                  <span className="text-white font-medium">{community.memberCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">This Month's Events</span>
                  <span className="text-white font-medium">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">New Members</span>
                  <span className="text-white font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Founded</span>
                  <span className="text-white font-medium">2021</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/network/${communityId}/members`)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl py-3 px-4 transition-colors"
                >
                  View Members
                </button>
                <button className="w-full bg-zinc-700/50 hover:bg-zinc-700/70 text-white font-medium rounded-xl py-3 px-4 transition-colors">
                  Create Event
                </button>
                <button className="w-full bg-zinc-700/50 hover:bg-zinc-700/70 text-white font-medium rounded-xl py-3 px-4 transition-colors">
                  Post Announcement
                </button>
                <button className="w-full bg-zinc-700/50 hover:bg-zinc-700/70 text-white font-medium rounded-xl py-3 px-4 transition-colors">
                  Invite Members
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-zinc-300 text-sm">5 new members joined</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-zinc-300 text-sm">Workshop scheduled</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-zinc-300 text-sm">New partnership announced</p>
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
