"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Calendar } from "@/lib/types/events"
import { Button } from "@/components/ui/button"
import { Plus, CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { OnboardingCarousel } from "./onboarding-carousel"

export function CalendarsView() {
  const [myCalendars, setMyCalendars] = useState<Calendar[]>([])
  const [subscribedCalendars, setSubscribedCalendars] = useState<Calendar[]>([])
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchCalendars() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      // Fetch user's own calendars
      const { data: myData } = await supabase
        .from("calendars")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (myData) {
        setMyCalendars(myData)
        
        // Check if first time user
        if (myData.length === 0) {
          setShowOnboarding(true)
        }
      }

      // Fetch subscribed calendars
      const { data: subscriptions } = await supabase
        .from("calendar_subscribers")
        .select("calendar:calendars(*)")
        .eq("user_id", user.id)

      if (subscriptions) {
        setSubscribedCalendars(subscriptions.map(sub => sub.calendar).filter(Boolean) as Calendar[])
      }

      setLoading(false)
    }

    fetchCalendars()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Calendars</h1>
            <Button onClick={() => router.push("/calendars/create")} className="gap-2">
              <Plus className="w-4 h-4" />
              Create
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Onboarding Carousel */}
        {showOnboarding && (
          <div className="mb-12">
            <OnboardingCarousel onComplete={() => setShowOnboarding(false)} />
          </div>
        )}

        {/* My Calendars */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">My Calendars</h2>
            {myCalendars.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => router.push("/calendars/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            )}
          </div>

          {myCalendars.length === 0 ? (
            <div className="floating-card rounded-2xl p-12 text-center">
              <div className="monochrome-icon w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Calendars</h3>
              <p className="text-muted-foreground mb-6">You are not an admin of any calendars.</p>
              <Button onClick={() => router.push("/calendars/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Calendar
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCalendars.map((calendar) => (
                <CalendarCard key={calendar.id} calendar={calendar} />
              ))}
            </div>
          )}
        </div>

        {/* Subscribed Calendars */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Subscribed Calendars</h2>

          {subscribedCalendars.length === 0 ? (
            <div className="floating-card rounded-2xl p-12 text-center">
              <div className="monochrome-icon w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Subscriptions</h3>
              <p className="text-muted-foreground">You have not subscribed to any calendars.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscribedCalendars.map((calendar) => (
                <CalendarCard key={calendar.id} calendar={calendar} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CalendarCard({ calendar }: { calendar: Calendar }) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/calendars/${calendar.slug}`)}
      className="group cursor-pointer floating-card rounded-2xl overflow-hidden"
    >
      {/* Cover */}
      <div
        className="h-32 relative"
        style={{
          background: `linear-gradient(135deg, ${calendar.tint_color}20, ${calendar.tint_color}40)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">{calendar.icon_emoji}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {calendar.name}
        </h3>
        {calendar.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{calendar.description}</p>
        )}
        <div className="text-xs text-muted-foreground">
          {calendar.location_type === "city" && calendar.location_city && (
            <span>{calendar.location_city}</span>
          )}
          {calendar.location_type === "global" && <span>Global</span>}
        </div>
      </div>
    </div>
  )
}
