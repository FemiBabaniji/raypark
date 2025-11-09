"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

interface EventCardProps {
  title: string
  date: string
  description: string
  time: string
  attending: number
  location?: string
  instructor?: string
  tags?: string[]
  dateLabel?: string
  onEventClick?: (eventId: string) => void
}

export function EventCard({ title, date, description, time, attending, location, onEventClick }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getGradient = (title: string) => {
    if (title.includes("AI") || title.includes("Machine Learning")) {
      return "from-cyan-600 to-blue-600"
    } else if (title.includes("Networking") || title.includes("Founder")) {
      return "from-emerald-600 to-teal-600"
    } else if (title.includes("Design") || title.includes("Product")) {
      return "from-purple-600 to-pink-600"
    }
    return "from-cyan-600 to-blue-600"
  }

  const getEventType = (title: string) => {
    if (title.includes("Workshop")) return "Workshop"
    if (title.includes("Mixer") || title.includes("Networking")) return "Networking"
    if (title.includes("Masterclass")) return "Masterclass"
    return "Event"
  }

  const gradient = getGradient(title)
  const type = getEventType(title)

  const handleEventClick = () => {
    if (onEventClick) {
      if (title.includes("AI & Machine Learning")) {
        onEventClick("ai-ml-workshop")
      } else if (title.includes("Founder Networking")) {
        onEventClick("founder-networking-mixer")
      } else if (title.includes("Product Design")) {
        onEventClick("product-design-masterclass")
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleEventClick}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 hover:scale-105 transition cursor-pointer text-left`}
      style={{ width: "320px", minHeight: "500px" }}
    >
      <div className="flex flex-col h-full">
        {/* Top: type pill + title */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-3">{type}</span>
          <h3 className="text-xl font-bold mb-3">{title}</h3>
        </div>

        {/* Description */}
        <p className="text-white/90 mb-6 leading-relaxed text-sm flex-grow">{description}</p>

        {/* Time / Date / Location */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{date}</span>
          </div>
          {location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Footer: attendees + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20 mt-auto">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="font-semibold text-sm">{attending} attending</span>
          </div>
          <div className="px-5 py-2 bg-white text-black font-semibold rounded-lg text-sm">View Event</div>
        </div>
      </div>
    </button>
  )
}
