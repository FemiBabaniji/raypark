"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BackButton } from "@/components/ui/back-button"
import { Laptop, Palette, Rocket, Users } from "lucide-react"

const communities = [
  {
    id: "tech-innovators-sf",
    name: "Tech Innovators SF",
    memberCount: 247,
    icon: Laptop,
    gradient: "from-blue-500/80 to-cyan-500/80",
    description: "Building the future of technology in San Francisco",
  },
  {
    id: "creative-collective-nyc",
    name: "Creative Collective NYC",
    memberCount: 183,
    icon: Palette,
    gradient: "from-green-500/80 to-emerald-500/80",
    description: "Artists, designers, and creative professionals in NYC",
  },
  {
    id: "startup-founders-la",
    name: "Startup Founders LA",
    memberCount: 156,
    icon: Rocket,
    gradient: "from-pink-500/80 to-orange-500/80",
    description: "Entrepreneurial community in Los Angeles",
  },
  {
    id: "black-entrepreneurship-alliance",
    name: "Black Entrepreneurship Alliance",
    memberCount: 312,
    icon: Users,
    gradient: "from-purple-500/80 to-indigo-500/80",
    description: "Empowering Black entrepreneurs and business leaders",
  },
]

export default function NetworkPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden">
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between"
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0, 1] }}
      >
        <div className="flex items-center space-x-4">
          <BackButton
            onClick={() => router.push("/dashboard")}
            className="text-neutral-400 hover:text-white transition-colors"
          />

          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-neutral-400">pathwai</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-sm text-neutral-500 hover:text-white transition-colors duration-300">ai</button>
          <span className="text-sm text-white font-medium">network</span>
          <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">U</span>
          </div>
        </div>
      </motion.nav>

      <div className="pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Community</h1>
          <p className="text-neutral-400 text-lg">
            Select the community you're part of to access your network and events
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {communities.map((community, index) => {
              const IconComponent = community.icon
              return (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/network/${community.id}`)}
                  className="relative group cursor-pointer"
                >
                  <div
                    className={`
                    relative h-48 rounded-3xl overflow-hidden
                    bg-gradient-to-br ${community.gradient}
                    backdrop-blur-xl border border-white/10
                    hover:scale-[1.02] transition-all duration-300
                    flex flex-col items-center justify-center p-8
                  `}
                  >
                    <div className="absolute inset-0 bg-black/20"></div>

                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2">{community.name}</h3>

                      <p className="text-white/90 text-sm mb-3">{community.description}</p>

                      <div className="text-white/80 text-sm font-medium">{community.memberCount} active members</div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
