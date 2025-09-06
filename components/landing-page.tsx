"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Users } from "lucide-react"

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
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.8,
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      {!isTransitioning && (
        <motion.div
          className="min-h-screen bg-black relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-black to-neutral-950" />

          {/* Floating elements for visual interest */}
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute top-20 left-20 w-2 h-2 bg-purple-500/30 rounded-full blur-sm"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: "2s" }}
            className="absolute top-40 right-32 w-1 h-1 bg-pink-500/40 rounded-full blur-sm"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: "4s" }}
            className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-blue-500/30 rounded-full blur-sm"
          />

          {/* Header */}
          <motion.div variants={itemVariants} className="absolute top-8 left-8 right-8 z-10">
            <div className="flex justify-between items-center">
              <div className="text-white font-semibold text-xl tracking-tight">pathwai</div>
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-white hover:bg-white/5 rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 border border-white/10 hover:border-white/20"
                onClick={() => router.push("/auth")}
              >
                Sign In
              </Button>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex flex-col items-center justify-center min-h-screen px-8 py-20">
            <motion.div className="text-center max-w-4xl" variants={containerVariants}>
              {/* Badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-xl"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-neutral-300 text-sm font-medium">Trusted by 10,000+ professionals</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                className="text-6xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-[0.9]"
                variants={itemVariants}
              >
                Your digital
                <br />
                <span className="text-purple-400">workroom</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-neutral-400 text-xl lg:text-2xl mb-12 leading-relaxed font-light max-w-2xl mx-auto"
                variants={itemVariants}
              >
                Build stunning portfolios that showcase your work and connect you with opportunities.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-neutral-100 rounded-full px-10 py-6 text-lg font-semibold transition-all duration-300 group shadow-2xl"
                  onClick={handleGetStarted}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full px-10 py-6 text-lg font-medium backdrop-blur-xl transition-all duration-300"
                  onClick={() => router.push("/dashboard")}
                >
                  View Examples
                </Button>
              </motion.div>

              {/* Feature Cards */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                  <Zap className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">Lightning Fast</h3>
                  <p className="text-neutral-400 text-sm">Build and deploy your portfolio in minutes, not hours.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                  <Sparkles className="w-8 h-8 text-pink-400 mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">Beautiful Design</h3>
                  <p className="text-neutral-400 text-sm">Professional templates that make you stand out.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                  <Users className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">Connect & Grow</h3>
                  <p className="text-neutral-400 text-sm">Network with professionals and discover opportunities.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="absolute bottom-8 left-8 right-8 z-10">
            <div className="flex justify-center">
              <div className="text-neutral-500 text-sm font-light">© 2024 pathwai. Crafted for professionals.</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
