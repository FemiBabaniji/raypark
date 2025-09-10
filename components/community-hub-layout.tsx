"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Plus, BarChart3, Rocket, Activity, ChevronRight, X } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useUserSkills } from "@/context/use-user-skills"

// Node colors with iridescent/holographic effects
const nodeColors = [
  {
    bg: "from-blue-400 via-cyan-300 to-blue-500",
    shadow: "shadow-blue-500/30",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
  },
  {
    bg: "from-purple-400 via-pink-300 to-purple-500",
    shadow: "shadow-purple-500/30",
    glow: "shadow-[0_0_30px_rgba(147,51,234,0.3)]",
  },
  {
    bg: "from-emerald-400 via-green-300 to-emerald-500",
    shadow: "shadow-emerald-500/30",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
  },
  {
    bg: "from-amber-400 via-yellow-300 to-orange-500",
    shadow: "shadow-amber-500/30",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]",
  },
  {
    bg: "from-rose-400 via-pink-300 to-rose-500",
    shadow: "shadow-rose-500/30",
    glow: "shadow-[0_0_30px_rgba(244,63,94,0.3)]",
  },
  {
    bg: "from-indigo-400 via-blue-300 to-indigo-500",
    shadow: "shadow-indigo-500/30",
    glow: "shadow-[0_0_30px_rgba(99,102,241,0.3)]",
  },
]

