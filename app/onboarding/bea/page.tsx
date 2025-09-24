"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Users, Calendar, MessageCircle, QrCode, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import JennyWilsonPortfolio from "@/components/jenny-wilson-portfolio"

interface ProfileData {
  name: string
  role: string
  industry: string
  skills: string[]
  businessNeeds: string[]
  goals: string
  linkedinUrl: string
  portfolioUrl: string
  websiteUrl: string
  avatarFile?: File
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

const formSteps = [
  { id: "basic", title: "Basic Info", fields: ["name", "role"] },
  { id: "industry", title: "Industry & Skills", fields: ["industry", "skills"] },
  { id: "goals", title: "Goals & Needs", fields: ["goals", "businessNeeds"] },
  { id: "links", title: "Links & Portfolio", fields: ["linkedinUrl", "portfolioUrl", "websiteUrl"] },
  { id: "uploads", title: "Avatar & Resume", fields: ["avatarFile", "portfolioFile"] },
]

export default function BEAOnboardingPage() {
  const [step, setStep] = useState<"welcome" | "form" | "dashboard" | "complete">("welcome")
  const [currentFormStep, setCurrentFormStep] = useState(0)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    role: "",
    industry: "",
    skills: [],
    businessNeeds: [],
    goals: "",
    linkedinUrl: "",
    portfolioUrl: "",
    websiteUrl: "",
  })
  const [avatarPreview, setAvatarPreview] = useState<string>("")

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

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileData((prev) => ({ ...prev, avatarFile: file }))
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
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
      setStep("dashboard")
    }
  }

  const nextFormStep = () => {
    if (currentFormStep < formSteps.length - 1) {
      setCurrentFormStep(currentFormStep + 1)
    } else {
      handleCreateProfile()
    }
  }

  const prevFormStep = () => {
    if (currentFormStep > 0) {
      setCurrentFormStep(currentFormStep - 1)
    }
  }

  const isCurrentStepValid = () => {
    const currentStep = formSteps[currentFormStep]
    switch (currentStep.id) {
      case "basic":
        return profileData.name.trim() && profileData.role.trim()
      case "industry":
        return profileData.industry && profileData.skills.length > 0
      case "goals":
        return profileData.goals.trim() && profileData.businessNeeds.length > 0
      case "links":
        return true // Optional fields
      case "uploads":
        return true // Optional fields
      default:
        return true
    }
  }

  const activeIdentity = {
    name: profileData.name || "Your Name",
    selectedColor: 0,
    avatarUrl: avatarPreview || "/professional-woman-headshot.png",
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
          <img src="/bea-logo.svg" alt="Black Entrepreneurship Alliance" className="h-8 w-auto" />
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
                  onClick={() => setStep("form")}
                  className="flex items-center gap-2 mx-auto px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors font-medium"
                  style={{ backgroundColor: "#0EA5E9", color: "#FFFFFF" }}
                >
                  Build My Professional ID
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen flex"
            >
              <div className="w-1/2 p-8 overflow-y-auto">
                <div className="max-w-lg mx-auto">
                  {/* Progress indicator */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>
                        {formSteps[currentFormStep].title}
                      </h2>
                      <span className="text-sm" style={{ color: "#B3B3B3" }}>
                        {currentFormStep + 1} of {formSteps.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentFormStep + 1) / formSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Form Steps */}
                  <div className="space-y-6">
                    {/* Basic Info */}
                    {currentFormStep === 0 && (
                      <div className="space-y-6">
                        <div>
                          <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                            Full Name *
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
                        <div>
                          <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                            Professional Role *
                          </label>
                          <input
                            type="text"
                            value={profileData.role}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, role: e.target.value }))}
                            placeholder="e.g., Product Manager, Founder, Developer"
                            className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                            style={{
                              backgroundColor: "oklch(0.145 0 0)",
                              borderColor: "oklch(0.145 0 0)",
                              color: "#FFFFFF",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Industry & Skills */}
                    {currentFormStep === 1 && (
                      <div className="space-y-6">
                        <div>
                          <label className="block font-medium mb-4" style={{ color: "#FFFFFF" }}>
                            Industry Focus *
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {industries.map((industry) => (
                              <button
                                key={industry}
                                type="button"
                                onClick={() =>
                                  setProfileData((prev) => ({
                                    ...prev,
                                    industry: prev.industry === industry ? "" : industry,
                                  }))
                                }
                                className={`relative overflow-hidden rounded-xl p-4 text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${
                                  profileData.industry === industry
                                    ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/20"
                                    : "hover:shadow-md"
                                }`}
                                style={{
                                  backgroundColor:
                                    profileData.industry === industry ? "oklch(0.18 0 0)" : "oklch(0.145 0 0)",
                                  border:
                                    profileData.industry === industry
                                      ? "1px solid #3b82f6"
                                      : "1px solid oklch(0.2 0 0)",
                                  color: "#FFFFFF",
                                }}
                              >
                                <div
                                  className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 transition-opacity duration-300 ${
                                    profileData.industry === industry ? "opacity-100" : "opacity-0 hover:opacity-50"
                                  }`}
                                ></div>
                                <div className="relative flex items-center justify-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                      profileData.industry === industry
                                        ? "bg-blue-500 shadow-lg shadow-blue-500/50"
                                        : "bg-gray-500"
                                    }`}
                                  ></div>
                                  <span className="text-center leading-tight">{industry}</span>
                                </div>
                                {profileData.industry === industry && (
                                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block font-medium mb-4" style={{ color: "#FFFFFF" }}>
                            Skills & Expertise *
                          </label>
                          <div className="grid grid-cols-2 gap-3">
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
                                  backgroundColor: profileData.skills.includes(skill)
                                    ? "oklch(0.145 0 0)"
                                    : "transparent",
                                  color: profileData.skills.includes(skill) ? "#FFFFFF" : "#B3B3B3",
                                }}
                              >
                                {skill}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Goals & Needs */}
                    {currentFormStep === 2 && (
                      <div className="space-y-6">
                        <div>
                          <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                            Professional Goals *
                          </label>
                          <textarea
                            value={profileData.goals}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, goals: e.target.value }))}
                            placeholder="Describe your professional goals and what you're working towards..."
                            rows={4}
                            className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors resize-none"
                            style={{
                              backgroundColor: "oklch(0.145 0 0)",
                              borderColor: "oklch(0.145 0 0)",
                              color: "#FFFFFF",
                            }}
                          />
                        </div>

                        <div>
                          <label className="block font-medium mb-4" style={{ color: "#FFFFFF" }}>
                            What are you looking for? *
                          </label>
                          <div className="grid grid-cols-2 gap-3">
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
                      </div>
                    )}

                    {/* Links & Portfolio */}
                    {currentFormStep === 3 && (
                      <div className="space-y-6">
                        <div>
                          <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                            LinkedIn URL
                          </label>
                          <input
                            type="url"
                            value={profileData.linkedinUrl}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                            placeholder="https://linkedin.com/in/yourprofile"
                            className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                            style={{
                              backgroundColor: "oklch(0.145 0 0)",
                              borderColor: "oklch(0.145 0 0)",
                              color: "#FFFFFF",
                            }}
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                            Portfolio URL
                          </label>
                          <input
                            type="url"
                            value={profileData.portfolioUrl}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
                            placeholder="https://yourportfolio.com"
                            className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                            style={{
                              backgroundColor: "oklch(0.145 0 0)",
                              borderColor: "oklch(0.145 0 0)",
                              color: "#FFFFFF",
                            }}
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                            Website URL
                          </label>
                          <input
                            type="url"
                            value={profileData.websiteUrl}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                            placeholder="https://yourwebsite.com"
                            className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                            style={{
                              backgroundColor: "oklch(0.145 0 0)",
                              borderColor: "oklch(0.145 0 0)",
                              color: "#FFFFFF",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Avatar & Resume */}
                    {currentFormStep === 4 && (
                      <div className="space-y-6">
                        <div>
                          <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                            Profile Avatar
                          </label>
                          <div
                            className="border-2 border-dashed rounded-2xl p-6 text-center hover:border-white/20 transition-colors"
                            style={{ borderColor: "oklch(0.145 0 0)" }}
                          >
                            {avatarPreview ? (
                              <div className="space-y-4">
                                <img
                                  src={avatarPreview || "/placeholder.svg"}
                                  alt="Avatar preview"
                                  className="w-20 h-20 rounded-full mx-auto object-cover"
                                />
                                <button
                                  onClick={() => document.getElementById("avatar-upload")?.click()}
                                  className="text-sm px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                  style={{ color: "#0EA5E9" }}
                                >
                                  Change Avatar
                                </button>
                              </div>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleAvatarUpload}
                                  className="hidden"
                                  id="avatar-upload"
                                />
                                <label htmlFor="avatar-upload" className="cursor-pointer">
                                  <div className="mb-2" style={{ color: "#B3B3B3" }}>
                                    Drop your avatar here or click to browse
                                  </div>
                                  <div className="text-sm" style={{ color: "#B3B3B3" }}>
                                    JPG, PNG up to 5MB
                                  </div>
                                </label>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                            Portfolio / Resume
                          </label>
                          <div
                            className="border-2 border-dashed rounded-2xl p-6 text-center hover:border-white/20 transition-colors"
                            style={{ borderColor: "oklch(0.145 0 0)" }}
                          >
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) =>
                                setProfileData((prev) => ({ ...prev, portfolioFile: e.target.files?.[0] }))
                              }
                              className="hidden"
                              id="portfolio-upload"
                            />
                            <label htmlFor="portfolio-upload" className="cursor-pointer">
                              <div className="mb-2" style={{ color: "#B3B3B3" }}>
                                {profileData.portfolioFile
                                  ? profileData.portfolioFile.name
                                  : "Drop your file here or click to browse"}
                              </div>
                              <div className="text-sm" style={{ color: "#B3B3B3" }}>
                                PDF, DOC, or DOCX up to 10MB
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between pt-8">
                    <button
                      onClick={prevFormStep}
                      disabled={currentFormStep === 0}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "oklch(0.145 0 0)", color: "#FFFFFF" }}
                    >
                      <ChevronLeft size={20} />
                      Previous
                    </button>
                    <button
                      onClick={nextFormStep}
                      disabled={!isCurrentStepValid()}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#0EA5E9", color: "#FFFFFF" }}
                    >
                      {currentFormStep === formSteps.length - 1 ? "Create Profile" : "Next"}
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-1/2 p-8 overflow-y-auto">
                <div className="sticky top-0">
                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFFFFF" }}>
                      Live Preview
                    </h3>
                    <p className="text-sm" style={{ color: "#B3B3B3" }}>
                      See how your portfolio looks as you type
                    </p>
                  </div>
                  <div className="transform scale-75 origin-top">
                    <JennyWilsonPortfolio isPreviewMode={true} activeIdentity={activeIdentity} />
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
