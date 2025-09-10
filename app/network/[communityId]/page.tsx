"use client"

import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Users, MessageSquare, Clock, ArrowLeft } from "lucide-react"

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
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/network")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 backdrop-blur-xl rounded-2xl px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="text-white text-2xl font-medium">{community.name}</h1>
            <p className="text-zinc-400 text-sm">{community.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                </div>
                <h2 className="text-white text-lg font-medium">Latest Announcements</h2>
              </div>

              <div className="space-y-4">
                {community.announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:bg-zinc-800/70 transition-colors"
                  >
                    <h3 className="text-white font-medium mb-2">{announcement.title}</h3>
                    <div className="text-zinc-400 text-sm mb-3">
                      Posted {announcement.time} • {announcement.author}
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-white text-lg font-medium">Upcoming Events</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {community.events.map((event) => (
                  <motion.button
                    key={event.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => router.push(`/network/${communityId}/events/${event.id}`)}
                    className="bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:bg-zinc-800/70 transition-all text-left"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1 rounded-full">
                        {event.date}
                      </div>
                      <span className="text-green-400 text-xs font-medium">{event.attendeeCount} attending</span>
                    </div>

                    <h3 className="text-white font-medium mb-2 leading-tight">{event.title}</h3>
                    <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{event.description}</p>

                    <div className="space-y-1 text-xs text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="text-zinc-400">{event.location}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Active Members</span>
                  <span className="text-white font-medium">{community.memberCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">This Month's Events</span>
                  <span className="text-white font-medium">{community.events.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">New Members</span>
                  <span className="text-white font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Founded</span>
                  <span className="text-white font-medium">2021</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/network/${communityId}/members`)}
                  className="w-full bg-white hover:bg-gray-100 text-black font-medium rounded-2xl py-3 px-4 transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  View Members
                </button>
                <button className="w-full bg-zinc-700/80 hover:bg-zinc-700 text-white font-medium rounded-2xl py-3 px-4 transition-colors">
                  Create Event
                </button>
                <button className="w-full bg-zinc-700/80 hover:bg-zinc-700 text-white font-medium rounded-2xl py-3 px-4 transition-colors">
                  Post Announcement
                </button>
                <button className="w-full bg-zinc-700/80 hover:bg-zinc-700 text-white font-medium rounded-2xl py-3 px-4 transition-colors">
                  Invite Members
                </button>
              </div>
            </div>

            <div className="bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-4">Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300 text-sm">Email Notifications</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300 text-sm">Event Reminders</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-600 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300 text-sm">Community Updates</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-zinc-300">5 new members joined</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-zinc-300">Workshop scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-zinc-300">New partnership announced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
