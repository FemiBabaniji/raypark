"use client"

import { useState, useEffect } from "react"
import { Reorder } from "framer-motion"
import { Upload, Play, GripVertical, Palette, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import PortfolioShell from "./portfolio/portfolio-shell"
import OnboardingOverlay from "./onboarding-overlay"
import { THEME_COLOR_OPTIONS, type ThemeIndex } from "@/lib/theme"
import type { Identity } from "./portfolio/builder/types"

type Step = 0 | 1 | 2 | 3

/**
 * StarterPortfolio — a full-fledged template matching Jenny Wilson's setup
 * - Complete widget set (Profile, Education, Projects, Services, Description, Gallery)
 * - Same theme system and interactions
 * - 4-step onboarding overlay with widget highlighting
 */
export default function StarterPortfolio({
  isPreviewMode = false,
  activeIdentity,
  onActiveIdentityChange,
}: {
  isPreviewMode?: boolean
  activeIdentity?: Identity
  onActiveIdentityChange?: (identity: Identity) => void
}) {
  const [step, setStep] = useState<Step>(0)
  const [showOnboarding, setShowOnboarding] = useState(true)

  useEffect(() => {
    const seen = localStorage.getItem("starter.onboarding.seen")
    if (seen === "1") setShowOnboarding(false)
  }, [])

  useEffect(() => {
    if (!showOnboarding) localStorage.setItem("starter.onboarding.seen", "1")
  }, [showOnboarding])

  const handleNext = () => setStep((s) => Math.min(3, (s + 1) as Step))
  const handleBack = () => setStep((s) => Math.max(0, (s - 1) as Step))
  const handleSkip = () => setShowOnboarding(false)
  const handleDone = () => setShowOnboarding(false)

  const [profileColorIdx, setProfileColorIdx] = useState<ThemeIndex>(activeIdentity?.selectedColor ?? 0)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const projectColorOptions = [
    { name: "rose", gradient: "from-rose-500/70 to-pink-500/70" },
    { name: "blue", gradient: "from-blue-500/70 to-cyan-500/70" },
    { name: "purple", gradient: "from-purple-500/70 to-blue-500/70" },
    { name: "green", gradient: "from-green-500/70 to-emerald-500/70" },
    { name: "orange", gradient: "from-orange-500/70 to-red-500/70" },
    { name: "teal", gradient: "from-teal-500/70 to-blue-500/70" },
    { name: "neutral", gradient: "from-neutral-500/70 to-neutral-600/70" },
  ]

  const [projectColors, setProjectColors] = useState({
    webdev: "blue",
    aiml: "purple",
    mobile: "green",
    devops: "orange",
  })
  const [showProjectColorPicker, setShowProjectColorPicker] = useState({
    webdev: false,
    aiml: false,
    mobile: false,
    devops: false,
  })

  const [leftWidgets, setLeftWidgets] = useState([
    { id: "profile", type: "profile" as const },
    { id: "education", type: "education" as const },
  ])

  const [rightWidgets, setRightWidgets] = useState([
    { id: "description", type: "description" as const },
    { id: "projects", type: "projects" as const },
    { id: "services", type: "services" as const },
  ])

  const [isDragging, setIsDragging] = useState(false)
  const [dragOverColumn, setDragOverColumn] = useState<"left" | "right" | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)

  const [profileText, setProfileText] = useState({
    name: activeIdentity?.name || "your name",
    title: "is a",
    subtitle: "describe what you do (e.g., product designer / software engineer).",
  })

  const [aboutText, setAboutText] = useState({
    title: "About Me",
    description: "I specialize in creating unique digital experiences that solve real problems.",
    subdescription: "I believe great design starts with understanding your users and their needs.",
  })

  const [galleryGroups, setGalleryGroups] = useState<Record<string, any[]>>({})
  const [selectedGroup, setSelectedGroup] = useState<any>(null)

  const handleColorChange = (colorIdx: ThemeIndex) => {
    setProfileColorIdx(colorIdx)
    if (onActiveIdentityChange && activeIdentity) {
      onActiveIdentityChange({
        ...activeIdentity,
        selectedColor: colorIdx,
      })
    }
  }

  const deleteWidget = (widgetId: string, column: "left" | "right") => {
    if (column === "left") setLeftWidgets(leftWidgets.filter((w) => w.id !== widgetId))
    else setRightWidgets(rightWidgets.filter((w) => w.id !== widgetId))
  }

  const addWidget = (type: string, column: "left" | "right") => {
    const newWidget = { id: `${type}-${Date.now()}`, type }
    if (column === "left") setLeftWidgets((p) => [...p, newWidget as any])
    else setRightWidgets((p) => [...p, newWidget as any])
    setSelectedWidgetType(null)
    setShowAddDropdown(false)
  }

  const ProfileWidget = ({ widgetId, column }: { widgetId?: string; column?: "left" | "right" }) => (
    <div
      className={`bg-gradient-to-br ${THEME_COLOR_OPTIONS[profileColorIdx]?.gradient} backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing relative`}
      data-widget="profile"
    >
      <div className="flex items-center justify-between mb-4">
        {!isPreviewMode && (
          <div className={`transition-opacity ${isDragging ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
            <GripVertical className="w-5 h-5 text-white/70" data-coach={step === 0 ? "drag" : undefined} />
          </div>
        )}
        {isPreviewMode && <div />}
        <div className="flex items-center gap-2">
          {!isPreviewMode && widgetId && widgetId !== "profile" && column && (
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-200 p-2"
              onClick={() => deleteWidget(widgetId, column)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {!isPreviewMode && (
            <div className="relative">
              {showColorPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-4 z-50 min-w-[200px]">
                  <div className="grid grid-cols-3 gap-3">
                    {THEME_COLOR_OPTIONS.map((color, idx) => (
                      <button
                        key={color.name}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient} ${
                          profileColorIdx === idx ? "ring-2 ring-white" : ""
                        } hover:ring-2 hover:ring-white/50 transition-all`}
                        onClick={() => {
                          handleColorChange(idx as ThemeIndex)
                          setShowColorPicker(false)
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 text-white p-2"
                onClick={() => setShowColorPicker(!showColorPicker)}
                data-coach={step === 2 ? "palette" : undefined}
              >
                <Palette className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
          <img
            src="/professional-woman-headshot.png"
            alt="avatar"
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.opacity = "0.2")}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold leading-tight text-white">
          {editingField === "profile-name" ? (
            <input
              type="text"
              value={profileText.name}
              onChange={(e) => setProfileText({ ...profileText, name: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
              className="bg-transparent border-none outline-none text-3xl font-bold text-white w-full"
              autoFocus
            />
          ) : (
            <span
              onClick={() => !isPreviewMode && setEditingField("profile-name")}
              className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
              data-coach={step === 1 ? "edit-name" : undefined}
            >
              {profileText.name}
            </span>
          )}
          <br />
          {editingField === "profile-title" ? (
            <input
              type="text"
              value={profileText.title}
              onChange={(e) => setProfileText({ ...profileText, title: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
              className="bg-transparent border-none outline-none text-3xl font-bold text-white w-full"
              autoFocus
            />
          ) : (
            <span
              onClick={() => !isPreviewMode && setEditingField("profile-title")}
              className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
            >
              {profileText.title}
            </span>
          )}{" "}
          <span className="text-white/70">
            {editingField === "profile-subtitle" ? (
              <input
                type="text"
                value={profileText.subtitle}
                onChange={(e) => setProfileText({ ...profileText, subtitle: e.target.value })}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                className="bg-transparent border-none outline-none text-3xl font-bold text-white/70 w-full"
                autoFocus
              />
            ) : (
              <span
                onClick={() => !isPreviewMode && setEditingField("profile-subtitle")}
                className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
              >
                {profileText.subtitle}
              </span>
            )}
          </span>
        </h1>

        <div className="flex flex-wrap gap-3 pt-4">
          {["linkedin.", "github.", "twitter."].map((social) => (
            <Button
              key={social}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {social}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

  const EducationWidget = ({ widgetId, column }: { widgetId: string; column: "left" | "right" }) => (
    <div
      className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing"
      data-widget="education"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Education</h2>
        {!isPreviewMode && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2"
              onClick={() => deleteWidget(widgetId, column)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className={`transition-opacity ${isDragging ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
              <GripVertical className="w-5 h-5 text-neutral-400" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <h3 className="font-semibold text-white">MS Computer Science</h3>
          <p className="text-neutral-300 text-sm">Stanford University</p>
          <p className="text-neutral-400 text-xs">2020 • GPA: 3.8</p>
        </div>
        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <h3 className="font-semibold text-white">BS Software Engineering</h3>
          <p className="text-neutral-300 text-sm">UC Berkeley</p>
          <p className="text-neutral-400 text-xs">2018 • GPA: 3.7</p>
        </div>
      </div>
    </div>
  )

  const ProjectsWidget = ({ widgetId, column }: { widgetId: string; column: "left" | "right" }) => (
    <div
      className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing"
      data-widget="projects"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-neutral-600 rounded flex items-center justify-center">
            <div className="w-3 h-3 border border-neutral-400 rounded-sm"></div>
          </div>
          <h2 className="text-xl font-bold text-white">Projects Portfolio</h2>
        </div>
        {!isPreviewMode && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2"
              onClick={() => deleteWidget(widgetId, column)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-5 h-5 text-neutral-400" />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Web Development */}
        <div className="bg-neutral-800/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Web Development</span>
            <Upload className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Complete overhaul of user experience and backend architecture for scalable growth...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded text-white">React</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded text-white">Node.js</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400">In Progress</span>
            <span className="text-2xl font-bold text-white">85%</span>
          </div>
        </div>

        {/* AI/ML with color picker */}
        <div
          className={`bg-gradient-to-br ${projectColorOptions.find((c) => c.name === projectColors.aiml)?.gradient} rounded-2xl p-4 space-y-3 relative group/aiml`}
        >
          {!isPreviewMode && (
            <div className="absolute top-2 right-2">
              {showProjectColorPicker.aiml && (
                <div className="absolute bottom-full right-0 mb-2 bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-4 z-50 min-w-[200px]">
                  <div className="grid grid-cols-3 gap-3">
                    {projectColorOptions.map((color) => (
                      <button
                        key={color.name}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient} ${
                          projectColors.aiml === color.name ? "ring-2 ring-white" : ""
                        } hover:ring-2 hover:ring-white/50 transition-all`}
                        onClick={() => {
                          setProjectColors((prev) => ({ ...prev, aiml: color.name }))
                          setShowProjectColorPicker((prev) => ({ ...prev, aiml: false }))
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover/aiml:opacity-100 transition-opacity bg-black/20 hover:bg-black/30 text-white p-2"
                onClick={() => setShowProjectColorPicker((prev) => ({ ...prev, aiml: !prev.aiml }))}
              >
                <Palette className="w-4 h-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium bg-black/20 px-2 py-1 rounded text-white">AI/ML</span>
            <Play className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            Machine learning models for predictive analytics and automation...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-black/20 px-2 py-1 rounded text-white">Python</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded text-white">TensorFlow</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/80">Complete</span>
            <span className="text-2xl font-bold text-white">100%</span>
          </div>
        </div>

        {/* Mobile */}
        <div className="bg-neutral-800/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Mobile</span>
            <Upload className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Cross-platform mobile application with native performance...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded text-white">React Native</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded text-white">TypeScript</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-400">Testing</span>
            <span className="text-2xl font-bold text-white">92%</span>
          </div>
        </div>

        {/* DevOps */}
        <div className="bg-neutral-800/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">DevOps</span>
            <Upload className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Infrastructure automation and CI/CD pipeline optimization...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded text-white">Docker</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded text-white">AWS</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-orange-400">Planning</span>
            <span className="text-2xl font-bold text-white">25%</span>
          </div>
        </div>
      </div>
    </div>
  )

  const ServicesWidget = ({ widgetId, column }: { widgetId: string; column: "left" | "right" }) => (
    <div
      className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing"
      data-widget="services"
    >
      <div className="flex items-center justify-between mb-4">
        <div></div>
        {!isPreviewMode && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2"
              onClick={() => deleteWidget(widgetId, column)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-5 h-5 text-neutral-400" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">As a digital designer,</h3>
        <p className="text-white leading-relaxed">
          I specialize in creating unique visual identities for digital products.{" "}
          <span className="text-neutral-400">
            I believe that a catchy design starts with common values, open communication, and respect for your audience.
          </span>
        </p>
      </div>
    </div>
  )

  const DescriptionWidget = ({ widgetId, column }: { widgetId: string; column: "left" | "right" }) => (
    <div
      className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing"
      data-widget="description"
    >
      <div className="flex items-center justify-between mb-4">
        <div></div>
        {!isPreviewMode && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2"
              onClick={() => deleteWidget(widgetId, column)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-5 h-5 text-neutral-400" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">
          {editingField === "about-title" ? (
            <input
              type="text"
              value={aboutText.title}
              onChange={(e) => setAboutText({ ...aboutText, title: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
              className="bg-transparent border-none outline-none text-xl font-bold text-white w-full"
              autoFocus
            />
          ) : (
            <span
              onClick={() => !isPreviewMode && setEditingField("about-title")}
              className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
            >
              {aboutText.title}
            </span>
          )}
        </h3>
        <p className="text-white leading-relaxed">
          {editingField === "about-description" ? (
            <textarea
              value={aboutText.description}
              onChange={(e) => setAboutText({ ...aboutText, description: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && setEditingField(null)}
              className="bg-transparent border-none outline-none text-white leading-relaxed w-full resize-none"
              rows={2}
              autoFocus
            />
          ) : (
            <span
              onClick={() => !isPreviewMode && setEditingField("about-description")}
              className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
            >
              {aboutText.description}
            </span>
          )}{" "}
          <span className="text-neutral-400">
            {editingField === "about-subdescription" ? (
              <textarea
                value={aboutText.subdescription}
                onChange={(e) => setAboutText({ ...aboutText, subdescription: e.target.value })}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && setEditingField(null)}
                className="bg-transparent border-none outline-none text-neutral-400 leading-relaxed w-full resize-none"
                rows={2}
                autoFocus
              />
            ) : (
              <span
                onClick={() => !isPreviewMode && setEditingField("about-subdescription")}
                className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
              >
                {aboutText.subdescription}
              </span>
            )}
          </span>
        </p>
      </div>
    </div>
  )

  const GalleryWidget = ({ widgetId, column }: { widgetId: string; column: "left" | "right" }) => {
    const groups = galleryGroups[widgetId] || []
    const [showAddGroup, setShowAddGroup] = useState(false)
    const [newGroupName, setNewGroupName] = useState("")

    const addGroup = () => {
      if (!newGroupName.trim()) return
      const newGroup = {
        id: `group-${Date.now()}`,
        name: newGroupName,
        description: "",
        images: [],
        isVideo: false,
      }
      setGalleryGroups((prev) => ({
        ...prev,
        [widgetId]: [...(prev[widgetId] || []), newGroup],
      }))
      setNewGroupName("")
      setShowAddGroup(false)
    }

    return (
      <div
        className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-6 group cursor-grab active:cursor-grabbing"
        data-widget="gallery"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-neutral-600 rounded flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-neutral-400 rounded-sm"></div>
            </div>
            <h2 className="text-lg font-bold text-white">Image Gallery</h2>
          </div>
          {!isPreviewMode && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2"
                onClick={() => deleteWidget(widgetId, column)}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5 text-neutral-400" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {!isPreviewMode && (
            <>
              {showAddGroup ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Group name..."
                    className="flex-1 bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-400"
                    onKeyDown={(e) => e.key === "Enter" && addGroup()}
                    autoFocus
                  />
                  <Button size="sm" onClick={addGroup} className="bg-blue-600 hover:bg-blue-700">
                    Add
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddGroup(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddGroup(true)}
                  className="bg-neutral-800/50 border-neutral-700 hover:bg-neutral-700/50 text-neutral-300 hover:text-white"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Group
                </Button>
              )}
            </>
          )}

          {groups.length === 0 && (
            <div className="border-2 border-dashed border-neutral-600 rounded-lg p-8 text-center">
              <p className="text-neutral-400 text-sm">No image groups yet</p>
              <p className="text-neutral-500 text-xs mt-1">Add a group to organize your images</p>
            </div>
          )}

          {groups.map((group) => (
            <div key={group.id} className="bg-neutral-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{group.name}</span>
                <span className="text-xs text-neutral-400">{group.images.length} images</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [selectedWidgetType, setSelectedWidgetType] = useState<string | null>(null)

  const rightSlot = (
    <div className="relative">
      {showAddDropdown && (
        <div className="absolute top-full right-0 mt-2 bg-neutral-800/95 backdrop-blur-xl rounded-xl border border-neutral-700 p-2 z-50 min-w-[220px]">
          <div className="space-y-1">
            {selectedWidgetType ? (
              <>
                <div className="px-3 py-2 text-xs font-medium text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                  <button onClick={() => setSelectedWidgetType(null)} className="text-neutral-300 hover:text-white">
                    ←
                  </button>
                  Choose Column
                </div>
                <button
                  onClick={() => addWidget(selectedWidgetType, "left")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-neutral-700/80 rounded-lg transition-colors"
                >
                  <div className="w-4 h-4 bg-neutral-600 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-neutral-400 rounded"></div>
                  </div>
                  Add to Left Column
                </button>
                <button
                  onClick={() => addWidget(selectedWidgetType, "right")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-neutral-700/80 rounded-lg transition-colors"
                >
                  <div className="w-4 h-4 bg-neutral-600 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-neutral-400 rounded"></div>
                  </div>
                  Add to Right Column
                </button>
              </>
            ) : (
              <>
                <div className="px-3 py-2 text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Select Widget Type
                </div>
                {["projects", "education", "description", "services", "gallery"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedWidgetType(type)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-neutral-700/80 rounded-lg transition-colors"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)} Widget
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
      <BackButton
        onClick={() => setShowAddDropdown(!showAddDropdown)}
        icon={Plus}
        data-coach={step === 2 ? "add-widget" : undefined}
      />
    </div>
  )

  const renderWidget = (widget: { id: string; type: string }, column: "left" | "right") => {
    switch (widget.type) {
      case "profile":
        return <ProfileWidget key={widget.id} widgetId={widget.id} column={column} />
      case "education":
        return <EducationWidget key={widget.id} widgetId={widget.id} column={column} />
      case "projects":
        return <ProjectsWidget key={widget.id} widgetId={widget.id} column={column} />
      case "services":
        return <ServicesWidget key={widget.id} widgetId={widget.id} column={column} />
      case "description":
        return <DescriptionWidget key={widget.id} widgetId={widget.id} column={column} />
      case "gallery":
        return <GalleryWidget key={widget.id} widgetId={widget.id} column={column} />
      default:
        return null
    }
  }

  useEffect(() => {
    setLeftWidgets((prev) => {
      const without = prev.filter((w) => w.id !== "profile")
      return [{ id: "profile", type: "profile" }, ...without]
    })
  }, [])

  return (
    <>
      <PortfolioShell
        title={`${profileText.name || "your portfolio"}.`}
        isPreviewMode={isPreviewMode}
        rightSlot={rightSlot}
      >
        {/* Left Column */}
        <div
          className={`lg:w-1/2 relative transition-all duration-200 ${
            dragOverColumn === "left" ? "bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOverColumn("left")
          }}
          onDragLeave={() => setDragOverColumn(null)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOverColumn(null)
          }}
        >
          <Reorder.Group
            axis="y"
            values={leftWidgets}
            onReorder={setLeftWidgets}
            className="flex flex-col gap-4 sm:gap-6"
          >
            {leftWidgets.map((widget) => (
              <Reorder.Item
                key={widget.id}
                value={widget}
                className="list-none"
                whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: "0 20px 40px rgba(0,0,0,0.4)", rotate: 2 }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {renderWidget(widget, "left")}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        {/* Right Column */}
        <div
          className={`lg:w-1/2 relative transition-all duration-200 ${
            dragOverColumn === "right" ? "bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOverColumn("right")
          }}
          onDragLeave={() => setDragOverColumn(null)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOverColumn(null)
          }}
        >
          <Reorder.Group
            axis="y"
            values={rightWidgets}
            onReorder={setRightWidgets}
            className="flex flex-col gap-4 sm:gap-6"
          >
            {rightWidgets.map((widget) => (
              <Reorder.Item
                key={widget.id}
                value={widget}
                className="list-none"
                whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: "0 20px 40px rgba(0,0,0,0.4)", rotate: -2 }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {renderWidget(widget, "right")}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </PortfolioShell>

      {showOnboarding && (
        <OnboardingOverlay
          step={step}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
          onDone={handleDone}
        />
      )}
    </>
  )
}
