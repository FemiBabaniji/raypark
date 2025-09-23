"use client"

import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BackButton } from "@/components/ui/back-button"
import { ChevronDown, Users, Calendar, MessageCircle, Star, Bell, ArrowRight } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const communityData = {
  name: "BEA Founders Connect",
  subtitle: "Black Entrepreneurship Alliance - Community Hub",
  memberCount: 312,
  announcements: [
    {
      id: 1,
      title: "Welcome New BEA Cohort Members!",
      author: "BEA Team",
      time: "2 hours ago",
      content:
        "We're excited to welcome 25 new founders to the BEA community. Join us for the welcome mixer on Dec 15th.",
      isImportant: true,
    },
    {
      id: 2,
      title: "Investor Office Hours - December",
      author: "Sarah Kim, Program Director",
      time: "1 day ago",
      content: "Book 1:1 sessions with our partner VCs. Limited slots available for December.",
      isImportant: false,
    },
    {
      id: 3,
      title: "Mentorship Program Applications Open",
      author: "Mentorship Team",
      time: "3 days ago",
      content:
        "Apply now for our Q1 2025 mentorship program. Connecting experienced entrepreneurs with emerging talent.",
      isImportant: false,
    },
  ],
  events: [
    {
      id: "founders-connect-mixer",
      title: "Founders Connect Mixer",
      description:
        "Connect with fellow entrepreneurs and startup founders in a relaxed networking environment. Share experiences and build valuable connections.",
      date: "Dec 15",
      time: "6:00 PM - 9:00 PM",
      location: "Innovation Hub",
      attendeeCount: 47,
      isRSVPed: false,
      hasMatches: true,
      matchCount: 8,
    },
    {
      id: "ai-ml-workshop",
      title: "AI & Machine Learning Workshop",
      description:
        "Join us for an intensive workshop on the latest AI and machine learning technologies. Learn hands-on techniques and network with industry experts.",
      date: "Dec 18",
      time: "2:00 PM - 5:00 PM",
      location: "Tech Center",
      attendeeCount: 32,
      isRSVPed: true,
      hasMatches: true,
      matchCount: 5,
    },
    {
      id: "pitch-competition",
      title: "Quarterly Pitch Competition",
      description:
        "Present your business ideas to a panel of investors and industry leaders. Win funding and mentorship opportunities.",
      date: "Dec 22",
      time: "1:00 PM - 6:00 PM",
      location: "Business Center",
      attendeeCount: 67,
      isRSVPed: false,
      hasMatches: false,
      matchCount: 0,
    },
  ],
  memberSpotlights: [
    {
      id: "sarah-chen",
      name: "Sarah Chen",
      title: "Founder & CEO",
      company: "HealthTech AI",
      avatarUrl: "/professional-headshot.png",
      achievement: "Raised $2M Series A for AI-powered healthcare platform",
    },
    {
      id: "alex-rodriguez",
      name: "Alex Rodriguez",
      title: "Partner",
      company: "Venture Capital Fund",
      achievement: "Led 15+ successful startup investments in 2024",
    },
  ],
}

