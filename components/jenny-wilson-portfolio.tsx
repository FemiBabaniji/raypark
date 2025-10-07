"use client"

import { Button } from "@/components/ui/button"
import { Upload, Play, GripVertical, Palette, Plus, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Reorder } from "framer-motion"
import PortfolioShell from "./portfolio/portfolio-shell"
import { BackButton } from "@/components/ui/back-button"
import { THEME_COLOR_OPTIONS, type ThemeIndex } from "@/lib/theme"
import type { Identity } from "./portfolio/builder/types"
import StartupWidget from "./portfolio/builder/widgets/StartupWidget"

export default function JennyWilsonPortfolio({
  isPreviewMode = false,
  activeIdentity,
  onActiveIdentityChange,
}: {
  isPreviewMode?: boolean
  activeIdentity?: Identity
  onActiveIdentityChange?: (identity: Identity) => void
}) {
  const [profileColorIdx, setProfileColorIdx] = useState<ThemeIndex>(activeIdentity?.selectedColor ?? 0)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [projectColors, setProjectColors] = useState({
    aiml: "purple",
    mobile: "purple",
  })
  const [showProjectColorPicker, setShowProjectColorPicker] = useState({
    aiml: false,
    mobile: false,
  })

  const [leftWidgets, setLeftWidgets] = useState([
    { id: "profile", type: "profile" },
    { id: "education", type: "education" },
  ])

  const [rightWidgets, setRightWidgets] = useState([
    { id: "startup", type: "startup" },
    { id: "description", type: "description" },
    { id: "projects", type: "projects" },
    { id: "services", type: "services" },
  ])

  const [editingField, setEditingField] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOverColumn, setDragOverColumn] = useState<"left" | "right" | null>(null)

  const projectColorOptions = [
    { name: "rose", gradient: "from-rose-500/70 to-pink-500/70" },
    { name: "blue", gradient: "from-blue-500/70 to-cyan-500/70" },
    { name: "purple", gradient: "from-purple-500/70 to-blue-500/70" },
    { name: "green", gradient: "from-green-500/70 to-emerald-500/70" },
    { name: "orange", gradient: "from-orange-500/70 to-red-500/70" },
    { name: "teal", gradient: "from-teal-500/70 to-blue-500/70" },
    { name: "neutral", gradient: "from-neutral-500/70 to-neutral-600/70" },
  ]

  const [profileText, setProfileText] = useState({
    name: "jenny wilson",
    title: "is a digital product designer",
    subtitle: "currently designing at acme.",
  })

  const [aboutText, setAboutText] = useState({
    title: "About Me",
    description:
      "I'm a passionate digital designer with over 5 years of experience creating meaningful user experiences.",
    subdescription: "I focus on clean, functional design that solves real problems and delights users.",
  })

  useEffect(() => {
    if (activeIdentity?.selectedColor !== undefined) {
      setProfileColorIdx(activeIdentity.selectedColor)
    }
  }, [activeIdentity?.selectedColor])

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
    if (column === "left") {
      setLeftWidgets(leftWidgets.filter((w) => w.id !== widgetId))
    } else {
      setRightWidgets(rightWidgets.filter((w) => w.id !== widgetId))
    }
  }

  const moveWidgetToColumn = (
    widget: { id: string; type: string },
    fromColumn: "left" | "right",
    toColumn: "left" | "right",
  ) => {
    if (fromColumn === toColumn) return

    // Remove from source column
    if (fromColumn === "left") {
      setLeftWidgets((prev) => prev.filter((w) => w.id !== widget.id))
    } else {
      setRightWidgets((prev) => prev.filter((w) => w.id !== widget.id))
    }

    // Add to target column
    if (toColumn === "left") {
      setLeftWidgets((prev) => [...prev, widget])
    } else {
      setRightWidgets((prev) => [...prev, widget])
    }
  }

  const IdentityWidget = () => {
    const gradient = THEME_COLOR_OPTIONS[profileColorIdx].gradient
    return (
      <div
        className={`bg-gradient-to-br ${gradient} backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing relative`}
      >
        <div className="flex items-center justify-between mb-4">
          {!isPreviewMode && (
            <div className="opacity-60 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-5 h-5 text-white/70" />
            </div>
          )}
          <div className="relative">
            {!isPreviewMode && (
              <>
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
                            const i = idx as ThemeIndex
                            setProfileColorIdx(i)
                            onActiveIdentityChange?.({ selectedColor: i })
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
                >
                  <Palette className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeIdentity?.avatarUrl || "/professional-woman-headshot.png"}
              alt={activeIdentity?.name || "Profile"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold leading-tight text-white">
            {editingField === "identity-name" ? (
              <input
                type="text"
                value={profileText.name}
                onChange={(e) => {
                  setProfileText({ ...profileText, name: e.target.value })
                  onActiveIdentityChange?.({ name: e.target.value })
                }}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                className="bg-transparent border-none outline-none text-3xl font-bold text-white w-full"
                autoFocus
              />
            ) : (
              <span
                onClick={() => !isPreviewMode && setEditingField("identity-name")}
                className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
              >
                {activeIdentity?.name || profileText.name}
              </span>
            )}
            <br />
            {editingField === "identity-title" ? (
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
                onClick={() => !isPreviewMode && setEditingField("identity-title")}
                className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
              >
                {profileText.title}
              </span>
            )}
            <br />
            <span className="text-white/70">
              {editingField === "identity-subtitle" ? (
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
                  onClick={() => !isPreviewMode && setEditingField("identity-subtitle")}
                  className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
                >
                  {profileText.subtitle}
                </span>
              )}
            </span>
          </h1>

          <div className="flex flex-wrap gap-3 pt-4">
            {["linkedin.", "dribbble.", "behance.", "twitter.", "unsplash.", "instagram."].map((social) => (
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
  }

  const ProfileWidget = ({ widgetId, column }: { widgetId?: string; column?: "left" | "right" }) => (
    <div
      className={`bg-gradient-to-br ${THEME_COLOR_OPTIONS[profileColorIdx]?.gradient} backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing relative`}
    >
      <div className="flex items-center justify-between mb-4">
        {!isPreviewMode && (
          <div className={`transition-opacity ${isDragging ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
            <GripVertical className="w-5 h-5 text-white/70" />
          </div>
        )}
        {isPreviewMode && <div></div>}
        <div className="flex items-center gap-2">
          {!isPreviewMode && widgetId && widgetId !== "profile" && column && (
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2"
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
              >
                <Palette className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden">
          <img src="/professional-woman-headshot.png" alt="Jenny Wilson" className="w-full h-full object-cover" />
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
          )}
          <br />
          designer{" "}
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
          {["linkedin.", "dribbble.", "behance.", "twitter.", "unsplash.", "instagram."].map((social) => (
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
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Education</h2>
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
        {/* MS Computer Science */}
        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div>
            <h3 className="font-semibold text-white">MS Computer Science</h3>
            <p className="text-neutral-300 text-sm">Stanford University</p>
            <p className="text-neutral-400 text-xs">2020 • GPA: 3.8</p>
          </div>
        </div>

        {/* BS Software Engineering */}
        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div>
            <h3 className="font-semibold text-white">BS Software Engineering</h3>
            <p className="text-neutral-300 text-sm">UC Berkeley</p>
            <p className="text-neutral-400 text-xs">2018 • GPA: 3.7</p>
          </div>
        </div>

        {/* AWS Solutions Architect */}
        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white">AWS Solutions Architect</h3>
              <p className="text-neutral-300 text-sm">Coursera</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-neutral-400 text-xs">2021</p>
              <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const WorkExperienceWidget = ({ widgetId, column }: { widgetId: string; column: "left" | "right" }) => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Work Experience</h2>
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
        {/* Senior Software Engineer */}
        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white">Senior Software Engineer</h3>
              <p className="text-neutral-300 text-sm">Google</p>
              <p className="text-neutral-400 text-xs">2021 - Present</p>
            </div>
            <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded">Current</span>
          </div>
          <p className="text-neutral-400 text-xs mt-2">
            Leading development of cloud infrastructure solutions and mentoring junior developers.
          </p>
        </div>

        {/* Software Engineer */}
        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div>
            <h3 className="font-semibold text-white">Software Engineer</h3>
            <p className="text-neutral-300 text-sm">Meta</p>
            <p className="text-neutral-400 text-xs">2019 - 2021 • 2 years</p>
            <p className="text-neutral-400 text-xs mt-2">
              Developed scalable web applications using React and Node.js for millions of users.
            </p>
          </div>
        </div>

        {/* Junior Developer */}
        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div>
            <h3 className="font-semibold text-white">Junior Developer</h3>
            <p className="text-neutral-300 text-sm">Startup Inc.</p>
            <p className="text-neutral-400 text-xs">2018 - 2019 • 1 year</p>
            <p className="text-neutral-400 text-xs mt-2">
              Built responsive web interfaces and collaborated on mobile app development.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const ProjectsWidget = ({ widgetId, column }: { widgetId: string; column: "left" | "right" }) => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-neutral-600 rounded flex items-center justify-center">
            <div className="w-3 h-3 border border-neutral-400 rounded-sm"></div>
          </div>
          <h2 className="text-xl font-bold">Projects Portfolio</h2>
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
            <span className="text-sm font-medium">Web Development</span>
            <Upload className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Complete overhaul of user experience and backend architecture for scalable growth...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">React</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">Node.js</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">AWS</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400">In Progress</span>
            <span className="text-2xl font-bold">85%</span>
          </div>
        </div>

        {/* AI/ML */}
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
            <span className="text-sm font-medium bg-black/20 px-2 py-1 rounded">AI/ML</span>
            <Play className="w-4 h-4" />
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            Real-time insights with machine learning predictions and interactive data visual...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-black/20 px-2 py-1 rounded">Python</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">React</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">TensorFlow</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/80">In Progress</span>
            <span className="text-2xl font-bold">60%</span>
          </div>
        </div>

        {/* Mobile */}
        <div
          className={`bg-gradient-to-br ${projectColorOptions.find((c) => c.name === projectColors.mobile)?.gradient} rounded-2xl p-4 space-y-3 relative group/mobile`}
        >
          {!isPreviewMode && (
            <div className="absolute top-2 right-2">
              {showProjectColorPicker.mobile && (
                <div className="absolute bottom-full right-0 mb-2 bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-4 z-50 min-w-[200px]">
                  <div className="grid grid-cols-3 gap-3">
                    {projectColorOptions.map((color) => (
                      <button
                        key={color.name}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient} ${
                          projectColors.mobile === color.name ? "ring-2 ring-white" : ""
                        } hover:ring-2 hover:ring-white/50 transition-all`}
                        onClick={() => {
                          setProjectColors((prev) => ({ ...prev, mobile: color.name }))
                          setShowProjectColorPicker((prev) => ({ ...prev, mobile: false }))
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover/mobile:opacity-100 transition-opacity bg-black/20 hover:bg-black/30 text-white p-2"
                onClick={() => setShowProjectColorPicker((prev) => ({ ...prev, mobile: !prev.mobile }))}
              >
                <Palette className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium bg-black/20 px-2 py-1 rounded">Mobile</span>
            <Play className="w-4 h-4" />
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            Cross-platform mobile solution for enhanced customer engagement with offline cap...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-black/20 px-2 py-1 rounded">React Native</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">TypeScript</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">Firebase</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-400">Completed</span>
            <span className="text-2xl font-bold">100%</span>
          </div>
        </div>

        {/* DevOps */}
        <div className="bg-neutral-800/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">DevOps</span>
            <Upload className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Scalable cloud architecture implementation with automated deployment pipelines a...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">AWS</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">Terraform</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">Kubernetes</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-400">Completed</span>
            <span className="text-2xl font-bold">100%</span>
          </div>
        </div>
      </div>
    </div>
  )

  const ServicesWidget = ({ widgetId, column }: { widgetId: string; column: "left" | "right" }) => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
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
        <h3 className="text-xl font-bold">As a digital designer,</h3>
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
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
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
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">
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
              onKeyDown={(e) => e.key === "Enter" && e.shiftKey === false && setEditingField(null)}
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
                onKeyDown={(e) => e.key === "Enter" && e.shiftKey === false && setEditingField(null)}
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

  const [galleryGroups, setGalleryGroups] = useState<{
    [key: string]: Array<{
      id: string
      name: string
      description?: string
      images: string[]
      isVideo?: boolean
    }>
  }>({})

  const [selectedGroup, setSelectedGroup] = useState<{
    widgetId: string
    groupId: string
    group: {
      id: string
      name: string
      description?: string
      images: string[]
      isVideo?: boolean
    }
  } | null>(null)

  const addImagesToGroup = (groupId: string, widgetId?: string) => {
    const targetWidgetId = widgetId || selectedGroup?.widgetId
    if (!targetWidgetId) return

    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.multiple = true

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string
            setGalleryGroups((prev) => ({
              ...prev,
              [targetWidgetId]:
                prev[targetWidgetId]?.map((group) =>
                  group.id === groupId ? { ...group, images: [...group.images, imageUrl] } : group,
                ) || [],
            }))

            // Update selectedGroup if it's the same group being modified
            if (selectedGroup && selectedGroup.groupId === groupId) {
              setSelectedGroup((prev) =>
                prev
                  ? {
                      ...prev,
                      group: {
                        ...prev.group,
                        images: [...prev.group.images, imageUrl],
                      },
                    }
                  : null,
              )
            }
          }
          reader.readAsDataURL(file)
        })
      }
    }

    input.click()
  }

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

    const removeGroup = (groupId: string) => {
      setGalleryGroups((prev) => ({
        ...prev,
        [widgetId]: prev[widgetId]?.filter((group) => group.id !== groupId) || [],
      }))
    }

    const removeImageFromGroup = (groupId: string, imageIndex: number) => {
      setGalleryGroups((prev) => ({
        ...prev,
        [widgetId]:
          prev[widgetId]?.map((group) =>
            group.id === groupId ? { ...group, images: group.images.filter((_, i) => i !== imageIndex) } : group,
          ) || [],
      }))
    }

    const reorderImagesInGroup = (groupId: string, newImageOrder: string[]) => {
      setGalleryGroups((prev) => ({
        ...prev,
        [widgetId]:
          prev[widgetId]?.map((group) => (group.id === groupId ? { ...group, images: newImageOrder } : group)) || [],
      }))
    }

    const handleGroupClick = (group: any) => {
      if (group.images.length > 0) {
        setSelectedGroup({
          widgetId,
          groupId: group.id,
          group,
        })
      }
    }

    return (
      <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-6 group cursor-grab active:cursor-grabbing">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-neutral-600 rounded flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-neutral-400 rounded-sm"></div>
            </div>
            <h2 className="text-lg font-bold">Image Gallery</h2>
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
                    placeholder="Group name..."
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="flex-1 bg-neutral-800/50 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-600"
                    onKeyPress={(e) => e.key === "Enter" && addGroup()}
                    autoFocus
                  />
                  <Button
                    onClick={addGroup}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 h-auto text-xs"
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddGroup(false)
                      setNewGroupName("")
                    }}
                    size="sm"
                    variant="ghost"
                    className="text-neutral-400 hover:text-white px-2 py-1 h-auto text-xs"
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAddGroup(true)}
                  variant="outline"
                  size="sm"
                  className="w-full bg-neutral-800/50 border-neutral-700 hover:bg-neutral-700/50 text-neutral-300 hover:text-white py-1 h-auto text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Group
                </Button>
              )}
            </>
          )}

          {groups.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {groups.map((group, index) => (
                <div
                  key={group.id}
                  className="bg-neutral-800/30 rounded-lg p-2 relative group/group cursor-pointer hover:bg-neutral-800/40 transition-colors"
                  onClick={() => handleGroupClick(group)}
                >
                  {!isPreviewMode && (
                    <div className="absolute top-1 right-1 opacity-0 group-hover/group:opacity-100 transition-opacity flex gap-1 z-10">
                      <Button
                        onClick={() => addImagesToGroup(group.id, widgetId)}
                        size="sm"
                        variant="ghost"
                        className="bg-neutral-700/80 hover:bg-neutral-600/80 text-neutral-300 hover:text-white p-0.5 h-5 w-5"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </Button>
                      <Button
                        onClick={() => removeGroup(group.id)}
                        size="sm"
                        variant="ghost"
                        className="bg-red-500/80 hover:bg-red-500 text-white p-0.5 h-5 w-5"
                      >
                        <X className="w-2.5 h-2.5" />
                      </Button>
                    </div>
                  )}

                  {group.images.length > 0 ? (
                    <div className="relative mb-2">
                      <div className="aspect-video bg-neutral-700/50 rounded-md overflow-hidden relative">
                        <img
                          src={group.images[0] || "/placeholder.svg"}
                          alt={`${group.name} main`}
                          className="w-full h-full object-cover"
                        />
                        {group.isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 bg-black/60 rounded-full flex items-center justify-center">
                              <Play className="w-2 h-2 text-white ml-0.5" />
                            </div>
                          </div>
                        )}
                      </div>
                      {group.images.length > 1 && (
                        <div className="absolute top-1 right-1 flex -space-x-1">
                          {!isPreviewMode ? (
                            <Reorder.Group
                              axis="x"
                              values={group.images.slice(1, 3)}
                              onReorder={(newOrder) => {
                                const reorderedImages = [group.images[0], ...newOrder, ...group.images.slice(3)]
                                reorderImagesInGroup(group.id, reorderedImages)
                              }}
                              className="flex -space-x-1"
                            >
                              {group.images.slice(1, 3).map((image, imgIndex) => (
                                <Reorder.Item
                                  key={`${image}-${imgIndex}`}
                                  value={image}
                                  className="w-4 h-4 bg-neutral-700 rounded-sm overflow-hidden border border-neutral-600 cursor-grab active:cursor-grabbing"
                                  whileDrag={{ scale: 1.1, zIndex: 10 }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <img
                                    src={image || "/placeholder.svg"}
                                    alt={`${group.name} ${imgIndex + 2}`}
                                    className="w-full h-full object-cover pointer-events-none"
                                  />
                                </Reorder.Item>
                              ))}
                            </Reorder.Group>
                          ) : (
                            group.images.slice(1, 3).map((image, imgIndex) => (
                              <div
                                key={imgIndex}
                                className="w-4 h-4 bg-neutral-700 rounded-sm overflow-hidden border border-neutral-600"
                              >
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`${group.name} ${imgIndex + 2}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))
                          )}
                          {group.images.length > 3 && (
                            <div className="w-4 h-4 bg-neutral-700 rounded-sm border border-neutral-600 flex items-center justify-center">
                              <span className="text-neutral-300 text-[8px] font-medium">
                                +{group.images.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-neutral-700/30 rounded-md border border-dashed border-neutral-600 flex items-center justify-center mb-2">
                      <Upload className="w-3 h-3 text-neutral-500" />
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium text-white text-xs truncate">{group.name}</h3>
                    <p className="text-neutral-400 text-[10px]">
                      {group.images.length} image{group.images.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))}
              {!isPreviewMode && groups.length > 0 && groups.length % 2 !== 0 && (
                <div
                  className="bg-neutral-800/20 rounded-lg p-2 border border-dashed border-neutral-600 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-800/30 transition-colors"
                  onClick={() => setShowAddGroup(true)}
                >
                  <Plus className="w-4 h-4 text-neutral-500 mb-1" />
                  <span className="text-neutral-500 text-[10px]">Add Group</span>
                </div>
              )}
            </div>
          )}

          {groups.length === 0 && (
            <div className="text-center py-4 text-neutral-400">
              <div className="w-8 h-8 bg-neutral-800/50 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-xs">Create groups to organize your gallery</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const GroupDetailView = () => {
    if (!selectedGroup) return null

    return (
      <div className="fixed inset-0 bg-neutral-950 z-50 flex flex-col">
        {/* Back button */}
        <div className="p-6 flex justify-between items-center">
          <BackButton onClick={() => setSelectedGroup(null)} />

          {!isPreviewMode && <BackButton onClick={() => addImagesToGroup(selectedGroup.groupId)} icon={Plus} />}
        </div>

        {/* Group title */}
        <div className="px-6 pb-6">
          <h1 className="text-2xl font-bold text-white">{selectedGroup.group.name}</h1>
          <p className="text-neutral-400 text-sm mt-1">
            {selectedGroup.group.images.length} image{selectedGroup.group.images.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Images grid */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          {!isPreviewMode ? (
            <Reorder.Group
              axis="y"
              values={selectedGroup.group.images}
              onReorder={(newOrder) => {
                setGalleryGroups((prev) => ({
                  ...prev,
                  [selectedGroup.widgetId]:
                    prev[selectedGroup.widgetId]?.map((group) =>
                      group.id === selectedGroup.groupId ? { ...group, images: newOrder } : group,
                    ) || [],
                }))
                setSelectedGroup((prev) =>
                  prev
                    ? {
                        ...prev,
                        group: { ...prev.group, images: newOrder },
                      }
                    : null,
                )
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto"
            >
              {selectedGroup.group.images.map((image, index) => (
                <Reorder.Item
                  key={`${image}-${index}`}
                  value={image}
                  className="bg-neutral-900/50 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
                  whileDrag={{ scale: 1.02, zIndex: 10 }}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${selectedGroup.group.name} ${index + 1}`}
                    className="w-full h-auto object-cover pointer-events-none"
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
              {selectedGroup.group.images.map((image, index) => (
                <div key={index} className="bg-neutral-900/50 rounded-2xl overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${selectedGroup.group.name} ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const [startupContent, setStartupContent] = useState({
    title: "Startup Pitch",
    slides: {
      identity: {
        companyName: "Your Startup",
        tagline: "We're building X for Y",
        stage: "Seed",
        ask: "$50K seed funding",
      },
      problem: {
        title: "Problem",
        description: "Describe the problem you're solving...",
      },
      solution: {
        title: "Solution",
        description: "Describe your solution...",
        links: [],
      },
      market: {
        title: "Market",
        targetCustomer: "Your target customers",
        marketSize: "$X billion market",
        useCase: "How customers use your product",
      },
      traction: {
        title: "Traction",
        milestones: [
          { text: "Prototype built", completed: true },
          { text: "First customers", completed: false },
        ],
        metrics: "Key metrics and growth",
      },
      team: {
        title: "Team",
        members: [{ name: "Your Name", role: "CEO" }],
      },
      cta: {
        title: "Call to Action",
        asks: [
          { text: "Funding", active: true },
          { text: "Mentorship", active: true },
          { text: "Partnerships", active: false },
        ],
        contact: "hello@yourcompany.com",
      },
    },
  })

  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [selectedWidgetType, setSelectedWidgetType] = useState<string | null>(null)

  const addWidget = (type: string, column: "left" | "right") => {
    const newWidget = {
      id: `${type}-${Date.now()}`,
      type: type,
    }

    if (column === "left") {
      setLeftWidgets([...leftWidgets, newWidget])
    } else {
      setRightWidgets([...rightWidgets, newWidget])
    }

    setSelectedWidgetType(null)
    setShowAddDropdown(false)
  }

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
                <button
                  onClick={() => setSelectedWidgetType("projects")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-neutral-700/80 rounded-lg transition-colors"
                >
                  Projects Widget
                </button>
                <button
                  onClick={() => setSelectedWidgetType("education")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-neutral-700/80 rounded-lg transition-colors"
                >
                  Education Widget
                </button>
                <button
                  onClick={() => setSelectedWidgetType("work-experience")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-neutral-700/80 rounded-lg transition-colors"
                >
                  Work Experience Widget
                </button>
                <button
                  onClick={() => setSelectedWidgetType("description")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-neutral-700/80 rounded-lg transition-colors"
                >
                  Description Widget
                </button>
                <button
                  onClick={() => setSelectedWidgetType("gallery")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-neutral-700/80 rounded-lg transition-colors"
                >
                  Gallery Widget
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <BackButton onClick={() => setShowAddDropdown(!showAddDropdown)} icon={Plus} />
    </div>
  )

  const renderWidget = (widget: { id: string; type: string }, column: "left" | "right") => {
    switch (widget.type) {
      case "profile":
        return <ProfileWidget key={widget.id} widgetId={widget.id} column={column} />
      case "education":
        return <EducationWidget key={widget.id} widgetId={widget.id} column={column} />
      case "work-experience":
        return <WorkExperienceWidget key={widget.id} widgetId={widget.id} column={column} />
      case "projects":
        return <ProjectsWidget key={widget.id} widgetId={widget.id} column={column} />
      case "services":
        return <ServicesWidget key={widget.id} widgetId={widget.id} column={column} />
      case "description":
        return <DescriptionWidget key={widget.id} widgetId={widget.id} column={column} />
      case "gallery":
        return <GalleryWidget key={widget.id} widgetId={widget.id} column={column} />
      case "startup":
        return (
          <StartupWidget
            key={widget.id}
            widgetId={widget.id}
            column={column}
            isPreviewMode={isPreviewMode}
            content={startupContent}
            onContentChange={setStartupContent}
            onDelete={() => deleteWidget(widget.id, column)}
            onMove={() => {
              deleteWidget(widget.id, column)
              if (column === "left") {
                setRightWidgets([...rightWidgets, widget])
              } else {
                setLeftWidgets([...leftWidgets, widget])
              }
            }}
            editingField={editingField}
            setEditingField={setEditingField}
          />
        )
      default:
        return (
          <div key={widget.id} className="bg-neutral-800/50 backdrop-blur-xl rounded-3xl p-8">
            <div className="text-white">Widget: {widget.type}</div>
          </div>
        )
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
      {selectedGroup && <GroupDetailView />}
      <PortfolioShell
        title={`${activeIdentity?.name || "jenny wilson"}.`}
        isPreviewMode={isPreviewMode}
        rightSlot={!isPreviewMode ? rightSlot : null}
        logoHref="/network"
      >
        <Reorder.Group
          axis="y"
          values={leftWidgets}
          onReorder={setLeftWidgets}
          className="lg:w-1/2 flex flex-col gap-4 sm:gap-6"
        >
          {leftWidgets.map((w) => (
            <Reorder.Item
              key={w.id}
              value={w}
              className="list-none"
              whileDrag={{
                scale: 1.05,
                zIndex: 50,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                rotate: 2,
              }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {renderWidget(w, "left")}
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <Reorder.Group
          axis="y"
          values={rightWidgets}
          onReorder={setRightWidgets}
          className="lg:w-1/2 flex flex-col gap-4 sm:gap-6"
        >
          {rightWidgets.map((w) => (
            <Reorder.Item
              key={w.id}
              value={w}
              className="list-none"
              whileDrag={{
                scale: 1.05,
                zIndex: 50,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                rotate: -2,
              }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {renderWidget(w, "right")}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </PortfolioShell>
    </>
  )
}
