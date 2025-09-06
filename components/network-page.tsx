"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"

/**
 * NetworkPage
 * Clean, isolated structure of the "Network" view from your original file.
 * - No local state
 * - Pure presentational components
 * - Re-usable <PersonCard /> for each person
 */

export type Person = {
  id: string
  name: string
  title: string
  org: string
  avatarUrl?: string
  initials: string
  location: string
  email: string
  handle: string
  tags: string[] // e.g., ["React", "TypeScript", "CSS"]
  variant?: "purple" | "blue" | "emerald" | "pink" | "orange"
  /**
   * When true, shows a bottom CTA (e.g., "Connect with …").
   * If undefined/false, no CTA renders.
   */
  showCTA?: boolean
}

export function NetworkPage({
  people,
  onOpenPortfolio, // e.g., (personId) => setCurrentView('dashboard')
  onInvite, // optional: click handler for the Invite card
}: {
  people: Person[]
  onOpenPortfolio?: (personId: string) => void
  onInvite?: () => void
}) {
  return (
    <div className="flex gap-6 p-6 pt-12 mt-4">
      {/* Left: People Grid */}
      <div className="flex-1">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl text-white mb-4">Your Network</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Meet the talented individuals who make our work possible. Each card represents a unique professional with
            their own expertise and background.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {people.map((p) => (
            <PersonCard key={p.id} person={p} onClick={() => onOpenPortfolio?.(p.id)} />
          ))}

          {/* Invite Card */}
          <Card
            className="border-2 border-zinc-600 bg-zinc-800 cursor-pointer hover:border-zinc-500 hover:scale-105 transition-all w-full h-96"
            onClick={onInvite}
          >
            <CardContent className="p-6 h-full flex flex-col items-center justify-center">
              <Plus className="w-16 h-16 text-zinc-400 mb-4" />
              <p className="text-sm text-zinc-400 text-center">Invite</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right: Network Description */}
      <aside className="w-80 ml-auto">
        <div className="bg-zinc-800 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-purple-500 rounded-sm" />
            <span className="text-sm text-white">About The Network</span>
          </div>

          <h4 className="text-lg text-white mb-4">The Entrepreneurship Network</h4>
          <p className="text-sm text-zinc-300 leading-relaxed mb-4">
            A curated community of innovative entrepreneurs, creators, and industry leaders who are building the future.
            Our network connects ambitious professionals across diverse fields, fostering collaboration and knowledge
            sharing.
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed mb-4">
            Members gain access to exclusive opportunities, mentorship programs, and collaborative projects that drive
            meaningful impact in their respective industries.
          </p>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Active Members</span>
              <span className="text-white">150+</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Industries</span>
              <span className="text-white">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Founded</span>
              <span className="text-white">2022</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

// ——————————————————————————————————————————————
// Presentational card used by NetworkPage
// ——————————————————————————————————————————————

function gradientForVariant(v?: Person["variant"]) {
  switch (v) {
    case "blue":
      return "from-blue-400/40 to-blue-600/60"
    case "emerald":
      return "from-green-400/40 to-green-600/60"
    case "pink":
      return "from-rose-400/40 to-rose-600/60"
    case "orange":
      return "from-orange-400/40 to-orange-600/60"
    case "purple":
    default:
      return "from-purple-400/40 to-purple-600/60"
  }
}

export function PersonCard({
  person,
  onClick,
}: {
  person: Person
  onClick?: () => void
}) {
  const grad = gradientForVariant(person.variant)

  return (
    <Card
      className={`bg-gradient-to-br ${grad} backdrop-blur-xl border-none text-white cursor-pointer hover:scale-105 transition-transform w-full h-96 relative overflow-hidden rounded-3xl`}
      onClick={onClick}
    >
      <CardContent className="p-6 h-full flex flex-col relative">
        <div className="absolute top-4 right-4">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-black/60 rounded-full"></div>
            <div className="w-1 h-1 bg-black/60 rounded-full"></div>
            <div className="w-1 h-1 bg-black/60 rounded-full"></div>
          </div>
        </div>

        <div className="flex justify-center mb-6 mt-2">
          <Avatar className="w-20 h-20">
            {person.avatarUrl ? (
              <AvatarImage src={person.avatarUrl || "/placeholder.svg"} className="object-cover w-full h-full" />
            ) : null}
            <AvatarFallback className="bg-white/20 text-black text-lg">{person.initials}</AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center mb-4">
          <h3 className="text-4xl font-bold text-black mb-2">{person.name}</h3>
          <p className="text-lg text-black/80">
            {person.title} at {person.org}
          </p>
        </div>

        <div className="flex-1">
          <div className="space-y-1 mb-4">
            <p className="text-sm text-white">{person.email}</p>
            <p className="text-sm text-white">{person.location}</p>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {person.tags.slice(0, 3).map((t) => (
              <span key={t} className="bg-white/20 text-white text-xs px-2 py-1 rounded-full border border-white/30">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-white/20 text-white text-xs px-3 py-1 rounded-full border border-white/30">
            {person.handle}
          </div>
          <button className="w-8 h-8 bg-white/20 rounded-lg border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

// ——————————————————————————————————————————————
// Example usage
// (remove or replace with your data layer)
// ——————————————————————————————————————————————

export function ExampleNetworkPage() {
  const people: Person[] = [
    {
      id: "jenny",
      name: "Jenny Wilson",
      title: "Digital Product Designer",
      org: "Tech Startup",
      avatarUrl:
        "https://images.unsplash.com/photo-1638727295415-286409421143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBibGFjayUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU2NzgyNDY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      initials: "JW",
      location: "New York, NY",
      email: "jenny@acme.com",
      handle: "@jenny_design",
      tags: ["UI/UX", "Figma", "Prototyping"],
      variant: "purple",
    },
    {
      id: "john",
      name: "John Doe",
      title: "Data Scientist",
      org: "State University",
      avatarUrl:
        "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTY4MzAzMTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      initials: "JD",
      location: "Boston, MA",
      email: "john@datateam.edu",
      handle: "@johndata",
      tags: ["Python", "ML", "Analytics"],
      variant: "blue",
      showCTA: true,
    },
    {
      id: "sarah",
      name: "Sarah Chen",
      title: "Frontend Developer",
      org: "Tech Startup",
      avatarUrl:
        "https://images.unsplash.com/photo-1731419223715-aec6664f9011?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwdGVjaHxlbnwxfHx8fDE3NTY4Mzk3NDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      initials: "SC",
      location: "San Francisco, CA",
      email: "sarah@techstartup.io",
      handle: "@sarahcodes",
      tags: ["React", "TypeScript", "CSS"],
      variant: "emerald",
      showCTA: true,
    },
    {
      id: "maria",
      name: "Maria Garcia",
      title: "Marketing Director",
      org: "Digital Agency",
      avatarUrl:
        "https://images.unsplash.com/photo-1727299781147-c7ab897883a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXNwYW5pYyUyMHByb2Zlc3Npb24lMjBkZXZlbG9wZXJ8ZW58MXx8fHwxNzU2ODQyMTk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      initials: "MG",
      location: "Los Angeles, CA",
      email: "maria@digitalagency.com",
      handle: "@mariamarketing",
      tags: ["Branding", "Social Media", "Growth"],
      variant: "pink",
      showCTA: true,
    },
    {
      id: "mike",
      name: "Mike Rodriguez",
      title: "Product Manager",
      org: "Innovation Labs",
      avatarUrl:
        "https://images.unsplash.com/photo-1724654814378-108c93f5fa54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXNwYW5pYyUyMHByb2Zlc3Npb24lMjBkZXZlbG9wZXJ8ZW58MXx8fHwxNzU2ODM5NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      initials: "MR",
      location: "Austin, TX",
      email: "mike@innovationlabs.com",
      handle: "@mikepn",
      tags: ["Strategy", "Analytics", "Leadership"],
      variant: "orange",
      showCTA: true,
    },
    {
      id: "alex",
      name: "Alex Thompson",
      title: "Software Engineer",
      org: "Tech Solutions",
      avatarUrl:
        "https://images.unsplash.com/photo-1710770563074-6d9cc0d3e338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBibGFjayUyMG1hbiUyMHNvZnR3YXJlfGVufDF8fHx8MTc1NjgzOTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      initials: "AT",
      location: "Seattle, WA",
      email: "alex@techsolutions.com",
      handle: "@alexdev",
      tags: ["Node.js", "AWS", "Docker"],
      variant: "purple",
      showCTA: true,
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <NetworkPage
        people={people}
        onOpenPortfolio={(id) => console.log("open portfolio:", id)}
        onInvite={() => console.log("invite")}
      />
    </div>
  )
}
