"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Loader2, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CreateEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  communityId: string
  cohorts?: Array<{ id: string; name: string }>
}

export function CreateEventModal({ open, onOpenChange, communityId, cohorts = [] }: CreateEventModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [startTime, setStartTime] = useState("09:00")
  const [endDate, setEndDate] = useState<Date>()
  const [endTime, setEndTime] = useState("10:00")
  const [location, setLocation] = useState("")
  const [virtualLink, setVirtualLink] = useState("")
  const [eventType, setEventType] = useState<string>("general")
  const [capacity, setCapacity] = useState<string>("")
  const [selectedCohort, setSelectedCohort] = useState<string>("")
  const [rsvpRequired, setRsvpRequired] = useState<string>("true")
  const [visibility, setVisibility] = useState<string>("members")

  const resetForm = () => {
    setName("")
    setDescription("")
    setStartDate(undefined)
    setStartTime("09:00")
    setEndDate(undefined)
    setEndTime("10:00")
    setLocation("")
    setVirtualLink("")
    setEventType("general")
    setCapacity("")
    setSelectedCohort("")
    setRsvpRequired("true")
    setVisibility("members")
    setError(null)
    setSuccess(false)
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation
    if (!name.trim()) {
      setError("Event name is required")
      return
    }

    if (!startDate) {
      setError("Start date is required")
      return
    }

    setLoading(true)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      // Combine date and time
      const startDateTime = new Date(startDate)
      const [startHour, startMinute] = startTime.split(":")
      startDateTime.setHours(Number.parseInt(startHour), Number.parseInt(startMinute))

      let endDateTime = null
      if (endDate) {
        endDateTime = new Date(endDate)
        const [endHour, endMinute] = endTime.split(":")
        endDateTime.setHours(Number.parseInt(endHour), Number.parseInt(endMinute))
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("You must be logged in to create events")
        setLoading(false)
        return
      }

      // Insert event
      const { error: insertError } = await supabase.from("events").insert({
        community_id: communityId,
        cohort_id: selectedCohort || null,
        name: name.trim(),
        description: description.trim() || null,
        start_date: startDateTime.toISOString(),
        end_date: endDateTime?.toISOString() || null,
        location: location.trim() || null,
        virtual_meeting_link: virtualLink.trim() || null,
        event_type: eventType,
        capacity: capacity ? Number.parseInt(capacity) : null,
        rsvp_required: rsvpRequired === "true",
        visibility: visibility,
        status: "upcoming",
        created_by: user.id,
      })

      if (insertError) {
        console.error("[v0] Error creating event:", insertError)
        throw new Error("Failed to create event")
      }

      setSuccess(true)
      setTimeout(() => {
        handleClose()
        window.location.reload()
      }, 1500)
    } catch (err) {
      console.error("[v0] Create event error:", err)
      setError(err instanceof Error ? err.message : "Failed to create event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a1a1d] border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Event</DialogTitle>
          <DialogDescription className="text-white/60">
            Create a new event for your community members to RSVP and attend.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/90">
              Event Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Monthly Networking Mixer"
              disabled={loading}
              className="bg-white/[0.05] border-white/10 text-white"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white/90">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what attendees can expect..."
              rows={3}
              disabled={loading}
              className="bg-white/[0.05] border-white/10 text-white resize-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/90">Start Date & Time *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/[0.05] border-white/10 text-white hover:bg-white/[0.08]",
                      !startDate && "text-white/50",
                    )}
                    disabled={loading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#1a1a1d] border-white/10">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={loading}
                className="bg-white/[0.05] border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">End Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/[0.05] border-white/10 text-white hover:bg-white/[0.08]",
                      !endDate && "text-white/50",
                    )}
                    disabled={loading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#1a1a1d] border-white/10">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate && date < startDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={loading}
                className="bg-white/[0.05] border-white/10 text-white"
              />
            </div>
          </div>

          {/* Location & Virtual Link */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white/90">
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="123 Main St, City"
                disabled={loading}
                className="bg-white/[0.05] border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="virtualLink" className="text-white/90">
                Virtual Meeting Link
              </Label>
              <Input
                id="virtualLink"
                value={virtualLink}
                onChange={(e) => setVirtualLink(e.target.value)}
                placeholder="https://zoom.us/..."
                disabled={loading}
                className="bg-white/[0.05] border-white/10 text-white"
              />
            </div>
          </div>

          {/* Event Type & Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventType" className="text-white/90">
                Event Type
              </Label>
              <Select value={eventType} onValueChange={setEventType} disabled={loading}>
                <SelectTrigger className="bg-white/[0.05] border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1d] border-white/10">
                  <SelectItem value="general" className="text-white">
                    General
                  </SelectItem>
                  <SelectItem value="workshop" className="text-white">
                    Workshop
                  </SelectItem>
                  <SelectItem value="networking" className="text-white">
                    Networking
                  </SelectItem>
                  <SelectItem value="social" className="text-white">
                    Social
                  </SelectItem>
                  <SelectItem value="speaker" className="text-white">
                    Speaker Event
                  </SelectItem>
                  <SelectItem value="other" className="text-white">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-white/90">
                Capacity (Optional)
              </Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="50"
                min="1"
                disabled={loading}
                className="bg-white/[0.05] border-white/10 text-white"
              />
            </div>
          </div>

          {/* Cohort & Visibility */}
          <div className="grid grid-cols-2 gap-4">
            {cohorts.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="cohort" className="text-white/90">
                  Cohort (Optional)
                </Label>
                <Select value={selectedCohort} onValueChange={setSelectedCohort} disabled={loading}>
                  <SelectTrigger className="bg-white/[0.05] border-white/10 text-white">
                    <SelectValue placeholder="All cohorts" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1d] border-white/10">
                    {cohorts.map((cohort) => (
                      <SelectItem key={cohort.id} value={cohort.id} className="text-white">
                        {cohort.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="visibility" className="text-white/90">
                Visibility
              </Label>
              <Select value={visibility} onValueChange={setVisibility} disabled={loading}>
                <SelectTrigger className="bg-white/[0.05] border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1d] border-white/10">
                  <SelectItem value="public" className="text-white">
                    Public
                  </SelectItem>
                  <SelectItem value="members" className="text-white">
                    Members Only
                  </SelectItem>
                  <SelectItem value="cohort" className="text-white">
                    Cohort Only
                  </SelectItem>
                  <SelectItem value="private" className="text-white">
                    Private
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* RSVP Required */}
          <div className="space-y-2">
            <Label htmlFor="rsvpRequired" className="text-white/90">
              RSVP Required
            </Label>
            <Select value={rsvpRequired} onValueChange={setRsvpRequired} disabled={loading}>
              <SelectTrigger className="bg-white/[0.05] border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1d] border-white/10">
                <SelectItem value="true" className="text-white">
                  Yes
                </SelectItem>
                <SelectItem value="false" className="text-white">
                  No
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
              <p className="text-green-400 text-sm">Event created successfully!</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="bg-white/[0.05] hover:bg-white/[0.08] text-white border-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
