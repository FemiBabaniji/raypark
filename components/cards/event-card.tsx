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
      return "from-blue-900/70 via-cyan-900/60 to-blue-950/70"
    } else if (title.includes("Networking") || title.includes("Founder")) {
      return "from-emerald-900/70 via-teal-900/60 to-emerald-950/70"
    } else if (title.includes("Design") || title.includes("Product")) {
      return "from-purple-900/70 via-pink-900/60 to-purple-950/70"
    }
    return "from-blue-900/70 via-cyan-900/60 to-blue-950/70"
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${gradient}
        backdrop-blur-xl
        rounded-3xl 
        p-8
        transition-all duration-300 ease-out
        ${isHovered ? "scale-[1.02] shadow-2xl" : "shadow-lg"}
        text-left text-white
        w-80
        flex-shrink-0
      `}
      style={{
        minHeight: "500px",
        boxShadow: isHovered ? "0 25px 50px -12px rgba(0, 0, 0, 0.4)" : "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

      <div className="relative flex flex-col h-full">
        <div className="mb-6">
          <p className="text-white/60 text-xs font-medium tracking-wide uppercase mb-2">{type}</p>
          <h3 className="text-2xl font-bold mb-2 leading-tight text-balance">{title}</h3>
        </div>

        <p className="text-white/75 mb-8 leading-relaxed text-sm text-pretty flex-grow">{description}</p>

        <div className="space-y-2.5 mb-8">
          <div className="flex items-center gap-2.5 text-sm text-white/85">
            <Calendar className="w-4 h-4 flex-shrink-0 opacity-70" />
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-white/85">
            <Clock className="w-4 h-4 flex-shrink-0 opacity-70" />
            <span className="font-medium">{time}</span>
          </div>
          {location && (
            <div className="flex items-center gap-2.5 text-sm text-white/85">
              <MapPin className="w-4 h-4 flex-shrink-0 opacity-70" />
              <span className="font-medium">{location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-5 mt-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-sm">{attending}</span>
          </div>
          <div
            className={`
              px-4 py-2 
              bg-white/95 text-black 
              font-semibold rounded-full text-sm
              transition-all
              ${isHovered ? "bg-white" : ""}
            `}
          >
            View Event
          </div>
        </div>
      </div>
    </button>
  )
}
