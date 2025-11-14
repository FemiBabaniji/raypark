"use client"

import type { Event } from "@/lib/types/events"
import { format } from "date-fns"
import { Calendar, MapPin, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from "next/image"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const router = useRouter()
  const startDate = new Date(event.start_time)
  
  return (
    <div
      onClick={() => router.push(`/events/${event.id}`)}
      className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border hover:border-muted-foreground/20 transition-all duration-300 hover:shadow-lg"
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-br from-purple-500/10 to-pink-500/10 overflow-hidden">
        {event.cover_image_url ? (
          <Image
            src={event.cover_image_url || "/placeholder.svg"}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">
              {event.calendar?.icon_emoji || "📅"}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Calendar Badge */}
        {event.calendar && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{event.calendar.icon_emoji}</span>
            <span className="text-sm font-medium text-muted-foreground">
              {event.calendar.name}
            </span>
          </div>
        )}

        {/* Event Name */}
        <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {event.name}
        </h3>

        {/* Event Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {format(startDate, "EEE, MMM d")} at {format(startDate, "h:mm a")}
            </span>
          </div>

          {event.location_type === "offline" && event.location_address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{event.location_address}</span>
            </div>
          )}

          {event.location_type === "virtual" && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Virtual Event</span>
            </div>
          )}

          {event.registration_count !== undefined && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{event.registration_count} attending</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
