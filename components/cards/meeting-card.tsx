"use client"

import { useState } from "react"

interface MeetingCardProps {
  title: string
  organizer: string
  date: string
  time: string
  attendees: number
  gradientFrom: string
  gradientTo: string
  subtext?: string
}

export function MeetingCard({ title, organizer, date, time, attendees, gradientFrom, gradientTo, subtext }: MeetingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg bg-[#1a1a1a]
        transition-all duration-200 ease-out
        ${isHovered ? "scale-[1.01]" : ""}
        text-left text-white
        w-full
        border border-white/5
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "0.625rem 0.75rem"
      }}
    >
      <div 
        className="absolute left-0 top-0 h-full w-1"
        style={{
          background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`
        }}
      />
      <h3 className="mb-0.5 text-sm font-semibold leading-tight">{title}</h3>
      <p className="mb-0.5 text-xs text-gray-400">{organizer}</p>
      {subtext && <p className="mb-1.5 text-xs text-gray-500">{subtext}</p>}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{date} • {time}</span>
        <span>{attendees} attending</span>
      </div>
    </div>
  )
}
