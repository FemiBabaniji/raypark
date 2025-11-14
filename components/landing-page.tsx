"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const mockWidgets = [
    { id: 1, type: 'profile', delay: 0.1, x: -20, y: 0 },
    { id: 2, type: 'event', delay: 0.2, x: 20, y: 10 },
    { id: 3, type: 'network', delay: 0.3, x: -10, y: 20 },
    { id: 4, type: 'meeting', delay: 0.4, x: 15, y: -10 },
  ]

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "oklch(0.18 0 0)", color: "#FFFFFF" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, #4169E1 0%, transparent 70%)",
          }}
        />
        <div 
          className="absolute -top-1/3 right-0 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
          style={{
            background: "radial-gradient(circle, #7B68EE 0%, transparent 70%)",
          }}
        />
        <div 
          className="absolute top-1/2 -left-1/4 w-[700px] h-[700px] rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #4169E1 0%, transparent 70%)",
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[900px] h-[900px] rounded-full opacity-25 blur-3xl"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: "oklch(0.18 0 0 / 0.8)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-200 via-blue-200 to-purple-300 flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-xl">DMZ</span>
            </div>
            <span className="font-semibold text-lg text-white">Pathwai</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button className="text-sm text-white/70 hover:text-white transition-colors">Platform</button>
            <button className="text-sm text-white/70 hover:text-white transition-colors">Communities</button>
            <button className="text-sm text-white/70 hover:text-white transition-colors">Resources</button>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-sm text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => router.push("/login")}
            >
              Sign in
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full px-6"
              onClick={() => router.push("/onboarding")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white"
          >
            The{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Community-First
            </span>{" "}
            Platform
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Build thriving communities where members connect, collaborate, and grow together. Your space for meaningful relationships and shared success.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-full px-10 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => router.push("/onboarding")}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Get Started
              <ArrowRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="relative pb-20 px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-visible min-h-[500px] flex items-center justify-center">
            <div className="relative w-full max-w-4xl">
              <div className="grid grid-cols-2 gap-6">
                {/* Left column widgets */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="bg-zinc-900/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                      <div>
                        <div className="w-24 h-3 bg-white/20 rounded mb-2" />
                        <div className="w-32 h-2 bg-white/10 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-white/10 rounded" />
                      <div className="w-3/4 h-2 bg-white/10 rounded" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="bg-zinc-900/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg"
                  >
                    <div className="w-20 h-3 bg-white/20 rounded mb-4" />
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600" />
                        <div className="flex-1">
                          <div className="w-full h-2 bg-white/10 rounded mb-1" />
                          <div className="w-2/3 h-2 bg-white/10 rounded" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600" />
                        <div className="flex-1">
                          <div className="w-full h-2 bg-white/10 rounded mb-1" />
                          <div className="w-2/3 h-2 bg-white/10 rounded" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right column widgets */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="bg-zinc-900/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg"
                  >
                    <div className="w-24 h-3 bg-white/20 rounded mb-4" />
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-violet-500/50 to-purple-600/50" />
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="bg-zinc-900/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-20 h-3 bg-white/20 rounded" />
                      <div className="w-16 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-white/10 rounded" />
                      <div className="w-5/6 h-2 bg-white/10 rounded" />
                      <div className="w-4/6 h-2 bg-white/10 rounded" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Community Connections</h3>
              <p className="text-white/60">Foster meaningful relationships within your community with intelligent member matching</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Member Profiles</h3>
              <p className="text-white/60">Empower members to showcase their skills and contributions to the community</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Events & Meetings</h3>
              <p className="text-white/60">Bring your community together with seamless event management and engagement</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
