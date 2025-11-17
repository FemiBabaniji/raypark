"use client"

import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { colors } from "@/lib/design-system"

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

export function EventCard({ 
  title, 
  date, 
  description, 
  time, 
  attending, 
  location, 
  onEventClick 
}: EventCardProps) {
  const getEventGradient = (title: string) => {
    if (title.includes("Workshop") || title.includes("AI") || title.includes("Machine Learning")) {
      return "from-sky-600/90 via-blue-600/90 to-indigo-600/80"
    } 
    if (title.includes("Networking") || title.includes("Mixer") || title.includes("Founder")) {
      return "from-emerald-600/90 via-green-600/90 to-teal-600/80"
    } 
    if (title.includes("Masterclass") || title.includes("Design") || title.includes("Product")) {
      return "from-violet-600/90 via-purple-600/90 to-fuchsia-600/80"
    }
    return "from-sky-600/90 via-blue-600/90 to-indigo-600/80"
  }

  const getEventType = (title: string) => {
    if (title.includes("Workshop")) return "Workshop"
    if (title.includes("Mixer") || title.includes("Networking")) return "Networking"
    if (title.includes("Masterclass")) return "Masterclass"
    return "Event"
  }

  const gradient = getEventGradient(title)
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
    <div 
      onClick={handleEventClick}
      className={`w-56 sm:w-64 flex-shrink-0 rounded-2xl bg-gradient-to-br ${gradient} backdrop-blur-xl p-6 cursor-pointer
        transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-lg border border-white/10
        flex flex-col h-full min-h-[260px]`}
    >
      <div className="mb-4">
        <div 
          className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-3 bg-white/20 backdrop-blur-sm text-white"
        >
          {type}
        </div>
        <h3 className="text-xl font-bold leading-tight text-balance text-white mb-2">
          {title}
        </h3>
      </div>

      <div className="mt-auto space-y-2.5">
        <div className="flex items-center gap-2 text-sm text-white/90">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/90">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>{time}</span>
        </div>
        {location && (
          <div className="flex items-center gap-2 text-sm text-white/90">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/20">
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm"
          >
            <Users className="w-4 h-4 text-white" />
            <span className="font-semibold text-sm text-white">{attending}</span>
          </div>
          <div
            className="px-4 py-2 font-semibold rounded-full text-xs transition-all bg-white/90 text-neutral-900
            hover:bg-white hover:scale-105"
          >
            View
          </div>
        </div>
      </div>
    </div>
  )
}
