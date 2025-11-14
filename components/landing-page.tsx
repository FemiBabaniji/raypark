"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-300 via-blue-300 to-purple-300 flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-lg">Pathwai</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">Platform</button>
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">Communities</button>
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">Resources</button>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-sm text-zinc-300 hover:text-white"
              onClick={() => router.push("/login")}
            >
              Sign in
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6"
              onClick={() => router.push("/onboarding")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
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
            className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed"
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
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
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
    </div>
  )
}
