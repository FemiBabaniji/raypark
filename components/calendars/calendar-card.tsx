"use client"

import { Calendar, Users } from 'lucide-react'
import Link from "next/link"

interface CalendarCardProps {
  slug: string
  name: string
  description?: string
  subscribers: number
  tintColor?: string
  iconEmoji?: string
  coverGradient?: "purple" | "pink" | "blue"
}

export function CalendarCard({
  slug,
  name,
  description,
  subscribers,
  tintColor = "#8B5CF6",
  iconEmoji = "📅",
  coverGradient = "purple",
}: CalendarCardProps) {
  const gradientClasses = {
    purple: "gradient-purple",
    pink: "gradient-pink",
    blue: "gradient-blue",
  }

  return (
    <Link href={`/calendars/${slug}`}>
      <div className="floating-card rounded-2xl overflow-hidden group cursor-pointer">
        {/* Small gradient accent bar */}
        <div className={`h-2 w-full ${gradientClasses[coverGradient]}`} />

        {/* Content */}
        <div className="p-6">
          {/* Icon with tint color background */}
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-4"
            style={{ backgroundColor: `${tintColor}20` }}
          >
            {iconEmoji}
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          {description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {description}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{subscribers} {subscribers === 1 ? 'subscriber' : 'subscribers'}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
