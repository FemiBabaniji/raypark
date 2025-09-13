"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
// import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import NetworkAnimation from "@/components/network-animation"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const user = null
  const loading = false

  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log("HomePage mounted, loading:", loading, "user:", user ? "exists" : "null")
  }, [loading, user])

  const handleGetStarted = () => {
    console.log("Get Started clicked, directing to login")
    setIsTransitioning(true)

    // Delay navigation to allow slide animation
    setTimeout(() => {
      router.push("/login")
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
            <div className="font-mono text-xs text-neutral-600">
              <span className="text-neutral-500">01</span>
              <span className="ml-6 text-neutral-500">
                {"<!--"} NETWORK BUILDERS WANTED {"-->"}
              </span>
            </div>
          </div>

          <div className="flex min-h-screen">
            {/* Left Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-16 py-20">
              <motion.div className="text-center max-w-2xl" variants={containerVariants}>
                <motion.h1
                  className="text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight"
                  variants={itemVariants}
                >
                  pathwai
                </motion.h1>

                <motion.h2 className="text-xl lg:text-2xl font-light text-white mb-4" variants={itemVariants}>
                  Your digital workroom to grow and connect
                </motion.h2>

                <motion.p className="text-neutral-400 text-lg mb-12 leading-relaxed" variants={itemVariants}>
                  Where what you do meets who you need—and new paths open.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-4 text-base font-medium transition-all duration-300 group"
                    onClick={handleGetStarted}
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full px-8 py-4 text-base font-medium backdrop-blur-xl"
                    onClick={() => router.push("/login")}
                  >
                    Sign In
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Visual Area */}
            <div className="flex-1 flex items-center justify-center relative min-h-screen p-8">
              {/* Network Animation Card with Grid Background */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative w-full h-full max-w-2xl max-h-[600px] bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
              >
                {/* Grid background inside card */}
                <div className="absolute inset-0 opacity-20">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(115, 115, 115, 0.4) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(115, 115, 115, 0.4) 1px, transparent 1px)
                      `,
                      backgroundSize: "40px 40px",
                    }}
                  />
                </div>

                {/* Network Animation Container */}
                <div className="relative z-10 w-full h-full">
                  <NetworkAnimation />
                </div>
              </motion.div>
            </div>
          </div>

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
