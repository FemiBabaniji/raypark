"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Upload, User, Check } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import type { UnifiedPortfolio } from "@/components/unified-portfolio-card"
import { THEME_COLOR_OPTIONS, type ThemeIndex } from "@/lib/theme"
import PortfolioBuilder from "@/components/portfolio/builder/PortfolioBuilder"
import type { Identity } from "@/components/portfolio/builder/types"
import { getCommunityByCode, joinCommunity, createPortfolioOnce } from "@/lib/portfolio-service"

interface OnboardingData {
  name: string
  role: string
  email: string
  industry: string
  location: string
  handle: string
  skills: string[]
  goals: string[]
  linkedinUrl: string
  websiteUrl: string
  twitterUrl: string
  avatarFile?: File
  selectedColor: ThemeIndex
}

type OnboardingStep = 1 | 2 | 3 | 4 | 5
type FlowStage = "onboarding" | "portfolio-builder" | "expanded-view" | "complete"

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Consulting",
  "Real Estate",
  "E-commerce",
  "Media",
  "Non-profit",
]

const SKILL_OPTIONS = [
  "Leadership",
  "Strategy",
  "Marketing",
  "Sales",
  "Product Management",
  "Software Development",
  "Data Analysis",
  "Design",
  "Operations",
  "Finance",
]

const GOAL_OPTIONS = [
  "Network with peers",
  "Find mentorship",
  "Grow my business",
  "Raise funding",
  "Hire talent",
  "Learn new skills",
  "Share knowledge",
  "Build partnerships",
]

// Debounce helper
function useDebounced<T>(value: T, delay = 150) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

function clampThemeIndex(i: number): ThemeIndex {
  const max = THEME_COLOR_OPTIONS.length - 1
  const clamped = Math.max(0, Math.min(max, i))
  return clamped as ThemeIndex
}

