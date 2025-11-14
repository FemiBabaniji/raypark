"use client"

import { Button } from "@/components/ui/button"
import { Plus, CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from "react"

export function EventsHeader() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Events</h1>
            <p className="text-muted-foreground">Discover and attend events in your community</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.push("/calendars")}
            >
              <CalendarIcon className="w-4 h-4" />
              Calendars
            </Button>
            <Button
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push("/events/create")}
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "upcoming"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "past"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Past
          </button>
        </div>
      </div>
    </div>
  )
}
