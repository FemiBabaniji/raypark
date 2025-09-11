"use client"

import { ArrowLeft } from "lucide-react"

interface Community {
  name: string
  subtitle: string
  members: string
  gradient: string
  icon: string
}

interface Event {
  title: string
  date: string
  time: string
  location: string
  description: string
  attending: number
  gradient: string
}

interface CommunityDetailProps {
  selectedCommunity: Community
  setNetworkView: (view: string) => void
  setSelectedEvent: (event: Event) => void
}

export function CommunityDetail({ selectedCommunity, setNetworkView, setSelectedEvent }: CommunityDetailProps) {
  const events = [
    {
      title: "AI & Machine Learning Workshop",
      date: "September 18, 2025",
      time: "6:00 PM - 9:00 PM",
      location: "Innovation Centre",
      description: "Deep dive into cutting-edge AI technologies and practical ML implementations for startups.",
      attending: 23,
      gradient: "from-blue-600 to-purple-600",
    },
    {
      title: "Founder Networking Mixer",
      date: "September 25, 2025",
      time: "7:00 PM - 10:00 PM",
      location: "Innovation Centre",
      description: "Connect with fellow founders, share experiences, and build meaningful relationships.",
      attending: 45,
      gradient: "from-purple-600 to-pink-600",
    },
    {
      title: "Product Design Masterclass",
      date: "September 30, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Innovation Centre",
      description: "Learn advanced UX/UI principles and design thinking methodologies from industry experts.",
      attending: 31,
      gradient: "from-green-600 to-emerald-600",
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-900 pt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setNetworkView("communities")}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-lg text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="text-3xl text-white">{selectedCommunity?.name}</h1>
            <p className="text-zinc-400">{selectedCommunity?.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Latest Announcements */}
            <div className="bg-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
                <h2 className="text-xl text-white">Latest Announcements</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-700 p-4 rounded-lg">
                  <h3 className="text-white mb-2">New Partnership with TechCorp</h3>
                  <p className="text-zinc-400 text-sm mb-2">Posted 2 hours ago • Admin</p>
                </div>

                <div className="bg-zinc-700 p-4 rounded-lg">
                  <h3 className="text-white mb-2">Q4 Community Mixer Planning</h3>
                  <p className="text-zinc-400 text-sm mb-2">Posted 1 day ago • Events Team</p>
                </div>

                <div className="bg-zinc-700 p-4 rounded-lg">
                  <h3 className="text-white mb-2">Welcome New Members - October Batch</h3>
                  <p className="text-zinc-400 text-sm mb-2">Posted 3 days ago • Community Manager</p>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
                <h2 className="text-xl text-white">Upcoming Events</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="bg-zinc-700 rounded-lg p-4 cursor-pointer hover:bg-zinc-600 transition-colors"
                    onClick={() => {
                      setSelectedEvent(event)
                      setNetworkView("event")
                    }}
                  >
                    <div
                      className={`bg-${index === 0 ? "blue" : index === 1 ? "purple" : "green"}-600 text-white text-xs px-2 py-1 rounded mb-3 inline-block`}
                    >
                      {event.date.split(",")[0].replace("September ", "Sep ")}
                    </div>
                    <h4 className="text-white mb-2">{event.title}</h4>
                    <p className="text-zinc-400 text-sm mb-3">{event.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">{event.time}</span>
                      <span className="text-zinc-400">{event.attending} attending</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-white mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Active Members</span>
                  <span className="text-white">{selectedCommunity?.members.split(" ")[0]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">This Month's Events</span>
                  <span className="text-white">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">New Members</span>
                  <span className="text-white">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Founded</span>
                  <span className="text-white">2021</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  View Members
                </button>
                <button className="w-full py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors">
                  Create Event
                </button>
                <button className="w-full py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors">
                  Post Announcement
                </button>
                <button className="w-full py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors">
                  Invite Members
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-white mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-zinc-300">5 new members joined</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-zinc-300">Workshop scheduled</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
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