export default function BEACommunityPage() {
  const router = useRouter()
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [events, setEvents] = useState(communityData.events)

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId)
  }

  const handleRSVP = async (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isRSVPed: !event.isRSVPed,
              attendeeCount: event.isRSVPed ? event.attendeeCount - 1 : event.attendeeCount + 1,
              hasMatches: !event.isRSVPed ? true : event.hasMatches,
              matchCount: !event.isRSVPed ? Math.floor(Math.random() * 10) + 3 : event.matchCount,
            }
          : event,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <BackButton onClick={() => router.push("/network")} aria-label="Back to communities" />
          <div>
            <h1 className="text-2xl font-medium text-white">{communityData.name}</h1>
            <p className="text-zinc-400">{communityData.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
          {/* Left Column: Announcements + Events */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/20"
            >
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-medium text-white">Community Announcements</h2>
              </div>

              <div className="space-y-4">
                {communityData.announcements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="bg-black/20 rounded-xl p-4 hover:bg-black/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        {announcement.title}
                        {announcement.isImportant && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                      </h3>
                      <span className="text-neutral-400 text-sm">{announcement.time}</span>
                    </div>
                    <p className="text-neutral-300 text-sm mb-2">{announcement.content}</p>
                    <div className="text-neutral-400 text-xs">— {announcement.author}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-zinc-800/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-medium text-white">Upcoming Events</h2>
              </div>

              <div className="space-y-4">
                {events.map((event, index) => {
                  const isExpanded = expandedEvent === event.id
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      className={`bg-zinc-700/50 rounded-xl transition-all duration-300 cursor-pointer ${
                        isExpanded ? "ring-2 ring-blue-500/50" : "hover:bg-zinc-700/70"
                      }`}
                    >
                      <div onClick={() => toggleEventExpansion(event.id)} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">
                                {event.date}
                              </span>
                              {event.isRSVPed && (
                                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-medium">
                                  RSVP'd
                                </span>
                              )}
                              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDown className="w-4 h-4 text-zinc-400" />
                              </motion.div>
                            </div>

                            <h3 className="text-white font-medium mb-2 leading-tight">{event.title}</h3>
                            <p className="text-zinc-400 text-sm mb-3 leading-relaxed">{event.description}</p>

                            <div className="flex items-center justify-between">
                              <p className="text-zinc-400 text-sm">{event.time}</p>
                              <div className="flex items-center gap-2">
                                <div className="bg-zinc-600/50 px-2 py-1 rounded text-xs text-zinc-300">
                                  {event.attendeeCount} attending
                                </div>
                                {event.hasMatches && (
                                  <div className="bg-purple-600/50 px-2 py-1 rounded text-xs text-purple-300">
                                    {event.matchCount} matches
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-zinc-600/50 pt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-zinc-800/50 rounded-lg p-3">
                                  <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Location</p>
                                  <p className="text-white font-medium">{event.location}</p>
                                </div>
                                <div className="bg-zinc-800/50 rounded-lg p-3">
                                  <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Time</p>
                                  <p className="text-white font-medium">{event.time}</p>
                                </div>
                              </div>

                              <div className="flex gap-3 mb-4">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRSVP(event.id)
                                  }}
                                  className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors ${
                                    event.isRSVPed
                                      ? "bg-green-600 hover:bg-green-700 text-white"
                                      : "bg-blue-600 hover:bg-blue-700 text-white"
                                  }`}
                                >
                                  {event.isRSVPed ? "RSVP'd ✓" : "RSVP"}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/network/bea-founders-connect/events/${event.id}`)
                                  }}
                                  className="flex-1 border-zinc-600 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                  View Details
                                </Button>
                              </div>

                              {event.isRSVPed && event.hasMatches && (
                                <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-purple-300 font-medium text-sm">AI Matches Available</p>
                                      <p className="text-purple-200 text-xs">
                                        {event.matchCount} potential collaborators found
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      className="bg-purple-600 hover:bg-purple-700 text-white"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(`/network/bea-founders-connect/events/${event.id}/matches`)
                                      }}
                                    >
                                      View Matches
                                      <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
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
            <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-2xl p-6 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Member Spotlights
                </h3>
                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {communityData.memberSpotlights.map((member) => (
                  <div key={member.id} className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl || "/placeholder.svg"}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-medium text-sm">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{member.name}</h4>
                        <div className="text-neutral-300 text-xs mb-1">
                          {member.title} at {member.company}
                        </div>
                        <p className="text-neutral-400 text-xs">{member.achievement}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-zinc-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Active Members</span>
                  <span className="text-white font-medium">{communityData.memberCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">This Month's Events</span>
                  <span className="text-white font-medium">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">New Members</span>
                  <span className="text-white font-medium">25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Founded</span>
                  <span className="text-white font-medium">2019</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/network/bea-founders-connect/members`)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl py-3 px-4 transition-colors"
                >
                  View Members
                </button>
                <button className="w-full bg-zinc-700/50 hover:bg-zinc-700/70 text-white font-medium rounded-xl py-3 px-4 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Start Conversations
                </button>
                <button className="w-full bg-zinc-700/50 hover:bg-zinc-700/70 text-white font-medium rounded-xl py-3 px-4 transition-colors">
                  AI Matching
                </button>
                <button className="w-full bg-zinc-700/50 hover:bg-zinc-700/70 text-white font-medium rounded-xl py-3 px-4 transition-colors">
                  Schedule Coffee
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
                    <p className="text-zinc-300 text-sm">25 new members joined</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-zinc-300 text-sm">AI Workshop scheduled</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-zinc-300 text-sm">Investor office hours announced</p>
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
