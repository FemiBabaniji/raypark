"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Users, Calendar, MessageCircle, QrCode } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ProfileData {
  name: string
  industry: string
  skills: string[]
  businessNeeds: string[]
  portfolioFile?: File
}

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Wellness",
  "E-commerce",
  "Consulting",
  "Media & Entertainment",
]

const skillOptions = [
  "Product Management",
  "Software Development",
  "UX/UI Design",
  "Data Science",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
  "Legal",
  "HR",
]

const businessNeedOptions = [
  "Co-founder",
  "Technical Partner",
  "Investor",
  "Mentor",
  "Advisor",
  "Team Member",
  "Collaborator",
  "Service Provider",
]

export default function BEAOnboardingPage() {
  const [step, setStep] = useState<"welcome" | "profile" | "dashboard" | "complete">("welcome")
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    industry: "",
    skills: [],
    businessNeeds: [],
  })
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const communityCode = searchParams.get("code") || "bea-founders-connect"

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/auth?redirect=/onboarding/bea?code=${communityCode}`)
    }
  }, [user, loading, router, communityCode])

  const handleSkillToggle = (skill: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const handleBusinessNeedToggle = (need: string) => {
    setProfileData((prev) => ({
      ...prev,
      businessNeeds: prev.businessNeeds.includes(need)
        ? prev.businessNeeds.filter((n) => n !== need)
        : [...prev.businessNeeds, need],
    }))
  }

  const handleCreateProfile = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/community-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profileData,
          communityCode,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create community profile")
      }

      setStep("dashboard")
    } catch (error) {
      console.error("Error creating community profile:", error)
      // Continue to dashboard even if API fails
      setStep("dashboard")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "oklch(0.18 0 0)" }}>
        <div style={{ color: "#FFFFFF" }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: "oklch(0.18 0 0)" }}>
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between"
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-sky-400/35 to-blue-600/20 rounded-lg flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <span className="text-sm font-medium" style={{ color: "#B3B3B3" }}>
            pathwai × BEA
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "oklch(0.145 0 0)" }}
          >
            <span className="text-xs font-medium" style={{ color: "#FFFFFF" }}>
              {user?.name?.[0] || "M"}
            </span>
          </div>
        </div>
      </motion.nav>

      <div className="pt-20">
        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen flex items-center justify-center p-8"
            >
              <div className="text-center max-w-2xl">
                <div className="w-24 h-24 bg-gradient-to-br from-sky-400/35 to-blue-600/20 rounded-2xl mx-auto mb-8 flex items-center justify-center">
                  <Users className="w-8 h-8" style={{ color: "#FFFFFF" }} />
                </div>
                <h1 className="text-4xl font-bold mb-6" style={{ color: "#FFFFFF" }}>
                  Welcome to BEA Founders Connect
                </h1>
                <p className="text-xl mb-12" style={{ color: "#B3B3B3" }}>
                  Create your dynamic professional profile and connect with co-founders, investors, and collaborators in
                  the BEA ecosystem.
                </p>
                <button
                  onClick={() => setStep("profile")}
                  className="flex items-center gap-2 mx-auto px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors font-medium"
                  style={{ backgroundColor: "#0EA5E9", color: "#FFFFFF" }}
                >
                  Build My Professional ID
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen flex items-center justify-center p-8"
            >
              <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
                    Create Your Professional ID
                  </h2>
                  <p style={{ color: "#B3B3B3" }}>Build a dynamic profile that showcases your expertise and goals</p>
                </div>

                <div className="space-y-8">
                  {/* Name */}
                  <div>
                    <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Malik Johnson"
                      className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                      style={{
                        backgroundColor: "oklch(0.145 0 0)",
                        borderColor: "oklch(0.145 0 0)",
                        color: "#FFFFFF",
                      }}
                    />
                  </div>

                  {/* Industry Focus */}
                  <div>
                    <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                      Industry Focus
                    </label>
                    <select
                      value={profileData.industry}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                      style={{
                        backgroundColor: "oklch(0.145 0 0)",
                        borderColor: "oklch(0.145 0 0)",
                        color: "#FFFFFF",
                      }}
                    >
                      <option value="" style={{ backgroundColor: "oklch(0.145 0 0)", color: "#B3B3B3" }}>
                        Select your industry
                      </option>
                      {industries.map((industry) => (
                        <option
                          key={industry}
                          value={industry}
                          style={{ backgroundColor: "oklch(0.145 0 0)", color: "#FFFFFF" }}
                        >
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block font-medium mb-4" style={{ color: "#FFFFFF" }}>
                      Skills & Expertise
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {skillOptions.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => handleSkillToggle(skill)}
                          className={`px-4 py-2 rounded-2xl border transition-all text-sm ${
                            profileData.skills.includes(skill)
                              ? "border-white/30"
                              : "border-white/10 hover:border-white/20"
                          }`}
                          style={{
                            backgroundColor: profileData.skills.includes(skill) ? "oklch(0.145 0 0)" : "transparent",
                            color: profileData.skills.includes(skill) ? "#FFFFFF" : "#B3B3B3",
                          }}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Business Needs */}
                  <div>
                    <label className="block font-medium mb-4" style={{ color: "#FFFFFF" }}>
                      What are you looking for?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {businessNeedOptions.map((need) => (
                        <button
                          key={need}
                          onClick={() => handleBusinessNeedToggle(need)}
                          className={`px-4 py-2 rounded-2xl border transition-all text-sm ${
                            profileData.businessNeeds.includes(need)
                              ? "border-white/30"
                              : "border-white/10 hover:border-white/20"
                          }`}
                          style={{
                            backgroundColor: profileData.businessNeeds.includes(need)
                              ? "oklch(0.145 0 0)"
                              : "transparent",
                            color: profileData.businessNeeds.includes(need) ? "#FFFFFF" : "#B3B3B3",
                          }}
                        >
                          {need}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Upload */}
                  <div>
                    <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                      Portfolio / Resume (Optional)
                    </label>
                    <div
                      className="border-2 border-dashed rounded-2xl p-8 text-center hover:border-white/20 transition-colors"
                      style={{ borderColor: "oklch(0.145 0 0)" }}
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setProfileData((prev) => ({ ...prev, portfolioFile: e.target.files?.[0] }))}
                        className="hidden"
                        id="portfolio-upload"
                      />
                      <label htmlFor="portfolio-upload" className="cursor-pointer">
                        <div className="mb-2" style={{ color: "#B3B3B3" }}>
                          Drop your file here or click to browse
                        </div>
                        <div className="text-sm" style={{ color: "#B3B3B3" }}>
                          PDF, DOC, or DOCX up to 10MB
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="text-center pt-6">
                    <button
                      onClick={handleCreateProfile}
                      disabled={!profileData.name.trim() || !profileData.industry}
                      className="px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#0EA5E9", color: "#FFFFFF" }}
                    >
                      Create My Professional ID
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen flex items-center justify-center p-8"
            >
              <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
                    Welcome to Your BEA Dashboard
                  </h2>
                  <p style={{ color: "#B3B3B3" }}>Your personalized hub for networking and collaboration</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Community Announcements */}
                  <div className="bg-gradient-to-br from-sky-400/35 to-blue-600/20 rounded-2xl p-6 border border-white/10">
                    <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "#FFFFFF" }}>
                      <Calendar className="w-5 h-5" />
                      Upcoming Events
                    </h3>
                    <div className="space-y-3">
                      <div className="rounded-lg p-3" style={{ backgroundColor: "oklch(0.145 0 0)" }}>
                        <div className="font-medium" style={{ color: "#FFFFFF" }}>
                          Founders Connect Mixer
                        </div>
                        <div className="text-sm" style={{ color: "#B3B3B3" }}>
                          Dec 15, 2024 • 6:00 PM
                        </div>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: "oklch(0.145 0 0)" }}>
                        <div className="font-medium" style={{ color: "#FFFFFF" }}>
                          AI Workshop
                        </div>
                        <div className="text-sm" style={{ color: "#B3B3B3" }}>
                          Dec 18, 2024 • 2:00 PM
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Member Spotlights */}
                  <div className="bg-gradient-to-br from-emerald-400/35 to-teal-600/20 rounded-2xl p-6 border border-white/10">
                    <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "#FFFFFF" }}>
                      <Users className="w-5 h-5" />
                      Member Spotlights
                    </h3>
                    <div className="space-y-3">
                      <div
                        className="rounded-lg p-3 flex items-center gap-3"
                        style={{ backgroundColor: "oklch(0.145 0 0)" }}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-sky-400/35 to-blue-600/20 rounded-full"></div>
                        <div>
                          <div className="font-medium text-sm" style={{ color: "#FFFFFF" }}>
                            Sarah Chen
                          </div>
                          <div className="text-xs" style={{ color: "#B3B3B3" }}>
                            AI Startup Founder
                          </div>
                        </div>
                      </div>
                      <div
                        className="rounded-lg p-3 flex items-center gap-3"
                        style={{ backgroundColor: "oklch(0.145 0 0)" }}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400/35 to-teal-600/20 rounded-full"></div>
                        <div>
                          <div className="font-medium text-sm" style={{ color: "#FFFFFF" }}>
                            Alex Rodriguez
                          </div>
                          <div className="text-xs" style={{ color: "#B3B3B3" }}>
                            FinTech Investor
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: "oklch(0.145 0 0)" }}>
                    <MessageCircle className="w-8 h-8 mx-auto mb-2" style={{ color: "#0EA5E9" }} />
                    <div className="font-medium" style={{ color: "#FFFFFF" }}>
                      Pre-Event Chat
                    </div>
                    <div className="text-sm" style={{ color: "#B3B3B3" }}>
                      Connect before events
                    </div>
                  </div>
                  <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: "oklch(0.145 0 0)" }}>
                    <QrCode className="w-8 h-8 mx-auto mb-2" style={{ color: "#10B981" }} />
                    <div className="font-medium" style={{ color: "#FFFFFF" }}>
                      QR Profile
                    </div>
                    <div className="text-sm" style={{ color: "#B3B3B3" }}>
                      Instant networking
                    </div>
                  </div>
                  <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: "oklch(0.145 0 0)" }}>
                    <Users className="w-8 h-8 mx-auto mb-2" style={{ color: "#8B5CF6" }} />
                    <div className="font-medium" style={{ color: "#FFFFFF" }}>
                      AI Matching
                    </div>
                    <div className="text-sm" style={{ color: "#B3B3B3" }}>
                      Find perfect matches
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => router.push("/bea")}
                    className="px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors font-medium"
                    style={{ backgroundColor: "#0EA5E9", color: "#FFFFFF" }}
                  >
                    Explore BEA Community
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
