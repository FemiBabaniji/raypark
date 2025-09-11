"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BackButton } from "@/components/ui/back-button"
import { useRouter } from "next/navigation"

interface Community {
  name: string
  subtitle: string
  members: string
  gradient: string
  icon: string
}

interface CommunitySelectionProps {
  setSelectedCommunity: (community: Community) => void
  setNetworkView: (view: string) => void
}

export function CommunitySelection({ setSelectedCommunity, setNetworkView }: CommunitySelectionProps) {
  const router = useRouter()

  const communities = [
    {
      name: "Tech Innovators SF",
      subtitle: "Community Hub • Announcements & Events",
      members: "247 active members",
      gradient: "from-blue-600 to-cyan-600",
      icon: "💻",
    },
    {
      name: "Creative Collective NYC",
      subtitle: "Community Hub • Announcements & Events",
      members: "183 active members",
      gradient: "from-emerald-600 to-green-600",
      icon: "🎨",
    },
    {
      name: "Startup Founders LA",
      subtitle: "Community Hub • Announcements & Events",
      members: "156 active members",
      gradient: "from-orange-500 to-red-500",
      icon: "🚀",
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-900 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="absolute top-6 left-6">
          <BackButton onClick={() => router.push("/dashboard")} aria-label="Back to dashboard" />
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl text-white mb-6">Choose Your Community</h1>
          <p className="text-zinc-400 text-xl">Select the community you're part of to access your network and events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {communities.map((community, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${community.gradient} border-none text-white cursor-pointer hover:scale-105 transition-transform h-80 relative overflow-hidden`}
              onClick={() => {
                setSelectedCommunity(community)
                setNetworkView("detail")
              }}
            >
              <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-6">{community.icon}</div>
                <h3 className="text-2xl mb-4">{community.name}</h3>
                <p className="text-white/80 text-sm">{community.members}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
