"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import Image from "next/image"

export default function HomePage() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-lg">Pathwai</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Platform</button>
            <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Communities</button>
            <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Resources</button>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-sm"
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
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            The{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Community-First
            </span>{" "}
            Platform
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
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

      <section className="pb-20 px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            {/* Product screenshot placeholder with gradient background */}
            <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
              {/* Decorative elements to suggest interface */}
              <div className="absolute inset-0 p-8">
                {/* Mock header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
                    <div className="space-y-1">
                      <div className="w-24 h-3 bg-gray-300 rounded" />
                      <div className="w-32 h-2 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                    <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                    <div className="w-20 h-8 bg-blue-600 rounded-lg" />
                  </div>
                </div>

                {/* Mock content grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                      <div className="w-full h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3" />
                      <div className="w-3/4 h-3 bg-gray-200 rounded mb-2" />
                      <div className="w-1/2 h-2 bg-gray-150 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-gray-50">
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
              <h3 className="text-xl font-semibold mb-3">Community Connections</h3>
              <p className="text-gray-600">Foster meaningful relationships within your community with intelligent member matching</p>
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
              <h3 className="text-xl font-semibold mb-3">Member Profiles</h3>
              <p className="text-gray-600">Empower members to showcase their skills and contributions to the community</p>
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
              <h3 className="text-xl font-semibold mb-3">Events & Meetings</h3>
              <p className="text-gray-600">Bring your community together with seamless event management and engagement</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
