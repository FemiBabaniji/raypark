"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Users, Upload, User, Briefcase, Link, Mail, Phone, MapPin } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface BusinessCardData {
  name: string
  role: string
  company: string
  email: string
  phone: string
  location: string
  linkedinUrl: string
  websiteUrl: string
  avatarFile?: File
}

export default function BEAOnboardingPage() {
  const [step, setStep] = useState<"welcome" | "form" | "complete">("welcome")
  const [cardData, setCardData] = useState<BusinessCardData>({
    name: "",
    role: "",
    company: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
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

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCardData((prev) => ({ ...prev, avatarFile: file }))
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCreateCard = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/community-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...cardData,
          communityCode,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create business card")
      }

      setStep("complete")
    } catch (error) {
      console.error("Error creating business card:", error)
      setStep("complete")
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
                  <User className="w-8 h-8" style={{ color: "#FFFFFF" }} />
                </div>
                <h1 className="text-4xl font-bold mb-6" style={{ color: "#FFFFFF" }}>
                  Create Your Digital Business Card
                </h1>
                <p className="text-xl mb-12" style={{ color: "#B3B3B3" }}>
                  Build a professional digital business card that updates in real-time and connects you with the BEA
                  community.
                </p>
                <button
                  onClick={() => setStep("form")}
                  className="flex items-center gap-2 mx-auto px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors font-medium"
                  style={{ backgroundColor: "#0EA5E9", color: "#FFFFFF" }}
                >
                  Create My Business Card
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
              className="min-h-screen flex items-center justify-center p-8"
            >
              <div className="max-w-6xl w-full flex gap-12">
                {/* Form Section */}
                <div className="flex-1 max-w-lg">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2" style={{ color: "#FFFFFF" }}>
                      Business Card Details
                    </h2>
                    <p style={{ color: "#B3B3B3" }}>Fill in your information to create your digital business card</p>
                  </div>

                  <div className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="text-center">
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
                        >
                          <Upload className="w-4 h-4" style={{ color: "#FFFFFF" }} />
                        </label>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={cardData.name}
                          onChange={(e) => setCardData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                          style={{
                            backgroundColor: "oklch(0.145 0 0)",
                            borderColor: "oklch(0.2 0 0)",
                            color: "#FFFFFF",
                          }}
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                          Professional Title
                        </label>
                        <input
                          type="text"
                          value={cardData.role}
                          onChange={(e) => setCardData((prev) => ({ ...prev, role: e.target.value }))}
                          placeholder="Founder & CEO"
                          className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                          style={{
                            backgroundColor: "oklch(0.145 0 0)",
                            borderColor: "oklch(0.2 0 0)",
                            color: "#FFFFFF",
                          }}
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                          Company
                        </label>
                        <input
                          type="text"
                          value={cardData.company}
                          onChange={(e) => setCardData((prev) => ({ ...prev, company: e.target.value }))}
                          placeholder="Tech Innovations Inc."
                          className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                          style={{
                            backgroundColor: "oklch(0.145 0 0)",
                            borderColor: "oklch(0.2 0 0)",
                            color: "#FFFFFF",
                          }}
                        />
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={cardData.email}
                          onChange={(e) => setCardData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="john@company.com"
                          className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                          style={{
                            backgroundColor: "oklch(0.145 0 0)",
                            borderColor: "oklch(0.2 0 0)",
                            color: "#FFFFFF",
                          }}
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={cardData.phone}
                          onChange={(e) => setCardData((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (555) 123-4567"
                          className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                          style={{
                            backgroundColor: "oklch(0.145 0 0)",
                            borderColor: "oklch(0.2 0 0)",
                            color: "#FFFFFF",
                          }}
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                          Location
                        </label>
                        <input
                          type="text"
                          value={cardData.location}
                          onChange={(e) => setCardData((prev) => ({ ...prev, location: e.target.value }))}
                          placeholder="San Francisco, CA"
                          className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                          style={{
                            backgroundColor: "oklch(0.145 0 0)",
                            borderColor: "oklch(0.2 0 0)",
                            color: "#FFFFFF",
                          }}
                        />
                      </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={cardData.linkedinUrl}
                          onChange={(e) => setCardData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                          placeholder="https://linkedin.com/in/johndoe"
                          className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                          style={{
                            backgroundColor: "oklch(0.145 0 0)",
                            borderColor: "oklch(0.2 0 0)",
                            color: "#FFFFFF",
                          }}
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-2" style={{ color: "#FFFFFF" }}>
                          Website
                        </label>
                        <input
                          type="url"
                          value={cardData.websiteUrl}
                          onChange={(e) => setCardData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                          placeholder="https://yourwebsite.com"
                          className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-colors"
                          style={{
                            backgroundColor: "oklch(0.145 0 0)",
                            borderColor: "oklch(0.2 0 0)",
                            color: "#FFFFFF",
                          }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCreateCard}
                      disabled={!cardData.name || !cardData.role}
                      className="w-full py-4 rounded-2xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#0EA5E9", color: "#FFFFFF" }}
                    >
                      Create Business Card
                    </button>
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

                    <div
                      className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
                      style={{ minHeight: "400px" }}
                    >
                      {/* Header with Avatar */}
                      <div className="text-center mb-6">
                        <div
                          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-2"
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
                        <h2 className="text-2xl font-bold mb-1" style={{ color: "#FFFFFF" }}>
                          {cardData.name || "Your Name"}
                        </h2>
                        <p className="text-lg mb-1" style={{ color: "#0EA5E9" }}>
                          {cardData.role || "Your Title"}
                        </p>
                        {cardData.company && (
                          <p className="text-sm" style={{ color: "#B3B3B3" }}>
                            {cardData.company}
                          </p>
                        )}
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-3">
                        {cardData.email && (
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4" style={{ color: "#0EA5E9" }} />
                            <span className="text-sm" style={{ color: "#FFFFFF" }}>
                              {cardData.email}
                            </span>
                          </div>
                        )}

                        {cardData.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4" style={{ color: "#0EA5E9" }} />
                            <span className="text-sm" style={{ color: "#FFFFFF" }}>
                              {cardData.phone}
                            </span>
                          </div>
                        )}

                        {cardData.location && (
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4" style={{ color: "#0EA5E9" }} />
                            <span className="text-sm" style={{ color: "#FFFFFF" }}>
                              {cardData.location}
                            </span>
                          </div>
                        )}

                        {cardData.linkedinUrl && (
                          <div className="flex items-center gap-3">
                            <Link className="w-4 h-4" style={{ color: "#0EA5E9" }} />
                            <span className="text-sm" style={{ color: "#FFFFFF" }}>
                              LinkedIn Profile
                            </span>
                          </div>
                        )}

                        {cardData.websiteUrl && (
                          <div className="flex items-center gap-3">
                            <Briefcase className="w-4 h-4" style={{ color: "#0EA5E9" }} />
                            <span className="text-sm" style={{ color: "#FFFFFF" }}>
                              Website
                            </span>
                          </div>
                        )}
                      </div>

                      {/* BEA Badge */}
                      <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <div
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
                          style={{ backgroundColor: "oklch(0.145 0 0)" }}
                        >
                          <img src="/bea-logo.svg" alt="BEA" className="h-4 w-auto" />
                          <span className="text-xs font-medium" style={{ color: "#FFFFFF" }}>
                            BEA Member
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen flex items-center justify-center p-8"
            >
              <div className="text-center max-w-2xl">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400/35 to-teal-600/20 rounded-2xl mx-auto mb-8 flex items-center justify-center">
                  <Users className="w-8 h-8" style={{ color: "#FFFFFF" }} />
                </div>
                <h1 className="text-4xl font-bold mb-6" style={{ color: "#FFFFFF" }}>
                  Business Card Created!
                </h1>
                <p className="text-xl mb-12" style={{ color: "#B3B3B3" }}>
                  Your digital business card is ready. Start networking with the BEA community.
                </p>
                <Button
                  onClick={() => router.push("/bea")}
                  className="px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors font-medium"
                  style={{ backgroundColor: "#0EA5E9", color: "#FFFFFF" }}
                >
                  Enter BEA Community
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
