"use client"

import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"

interface Event {
  title: string
  date: string
  time: string
  location: string
  description: string
  attending: number
  gradient: string
}

interface EventDetailProps {
  selectedEvent: Event
  setNetworkView: (view: string) => void
}

export function EventDetail({ selectedEvent, setNetworkView }: EventDetailProps) {
  const attendees = [
    {
      initials: "JW",
      name: "Jenny Wilson",
      title: "Digital Product Designer",
      email: "jenny@acme.com",
      location: "New York, NY",
      gradient: "from-cyan-500/70 to-blue-500/70",
    },
    {
      initials: "JD",
      name: "John Doe",
      title: "Data Scientist",
      email: "john@datascience.edu",
      location: "Boston, MA",
      gradient: "from-emerald-500/70 to-green-500/70",
    },
    {
      initials: "SC",
      name: "Sarah Chen",
      title: "Frontend Developer",
      email: "sarah@startuptech.io",
      location: "San Francisco, CA",
      gradient: "from-orange-500/70 to-red-500/70",
    },
    {
      initials: "MR",
      name: "Mike Rodriguez",
      title: "Product Manager",
      email: "mike@innovationlabs.com",
      location: "Austin, TX",
      gradient: "from-neutral-500/70 to-neutral-600/70",
    },
    {
      initials: "AT",
      name: "Alex Thompson",
      title: "Software Engineer",
      email: "alex@codesolutions.com",
      location: "Seattle, WA",
      gradient: "from-cyan-500/70 to-blue-500/70",
    },
    {
      initials: "LM",
      name: "Lisa Martinez",
      title: "UX Researcher",
      email: "lisa@researchstudio.co",
      location: "Portland, OR",
      gradient: "from-emerald-500/70 to-green-500/70",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-950 pt-16">
      <div className="absolute top-6 left-6">
        <BackButton onClick={() => setNetworkView("detail")} aria-label="Back to community" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Event Header */}
        <div
          className={`bg-gradient-to-br ${selectedEvent?.gradient} backdrop-blur-xl rounded-3xl p-8 mb-8 text-center text-white`}
        >
          <h1 className="text-4xl font-bold mb-4">{selectedEvent?.title}</h1>
          <p className="text-lg mb-6 text-white/90">
            {selectedEvent?.date} • {selectedEvent?.time} • {selectedEvent?.location}
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl">RSVP Now</Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl">
              Add to Calendar
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl">
              Share Event
            </Button>
          </div>
        </div>

        {/* Event Attendees */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 bg-neutral-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 border border-neutral-400 rounded-sm"></div>
            </div>
            <h2 className="text-xl font-bold text-white">Event Attendees</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {attendees.map((attendee, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${attendee.gradient} backdrop-blur-xl rounded-3xl p-6 text-white relative hover:scale-105 transition-all duration-300`}
              >
                {/* Icon in top right */}
                <div className="absolute top-3 right-3 w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>

                {/* Large Initials */}
                <div className="text-3xl font-bold mb-3">{attendee.initials}</div>

                {/* Name and Title */}
                <h3 className="text-sm font-medium mb-1">{attendee.name}</h3>
                <p className="text-xs text-white/80 mb-3">{attendee.title}</p>

                {/* Contact Info */}
                <div className="space-y-1 text-xs text-white/70">
                  <p>{attendee.email}</p>
                  <p>{attendee.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
