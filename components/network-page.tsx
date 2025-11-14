"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Home, Calendar, Users, Sparkles } from 'lucide-react'
import BackButton from "@/components/back-button"

const mockMembers = [
  {
    id: "oluwafemi-babaniji",
    name: "Oluwafemi Babaniji",
    title: "Senior Data Scientist",
    location: "Toronto, ON",
    handle: "@oluwafemidata",
    avatarUrl: "/man-developer.png",
    role: "Developer",
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    title: "AI Engineer",
    location: "San Francisco, CA",
    handle: "@sarahcodes",
    avatarUrl: "/professional-headshot.png",
    role: "Developer",
    gradient: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
  {
    id: "marcus-johnson",
    name: "Marcus Johnson",
    title: "Product Designer",
    location: "New York, NY",
    handle: "@marcusdesign",
    avatarUrl: "/man-developer.png",
    role: "Designer",
    gradient: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
  },
  {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    title: "Marketing Manager",
    location: "Austin, TX",
    handle: "@elenamarketing",
    avatarUrl: "/woman-analyst.png",
    role: "Manager",
    gradient: "from-orange-500/20 to-amber-500/20",
    borderColor: "border-orange-500/30",
  },
  {
    id: "david-kim",
    name: "David Kim",
    title: "Full Stack Developer",
    location: "Seattle, WA",
    handle: "@daviddev",
    avatarUrl: "/man-developer.png",
    role: "Developer",
    gradient: "from-indigo-500/20 to-blue-500/20",
    borderColor: "border-indigo-500/30",
  },
  {
    id: "jessica-wu",
    name: "Jessica Wu",
    title: "UX Designer",
    location: "Los Angeles, CA",
    handle: "@jessicaux",
    avatarUrl: "/woman-designer.png",
    role: "Designer",
    gradient: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/30",
  },
]

export { default as NetworkPage } from "./network-page"

export default function NetworkPage() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "Designer" | "Developer" | "Manager">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = selectedFilter === "all" || member.role === selectedFilter

    return matchesSearch && matchesFilter
  })

  const filters = [
    { key: "all" as const, label: "All", count: mockMembers.length },
    { key: "Designer" as const, label: "Designers", count: mockMembers.filter((m) => m.role === "Designer").length },
    { key: "Developer" as const, label: "Developers", count: mockMembers.filter((m) => m.role === "Developer").length },
    { key: "Manager" as const, label: "Managers", count: mockMembers.filter((m) => m.role === "Manager").length },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <BackButton onClick={() => window.history.back()} className="flex-shrink-0" />
          
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                placeholder="Search by name, role, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full bg-muted/50 border border-border/50 rounded-xl pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
              />
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="flex-shrink-0 w-11 h-11 bg-muted/50 hover:bg-muted rounded-xl flex items-center justify-center transition-colors"
          >
            <Home className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Community</h1>
              <p className="text-muted-foreground mt-1">Connect with {mockMembers.length} members</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="inline-flex gap-2 p-1.5 rounded-xl bg-muted/30 border border-border/50">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    selectedFilter === filter.key
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }
                `}
              >
                {filter.label}
                <span
                  className={`ml-2 text-xs ${
                    selectedFilter === filter.key ? "text-muted-foreground" : "text-muted-foreground/70"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="w-32 h-32 rounded-full bg-muted/30 flex items-center justify-center mb-6">
              <Users className="w-16 h-16 text-muted-foreground/50" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No Members Found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No members match your search criteria. Try adjusting your filters or search query.
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative"
                >
                  <div className={`
                    h-full rounded-2xl border backdrop-blur-sm overflow-hidden
                    bg-card/50 hover:bg-card transition-all duration-300
                    hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1
                    cursor-pointer ${member.borderColor}
                  `}>
                    <div className={`h-24 bg-gradient-to-br ${member.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-grid-white/5"></div>
                    </div>

                    <div className="p-6 -mt-10 relative">
                      <div className="relative w-20 h-20 mb-4">
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} blur-sm`}></div>
                        <img
                          src={member.avatarUrl || "/placeholder.svg"}
                          alt={member.name}
                          className="relative w-full h-full rounded-full object-cover border-4 border-background"
                        />
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background"></div>
                      </div>

                      <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-blue-400 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">{member.title}</p>
                      <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5 mb-4">
                        <Calendar className="w-3 h-3" />
                        {member.location}
                      </p>

                      <button className="w-full py-2.5 rounded-lg text-sm font-medium bg-muted/50 hover:bg-muted text-foreground transition-colors flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Connect
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  )
}
