"use client"

import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import MembersPage from "@/components/members-page"
import { mockPortfolios } from "@/lib/portfolio-data"
import { useState } from "react"

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
  const [showMembers, setShowMembers] = useState(false)

  const events = [
    {
      title: "AI & Machine Learning Workshop",
      date: "September 18, 2025",
      time: "6:00 PM - 9:00 PM",
      location: "Innovation Centre",
      description: "Deep dive into cutting-edge AI technologies and practical ML implementations for startups.",
      attending: 23,
      gradient: "from-blue-500/70 to-purple-500/70",
    },
    {
      title: "Founder Networking Mixer",
      date: "September 25, 2025",
      time: "7:00 PM - 10:00 PM",
      location: "Innovation Centre",
      description: "Connect with fellow founders, share experiences, and build meaningful relationships.",
      attending: 45,
      gradient: "from-purple-500/70 to-pink-500/70",
    },
    {
      title: "Product Design Masterclass",
      date: "September 30, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Innovation Centre",
      description: "Learn advanced UX/UI principles and design thinking methodologies from industry experts.",
      attending: 31,
      gradient: "from-green-500/70 to-emerald-500/70",
    },
  ]

  const communityMembers = [
    ...mockPortfolios,
    {
      id: "sarah-chen",
      name: "Sarah Chen",
      title: "Frontend Developer",
      email: "sarah@techstartup.io",
      location: "San Francisco, CA",
      handle: "@sarahcodes",
      avatarUrl: "/professional-headshot.png",
      initials: "SC",
      selectedColor: 2, // Using purple gradient from identity widget theme
    },
    {
      id: "mike-rodriguez",
      name: "Mike Rodriguez",
      title: "Product Manager",
      email: "mike@innovationlabs.com",
      location: "Austin, TX",
      handle: "@mikepm",
      avatarUrl: "/man-developer.png",
      initials: "MR",
      selectedColor: 3, // Using green gradient from identity widget theme
    },
  ]

  if (showMembers) {
    return (
      <MembersPage
        title={`${selectedCommunity?.name} Members`}
        members={communityMembers}
        onBack={() => setShowMembers(false)}
        showInvite={true}
      />
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-16">
      <div className="absolute top-6 left-6">
        <BackButton onClick={() => setNetworkView("communities")} aria-label="Back to communities" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl text-white">{selectedCommunity?.name}</h1>
          <p className="text-white/70">{selectedCommunity?.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Latest Announcements */}
            <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 bg-neutral-600 rounded flex items-center justify-center">
                  <div className="w-3 h-3 border border-neutral-400 rounded-sm"></div>
                </div>
                <h2 className="text-xl font-bold text-white">Latest Announcements</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-neutral-800/50 rounded-2xl p-4">
                  <h3 className="text-white mb-2">New Partnership with TechCorp</h3>
                  <p className="text-white/60 text-sm mb-2">Posted 2 hours ago • Admin</p>
                </div>

                <div className="bg-neutral-800/50 rounded-2xl p-4">
                  <h3 className="text-white mb-2">Q4 Community Mixer Planning</h3>
                  <p className="text-white/60 text-sm mb-2">Posted 1 day ago • Events Team</p>
                </div>

                <div className="bg-neutral-800/50 rounded-2xl p-4">
                  <h3 className="text-white mb-2">Welcome New Members - October Batch</h3>
                  <p className="text-white/60 text-sm mb-2">Posted 3 days ago • Community Manager</p>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 bg-neutral-600 rounded flex items-center justify-center">
                  <div className="w-3 h-3 border border-neutral-400 rounded-sm"></div>
                </div>
                <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${event.gradient} backdrop-blur-xl rounded-2xl p-4 cursor-pointer hover:scale-105 transition-all duration-300`}
                    onClick={() => {
                      setSelectedEvent(event)
                      setNetworkView("event")
                    }}
                  >
                    <div className="bg-black/20 text-white text-xs px-2 py-1 rounded mb-3 inline-block">
                      {event.date.split(",")[0].replace("September ", "Sep ")}
                    </div>
                    <h4 className="text-white mb-2 font-medium">{event.title}</h4>
                    <p className="text-white/80 text-sm mb-3">{event.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">{event.time}</span>
                      <span className="text-white/70">{event.attending} attending</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-6">
              <h3 className="text-white font-bold mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Active Members</span>
                  <span className="text-white">{selectedCommunity?.members.split(" ")[0]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">This Month's Events</span>
                  <span className="text-white">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">New Members</span>
                  <span className="text-white">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Founded</span>
                  <span className="text-white">2021</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-6">
              <h3 className="text-white font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl"
                  onClick={() => setShowMembers(true)}
                >
                  View Members
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                >
                  Create Event
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                >
                  Post Announcement
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                >
                  Invite Members
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-6">
              <h3 className="text-white font-bold mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-white/80">5 new members joined</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-white/80">Workshop scheduled</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-white/80">New partnership announced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
