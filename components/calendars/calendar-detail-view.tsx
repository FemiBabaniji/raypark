"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Calendar, Event } from "@/lib/types/events"
import { Button } from "@/components/ui/button"
import { Settings, Users, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { EventCard } from "@/components/events/event-card"
import { SubscribeButton } from "./subscribe-button"

interface CalendarDetailViewProps {
  slug: string
}

export function CalendarDetailView({ slug }: CalendarDetailViewProps) {
  const [calendar, setCalendar] = useState<Calendar | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchCalendar() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { data: calData, error } = await supabase
        .from("calendars")
        .select("*")
        .eq("slug", slug)
        .single()

      if (error || !calData) {
        setLoading(false)
        return
      }

      setCalendar(calData)
      setIsOwner(user?.id === calData.user_id)

      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("calendar_id", calData.id)
        .eq("status", "published")
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })

      if (eventsData) {
        setEvents(eventsData)
      }

      setLoading(false)
    }

    fetchCalendar()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!calendar) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Calendar not found</h2>
          <Button onClick={() => router.push("/calendars")}>Back to Calendars</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="relative border-b border-border"
        style={{
          background:
            calendar.tint_color.startsWith("linear")
              ? calendar.tint_color
              : `linear-gradient(135deg, ${calendar.tint_color}20, ${calendar.tint_color}40)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                {calendar.icon_emoji}
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{calendar.name}</h1>
                {calendar.location_type === "city" && calendar.location_city && (
                  <p className="text-muted-foreground">{calendar.location_city}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isOwner ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => router.push(`/calendars/${slug}/settings`)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => router.push(`/calendars/${slug}/team`)}
                  >
                    <Users className="w-4 h-4" />
                    Team
                  </Button>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => router.push("/events/create")}
                  >
                    <Plus className="w-4 h-4" />
                    Create Event
                  </Button>
                </>
              ) : (
                <SubscribeButton calendarId={calendar.id} calendarName={calendar.name} />
              )}
            </div>
          </div>

          {calendar.description && (
            <p className="text-muted-foreground text-lg max-w-3xl">{calendar.description}</p>
          )}
        </div>
      </div>

      {/* Events */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/events/create")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground mb-4">No upcoming events</p>
            {isOwner && (
              <Button onClick={() => router.push("/events/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={{ ...event, calendar }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
