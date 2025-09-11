"use client"

import { ArrowLeft } from "lucide-react"

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
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      initials: "JD",
      name: "John Doe",
      title: "Data Scientist",
      email: "john@datascience.edu",
      location: "Boston, MA",
      gradient: "from-emerald-500 to-green-500",
    },
    {
      initials: "SC",
      name: "Sarah Chen",
      title: "Frontend Developer",
      email: "sarah@startuptech.io",
      location: "San Francisco, CA",
      gradient: "from-orange-500 to-red-500",
    },
    {
      initials: "MR",
      name: "Mike Rodriguez",
      title: "Product Manager",
      email: "mike@innovationlabs.com",
      location: "Austin, TX",
      gradient: "from-zinc-400 to-zinc-600",
    },
    {
      initials: "AT",
      name: "Alex Thompson",
      title: "Software Engineer",
      email: "alex@codesolutions.com",
      location: "Seattle, WA",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      initials: "LM",
      name: "Lisa Martinez",
      title: "UX Researcher",
      email: "lisa@researchstudio.co",
      location: "Portland, OR",
      gradient: "from-emerald-500 to-green-500",
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-900 pt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setNetworkView("detail")}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-lg text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
        </div>

        {/* Event Header */}
        <div className={`bg-gradient-to-br ${selectedEvent?.gradient} rounded-lg p-8 mb-8 text-center text-white`}>
          <h1 className="text-4xl mb-4">{selectedEvent?.title}</h1>
          <p className="text-lg mb-6 opacity-90">
            {selectedEvent?.date} • {selectedEvent?.time} • {selectedEvent?.location}
          </p>

          <div className="flex items-center justify-center gap-4">
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">RSVP Now</button>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
              Add to Calendar
            </button>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
              Share Event
            </button>
          </div>
        </div>

        {/* Event Attendees */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <h2 className="text-xl text-white">Event Attendees</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {attendees.map((attendee, index) => (
              <div key={index} className={`bg-gradient-to-br ${attendee.gradient} rounded-lg p-4 text-white relative`}>
                {/* Icon in top right */}
                <div className="absolute top-3 right-3 w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>

                {/* Large Initials */}
                <div className="text-3xl mb-3">{attendee.initials}</div>

                {/* Name and Title */}
                <h3 className="text-sm mb-1">{attendee.name}</h3>
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
