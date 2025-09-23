"use client"

import { useRouter } from "next/navigation"
import { BackButton } from "@/components/ui/back-button"
import PostEventCollaboration from "@/components/post-event-collaboration"

const mockConnections = [
  {
    id: "jenny-wilson",
    name: "Jenny Wilson",
    title: "Digital Product Designer",
    company: "Acme Design Studio",
    avatarUrl: "/woman-designer.png",
    matchScore: 94,
    connectedAt: "During event",
    hasDownloadedResume: true,
  },
  {
    id: "alex-rodriguez",
    name: "Alex Rodriguez",
    title: "Full Stack Developer",
    company: "TechStart Solutions",
    matchScore: 87,
    connectedAt: "During event",
    hasDownloadedResume: true,
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    title: "Healthcare Entrepreneur",
    company: "HealthTech AI",
    avatarUrl: "/professional-headshot.png",
    matchScore: 92,
    connectedAt: "During event",
    hasDownloadedResume: false,
  },
  {
    id: "mike-rodriguez",
    name: "Mike Rodriguez",
    title: "Wellness Industry Investor",
    company: "Wellness Fund",
    matchScore: 85,
    connectedAt: "During event",
    hasDownloadedResume: true,
  },
]

export default function PostEventPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <BackButton onClick={() => router.push("/network/bea-founders-connect")} aria-label="Back to community" />
          <div>
            <h1 className="text-2xl font-medium text-white">Post-Event Collaboration</h1>
            <p className="text-zinc-400">Continue building from Founders Connect Mixer</p>
          </div>
        </div>

        <PostEventCollaboration
          eventId="founders-connect-mixer"
          eventTitle="Founders Connect Mixer"
          connections={mockConnections}
        />
      </div>
    </div>
  )
}