export default function BEAOnboardingPage() {
  const [stage, setStage] = useState<FlowStage>("onboarding")
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: "",
    role: "",
    email: "",
    industry: "",
    location: "",
    handle: "",
    skills: [],
    goals: [],
    linkedinUrl: "",
    websiteUrl: "",
    twitterUrl: "",
    selectedColor: 1,
  })
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [communityId, setCommunityId] = useState<string | null>(null)
  const [portfolioId, setPortfolioId] = useState<string | null>(null)

  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const communityCode = searchParams.get("code") || "bea-founders-connect"

  useEffect(() => {
    async function fetchCommunity() {
      try {
        const community = await getCommunityByCode(communityCode)
        if (community) {
          setCommunityId(community.id)
        }
      } catch (error) {
        console.error("Error fetching community:", error)
      }
    }
    fetchCommunity()
  }, [communityCode])

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/auth?redirect=/onboarding/bea?code=${communityCode}`)
    }
  }, [user, loading, router, communityCode])

  const identityImmediate: Identity = useMemo(
    () => ({
      name: onboardingData.name,
      title: onboardingData.role,
      subtitle: onboardingData.industry,
      selectedColor: onboardingData.selectedColor,
      email: onboardingData.email,
      location: onboardingData.location,
      handle: onboardingData.handle,
      initials: onboardingData.name
        ? onboardingData.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "",
    }),
    [onboardingData],
  )
  const identityDebounced = useDebounced(identityImmediate, 150)

  const portfolioPreview: UnifiedPortfolio = useMemo(
    () => ({
      id: "preview",
      name: onboardingData.name || "Your Name",
      title: onboardingData.role || "Your Title",
      email: onboardingData.email || undefined,
      location: onboardingData.location || undefined,
      handle: onboardingData.handle || undefined,
      avatarUrl: avatarPreview || undefined,
      selectedColor: onboardingData.selectedColor,
      isLive: false,
    }),
    [onboardingData, avatarPreview],
  )

  const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOnboardingData((prev) => ({ ...prev, avatarFile: file }))
    const url = URL.createObjectURL(file)
    setAvatarPreview((prev) => {
      if (prev.startsWith("blob:")) URL.revokeObjectURL(prev)
      return url
    })
  }, [])

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const toggleSkill = useCallback((skill: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }, [])

  const toggleGoal = useCallback((goal: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal],
    }))
  }, [])

  const canProceedFromStep = useCallback(
    (step: OnboardingStep): boolean => {
      switch (step) {
        case 1:
          return !!(onboardingData.name && onboardingData.role && onboardingData.email)
        case 2:
          return !!(onboardingData.industry && onboardingData.location)
        case 3:
          return onboardingData.skills.length > 0 && onboardingData.goals.length > 0
        case 4:
          return true
        case 5:
          return true
        default:
          return false
      }
    },
    [onboardingData],
  )

  const handleCompleteOnboarding = useCallback(async () => {
    if (!user) return
    try {
      const portfolio = await createPortfolioOnce({
        userId: user.id,
        name: `${onboardingData.name}'s Portfolio`,
        theme_id: "default-theme-id", // Use actual theme ID from your system
        description: `Portfolio for ${onboardingData.name} - ${onboardingData.role}`,
        community_id: communityId || undefined,
      })

      setPortfolioId(portfolio.id)

      if (communityId) {
        await joinCommunity(communityCode, user.id, {
          industry: onboardingData.industry,
          skills: onboardingData.skills,
          goals: onboardingData.goals,
        })
      }

      const portfolioData = {
        id: portfolio.id,
        name: onboardingData.name,
        title: onboardingData.role,
        email: onboardingData.email,
        location: onboardingData.location,
        handle: onboardingData.handle,
        industry: onboardingData.industry,
        skills: onboardingData.skills,
        goals: onboardingData.goals,
        linkedinUrl: onboardingData.linkedinUrl,
        websiteUrl: onboardingData.websiteUrl,
        twitterUrl: onboardingData.twitterUrl,
        avatarUrl: avatarPreview,
        selectedColor: onboardingData.selectedColor,
        isLive: true,
        community_id: communityId,
      }
      localStorage.setItem("bea_portfolio_data", JSON.stringify(portfolioData))

      setStage("portfolio-builder")
    } catch (err) {
      console.error("Error completing onboarding:", err)
      // Still proceed to builder on error
      setStage("portfolio-builder")
    }
  }, [user, onboardingData, communityCode, avatarPreview, communityId])

  const onIdentityChange = useCallback((updatedIdentity: Partial<Identity>) => {
    setOnboardingData((prev) => ({
      ...prev,
      name: updatedIdentity.name ?? prev.name,
      role: updatedIdentity.title ?? prev.role,
      email: updatedIdentity.email ?? prev.email,
      location: updatedIdentity.location ?? prev.location,
      handle: updatedIdentity.handle ?? prev.handle,
      selectedColor:
        updatedIdentity.selectedColor !== undefined
          ? clampThemeIndex(updatedIdentity.selectedColor as number)
          : prev.selectedColor,
    }))
  }, [])

  const onToggleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, onActivate: () => void) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      onActivate()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "oklch(0.18 0 0)" }}>
        <div style={{ color: "#FFFFFF" }}>Loading...</div>
      </div>
    )
  }

  if (stage === "portfolio-builder") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "oklch(0.18 0 0)" }}>
        <div className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between bg-black/20 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <img src="/bea-logo.svg" alt="Black Entrepreneurship Alliance" className="h-8 w-auto" />
            <span className="text-sm font-medium" style={{ color: "#B3B3B3" }}>
              Portfolio Builder
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              onClick={() => setStage("expanded-view")}
              variant="outline"
              className="px-4 py-2 rounded-xl font-medium border-white/20 text-white hover:bg-white/10"
            >
              Preview
            </Button>
            <Button
              type="button"
              onClick={() => setStage("expanded-view")}
              className="px-4 py-2 rounded-xl font-medium"
              style={{ backgroundColor: "#0EA5E9", color: "#FFFFFF" }}
            >
              Continue
            </Button>
          </div>
        </div>

        <div className="pt-20">
          <PortfolioBuilder
            identity={identityDebounced}
            onIdentityChange={onIdentityChange}
            isPreviewMode={false}
            onExportData={() => setStage("expanded-view")}
            isLive={false}
            onToggleLive={() => {}}
          />
        </div>
      </div>
    )
  }

  if (stage === "expanded-view") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "oklch(0.18 0 0)" }}>
        <div className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between bg-black/20 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <img src="/bea-logo.svg" alt="Black Entrepreneurship Alliance" className="h-8 w-auto" />
            <span className="text-sm font-medium" style={{ color: "#B3B3B3" }}>
              Portfolio Preview
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              onClick={() => setStage("portfolio-builder")}
              variant="outline"
              className="px-4 py-2 rounded-xl font-medium border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
            <Button
              type="button"
              onClick={() => {
                const portfolioData = {
                  id: portfolioId,
                  name: onboardingData.name,
                  title: onboardingData.role,
                  email: onboardingData.email,
                  location: onboardingData.location,
                  handle: onboardingData.handle,
                  industry: onboardingData.industry,
                  skills: onboardingData.skills,
                  goals: onboardingData.goals,
                  linkedinUrl: onboardingData.linkedinUrl,
                  websiteUrl: onboardingData.websiteUrl,
                  twitterUrl: onboardingData.twitterUrl,
                  avatarUrl: avatarPreview,
                  selectedColor: onboardingData.selectedColor,
                  isLive: true,
                  community_id: communityId,
                }
                localStorage.setItem("bea_portfolio_data", JSON.stringify(portfolioData))
                router.push("/bea")
              }}
              className="px-4 py-2 rounded-xl font-medium"
              style={{ backgroundColor: "#0EA5E9", color: "#FFFFFF" }}
            >
              Join BEA Community
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="pt-20">
          <PortfolioBuilder
            identity={identityDebounced}
            onIdentityChange={onIdentityChange}
            isPreviewMode={true}
            isLive={false}
            onToggleLive={() => {}}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: "oklch(0.18 0 0)" }}>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between"
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium" style={{ color: "#B3B3B3" }}>
            pathwai × BEA
          </span>
        </div>

        <div className="flex items-center space-x-2 mt-1" aria-label="Progress">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-colors ${step <= currentStep ? "bg-sky-400" : "bg-white/20"}`}
              role="img"
              aria-label={`Step ${step} ${step <= currentStep ? "completed" : "incomplete"}`}
            />
          ))}
        </div>

        <div className="flex items-center space-x-6">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "oklch(0.145 0 0)" }}
            aria-label="Account avatar"
          >
            <span className="text-xs font-medium" style={{ color: "#FFFFFF" }}>
              {user?.name?.[0] || "M"}
            </span>
          </div>
        </div>
      </motion.nav>

      <div className="pt-20">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-6xl w-full flex gap-12">
            {/* Form Section */}
            <div className="flex-1 max-w-lg">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2" style={{ color: "#FFFFFF" }}>
                  Step {currentStep} of 5
                </h2>
                <p style={{ color: "#B3B3B3" }}>
                  {currentStep === 1 && "Let's start with your basic information"}
                  {currentStep === 2 && "Tell us about your professional background"}
                  {currentStep === 3 && "What are your skills and goals?"}
                  {currentStep === 4 && "Share your professional links"}
                  {currentStep === 5 && "Customize your visual identity"}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="fullName" className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={onboardingData.name}
                        onChange={(e) => setOnboardingData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                        autoComplete="name"
                        className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                        style={{ backgroundColor: "oklch(0.145 0 0)", borderColor: "oklch(0.2 0 0)", color: "#FFFFFF" }}
                      />
                    </div>

                    <div>
                      <label htmlFor="title" className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                        Professional Title *
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={onboardingData.role}
                        onChange={(e) => setOnboardingData((prev) => ({ ...prev, role: e.target.value }))}
                        placeholder="Founder & CEO"
                        autoComplete="organization-title"
                        className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                        style={{ backgroundColor: "oklch(0.145 0 0)", borderColor: "oklch(0.2 0 0)", color: "#FFFFFF" }}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={onboardingData.email}
                        onChange={(e) => setOnboardingData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="john@company.com"
                        autoComplete="email"
                        className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                        style={{ backgroundColor: "oklch(0.145 0 0)", borderColor: "oklch(0.2 0 0)", color: "#FFFFFF" }}
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                        Industry Focus *
                      </label>
                      <div className="grid grid-cols-2 gap-3" role="grid" aria-label="Industry options">
                        {INDUSTRIES.map((industry) => {
                          const selected = onboardingData.industry === industry
                          return (
                            <button
                              key={industry}
                              type="button"
                              role="button"
                              aria-pressed={selected}
                              onKeyDown={(e) =>
                                onToggleKeyDown(e, () => setOnboardingData((p) => ({ ...p, industry })))
                              }
                              onClick={() => setOnboardingData((prev) => ({ ...prev, industry }))}
                              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                                selected
                                  ? "bg-gradient-to-r from-sky-400/20 to-blue-500/20 border-sky-400/50 text-sky-300"
                                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                              } border`}
                            >
                              {industry}
                              {selected && <Check className="w-4 h-4 ml-2 inline" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="location" className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                        Location *
                      </label>
                      <input
                        id="location"
                        type="text"
                        value={onboardingData.location}
                        onChange={(e) => setOnboardingData((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="San Francisco, CA"
                        autoComplete="address-level2"
                        className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                        style={{ backgroundColor: "oklch(0.145 0 0)", borderColor: "oklch(0.2 0 0)", color: "#FFFFFF" }}
                      />
                    </div>

                    <div>
                      <label htmlFor="handle" className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                        Handle (Optional)
                      </label>
                      <input
                        id="handle"
                        type="text"
                        value={onboardingData.handle}
                        onChange={(e) => setOnboardingData((prev) => ({ ...prev, handle: e.target.value }))}
                        placeholder="johndoe"
                        autoComplete="nickname"
                        className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                        style={{ backgroundColor: "oklch(0.145 0 0)", borderColor: "oklch(0.2 0 0)", color: "#FFFFFF" }}
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block font-medium mb-3" style={{ color: "#FFFFFF" }}>
                        Your Skills * (Select at least 1)
                      </label>
                      <div className="grid grid-cols-2 gap-3" aria-label="Skills">
                        {SKILL_OPTIONS.map((skill) => {
                          const selected = onboardingData.skills.includes(skill)
                          return (
                            <button
                              key={skill}
                              type="button"
                              role="button"
                              aria-pressed={selected}
                              onKeyDown={(e) => onToggleKeyDown(e, () => toggleSkill(skill))}
                              onClick={() => toggleSkill(skill)}
                              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                                selected
                                  ? "bg-gradient-to-r from-sky-400/20 to-blue-500/20 border-sky-400/50 text-sky-300"
                                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                              } border`}
                            >
                              {skill}
                              {selected && <Check className="w-4 h-4 ml-2 inline" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium mb-3" style={{ color: "#FFFFFF" }}>
                        Your Goals * (Select at least 1)
                      </label>
                      <div className="grid grid-cols-1 gap-3" aria-label="Goals">
                        {GOAL_OPTIONS.map((goal) => {
                          const selected = onboardingData.goals.includes(goal)
                          return (
                            <button
                              key={goal}
                              type="button"
                              role="button"
                              aria-pressed={selected}
                              onKeyDown={(e) => onToggleKeyDown(e, () => toggleGoal(goal))}
                              onClick={() => toggleGoal(goal)}
                              className={`p-3 rounded-2xl text-sm font-medium transition-all text-left ${
                                selected
                                  ? "bg-gradient-to-r from-sky-400/20 to-blue-500/20 border-sky-400/50 text-sky-300"
                                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                              } border`}
                            >
                              {goal}
                              {selected && <Check className="w-4 h-4 ml-2 inline float-right" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="linkedin" className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                        LinkedIn Profile
                      </label>
                      <input
                        id="linkedin"
                        type="url"
                        value={onboardingData.linkedinUrl}
                        onChange={(e) => setOnboardingData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                        placeholder="https://linkedin.com/in/johndoe"
                        autoComplete="url"
                        className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                        style={{ backgroundColor: "oklch(0.145 0 0)", borderColor: "oklch(0.2 0 0)", color: "#FFFFFF" }}
                      />
                    </div>

                    <div>
                      <label htmlFor="website" className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                        Website
                      </label>
                      <input
                        id="website"
                        type="url"
                        value={onboardingData.websiteUrl}
                        onChange={(e) => setOnboardingData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                        placeholder="https://yourwebsite.com"
                        autoComplete="url"
                        className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                        style={{ backgroundColor: "oklch(0.145 0 0)", borderColor: "oklch(0.2 0 0)", color: "#FFFFFF" }}
                      />
                    </div>

                    <div>
                      <label htmlFor="twitter" className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                        Twitter/X Profile
                      </label>
                      <input
                        id="twitter"
                        type="url"
                        value={onboardingData.twitterUrl}
                        onChange={(e) => setOnboardingData((prev) => ({ ...prev, twitterUrl: e.target.value }))}
                        placeholder="https://twitter.com/johndoe"
                        autoComplete="url"
                        className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                        style={{ backgroundColor: "oklch(0.145 0 0)", borderColor: "oklch(0.2 0 0)", color: "#FFFFFF" }}
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <label className="block font-medium mb-4" style={{ color: "#FFFFFF" }}>
                        Profile Photo
                      </label>
                      <div className="relative inline-block">
                        <div
                          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-2"
                          style={{ backgroundColor: "oklch(0.145 0 0)", borderColor: "oklch(0.2 0 0)" }}
                        >
                          {avatarPreview ? (
                            <img
                              src={avatarPreview || "/placeholder.svg"}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8" style={{ color: "#B3B3B3" }} />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: "#0EA5E9" }}
                          aria-label="Upload profile photo"
                        >
                          <Upload className="w-4 h-4" style={{ color: "#FFFFFF" }} />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium mb-4" style={{ color: "#FFFFFF" }}>
                        Choose Your Theme Color
                      </label>
                      <div className="grid grid-cols-4 gap-3" role="grid" aria-label="Theme colors">
                        {THEME_COLOR_OPTIONS.map((theme, index) => {
                          const selected = onboardingData.selectedColor === index
                          return (
                            <button
                              key={theme.name}
                              type="button"
                              role="button"
                              aria-pressed={selected}
                              aria-label={`Theme ${theme.name}`}
                              onKeyDown={(e) =>
                                onToggleKeyDown(e, () =>
                                  setOnboardingData((prev) => ({
                                    ...prev,
                                    selectedColor: clampThemeIndex(index),
                                  })),
                                )
                              }
                              onClick={() =>
                                setOnboardingData((prev) => ({
                                  ...prev,
                                  selectedColor: clampThemeIndex(index),
                                }))
                              }
                              className={`aspect-square rounded-2xl bg-gradient-to-br ${theme.gradient} border-2 transition-all hover:scale-105 ${
                                selected ? "border-white" : "border-transparent"
                              }`}
                            >
                              {selected && <Check className="w-6 h-6 text-white mx-auto" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1) as OnboardingStep)}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="px-6 py-3 rounded-2xl font-medium border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                {currentStep < 5 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(Math.min(5, currentStep + 1) as OnboardingStep)}
                    disabled={!canProceedFromStep(currentStep)}
                    className="px-6 py-3 rounded-2xl font-medium disabled:opacity-50"
                    style={{ backgroundColor: "#0EA5E9", color: "#FFFFFF" }}
                    aria-disabled={!canProceedFromStep(currentStep)}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleCompleteOnboarding}
                    className="px-6 py-3 rounded-2xl font-medium"
                    style={{ backgroundColor: "#0EA5E9", color: "#FFFFFF" }}
                  >
                    Complete Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>

            {/* Live Preview */}
            <div className="flex-1 max-w-md">
              <div className="sticky top-8">
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "#FFFFFF" }}>
                    Live Preview
                  </h3>
                  <p className="text-sm" style={{ color: "#B3B3B3" }}>
                    Your business card updates as you type
                  </p>
                </div>

                <div className="max-w-sm mx-auto">
                  <UnifiedPortfolioCard portfolio={portfolioPreview} onClick={() => {}} />
                </div>
              </div>
            </div>
            {/* /Live Preview */}
          </div>
        </div>
      </div>
    </div>
  )
}
