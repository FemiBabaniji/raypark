"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { BackButton } from "@/components/ui/back-button"
import { mockPortfolios } from "@/lib/portfolio-data"

export default function NetworkPage() {
  const router = useRouter()

  const networkMembers = [
    ...mockPortfolios,
    {
      id: "sarah-chen",
      name: "Sarah Chen",
      title: "Frontend Developer",
      email: "sarah@techstartup.io",
      location: "San Francisco, CA",
      handle: "@sarahcodes",
      avatarUrl: "/professional-headshot.png",
      initials: "SC",
      selectedColor: 3,
    },
    {
      id: "mike-rodriguez",
      name: "Mike Rodriguez",
      title: "Product Manager",
      email: "mike@innovationlabs.com",
      location: "Austin, TX",
      handle: "@mikepm",
      avatarUrl: "/man-developer.png",
      initials: "MR",
      selectedColor: 4,
    },
    {
      id: "alex-thompson",
      name: "Alex Thompson",
      title: "Software Engineer",
      email: "alex@techsolutions.com",
      location: "Seattle, WA",
      handle: "@alexdev",
      avatarUrl: "/man-developer.png",
      initials: "AT",
      selectedColor: 2,
    },
  ]

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {networkMembers.map((member) => (
                  <div key={member.id} className="w-full">
                    <UnifiedPortfolioCard
                      portfolio={member}
                      onClick={() => {
                        if (member.id === "john-doe") {
                          window.location.href = "/network/john-doe"
                        } else {
                          console.log("open portfolio:", member.id)
                        }
                      }}
                      onShare={() => console.log("share portfolio:", member.id)}
                      onMore={() => console.log("more options:", member.id)}
                    />
                  </div>
                ))}

                <div className="w-full aspect-[4/5] rounded-3xl border-2 border-dashed border-neutral-700 hover:border-neutral-500 transition-colors cursor-pointer flex flex-col items-center justify-center group backdrop-blur-sm hover:scale-105 transition-all">
                  <BackButton
                    onClick={() => console.log("invite")}
                    icon={() => <span className="text-base text-white">+</span>}
                  />
                  <span className="text-neutral-400 font-medium text-sm">Invite</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="fixed right-0 top-16 w-80 lg:w-96 2xl:w-[28rem] h-full p-4 lg:p-6 xl:p-8 2xl:p-12"
            animate={{
              x: "0%",
            }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="bg-neutral-900/50 backdrop-blur-xl rounded-3xl p-8 border border-neutral-800/50 sticky top-6">
              <h2 className="text-2xl font-bold mb-4 text-white">Your Network</h2>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                Meet the talented individuals who make our work possible. Each card represents a unique professional
                with their own expertise and background.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-neutral-400">5 Active Members</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-neutral-400">3 Industries</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
