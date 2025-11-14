"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, MapPin, Globe, Ticket, CheckCircle2 } from 'lucide-react'
import type { Calendar as CalendarType } from "@/lib/types/events"

export function CreateEventForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [calendars, setCalendars] = useState<CalendarType[]>([])
  const [selectedCalendar, setSelectedCalendar] = useState<string>("")
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    calendarId: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    timezone: "America/Toronto",
    locationType: "offline" as "offline" | "virtual" | "tbd",
    locationAddress: "",
    locationLink: "",
    isPublic: true,
    ticketName: "General Admission",
    ticketPrice: "0",
    ticketCapacity: "",
    requireApproval: false,
  })

  useEffect(() => {
    async function fetchCalendars() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data } = await supabase
        .from("calendars")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (data && data.length > 0) {
        setCalendars(data)
        setSelectedCalendar(data[0].id)
        setFormData(prev => ({ ...prev, calendarId: data[0].id }))
      }
    }

    fetchCalendars()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create an event",
          variant: "destructive",
        })
        return
      }

      // Combine date and time
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)

      // Create event
      const { data: event, error: eventError } = await supabase
        .from("events")
        .insert({
          calendar_id: selectedCalendar,
          created_by: user.id,
          name: formData.name,
          description: formData.description,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          timezone: formData.timezone,
          location_type: formData.locationType,
          location_address: formData.locationType === "offline" ? formData.locationAddress : null,
          location_link: formData.locationType === "virtual" ? formData.locationLink : null,
          is_public: formData.isPublic,
          status: "published",
          theme: "minimal",
        })
        .select()
        .single()

      if (eventError) throw eventError

      // Create ticket
      await supabase.from("event_tickets").insert({
        event_id: event.id,
        name: formData.ticketName,
        price_cents: parseInt(formData.ticketPrice) * 100,
        capacity: formData.ticketCapacity ? parseInt(formData.ticketCapacity) : null,
        require_approval: formData.requireApproval,
      })

      toast({
        title: "Event created successfully",
        description: "Your event has been published",
      })

      router.push(`/events/${event.id}`)
    } catch (error) {
      console.error("[v0] Error creating event:", error)
      toast({
        title: "Error creating event",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (calendars.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-2xl border border-border">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No Calendar Found</h3>
        <p className="text-muted-foreground mb-6">You need to create a calendar first</p>
        <Button onClick={() => router.push("/calendars/create")}>
          Create Calendar
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Calendar Selection */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <Label className="text-base font-semibold mb-4 block">Calendar</Label>
        <select
          value={selectedCalendar}
          onChange={(e) => {
            setSelectedCalendar(e.target.value)
            setFormData({ ...formData, calendarId: e.target.value })
          }}
          className="w-full bg-background border border-input rounded-lg px-4 py-3 text-foreground"
        >
          {calendars.map((cal) => (
            <option key={cal.id} value={cal.id}>
              {cal.icon_emoji} {cal.name}
            </option>
          ))}
        </select>
      </div>

      {/* Event Details */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <h2 className="text-lg font-semibold">Event Details</h2>
        
        <div>
          <Label htmlFor="name">Event Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="AI & Machine Learning Meetup"
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tell attendees what your event is about..."
            rows={4}
            className="mt-2"
          />
        </div>
      </div>

      {/* Date & Time */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Date & Time</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Event Location</h2>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={formData.locationType === "offline" ? "default" : "outline"}
            onClick={() => setFormData({ ...formData, locationType: "offline" })}
            className="flex-1"
          >
            Offline
          </Button>
          <Button
            type="button"
            variant={formData.locationType === "virtual" ? "default" : "outline"}
            onClick={() => setFormData({ ...formData, locationType: "virtual" })}
            className="flex-1"
          >
            Virtual
          </Button>
          <Button
            type="button"
            variant={formData.locationType === "tbd" ? "default" : "outline"}
            onClick={() => setFormData({ ...formData, locationType: "tbd" })}
            className="flex-1"
          >
            TBD
          </Button>
        </div>

        {formData.locationType === "offline" && (
          <div>
            <Label htmlFor="locationAddress">Address</Label>
            <Input
              id="locationAddress"
              value={formData.locationAddress}
              onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
              placeholder="123 Main St, Toronto, ON"
              className="mt-2"
            />
          </div>
        )}

        {formData.locationType === "virtual" && (
          <div>
            <Label htmlFor="locationLink">Meeting Link</Label>
            <Input
              id="locationLink"
              value={formData.locationLink}
              onChange={(e) => setFormData({ ...formData, locationLink: e.target.value })}
              placeholder="https://zoom.us/j/..."
              className="mt-2"
            />
          </div>
        )}
      </div>

      {/* Tickets */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Tickets</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="ticketName">Ticket Name</Label>
            <Input
              id="ticketName"
              value={formData.ticketName}
              onChange={(e) => setFormData({ ...formData, ticketName: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="ticketPrice">Price (CAD)</Label>
            <Input
              id="ticketPrice"
              type="number"
              value={formData.ticketPrice}
              onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
              min="0"
              step="0.01"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="ticketCapacity">Capacity</Label>
            <Input
              id="ticketCapacity"
              type="number"
              value={formData.ticketCapacity}
              onChange={(e) => setFormData({ ...formData, ticketCapacity: e.target.value })}
              placeholder="Unlimited"
              min="1"
              className="mt-2"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.requireApproval}
            onChange={(e) => setFormData({ ...formData, requireApproval: e.target.checked })}
            className="w-5 h-5 rounded border-input"
          />
          <span className="text-sm text-muted-foreground">Require approval for registrations</span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="gap-2 min-w-40"
        >
          {loading ? (
            "Creating..."
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Create Event
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
