"use client"

import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { BackButton } from "@/components/ui/back-button"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { Users, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const communityMembers = {
  "tech-innovators-sf": [
    {
      id: "jenny-wilson",
      name: "Jenny Wilson",
      title: "Digital Product Designer",
      email: "jenny@acme.com",
      location: "San Francisco, CA",
      handle: "@jennywilson",
      initials: "JW",
      selectedColor: 1,
      avatarUrl: "/woman-designer.png",
      isLive: true,
    },
    {
      id: "john-doe",
      name: "John Doe",
      title: "Data Scientist",
      email: "john@datastam.edu",
      location: "San Francisco, CA",
      handle: "@johndoe",
      initials: "JD",
      selectedColor: 2,
    },
    {
      id: "sarah-chen",
      name: "Sarah Chen",
      title: "Frontend Developer",
      email: "sarah@techstartup.io",
      location: "San Francisco, CA",
      handle: "@sarahcodes",
      initials: "SC",
      selectedColor: 3,
      avatarUrl: "/professional-headshot.png",
    },
    {
      id: "mike-rodriguez",
      name: "Mike Rodriguez",
      title: "Product Manager",
      email: "mike@innovationlabs.com",
      location: "San Francisco, CA",
      handle: "@mikepm",
      initials: "MR",
      selectedColor: 4,
      isLive: true,
    },
    {
      id: "alex-thompson",
      name: "Alex Thompson",
      title: "Software Engineer",
      email: "alex@techsolutions.com",
      location: "San Francisco, CA",
      handle: "@alexdev",
      initials: "AT",
      selectedColor: 2,
    },
    {
      id: "lisa-martinez",
      name: "Lisa Martinez",
      title: "UX Researcher",
      email: "lisa@designstudio.co",
      location: "San Francisco, CA",
      handle: "@lisamartinez",
      initials: "LM",
      selectedColor: 5,
    },
  ],
}

export default function CommunityMembersPage() {
  const router = useRouter()
  const params = useParams()
  const communityId = params.communityId as string
  const [searchQuery, setSearchQuery] = useState("")

  const members = communityMembers[communityId as keyof typeof communityMembers] || []

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const communityNames = {
    "tech-innovators-sf": "Tech Innovators SF",
    "black-entrepreneurship-alliance": "Black Entrepreneurship Alliance",
  }

  const communityName = communityNames[communityId as keyof typeof communityNames] || "Community"

  return (
    <div className="min-h-screen bg-zinc-950">
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-xl border-b border-neutral-800/50"
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center space-x-4">
          <BackButton
            onClick={() => router.push(`/network/${communityId}`)}
            className="text-neutral-400 hover:text-white transition-colors"
          />
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-neutral-400">pathwai</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-neutral-900/50 border-neutral-700 text-white placeholder:text-neutral-500 w-64"
            />
          </div>
        </div>
      </motion.nav>

      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">{communityName} Members</h1>
              <p className="text-neutral-400">{filteredMembers.length} members found</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <UnifiedPortfolioCard
                key={member.id}
                portfolio={member}
                onClick={(id) => console.log("View member profile:", id)}
                onShare={(id) => console.log("Share member:", id)}
                onMore={(id) => console.log("More options for member:", id)}
              />
            ))}
          </div>

          {filteredMembers.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-neutral-400">No members found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
