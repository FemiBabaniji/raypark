"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, Users } from 'lucide-react'

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
    // Workshop (Blue)
    if (title.includes("Workshop") || title.includes("AI") || title.includes("Machine Learning")) {
      return "from-[#5b7fc9] to-[#4a6bb3]"
    } 
    // Networking (Green)
    else if (title.includes("Networking") || title.includes("Mixer") || title.includes("Founder")) {
      return "from-[#5fb88f] to-[#4a9e7c]"
    } 
    // Masterclass (Purple)
    else if (title.includes("Masterclass") || title.includes("Design") || title.includes("Product")) {
      return "from-[#8b7fc9] to-[#7568b3]"
    }
    // Workshop/Pitch (Orange)
    else if (title.includes("Conference") || title.includes("Pitch")) {
      return "from-[#d9926f] to-[#c0795d]"
    }
    // Mixer (Teal)
    else if (title.includes("Meetup") || title.includes("Social")) {
      return "from-[#5fb8c9] to-[#4a9eb3]"
    }
    return "from-[#5b7fc9] to-[#4a6bb3]"
  }

  const getEventType = (title: string) => {
    if (title.includes("Workshop")) return "Workshop"
    if (title.includes("Mixer") || title.includes("Networking")) return "Networking"
    if (title.includes("Masterclass")) return "Masterclass"
    if (title.includes("Conference")) return "Conference"
    if (title.includes("Meetup")) return "Meetup"
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${gradient}
        backdrop-blur-xl
        rounded-3xl 
        p-5
        transition-all duration-300 ease-out
        ${isHovered ? "scale-[1.02]" : ""}
        text-left text-white
        w-52 sm:w-56
        flex-shrink-0
        shadow-lg
      `}
      style={{
        minHeight: "224px",
        maxWidth: "224px",
        aspectRatio: "1 / 1.1"
      }}
    >
      <div className={`absolute top-3 right-3 bg-gradient-to-br ${gradient} backdrop-blur-md rounded-lg px-2.5 py-1.5 z-10 shadow-md border border-white/20`}>
        <p className="text-white font-semibold text-xs leading-none whitespace-nowrap">{date}</p>
      </div>

      <div className="relative flex flex-col h-full">
        <div className="mb-auto pr-0">
          <p className="text-white/70 text-xs font-medium tracking-wide uppercase mb-2">{type}</p>
          <h3 className="text-xl font-bold leading-tight text-white line-clamp-3 mb-3">
            {title}
          </h3>
        </div>

        <div className="mt-auto space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-white/90">
            <Clock className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
            <span className="font-normal">{time}</span>
          </div>
          {location && (
            <div className="flex items-center gap-2 text-xs text-white/90">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
              <span className="font-normal truncate">{location}</span>
            </div>
          )}
          
          {/* Bottom buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
              <Users className="w-3.5 h-3.5" />
              <span className="font-semibold text-xs">{attending}</span>
            </div>
            <div
              className={`
                px-4 py-2 
                bg-white/95 text-black 
                font-semibold rounded-full text-xs
                transition-all
                ${isHovered ? "bg-white" : ""}
              `}
            >
              View
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
