"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ZoomOut, ArrowRight, Check, Plus, Edit3, ImageIcon, Type, User } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface PortfolioTemplate {
  id: string
  name: string
  description: string
  color: string
  preview: React.ReactNode
}

const portfolioTemplates: PortfolioTemplate[] = [
  {
    id: "developer",
    name: "Developer Portfolio",
    description: "Perfect for showcasing your coding projects and technical skills",
    color: "from-blue-400/40 to-blue-600/60",
    preview: (
      <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-4">
        <div className="space-y-2">
          <div className="h-2 bg-blue-400/60 rounded w-3/4"></div>
          <div className="h-2 bg-blue-400/40 rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="h-8 bg-blue-400/30 rounded"></div>
            <div className="h-8 bg-purple-400/30 rounded"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "designer",
    name: "Designer Portfolio",
    description: "Showcase your creative work and design process",
    color: "from-pink-400/40 to-rose-600/60",
    preview: (
      <div className="w-full h-32 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-lg p-4">
        <div className="space-y-2">
          <div className="h-2 bg-pink-400/60 rounded w-2/3"></div>
          <div className="h-2 bg-rose-400/40 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-1 mt-4">
            <div className="h-6 bg-pink-400/40 rounded"></div>
            <div className="h-6 bg-rose-400/40 rounded"></div>
            <div className="h-6 bg-pink-400/30 rounded"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "analyst",
    name: "Data Analyst Portfolio",
    description: "Display your data insights and analytical projects",
    color: "from-green-400/40 to-emerald-600/60",
    preview: (
      <div className="w-full h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4">
        <div className="space-y-2">
          <div className="h-2 bg-green-400/60 rounded w-4/5"></div>
          <div className="h-2 bg-emerald-400/40 rounded w-3/5"></div>
          <div className="flex gap-1 mt-4">
            <div className="h-8 w-2 bg-green-400/50 rounded"></div>
            <div className="h-6 w-2 bg-green-400/40 rounded mt-2"></div>
            <div className="h-10 w-2 bg-emerald-400/50 rounded"></div>
            <div className="h-4 w-2 bg-green-400/30 rounded mt-4"></div>
          </div>
        </div>
      </div>
    ),
  },
]

const widgetTypes = [
  {
    type: "header",
    name: "Header",
    icon: Type,
    description: "Add titles and headings to structure your content",
    example: { title: "Welcome to My Portfolio", subtitle: "Full Stack Developer" },
  },
  {
    type: "text",
    name: "Text Block",
    icon: Edit3,
    description: "Add paragraphs, descriptions, and rich text content",
    example: { content: "I'm passionate about creating innovative web solutions..." },
  },
  {
    type: "image",
    name: "Image",
    icon: ImageIcon,
    description: "Showcase your photos, screenshots, and visual work",
    example: { src: "/placeholder.svg?height=200&width=300" },
  },
  {
    type: "profile",
    name: "Profile",
    icon: User,
    description: "Add your professional photo and bio information",
    example: { name: "Your Name", role: "Your Role", bio: "Your professional summary" },
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState<"welcome" | "template" | "details" | "widgets" | "creating">("welcome")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [portfolioName, setPortfolioName] = useState("")
  const [portfolioDescription, setPortfolioDescription] = useState("")
  const [viewMode, setViewMode] = useState<"expanded" | "minimized">("expanded")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedWidgetType, setSelectedWidgetType] = useState<string | null>(null)
  const [isFirstTimeUser] = useState<boolean>(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  const handleZoomOut = () => {
    setViewMode("minimized")
    setIsPreviewMode(false)
  }

  const handleCreatePortfolio = async () => {
    if (!user || !selectedTemplate) return

    setStep("creating")

    try {
      const response = await fetch("/api/portfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: portfolioName,
          description: portfolioDescription,
          slug: portfolioName.toLowerCase().replace(/\s+/g, "-"),
          template: selectedTemplate,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create portfolio: ${response.status}`)
      }

      const portfolio = await response.json()
      console.log("[v0] Portfolio created successfully:", portfolio)

      if (isFirstTimeUser) {
        setStep("widgets")
      } else {
        handleFinishOnboarding()
      }
    } catch (error) {
      console.error("[v0] Error creating portfolio:", error)
      setStep("details")
    }
  }

  const handleFinishOnboarding = () => {
    const slug = portfolioName.toLowerCase().replace(/\s+/g, "-")
    router.push(`/portfolio/${slug}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between"
        animate={{
          opacity: isPreviewMode ? 0 : 1,
          y: isPreviewMode ? -20 : 0,
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-neutral-400">pathwai</span>
        </div>

        <div className="flex items-center space-x-6">
          <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">{user?.name?.[0] || "U"}</span>
          </div>
        </div>
      </motion.nav>

      {/* Zoom Out Button */}
      {!isPreviewMode && viewMode === "expanded" && (
        <div className="fixed top-24 right-4 z-50 flex gap-2">
          <button
            onClick={handleZoomOut}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors"
          >
            <ZoomOut size={16} />
            Zoom Out
          </button>
          <button
            onClick={() => setIsPreviewMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors"
          >
            Preview Mode
          </button>
        </div>
      )}

      <div className={isPreviewMode ? "pt-0" : "pt-20"}>
        <AnimatePresence mode="wait">
          {viewMode === "minimized" ? (
            <motion.div
              key="minimized"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="min-h-screen flex items-center justify-center p-8"
            >
              <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                  <h1 className="text-3xl font-bold text-white mb-4">Create Your Portfolio</h1>
                  <p className="text-neutral-400">Choose a template and customize it to showcase your work</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {portfolioTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedTemplate(template.id)
                        setViewMode("expanded")
                        setStep("template")
                      }}
                      className="cursor-pointer group"
                    >
                      <div className={`bg-gradient-to-br ${template.color} rounded-3xl p-6 shadow-2xl`}>
                        {template.preview}
                        <div className="mt-4 space-y-2">
                          <h3 className="text-white font-medium text-lg">{template.name}</h3>
                          <p className="text-white/70 text-sm">{template.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex gap-4 p-4 lg:gap-6 lg:p-6 xl:gap-8 xl:p-8 2xl:gap-12 2xl:p-12"
            >
              {/* Main Content */}
              <motion.div
                className={isPreviewMode ? "w-full" : "flex-1 lg:pr-80 xl:pr-96 2xl:pr-[28rem]"}
                animate={{
                  x: isPreviewMode ? "0rem" : "0rem",
                  scale: isPreviewMode ? 1 : 1,
                }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className={isPreviewMode ? "max-w-5xl mx-auto px-4 lg:px-6 xl:px-8 2xl:px-12" : ""}>
                  {/* Onboarding Steps */}
                  <AnimatePresence mode="wait">
                    {step === "welcome" && (
                      <motion.div
                        key="welcome"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="min-h-screen flex items-center justify-center"
                      >
                        <div className="text-center max-w-2xl">
                          <div className="w-24 h-24 bg-gradient-to-br from-pink-400 via-purple-500 to-pink-600 rounded-full mx-auto mb-8 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <h1 className="text-4xl font-bold text-white mb-6">Welcome to Pathwai</h1>
                          <p className="text-xl text-neutral-400 mb-12">
                            Let's create your professional portfolio in just a few steps
                          </p>
                          <button
                            onClick={() => setStep("template")}
                            className="flex items-center gap-2 mx-auto px-8 py-4 bg-white text-black rounded-2xl hover:bg-neutral-200 transition-colors font-medium"
                          >
                            Get Started
                            <ArrowRight size={20} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === "template" && (
                      <motion.div
                        key="template"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="min-h-screen flex items-center justify-center p-8"
                      >
                        <div className="max-w-4xl w-full">
                          <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Choose Your Template</h2>
                            <p className="text-neutral-400">Select a template that best represents your profession</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {portfolioTemplates.map((template) => (
                              <motion.div
                                key={template.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedTemplate(template.id)}
                                className={`cursor-pointer border-2 rounded-3xl p-6 transition-all ${
                                  selectedTemplate === template.id
                                    ? "border-white bg-white/5"
                                    : "border-neutral-700 hover:border-neutral-600"
                                }`}
                              >
                                <div className={`bg-gradient-to-br ${template.color} rounded-2xl p-4 mb-4`}>
                                  {template.preview}
                                </div>
                                <h3 className="text-white font-medium text-lg mb-2">{template.name}</h3>
                                <p className="text-neutral-400 text-sm">{template.description}</p>
                                {selectedTemplate === template.id && (
                                  <div className="mt-3 flex items-center gap-2 text-white">
                                    <Check size={16} />
                                    <span className="text-sm">Selected</span>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>

                          <div className="text-center">
                            <button
                              onClick={() => setStep("details")}
                              disabled={!selectedTemplate}
                              className="px-8 py-4 bg-white text-black rounded-2xl hover:bg-neutral-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === "details" && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="min-h-screen flex items-center justify-center p-8"
                      >
                        <div className="max-w-2xl w-full">
                          <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Portfolio Details</h2>
                            <p className="text-neutral-400">Give your portfolio a name and description</p>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <label className="block text-white font-medium mb-2">Portfolio Name</label>
                              <input
                                type="text"
                                value={portfolioName}
                                onChange={(e) => setPortfolioName(e.target.value)}
                                placeholder="e.g., John Doe Portfolio"
                                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-white transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-white font-medium mb-2">Description</label>
                              <textarea
                                value={portfolioDescription}
                                onChange={(e) => setPortfolioDescription(e.target.value)}
                                placeholder="Brief description of your portfolio..."
                                rows={4}
                                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-white transition-colors resize-none"
                              />
                            </div>

                            <div className="text-center pt-6">
                              <button
                                onClick={handleCreatePortfolio}
                                disabled={!portfolioName.trim()}
                                className="px-8 py-4 bg-white text-black rounded-2xl hover:bg-neutral-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isFirstTimeUser ? "Continue to Widget Tutorial" : "Create Portfolio"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === "widgets" && (
                      <motion.div
                        key="widgets"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="min-h-screen flex items-center justify-center p-8"
                      >
                        <div className="max-w-4xl w-full">
                          <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Learn About Widgets</h2>
                            <p className="text-neutral-400">
                              Widgets are the building blocks of your portfolio. Click on each type to learn more.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {widgetTypes.map((widget) => {
                              const IconComponent = widget.icon
                              return (
                                <motion.div
                                  key={widget.type}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() =>
                                    setSelectedWidgetType(selectedWidgetType === widget.type ? null : widget.type)
                                  }
                                  className={`cursor-pointer border-2 rounded-2xl p-6 transition-all ${
                                    selectedWidgetType === widget.type
                                      ? "border-white bg-white/5"
                                      : "border-neutral-700 hover:border-neutral-600"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                      <IconComponent size={20} className="text-white" />
                                    </div>
                                    <h3 className="text-white font-medium text-lg">{widget.name}</h3>
                                  </div>

                                  <p className="text-neutral-400 text-sm mb-4">{widget.description}</p>

                                  {selectedWidgetType === widget.type && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="border-t border-neutral-700 pt-4 mt-4"
                                    >
                                      <div className="text-xs text-neutral-500 mb-2">Example:</div>
                                      <div className="bg-neutral-800/50 rounded-lg p-3">
                                        {widget.type === "header" && (
                                          <div>
                                            <div className="text-white font-bold text-sm">{widget.example.title}</div>
                                            <div className="text-neutral-400 text-xs">{widget.example.subtitle}</div>
                                          </div>
                                        )}
                                        {widget.type === "text" && (
                                          <div className="text-neutral-300 text-xs">{widget.example.content}</div>
                                        )}
                                        {widget.type === "image" && (
                                          <div className="w-full h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded flex items-center justify-center">
                                            <ImageIcon size={16} className="text-white/50" />
                                          </div>
                                        )}
                                        {widget.type === "profile" && (
                                          <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full"></div>
                                            <div>
                                              <div className="text-white text-xs font-medium">
                                                {widget.example.name}
                                              </div>
                                              <div className="text-neutral-400 text-xs">{widget.example.role}</div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </motion.div>
                              )
                            })}
                          </div>

                          <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-6 mb-8">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Plus size={20} className="text-white" />
                              </div>
                              <div>
                                <h3 className="text-white font-medium mb-2">How to Add Widgets</h3>
                                <p className="text-neutral-400 text-sm mb-3">
                                  Once you're in your portfolio editor, you can add widgets by clicking the "+" button
                                  in any section. Drag and drop to rearrange them, and click to edit their content.
                                </p>
                                <div className="flex items-center gap-2 text-green-400 text-sm">
                                  <Check size={16} />
                                  <span>You'll see this in action next!</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-center">
                            <button
                              onClick={handleFinishOnboarding}
                              className="px-8 py-4 bg-white text-black rounded-2xl hover:bg-neutral-200 transition-colors font-medium"
                            >
                              Start Building My Portfolio
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === "creating" && (
                      <motion.div
                        key="creating"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="min-h-screen flex items-center justify-center"
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
                          <h2 className="text-2xl font-bold text-white mb-4">Creating Your Portfolio</h2>
                          <p className="text-neutral-400">This will just take a moment...</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Side Panel - Hidden during onboarding */}
              <motion.div
                className="fixed right-0 top-16 w-80 lg:w-96 2xl:w-[28rem] h-full p-4 lg:p-6 xl:p-8 2xl:p-12"
                animate={{
                  x: isPreviewMode || step !== "welcome" ? "100%" : "0%",
                }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="bg-neutral-900/50 backdrop-blur-xl rounded-3xl p-6 h-full">
                  <h3 className="text-white font-medium mb-4">Portfolio Preview</h3>
                  <p className="text-neutral-400 text-sm">Your portfolio will appear here once created</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
