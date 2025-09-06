"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGetStarted = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push("/auth")
    }, 800)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
    exit: {
      x: "-100%",
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const DeviceMockup = () => (
    <div className="relative">
      {/* Desktop/Mac Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative w-[600px] h-[400px] bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-2xl p-6 shadow-2xl border border-neutral-700"
      >
        {/* Screen */}
        <div className="bg-neutral-950 rounded-xl h-full p-6 relative overflow-hidden">
          {/* Portfolio Content */}
          <div className="flex gap-6 h-full">
            {/* Left Column */}
            <div className="flex-1 space-y-4">
              {/* Profile Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-rose-400/40 to-rose-600/60 backdrop-blur-xl rounded-2xl p-6 text-white"
              >
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/professional-woman-headshot.png" />
                    <AvatarFallback>JW</AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-lg font-bold mb-1">Jenny Wilson</h3>
                <p className="text-white/80 text-sm mb-2">Digital Product Designer</p>
                <p className="text-white/70 text-xs">Content creator. Digital nomad.</p>
              </motion.div>

              {/* Education Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-2xl p-4 text-white"
              >
                <h4 className="text-sm font-semibold mb-2">Education</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium">Design Systems</p>
                    <p className="text-neutral-400 text-xs">Stanford University</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="flex-1 space-y-4">
              {/* About Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-2xl p-4 text-white"
              >
                <h4 className="text-sm font-semibold mb-2">About Me</h4>
                <p className="text-neutral-300 text-xs leading-relaxed">
                  I'm a passionate digital designer with over 5 years of experience creating meaningful user
                  experiences.
                </p>
              </motion.div>

              {/* Projects Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-2xl p-4 text-white"
              >
                <h4 className="text-sm font-semibold mb-3">Projects Portfolio</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gradient-to-br from-purple-500/70 to-blue-500/70 rounded-lg p-2">
                    <p className="text-xs font-medium">AI/ML</p>
                    <p className="text-xs text-white/80 mt-1">Real-time insights...</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs">In Progress</span>
                      <span className="text-xs font-bold">60%</span>
                    </div>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-2">
                    <p className="text-xs font-medium">Web Dev</p>
                    <p className="text-xs text-neutral-400 mt-1">Complete overhaul...</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-blue-400">In Progress</span>
                      <span className="text-xs font-bold">85%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Phone Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute -right-20 top-20 w-64 h-[500px] bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-[2.5rem] p-4 shadow-2xl border border-neutral-700"
      >
        {/* Phone Screen */}
        <div className="bg-neutral-950 rounded-[2rem] h-full p-4 relative overflow-hidden">
          {/* Status Bar */}
          <div className="flex justify-between items-center mb-4 text-white text-xs">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-3 h-1 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Mobile Portfolio Content */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="bg-gradient-to-br from-rose-400/40 to-rose-600/60 rounded-xl p-4 text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/professional-woman-headshot.png" />
                  <AvatarFallback>JW</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-bold">Jenny Wilson</h4>
                  <p className="text-xs text-white/80">Designer</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="space-y-2"
            >
              <div className="bg-purple-600 text-white py-2 px-3 rounded-lg text-xs text-center">Portfolio</div>
              <div className="bg-blue-600 text-white py-2 px-3 rounded-lg text-xs text-center">Projects ↓</div>
              <div className="bg-green-600 text-white py-2 px-3 rounded-lg text-xs text-center">Skills</div>
              <div className="bg-amber-600 text-white py-2 px-3 rounded-lg text-xs text-center">Contact</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )

  return (
    <AnimatePresence mode="wait">
      {!isTransitioning && (
        <motion.div
          className="min-h-screen bg-neutral-950 relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header comment */}
          <div className="absolute top-6 left-6 right-6 z-10">
            <div className="flex justify-between items-center">
              <div className="font-mono text-xs text-neutral-600">
                <span className="text-neutral-500">01</span>
                <span className="ml-6 text-neutral-500">
                  {"<!--"} PROFESSIONAL PORTFOLIO BUILDER {"-->"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-white hover:bg-white/10 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300"
                onClick={() => router.push("/auth")}
              >
                Sign In
              </Button>
            </div>
          </div>

          <div className="flex min-h-screen">
            {/* Left Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-16 py-20">
              <motion.div className="text-center max-w-2xl" variants={containerVariants}>
                <motion.div className="flex items-center justify-center gap-2 mb-6" variants={itemVariants}>
                  <div className="flex -space-x-2">
                    {[
                      "/professional-headshot.png",
                      "/man-developer.png",
                      "/woman-designer.png",
                      "/woman-analyst.png",
                    ].map((src, i) => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-neutral-950">
                        <AvatarImage src={src || "/placeholder.svg"} className="object-cover" />
                        <AvatarFallback className="bg-neutral-700 text-white text-xs">U</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="w-3 h-3 text-yellow-400 text-xs">
                        ⭐
                      </div>
                    ))}
                  </div>
                  <span className="text-neutral-400 text-sm">10,000+ professionals</span>
                </motion.div>

                <motion.h1
                  className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight"
                  variants={itemVariants}
                >
                  Build your{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent [&:not(:has(.bg-clip-text))]:text-purple-400">
                    professional
                  </span>{" "}
                  portfolio
                </motion.h1>

                <motion.p className="text-neutral-400 text-lg mb-8 leading-relaxed" variants={itemVariants}>
                  Create stunning portfolio pages that showcase your skills, projects, and expertise. Connect with
                  opportunities and grow your network.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-4 text-base font-medium transition-all duration-300 group"
                    onClick={handleGetStarted}
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full px-8 py-4 text-base font-medium backdrop-blur-xl"
                    onClick={() => router.push("/dashboard")}
                  >
                    View Examples
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="text-neutral-500 text-sm">
                  Join thousands of professionals already on pathwai
                </motion.div>
              </motion.div>
            </div>

            {/* Right Visual Area */}
            <div className="flex-1 flex items-center justify-center relative min-h-screen p-8">
              <DeviceMockup />
            </div>
          </div>

          {/* Features Ticker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-20 left-0 right-0 bg-neutral-900/50 backdrop-blur-xl py-4 border-t border-b border-white/10"
          >
            <div className="flex items-center justify-center gap-12 text-neutral-300 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-600 rounded-sm"></div>
                <span>DRAG & DROP BUILDER</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-600 rounded-sm"></div>
                <span>FULLY CUSTOMIZABLE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                <span>LIVE IN MINUTES</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                <span>PROFESSIONAL TEMPLATES</span>
              </div>
            </div>
          </motion.div>

          {/* Footer comment */}
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <div className="font-mono text-xs text-neutral-600">
              <span className="text-neutral-500">02</span>
              <span className="ml-6 text-neutral-500">
                {"<!--"} START BUILDING {"-->"}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
