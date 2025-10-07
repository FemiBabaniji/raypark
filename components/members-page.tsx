"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { BackButton } from "@/components/ui/back-button"

export default function MembersPage({
  title = "Community Members",
  members = [],
  onBack,
  showInvite = true,
}: {
  title?: string
  members?: any[]
  onBack?: () => void
  showInvite?: boolean
}) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("All")

  const roles = useMemo(() => {
    const allRoles = members.flatMap((member) => member.tags || [])
    return ["All", ...Array.from(new Set(allRoles))]
  }, [members])

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        searchQuery === "" ||
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.org?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesRole = selectedRole === "All" || member.tags?.includes(selectedRole)

      return matchesSearch && matchesRole
    })
  }, [members, searchQuery, selectedRole])

  return (
    <div className="min-h-screen bg-neutral-950 overflow-hidden">
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
            onClick={onBack || (() => router.back())}
            className="text-neutral-400 hover:text-white transition-colors"
          />

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-neutral-400">pathwai</span>
          </div>
        </div>

        {/* User actions */}
        <div className="flex items-center space-x-6">
          <button className="text-sm text-neutral-500 hover:text-white transition-colors duration-300">ai</button>
          <Link href="/network" className="text-sm text-white font-medium">
            network
          </Link>
          <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">U</span>
          </div>
        </div>
      </motion.nav>

      <div className="pt-20">
        <div className="flex gap-4 p-4 lg:gap-6 lg:p-6 xl:gap-8 xl:p-8 2xl:gap-12 2xl:p-12">
          <motion.div
            className="flex-1 lg:pr-80 xl:pr-96 2xl:pr-[28rem]"
            animate={{
              x: "0rem",
              scale: 1,
            }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8 space-y-4">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search members by name, role, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors"
                  />
                </div>

                {/* Role filter buttons */}
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedRole === role
                          ? "bg-white text-neutral-950"
                          : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                {/* Results count */}
                <div className="text-sm text-neutral-500">
                  Showing {filteredMembers.length} of {members.length} members
                </div>
              </div>

              {filteredMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {filteredMembers.map((member) => (
                    <div key={member.id} className="w-full">
                      <UnifiedPortfolioCard
                        portfolio={member}
                        onClick={() => {
                          console.log("open portfolio:", member.id)
                        }}
                        onShare={() => console.log("share portfolio:", member.id)}
                        onMore={() => console.log("more options:", member.id)}
                      />
                    </div>
                  ))}

                  {showInvite && (
                    <div className="w-full aspect-[4/5] rounded-3xl border-2 border-dashed border-neutral-700 hover:border-neutral-500 transition-colors cursor-pointer flex flex-col items-center justify-center group backdrop-blur-sm hover:scale-105 transition-all">
                      <BackButton
                        onClick={() => console.log("invite")}
                        icon={() => <span className="text-base text-white">+</span>}
                      />
                      <span className="text-neutral-400 font-medium text-sm">Invite</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-neutral-500 text-lg">No members found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedRole("All")
                    }}
                    className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="fixed right-0 top-16 w-80 lg:w-96 2xl:w-[28rem] h-full p-4 lg:p-6 xl:p-8 2xl:p-12"
            animate={{
              x: "0%",
            }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="bg-gradient-to-br from-neutral-400/40 to-neutral-600/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 sticky top-6">
              <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
              <p className="text-white/90 mb-6 leading-relaxed">
                Meet the talented individuals who make our work possible. Each card represents a unique professional
                with their own expertise and background.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                  <span className="text-sm text-white/70">{members.length} Active Members</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-white/70">Multiple Industries</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
