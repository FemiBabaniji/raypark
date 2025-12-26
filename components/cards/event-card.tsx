"use client"

import { useState } from "react"
import { useTheme } from "@/lib/theme-context"
import { getThemeColor, type EventCategory } from "@/lib/theme-colors"

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
  category?: EventCategory
}

export function EventCard({
  title,
  date,
  description,
  time,
  attending,
  location,
  onEventClick,
  category,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useTheme()

  const getEventCategory = (title: string): EventCategory => {
    if (category) return category
    if (title.includes("Workshop") || title.includes("AI") || title.includes("Machine Learning")) return "workshop"
    if (title.includes("Networking") || title.includes("Mixer") || title.includes("Founder")) return "mixer"
    if (title.includes("Masterclass") || title.includes("Design") || title.includes("Product")) return "masterclass"
    if (title.includes("Conference") || title.includes("Pitch")) return "conference"
    if (title.includes("Meetup") || title.includes("Social")) return "meetup"
    return "workshop"
  }

  const getEventType = (title: string) => {
    if (title.includes("Workshop")) return "WORKSHOP"
    if (title.includes("Mixer") || title.includes("Networking")) return "NETWORKING"
    if (title.includes("Masterclass")) return "MASTERCLASS"
    if (title.includes("Conference")) return "CONFERENCE"
    if (title.includes("Meetup")) return "MEETUP"
    return "EVENT"
  }

  const eventCategory = getEventCategory(title)
  const bgColor = getThemeColor(theme, eventCategory)
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
    <div className="relative group flex-shrink-0 w-[280px]">
      <div
        className="relative rounded-xl p-6 shadow-lg transition-all hover:translate-y-[-2px] duration-300 h-[280px] flex flex-col cursor-pointer"
        style={{ backgroundColor: bgColor }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleEventClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between mb-auto">
          <div className="flex flex-col gap-2">
            <span className="text-white/60 text-[10px] uppercase tracking-widest font-medium">{type}</span>
            <h3 className="text-white text-xl font-medium leading-tight pr-4 max-w-[200px]">{title}</h3>
          </div>
          <span className="px-3 py-1 bg-white/15 backdrop-blur-sm text-white/90 text-[11px] font-medium rounded-full whitespace-nowrap mt-1">
            {date}
          </span>
        </div>

        <div className="relative z-10 space-y-2 mb-4">
          <div className="flex items-center gap-2 text-white/80">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-xs">{time}</span>
          </div>
          {location && (
            <div className="flex items-center gap-2 text-white/80">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2" />
                <circle cx="12" cy="10" r="3" strokeWidth="2" />
              </svg>
              <span className="text-xs">{location}</span>
            </div>
          )}
        </div>

        <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-black/10 backdrop-blur-sm rounded-full">
            <svg className="w-3 h-3 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-white/90 text-xs font-medium">{attending}</span>
          </div>
          <button
            className={`px-4 py-1.5 bg-white text-black rounded-full transition-colors text-xs font-medium ${isHovered ? "bg-white" : "bg-white/90"}`}
          >
            View Event
          </button>
        </div>
      </div>
    </div>
  )
}
