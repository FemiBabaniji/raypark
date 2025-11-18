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
}

export function MeetingCard({ title, organizer, date, time, attendees, gradientFrom, gradientTo }: MeetingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl bg-[#1a1a1a] p-4
        transition-all duration-300 ease-out
        ${isHovered ? "scale-[1.01]" : ""}
        text-left text-white
        w-full
        shadow-lg
        border border-white/5
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="absolute left-0 top-0 h-full w-1"
        style={{
          background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`
        }}
      />
      <h3 className="mb-1 text-lg font-semibold leading-tight">{title}</h3>
      <p className="mb-3 text-sm text-gray-400">{organizer}</p>
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>{date} • {time}</span>
        <span>{attendees} attending</span>
      </div>
    </div>
  )
}