// Full User Card Modal Component
const UserCardModal = ({
  isOpen,
  onClose,
  selectedColor = 1, // Default to purple
  name,
  selectedRole,
  selectedIndustry,
  skills,
}: {
  isOpen: boolean
  onClose: () => void
  selectedColor?: number
  name: string
  selectedRole?: string
  selectedIndustry?: string
  skills: string[]
}) => {
  const color = nodeColors[selectedColor]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* User Card */}
            <div className="w-80 h-80 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: "30px 30px",
                  }}
                />
              </div>

              {/* User node in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                  className={`
                    w-32 h-32 rounded-full bg-gradient-to-br ${color.bg} 
                    ${color.shadow} ${color.glow}
                    border-2 border-white/30 relative overflow-hidden
                  `}
                >
                  {/* Inner highlight */}
                  <div className="absolute inset-2 rounded-full bg-white/20" />

                  {/* Center dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/90 rounded-full" />
                  </div>

                  {/* Holographic effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-60" />
                </motion.div>
              </div>

              {/* Name section */}
              {name && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute bottom-16 left-0 right-0 text-center"
                >
                  <div className="text-white/90 text-lg font-medium px-4 truncate">{name}</div>
                </motion.div>
              )}

              {/* Role section */}
              <AnimatePresence>
                {selectedRole && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="absolute bottom-10 left-0 right-0 text-center"
                  >
                    <div className="text-white/70 text-sm px-4 truncate">{selectedRole}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Industry section */}
              <AnimatePresence>
                {selectedIndustry && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="absolute bottom-4 left-0 right-0 text-center"
                  >
                    <div className="text-white/60 text-xs px-4 truncate">{selectedIndustry}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Skills section */}
              <AnimatePresence>
                {skills.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="absolute top-4 left-4 right-4"
                  >
                    <div className="text-white/60 text-xs mb-2">Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {skills.slice(0, 3).map((skill, index) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs"
                        >
                          {skill}
                        </motion.div>
                      ))}
                      {skills.length > 3 && (
                        <div className="bg-white/10 text-white/60 px-2 py-1 rounded-full text-xs">
                          +{skills.length - 3}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface NetworkProject {
  id: string
  title: string
  author: string
  role: string
  company: string
  teamCount: number
  isNew?: boolean
  icon: React.ReactNode
  bgColor: string
}

interface FeedItem {
  id: string
  message: string
  timestamp: string
}

export default function HomeTab() {
  // User data from auth context
  const { user } = useAuth()
  const { userSkills } = useUserSkills()
  const [showUserCard, setShowUserCard] = useState(false)

  // Mock data for user communities
  const communities = [
    { id: "c1", name: "AI Builders Collective", role: "Member" },
    { id: "c2", name: "Startup Founders Network", role: "Admin" },
    { id: "c3", name: "Product Leaders Circle", role: "Member" },
  ]

  // Mock data for feed
  const [following] = useState<FeedItem[]>([
    { id: "f1", message: "sarah shared insights on ai infrastructure", timestamp: "2h ago" },
    { id: "f2", message: "alex launched a new sustainability project", timestamp: "5h ago" },
    { id: "f3", message: "jordan joined the founders collective", timestamp: "1d ago" },
  ])

  // Mock data for network projects
  const [networkProjects] = useState<NetworkProject[]>([
    {
      id: "1",
      title: "AI-Powered Analytics Platform",
      author: "Sarah Johnson",
      role: "Product Manager",
      company: "TechVision",
      teamCount: 3,
      isNew: true,
      icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
      bgColor: "from-blue-500/20 to-blue-600/20",
    },
    {
      id: "2",
      title: "Sustainable Supply Chain Solution",
      author: "Michael Chen",
      role: "Founder",
      company: "GreenChain",
      teamCount: 2,
      isNew: true,
      icon: <Rocket className="w-5 h-5 text-orange-400" />,
      bgColor: "from-orange-500/20 to-orange-600/20",
    },
    {
      id: "3",
      title: "Remote Healthcare Platform",
      author: "Priya Patel",
      role: "Healthcare Consultant",
      company: "MedConnect",
      teamCount: 5,
      icon: <Activity className="w-5 h-5 text-purple-400" />,
      bgColor: "from-purple-500/20 to-purple-600/20",
    },
  ])

  const stats = [
    { label: "connections", value: "127", icon: Users, change: "+12%" },
    { label: "projects", value: "8", icon: Plus, change: "+3" },
    { label: "network score", value: "94", icon: BarChart3, change: "+8%" },
  ]

  // Purple node color (index 1)
  const purpleColor = nodeColors[1]

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome + Profile Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 items-start"
        >
          {/* Welcome Section */}
          <div className="text-center lg:text-left py-8">
            <h1 className="text-3xl font-light text-white mb-2">
              welcome back, {user?.name?.split(" ")[0] || "builder"}
            </h1>
            <p className="text-neutral-400 text-lg mb-6">continue building meaningful connections</p>

            {/* Inline Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center group cursor-pointer"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl mx-auto mb-2 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="text-lg font-light text-white">{stat.value}</div>
                    <div className="text-neutral-400 text-xs">{stat.label}</div>
                  </div>
                  <span className="text-green-400 text-xs font-medium">{stat.change}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Simplified Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-6 text-center hover:scale-[1.02] transition-transform duration-300">
              {/* Purple Node Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
                className={`
                  w-16 h-16 rounded-full bg-gradient-to-br ${purpleColor.bg} 
                  ${purpleColor.shadow} ${purpleColor.glow}
                  border-2 border-white/30 relative overflow-hidden mx-auto mb-3
                `}
              >
                {/* Inner highlight */}
                <div className="absolute inset-1 rounded-full bg-white/20" />

                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white/90 rounded-full" />
                </div>

                {/* Holographic effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-60" />
              </motion.div>

              <h2 className="text-lg font-medium text-white mb-1">{user?.name || "User"}</h2>
              {user?.role && <p className="text-neutral-400 text-sm mb-2">{user.role}</p>}

              <p className="text-neutral-300 text-xs mb-3 leading-relaxed line-clamp-2">
                {user?.bio || "building the future of professional networking"}
              </p>

              {/* Skills as floating badges */}
              {userSkills?.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {userSkills.slice(0, 3).map((skill) => (
                    <span key={skill.name} className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
                      {skill.name}
                    </span>
                  ))}
                  {userSkills.length > 3 && (
                    <span className="px-2 py-1 bg-white/10 text-neutral-400 text-xs rounded-full">
                      +{userSkills.length - 3}
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={() => setShowUserCard(true)}
                className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-colors"
              >
                edit profile
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          {/* Left Column: Projects + Activity */}
          <div className="space-y-6">
            {/* Network Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">network projects</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors">
                  view all <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {networkProjects.slice(0, 4).map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className={`bg-gradient-to-br ${project.bgColor} backdrop-blur-xl rounded-2xl p-4 hover:scale-[1.02] transition-transform duration-300 cursor-pointer`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-900/50 flex items-center justify-center flex-shrink-0">
                        {project.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-white font-medium text-sm leading-tight">{project.title}</h4>
                          {project.isNew && (
                            <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full ml-2 flex-shrink-0">
                              new
                            </span>
                          )}
                        </div>

                        <p className="text-white/70 text-xs mb-2">by {project.author}</p>

                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-white/50" />
                          <span className="text-white/70 text-xs">{project.teamCount} members</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Add new project card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="border-2 border-dashed border-neutral-700 rounded-2xl p-4 flex items-center justify-center hover:border-neutral-600 transition-colors cursor-pointer group"
                >
                  <Plus className="w-4 h-4 text-neutral-600 group-hover:text-neutral-500 mr-2" />
                  <span className="text-neutral-600 group-hover:text-neutral-500 text-sm">start project</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Network Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-6"
            >
              <h3 className="text-lg font-medium text-white mb-4">network activity</h3>
              <div className="space-y-3">
                {following.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 pb-3 border-b border-white/10 last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-300 text-sm leading-relaxed">{item.message}</p>
                      <span className="text-neutral-500 text-xs">{item.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Communities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-6"
          >
            <h3 className="text-lg font-medium text-white mb-4">your communities</h3>
            <div className="space-y-3">
              {communities.map((community, index) => (
                <div
                  key={community.id}
                  className="flex justify-between items-start p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="text-neutral-300 text-sm leading-tight">{community.name}</span>
                  <span className="text-neutral-500 text-xs">{community.role}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-colors">
              join community
            </button>
          </motion.div>
        </div>
      </div>

      {/* User Card Modal */}
      <UserCardModal
        isOpen={showUserCard}
        onClose={() => setShowUserCard(false)}
        selectedColor={1} // Purple
        name={user?.name || ""}
        selectedRole={user?.role || ""}
        selectedIndustry="Technology"
        skills={userSkills.map((s) => s.name)}
      />
    </div>
  )
}
