"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Event, EventTicket } from "@/lib/types/events"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Users, Ticket, ExternalLink, Share2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { useRouter } from 'next/navigation'

interface EventDetailProps {
  eventId: string
}

export function EventDetail({ eventId }: EventDetailProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [tickets, setTickets] = useState<EventTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function fetchEvent() {
      const supabase = createClient()
      
      const { data: eventData, error } = await supabase
        .from("events")
        .select(`
          *,
          calendar:calendars(*)
        `)
        .eq("id", eventId)
        .single()

      if (!error && eventData) {
        setEvent(eventData as Event)
        
        // Fetch tickets
        const { data: ticketsData } = await supabase
          .from("event_tickets")
          .select("*")
          .eq("event_id", eventId)
        
        if (ticketsData) {
          setTickets(ticketsData)
        }
      }
      
      setLoading(false)
    }

    fetchEvent()
  }, [eventId])

  const handleRegister = async (ticketId: string) => {
    setRegistering(true)
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to register for this event",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      const { error } = await supabase
        .from("event_registrations")
        .insert({
          event_id: eventId,
          ticket_id: ticketId,
          user_id: user.id,
          email: user.email!,
          status: "approved",
        })

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already registered",
            description: "You are already registered for this event",
            variant: "destructive",
          })
        } else {
          throw error
        }
      } else {
        toast({
          title: "Registration successful",
          description: "You're all set for this event!",
        })
      }
    } catch (error) {
      console.error("[v0] Error registering:", error)
      toast({
        title: "Registration failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-96 bg-card animate-pulse" />
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-4">
          <div className="h-8 bg-card rounded animate-pulse" />
          <div className="h-4 bg-card rounded animate-pulse w-3/4" />
          <div className="h-32 bg-card rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Event not found</h2>
          <Button onClick={() => router.push("/events")}>Back to Events</Button>
        </div>
      </div>
    )
  }

  const startDate = new Date(event.start_time)
  const endDate = new Date(event.end_time)

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
        {event.cover_image_url ? (
          <Image
            src={event.cover_image_url || "/placeholder.svg"}
            alt={event.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-9xl opacity-30">
              {event.calendar?.icon_emoji || "📅"}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-card rounded-2xl border border-border p-8 mb-8">
          {/* Calendar Badge */}
          {event.calendar && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{event.calendar.icon_emoji}</span>
              <span className="font-medium text-muted-foreground">{event.calendar.name}</span>
            </div>
          )}

          {/* Event Title */}
          <h1 className="text-4xl font-bold text-foreground mb-6">{event.name}</h1>

          {/* Event Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-1" />
              <div>
                <p className="font-medium">{format(startDate, "EEEE, MMMM d, yyyy")}</p>
                <p className="text-sm text-muted-foreground">
                  {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")} {event.timezone}
                </p>
              </div>
            </div>

            {event.location_type === "offline" && event.location_address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium">In Person</p>
                  <p className="text-sm text-muted-foreground">{event.location_address}</p>
                </div>
              </div>
            )}

            {event.location_type === "virtual" && event.location_link && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium">Virtual Event</p>
                  <a
                    href={event.location_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    Join Meeting <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          {/* Tickets Section */}
          {tickets.length > 0 && (
            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold mb-6">Tickets</h2>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between bg-background rounded-xl p-6 border border-border"
                  >
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{ticket.name}</h3>
                      <p className="text-2xl font-bold text-foreground">
                        {ticket.price_cents === 0 ? "Free" : `$${(ticket.price_cents / 100).toFixed(2)}`}
                      </p>
                      {ticket.capacity && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Capacity: {ticket.capacity}
                        </p>
                      )}
                    </div>
                    <Button
                      size="lg"
                      onClick={() => handleRegister(ticket.id)}
                      disabled={registering}
                      className="min-w-32"
                    >
                      {registering ? "Registering..." : "Register"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
