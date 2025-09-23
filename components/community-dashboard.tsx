"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Users, MessageCircle, Star, ArrowRight, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CommunityEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendeeCount: number
  isRSVPed: boolean
}

interface MemberSpotlight {
  id: string
  name: string
  title: string
  company: string
  avatarUrl?: string
  achievement: string
}

interface Announcement {
  id: string
  title: string
  content: string
  author: string
  timestamp: string
  isImportant: boolean
}

const mockEvents: CommunityEvent[] = [
  {
    id: "founders-connect-dec15",
    title: "Founders Connect Mixer",
    date: "Dec 15, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "Innovation Hub",
    attendeeCount: 47,
    isRSVPed: false,
  },
  {
    id: "ai-workshop-dec18",
    title: "AI & Machine Learning Workshop",
    date: "Dec 18, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Tech Center",
    attendeeCount: 32,
    isRSVPed: true,
  },
]

const mockSpotlights: MemberSpotlight[] = [
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
]

const mockAnnouncements: Announcement[] = [
  {
    id: "welcome-new-cohort",
    title: "Welcome New BEA Cohort Members!",
    content:
      "We're excited to welcome 25 new founders to the BEA community. Join us for the welcome mixer on Dec 15th.",
    author: "BEA Team",
    timestamp: "2 hours ago",
    isImportant: true,
  },
  {
    id: "investor-office-hours",
    title: "Investor Office Hours - December",
    content: "Book 1:1 sessions with our partner VCs. Limited slots available for December.",
    author: "Sarah Kim, Program Director",
    timestamp: "1 day ago",
    isImportant: false,
  },
]

export default function CommunityDashboard({ communityId }: { communityId: string }) {
  const [events, setEvents] = useState<CommunityEvent[]>(mockEvents)
  const [spotlights, setSpotlights] = useState<MemberSpotlight[]>(mockSpotlights)
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)

  const handleRSVP = async (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isRSVPed: !event.isRSVPed,
              attendeeCount: event.isRSVPed ? event.attendeeCount - 1 : event.attendeeCount + 1,
            }
          : event,
      ),
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">BEA Founders Connect</h1>
        <p className="text-neutral-400">Your community hub for networking and collaboration</p>
      </div>

      {/* Announcements */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Community Announcements</h2>
        </div>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-black/20 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-medium flex items-center gap-2">
                  {announcement.title}
                  {announcement.isImportant && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                </h3>
                <span className="text-neutral-400 text-sm">{announcement.timestamp}</span>
              </div>
              <p className="text-neutral-300 text-sm mb-2">{announcement.content}</p>
              <div className="text-neutral-400 text-xs">— {announcement.author}</div>
            </div>
          ))}
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" />
              Upcoming Events
            </h2>
            <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-medium mb-1">{event.title}</h3>
                    <div className="text-neutral-400 text-sm space-y-1">
                      <div>
                        {event.date} • {event.time}
                      </div>
                      <div>{event.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-neutral-400 text-sm mb-2">{event.attendeeCount} attending</div>
                    <Button
                      size="sm"
                      variant={event.isRSVPed ? "secondary" : "default"}
                      onClick={() => handleRSVP(event.id)}
                      className={event.isRSVPed ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {event.isRSVPed ? "RSVP'd" : "RSVP"}
                    </Button>
                  </div>
                </div>
                {event.isRSVPed && (
                  <div className="mt-3 pt-3 border-t border-neutral-700">
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                      View Attendees & Matches
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Member Spotlights */}
        <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Member Spotlights
            </h2>
            <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {spotlights.map((member) => (
              <div key={member.id} className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
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
                    <h3 className="text-white font-medium">{member.name}</h3>
                    <div className="text-neutral-400 text-sm mb-2">
                      {member.title} at {member.company}
                    </div>
                    <p className="text-neutral-300 text-sm">{member.achievement}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-700">
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    View Profile
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-neutral-900/50 rounded-xl p-6 text-center border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer">
          <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <h3 className="text-white font-medium mb-2">Start Conversations</h3>
          <p className="text-neutral-400 text-sm">Connect with members before events</p>
        </div>
        <div className="bg-neutral-900/50 rounded-xl p-6 text-center border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer">
          <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <h3 className="text-white font-medium mb-2">AI Matching</h3>
          <p className="text-neutral-400 text-sm">Find your perfect collaborators</p>
        </div>
        <div className="bg-neutral-900/50 rounded-xl p-6 text-center border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer">
          <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <h3 className="text-white font-medium mb-2">Schedule Coffee</h3>
          <p className="text-neutral-400 text-sm">Book 1:1 meetings with matches</p>
        </div>
      </motion.section>
    </div>
  )
}
