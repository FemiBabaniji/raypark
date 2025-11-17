"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Users, Bell, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { UnifiedEventCard } from "@/components/cards/unified-event-card"
import { UnifiedAnnouncementCard } from "@/components/cards/unified-announcement-card"
import { colors, typography, spacing } from "@/lib/design-system"

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
    <div 
      className="max-w-7xl mx-auto space-y-8" 
      style={{ 
        padding: spacing.xl,
        backgroundColor: colors.background.primary 
      }}
    >
      <div className="text-center mb-8">
        <h1 
          className="text-white mb-2"
          style={{
            fontSize: typography.display.size,
            fontWeight: typography.display.weight,
            lineHeight: typography.display.lineHeight,
            letterSpacing: typography.display.letterSpacing,
          }}
        >
          BEA Founders Connect
        </h1>
        <p 
          style={{ 
            color: colors.foreground.secondary,
            fontSize: typography.body.size 
          }}
        >
          Your community hub for networking and collaboration
        </p>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5" style={{ color: colors.accent.blue }} />
          <h2 
            className="text-white"
            style={{
              fontSize: typography.h2.size,
              fontWeight: typography.h2.weight,
            }}
          >
            Community Announcements
          </h2>
        </div>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <UnifiedAnnouncementCard
              key={announcement.id}
              title={announcement.title}
              content={announcement.content}
              author={announcement.author}
              timeAgo={announcement.timestamp}
              avatarColor={colors.accent.purple}
              isImportant={announcement.isImportant}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: colors.accent.green }} />
            <h2 
              className="text-white"
              style={{
                fontSize: typography.h2.size,
                fontWeight: typography.h2.weight,
              }}
            >
              Upcoming Events
            </h2>
          </div>
          <Button variant="ghost" size="sm" style={{ color: colors.foreground.secondary }}>
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <UnifiedEventCard
              key={event.id}
              title={event.title}
              date={event.date}
              time={event.time}
              description={`${event.location}`}
              attending={event.attendeeCount}
              location={event.location}
              type="workshop"
              onEventClick={() => console.log('View event:', event.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: colors.accent.purple }} />
            <h2 
              className="text-white"
              style={{
                fontSize: typography.h2.size,
                fontWeight: typography.h2.weight,
              }}
            >
              Member Spotlights
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockSpotlights.map((member) => (
            <div
              key={member.id}
              className="relative rounded-xl p-6 border hover:scale-[1.01] transition-all cursor-pointer"
              style={{
                backgroundColor: colors.background.tertiary,
                borderColor: colors.border.subtle,
                borderRadius: '1.25rem',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colors.accent.purple }}
                >
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span 
                      className="text-white font-medium"
                      style={{ fontSize: typography.label.size }}
                    >
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-white font-semibold mb-1"
                    style={{ fontSize: typography.body.size }}
                  >
                    {member.name}
                  </h3>
                  <p 
                    className="mb-2"
                    style={{ 
                      fontSize: typography.bodySmall.size,
                      color: colors.foreground.secondary 
                    }}
                  >
                    {member.title} at {member.company}
                  </p>
                  <p 
                    style={{ 
                      fontSize: typography.bodySmall.size,
                      color: colors.foreground.secondary 
                    }}
                  >
                    {member.achievement}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border.subtle }}>
                <button
                  className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: colors.accent.blue }}
                >
                  View Profile
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
