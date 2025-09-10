"use client"

import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MessageSquare, Clock } from "lucide-react"

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
  // Add other communities with similar structure
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
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-xl border-b border-neutral-800/50"
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center space-x-4">
          <BackButton
            onClick={() => router.push("/network")}
            className="text-neutral-400 hover:text-white transition-colors"
          />
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-neutral-400">pathwai</span>
          </div>
        </div>

        <Button
          onClick={() => router.push(`/network/${communityId}/members`)}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Users className="w-4 h-4 mr-2" />
          Members ({community.memberCount})
        </Button>
      </motion.nav>

      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{community.name}</h1>
          <p className="text-neutral-400">{community.subtitle}</p>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Latest Announcements</h2>
          </div>

          <div className="space-y-4">
            {community.announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-6 border border-neutral-800/50"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{announcement.title}</h3>
                <div className="flex items-center gap-4 text-sm text-neutral-400 mb-3">
                  <span>Posted {announcement.time}</span>
                  <span>•</span>
                  <span>{announcement.author}</span>
                </div>
                <p className="text-neutral-300">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {community.events.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => router.push(`/network/${communityId}/events/${event.id}`)}
                className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-6 border border-neutral-800/50 cursor-pointer hover:border-neutral-700/50 transition-all"
              >
                <div className="bg-blue-500/20 text-blue-400 text-sm font-medium px-3 py-1 rounded-full w-fit mb-4">
                  {event.date}
                </div>

                <h3 className="text-lg font-semibold text-white mb-3">{event.title}</h3>
                <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 text-sm text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">{event.location}</span>
                    <span className="text-green-400 font-medium">{event.attendeeCount} attending</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
