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
    // Workshop (Blue) - deeper blue
    if (title.includes("Workshop") || title.includes("AI") || title.includes("Machine Learning")) {
      return "from-[#4a6bb3] to-[#3a5a9d]"
    } 
    // Networking/Mixer (Green) - deeper green
    else if (title.includes("Networking") || title.includes("Mixer") || title.includes("Founder")) {
      return "from-[#4a9e7c] to-[#3a8866]"
    } 
    // Masterclass (Purple) - deeper purple
    else if (title.includes("Masterclass") || title.includes("Design") || title.includes("Product")) {
      return "from-[#7568b3] to-[#5f529d]"
    }
    // Conference (Orange) - deeper orange
    else if (title.includes("Conference")) {
      return "from-[#c0795d] to-[#a66347]"
    }
    // Seminar (Coral) - deeper coral
    else if (title.includes("Seminar")) {
      return "from-[#c96868] to-[#b35252]"
    }
    // Hackathon (Cyan) - deeper cyan
    else if (title.includes("Hackathon")) {
      return "from-[#4ab3c9] to-[#3a9db3]"
    }
    // Meetup (Pink) - deeper pink
    else if (title.includes("Meetup")) {
      return "from-[#c068b3] to-[#a6529d]"
    }
    // Summit (Amber) - deeper amber
    else if (title.includes("Summit")) {
      return "from-[#c9a54a] to-[#b38f3a]"
    }
    // Social (Magenta) - deeper magenta
    else if (title.includes("Social")) {
      return "from-[#b368c9] to-[#9d52b3]"
    }
    return "from-[#4a6bb3] to-[#3a5a9d]"
  }

  const getTitleGradient = (title: string) => {
    if (title.includes("Workshop") || title.includes("AI") || title.includes("Machine Learning")) {
      return "from-white via-white to-[#4a6bb3]" // Deeper Blue
    } else if (title.includes("Networking") || title.includes("Mixer") || title.includes("Founder")) {
      return "from-white via-white to-[#4a9e7c]" // Deeper Green
    } else if (title.includes("Masterclass") || title.includes("Design") || title.includes("Product")) {
      return "from-white via-white to-[#7568b3]" // Deeper Purple
    } else if (title.includes("Conference")) {
      return "from-white via-white to-[#c0795d]" // Deeper Orange
    } else if (title.includes("Seminar")) {
      return "from-white via-white to-[#c96868]" // Deeper Coral
    } else if (title.includes("Hackathon")) {
      return "from-white via-white to-[#4ab3c9]" // Deeper Cyan
    } else if (title.includes("Meetup")) {
      return "from-white via-white to-[#c068b3]" // Deeper Pink
    } else if (title.includes("Summit")) {
      return "from-white via-white to-[#c9a54a]" // Deeper Amber
    } else if (title.includes("Social")) {
      return "from-white via-white to-[#b368c9]" // Deeper Magenta
    }
    return "from-white via-white to-[#4a6bb3]" // Default deeper blue
  }

  const getEventType = (title: string) => {
    if (title.includes("Workshop")) return "Workshop"
    if (title.includes("Mixer") || title.includes("Networking")) return "Networking"
    if (title.includes("Masterclass")) return "Masterclass"
    if (title.includes("Conference")) return "Conference"
    if (title.includes("Seminar")) return "Seminar"
    if (title.includes("Hackathon")) return "Hackathon"
    if (title.includes("Meetup")) return "Meetup"
    if (title.includes("Summit")) return "Summit"
    if (title.includes("Social")) return "Social"
    return "Event"
  }

  const gradient = getGradient(title)
  const titleGradient = getTitleGradient(title)
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

      <div className="relative flex flex-col justify-between h-full">
        <div className="mb-2">
          <p className="text-white/60 text-xs font-medium tracking-wide uppercase mb-2">{type}</p>
          <h3
            className={`text-2xl font-bold leading-tight text-balance bg-gradient-to-br ${titleGradient} bg-clip-text text-transparent`}
          >
            {title}
          </h3>
        </div>

        <div className="mt-auto space-y-2">
          {/* Date, time, location metadata */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-white font-semibold">
              <Calendar className="w-4 h-4 flex-shrink-0 opacity-80" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/85">
              <Clock className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
              <span className="font-medium">{time}</span>
            </div>
            {location && (
              <div className="flex items-center gap-2 text-xs text-white/85">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                <span className="font-medium">{location}</span>
              </div>
            )}
          </div>

          {/* Bottom buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
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
