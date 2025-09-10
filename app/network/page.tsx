"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Laptop, Palette, Rocket, Users } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"

const communities = [
  {
    id: "tech-innovators-sf",
    name: "Tech Innovators SF",
    memberCount: 247,
    icon: Laptop,
    gradient: "from-blue-500/70 to-cyan-500/70",
    description: "Building the future of technology in San Francisco",
  },
  {
    id: "creative-collective-nyc",
    name: "Creative Collective NYC",
    memberCount: 183,
    icon: Palette,
    gradient: "from-green-500/70 to-emerald-500/70",
    description: "Artists, designers, and creative professionals in NYC",
  },
  {
    id: "startup-founders-la",
    name: "Startup Founders LA",
    memberCount: 156,
    icon: Rocket,
    gradient: "from-orange-500/70 to-red-500/70",
    description: "Entrepreneurial community in Los Angeles",
  },
  {
    id: "black-entrepreneurship-alliance",
    name: "Black Entrepreneurship Alliance",
    memberCount: 312,
    icon: Users,
    gradient: "from-purple-500/70 to-blue-500/70",
    description: "Empowering Black entrepreneurs and business leaders",
  },
]

export default function NetworkPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="absolute top-6 left-6">
          <BackButton onClick={() => router.push("/dashboard")} aria-label="Back to dashboard" />
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-zinc-800 rounded-3xl flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 via-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-zinc-900 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-white text-xl font-medium leading-tight mb-4">
            Choose Your
            <br />
            Community
          </h1>
          <p className="text-zinc-500 text-sm">Select the community you're part of to access your network and events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {communities.map((community, index) => {
            const IconComponent = community.icon
            return (
              <motion.button
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(`/network/${community.id}`)}
                className={`bg-gradient-to-br ${community.gradient} backdrop-blur-xl rounded-3xl p-8 text-white hover:scale-105 transition-all duration-300 aspect-square flex flex-col items-center justify-center text-center relative overflow-hidden`}
              >
                <div className="mb-4">
                  <IconComponent className="w-12 h-12 text-white/90" />
                </div>

                <h3 className="text-xl font-medium text-white mb-2 leading-tight">{community.name}</h3>

                <p className="text-white/80 text-sm">{community.memberCount} active members</p>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
