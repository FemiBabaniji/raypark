"use client"

import { useState } from "react"
import { MembershipCard } from "@/components/membership-card"
import { BookingPage } from "@/components/booking-page"
import Link from "next/link"
import { AnimatedLogo } from "@/components/animated-logo"
import { motion } from "framer-motion"

export default function Home() {
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [isMembershipOpen, setIsMembershipOpen] = useState(false)
  const [showHero, setShowHero] = useState(true)

  const hideHero = () => {
    setShowHero(false)
  }

  // Project data with different demonstration content for each
  const projects = [
    {
      title: "Radiation Clock",
      description: "An interactive visualization of radiation patterns over time.",
      microTitle: "43434 CLICK",
      circleColor: "bg-green-400",
      hoverColor: "hover:bg-green-100 dark:hover:bg-green-900",
      demoContent: (
        <div className="h-full flex flex-col">
          <div className="flex-grow flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-gray-300 dark:border-gray-600 relative">
              <div className="absolute top-1/2 left-1/2 w-1 h-8 bg-black dark:bg-white -translate-x-1/2 -translate-y-1/2 origin-bottom rotate-45"></div>
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-sm">
              <span className="font-medium">Radiation Clock</span> <span className="mx-1">—</span>
              <span className="text-gray-500 dark:text-gray-400">
                visualizing patterns of radiation in everyday objects
              </span>
              <span className="inline-block ml-1">→</span>
            </p>
          </div>
        </div>
      ),
    },
  ]

  // Default demo content when no project is hovered
  const defaultDemoContent = (
    <div className="h-full flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <p className="text-gray-300 dark:text-gray-600">Hover over a project to see preview</p>
      </div>
      <div className="mt-auto">
        <p className="text-sm">
          <span className="font-medium">LFE Inc.</span> <span className="mx-1">—</span>
          <span className="text-gray-500 dark:text-gray-400">
            ever expanding website for the founders of Family and Honk; LA tech company, LFE
          </span>
          <span className="inline-block ml-1">→</span>
        </p>
      </div>
    </div>
  )

  // Get the active project data or default values
  const activeProjectData = activeProject
    ? projects.find((p) => p.title === activeProject)
    : {
        microTitle: "43434 CLICK",
        circleColor: "bg-green-400",
        hoverColor: "hover:bg-green-100 dark:hover:bg-green-900",
      }

  // Handle project click
  const handleProjectClick = (projectTitle: string) => {
    hideHero()
    if (expandedProject === projectTitle) {
      setExpandedProject(null)
    } else {
      setExpandedProject(projectTitle)
      setActiveProject(projectTitle)
    }
  }

  const isExpanded = expandedProject !== null

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Hero Section with animated logo and membership card */}
      <motion.div
        className="w-full h-screen flex flex-col items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: showHero && !isMembershipOpen ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Logo */}
          <div className="mb-12">
            <AnimatedLogo />
          </div>

          {/* Membership Card */}
          <div className="mt-4">
            <MembershipCard onOpenChange={setIsMembershipOpen} />
          </div>
        </motion.div>
      </motion.div>

      {/* Membership Page - Full Hero Section */}
      <motion.div
        className="fixed inset-0 w-full h-screen flex items-center justify-center bg-white z-40"
        initial={{ x: "100%" }}
        animate={{ x: isMembershipOpen ? 0 : "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="w-full h-full flex items-center justify-center pt-16">
          <div className="w-full max-w-lg px-8">
            {/* Header with micro title styling */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
              <span className="text-xs font-bold">MONTHLY CLUB</span>
            </div>

            <h2 className="text-3xl font-normal mb-6">Design & Development</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></div>
                <p className="text-sm">One request at a time</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></div>
                <p className="text-sm">48 hour delivery</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></div>
                <p className="text-sm">Unlimited brands</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></div>
                <p className="text-sm">Web development</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></div>
                <p className="text-sm">Unlimited stock photos</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></div>
                <p className="text-sm">Up to 2 users</p>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></div>
                <p className="text-sm">Pause or cancel anytime</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="py-1.5 px-3 bg-gray-100 inline-flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                <span>INCLUDED</span>
              </div>
            </div>

            <button
              disabled
              className="w-full py-2.5 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2 mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
              <span>At capacity - Join waitlist</span>
            </button>

            <div className="flex justify-center">
              <button
                onClick={() => setIsMembershipOpen(false)}
                className="py-1.5 px-3 bg-gray-100 flex items-center gap-2 text-xs hover:bg-pink-100 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                <span>CLOSE</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Bar - Fixed at top */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm z-50">
        <div className="flex flex-col">
          <h1 className="text-lg font-normal">
            <a href="/" className="hover:text-pink-500 transition-colors">
              Aray Park
            </a>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            An all-in-one platform{" "}
            <a href="/about" className="underline hover:text-pink-500 transition-colors">
              where developers think like designers
            </a>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <div className="bg-gray-100 dark:bg-gray-800 py-1.5 px-3 flex items-center gap-2 text-xs cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-300 group">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 group-hover:bg-blue-400 transition-colors duration-300"></div>
              <span>LOGIN</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content - Positioned below the viewport */}
      <main className="w-full relative">
        {/* Booking page - Slides in from left */}
        <div
          className={`absolute inset-0 z-10 transition-all duration-700 ease-in-out ${
            isMembershipOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
        >
          <div className="max-w-4xl mx-auto px-4">
            <BookingPage onClose={() => setIsMembershipOpen(false)} />
          </div>
        </div>

        {/* Regular content - Slides right when membership is open */}
        <div
          className={`w-full transition-all duration-700 ease-in-out ${
            isMembershipOpen ? "translate-x-[40%] opacity-30" : "translate-x-0 opacity-100"
          }`}
        >
          {/* Rest of your content */}
        </div>
      </main>
    </div>
  )
}
