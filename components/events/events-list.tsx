"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Event } from "@/lib/types/events"
import { EventCard } from "./event-card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchEvents() {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          calendar:calendars(*)
        `)
        .eq("status", "published")
        .eq("is_public", true)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })

      if (!error && data) {
        setEvents(data as Event[])
      }
      setLoading(false)
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-card rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-2">No Upcoming Events</h3>
          <p className="text-muted-foreground mb-8">You have no upcoming events. Why not host one?</p>
          <Button
            className="gap-2"
            onClick={() => router.push("/events/create")}
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
