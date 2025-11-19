"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

import { useChat } from "@ai-sdk/react"
import DiscoverTab from "./tabs/discover-tab"
import GenerateTab from "./tabs/generate-tab"
import NetworkTab from "./tabs/network-tab"
import ChatInterface from "./chat-interface"
import HomeTab from "./tabs/home-tab"

import { useAuth } from "@/lib/auth"
import { OnboardingProvider } from "@/context/onboarding-context"
import { mockNetworkMembers } from "@/lib/portfolio-data"
import type { DiscoverItem, NetworkProfile, Project, Message } from "@/types"

/* ── Navigation tabs ───────────────────────────────────────────────────── */
const tabs = [
  { key: "home", label: "home" },
  { key: "discover", label: "discover" },
  { key: "generate", label: "generate" },
  { key: "network", label: "network" },
] as const

/* ── Main component ────────────────────────────────────────────────────── */
function PathwaiInner() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<string>(tabs[0].key)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ api: "/api/chat" })
  const chatMsgs: Message[] = messages.map((m) => ({ sender: m.role === "user" ? "user" : "ai", content: m.content! }))

  const [discoverItems, setDiscoverItems] = useState<DiscoverItem[]>([])
  const [networkProfiles, setNetworkProfiles] = useState<NetworkProfile[]>([])
  const [recentProjects, setRecentProjects] = useState<Project[]>([])

  useEffect(() => {
    setDiscoverItems([
      {
        id: "1",
        type: "event",
        title: "AI + Sustainability Meetup",
        author: user?.name || "Alex",
        authorPhoto: user?.imageUrl || "",
        description: "Join us for an evening exploring how AI can drive sustainable innovation",
        likes: 10,
        comments: 2,
      },
      {
        id: "2",
        type: "project",
        title: "Portfolio Collaboration",
        author: "Jenny Wilson",
        authorPhoto: "/woman-designer.png",
        description: "Looking for developers to collaborate on a new portfolio platform",
        likes: 15,
        comments: 5,
      },
    ])

    setNetworkProfiles(
      mockNetworkMembers.map((member) => ({
        id: member.id,
        name: member.name,
        title: member.role,
        photo: member.avatar,
        bio: `Experienced ${member.role.toLowerCase()} with expertise in modern technologies`,
        location: "Remote",
        activity: "Active",
      })),
    )

    setRecentProjects([
      { id: 1, name: "Portfolio Website", date: "Mar 14, 2025" },
      { id: 2, name: "Design System", date: "Mar 12, 2025" },
    ])
  }, [user])

  const views: Record<string, React.JSX.Element> = {
    home: <HomeTab />,
    discover: <DiscoverTab items={discoverItems} />,
    generate: <GenerateTab recentProjects={recentProjects} />,
    network: <NetworkTab profiles={networkProfiles} />,
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Always visible top bar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between"
        initial={{ opacity: 1 }}
      >
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-neutral-400">pathwai</span>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-8">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`text-sm transition-colors duration-300 ${
                activeTab === key ? "text-white" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* User actions */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`text-sm transition-colors duration-300 ${
              isChatOpen ? "text-white" : "text-neutral-500 hover:text-white"
            }`}
          >
            ai
          </button>

          <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">{user?.name?.[0] || "U"}</span>
          </div>
        </div>
      </motion.nav>

      {/* Main content space */}
      <main className="pt-20 pb-20 px-8">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              {views[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Ambient chat overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ duration: 0.4 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-neutral-900/95 backdrop-blur-xl border-l border-neutral-800/50 z-40"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-neutral-800/50">
                <span className="text-sm text-neutral-400">ai assistant</span>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 p-6">
                <ChatInterface
                  messages={chatMsgs}
                  inputMessage={input}
                  setInputMessage={handleInputChange}
                  sendMessage={(e) => {
                    e.preventDefault()
                    if (input.trim()) handleSubmit(e)
                  }}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PathwaiInterface() {
  return (
    <OnboardingProvider>
      <PathwaiInner />
    </OnboardingProvider>
  )
}
