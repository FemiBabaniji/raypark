"use client"

import { useState } from "react"
import { Panel } from "@/components/ui/panel"

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
  instructor,
  tags,
  dateLabel,
  onEventClick,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getEventColors = (title: string) => {
    if (title.includes("AI") || title.includes("Machine Learning")) {
      return {
        accent: "#0EA5E9", // Electric Blue
        gradient: "from-sky-400/35 to-blue-600/20",
      }
    } else if (title.includes("Networking") || title.includes("Founder")) {
      return {
        accent: "#10B981", // Emerald
        gradient: "from-emerald-400/35 to-teal-600/20",
      }
    } else if (title.includes("Design") || title.includes("Product")) {
      return {
        accent: "#8B5CF6", // Purple
        gradient: "from-violet-400/35 to-purple-600/20",
      }
    }
    return {
      accent: "#06B6D4", // Cyan
      gradient: "from-cyan-400/35 to-blue-600/20",
    }
  }

  const colors = getEventColors(title)

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
    <div className="w-64 flex-shrink-0">
      <Panel
        variant="tile"
        className={`transition-all duration-300 ease-out overflow-visible group relative bg-gradient-to-br ${colors.gradient} cursor-pointer`}
        style={{
          backgroundColor: "#1F1F1F",
          width: "255px",
          height: isHovered ? "360px" : "276px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleEventClick}
      >
        <div className="relative z-10 h-full flex flex-col text-center">
          <div className="flex-shrink-0 mb-4">
            <div className="text-lg font-semibold mb-3 line-clamp-2" style={{ color: "#FFFFFF" }}>
              {title}
            </div>
            <div className="text-sm leading-relaxed line-clamp-3" style={{ color: "#B3B3B3" }}>
              {description.split(".")[0]}.
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex-shrink-0 space-y-4">
            <div className="text-center">
              <div className="text-sm mb-2" style={{ color: "#B3B3B3" }}>
                {time}
              </div>
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: colors.accent,
                  color: "#FFFFFF",
                }}
              >
                {attending} attending
              </div>
            </div>

            <div
              className={`transition-all duration-300 ease-out ${
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                maxHeight: isHovered ? "120px" : "0px",
                overflow: "hidden",
              }}
            >
              {location && instructor && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div
                    className="p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5"
                    style={{ backdropFilter: "blur(10px)" }}
                  >
                    <div className="text-xs font-medium mb-1" style={{ color: "#B3B3B3" }}>
                      LOCATION
                    </div>
                    <div className="text-xs font-medium truncate" style={{ color: "#FFFFFF" }}>
                      {location.split(",")[0]}
                    </div>
                  </div>
                  <div
                    className="p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5"
                    style={{ backdropFilter: "blur(10px)" }}
                  >
                    <div className="text-xs font-medium mb-1" style={{ color: "#B3B3B3" }}>
                      INSTRUCTOR
                    </div>
                    <div className="text-xs font-medium truncate" style={{ color: "#FFFFFF" }}>
                      {instructor.split(",")[0]}
                    </div>
                  </div>
                </div>
              )}

              {tags && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: colors.accent,
                        color: "#FFFFFF",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}
