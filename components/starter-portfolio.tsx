"use client"

import { useState } from "react"
import { Reorder } from "framer-motion"
import { Upload, Play, GripVertical, Palette, Plus, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import PortfolioShell from "./portfolio-shell"

/**
 * StarterPortfolio — a friendlier template for first-time users.
 * - Minimal default widgets
 * - Clear "click to edit" copy
 * - Quick-start tips
 * - Same 7-color translucent theme & interactions as your current build
 */
export default function StarterPortfolio({ isPreviewMode = false }: { isPreviewMode?: boolean }) {
  /** THEME (same 7-color translucent scheme you chose) */
  const colorOptions = [
    { name: "rose", gradient: "from-rose-400/40 to-rose-600/60" },
    { name: "blue", gradient: "from-blue-400/40 to-blue-600/60" },
    { name: "purple", gradient: "from-purple-400/40 to-purple-600/60" },
    { name: "green", gradient: "from-green-400/40 to-green-600/60" },
    { name: "orange", gradient: "from-orange-400/40 to-orange-600/60" },
    { name: "teal", gradient: "from-teal-400/40 to-teal-600/60" },
    { name: "neutral", gradient: "from-neutral-400/40 to-neutral-600/60" },
  ]
  const projectColorOptions = [
    { name: "rose", gradient: "from-rose-500/70 to-pink-500/70" },
    { name: "blue", gradient: "from-blue-500/70 to-cyan-500/70" },
    { name: "purple", gradient: "from-purple-500/70 to-blue-500/70" },
    { name: "green", gradient: "from-green-500/70 to-emerald-500/70" },
    { name: "orange", gradient: "from-orange-500/70 to-red-500/70" },
    { name: "teal", gradient: "from-teal-500/70 to-blue-500/70" },
    { name: "neutral", gradient: "from-neutral-500/70 to-neutral-600/70" },
  ]

  /** LOCAL UI STATE (same editing mechanics) */
  const [isDragging, setIsDragging] = useState(false)
  const [dragOverColumn, setDragOverColumn] = useState<"left" | "right" | null>(null)

  const [profileColor, setProfileColor] = useState("rose")
  const [showColorPicker, setShowColorPicker] = useState(false)

  const [projectColors, setProjectColors] = useState({ spotlight: "purple" })
  const [showProjectColorPicker, setShowProjectColorPicker] = useState({ spotlight: false })

  const [leftWidgets, setLeftWidgets] = useState([
    { id: "profile", type: "profile" as const },
    { id: "about", type: "about" as const },
  ])
  const [rightWidgets, setRightWidgets] = useState([
    { id: "projects", type: "projects" as const },
    { id: "quickstart", type: "quickstart" as const },
  ])

  const [profileText, setProfileText] = useState({
    name: "your name",
    title: "is a",
    subtitle: "describe what you do (e.g., product designer / software engineer).",
  })
  const [aboutText, setAboutText] = useState({
    title: "About",
    description: "Write a short intro. Focus on what you help people achieve and what makes you different.",
    subdescription: "Tip: keep it concise. You can add more detail in projects or services.",
  })
  const [editingField, setEditingField] = useState<string | null>(null)

  /** ADD MENU */
  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [selectedWidgetType, setSelectedWidgetType] = useState<string | null>(null)

  /** WIDGETS — helpers */
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

  /** WIDGETS — components */
  const ProfileWidget = ({ widgetId, column }: { widgetId?: string; column?: "left" | "right" }) => (
    <div
      className={`bg-gradient-to-br ${colorOptions.find((c) => c.name === profileColor)?.gradient} backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing relative`}
    >
      <div className="flex items-center justify-between mb-4">
        {!isPreviewMode && (
          <div className={`transition-opacity ${isDragging ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
            <GripVertical className="w-5 h-5 text-white/70" />
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
                    {colorOptions.map((color) => (
                      <button
                        key={color.name}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient} ${
                          profileColor === color.name ? "ring-2 ring-white" : ""
                        } hover:ring-2 hover:ring-white/50 transition-all`}
                        onClick={() => {
                          setProfileColor(color.name)
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
        <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
          <img
            src="/professional-woman-headshot.png"
            alt="avatar"
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.opacity = "0.2")}
          />
        </div>
        {!isPreviewMode && (
          <div className="text-xs text-white/80 mt-2">
            Tip: click text to edit • use the palette to change the card color
          </div>
        )}
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

  const AboutWidget = ({ widgetId, column }: { widgetId: string; column: "left" | "right" }) => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">About</h3>
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
        <h3 className="text-lg font-semibold">
          {editingField === "about-title" ? (
            <input
              type="text"
              value={aboutText.title}
              onChange={(e) => setAboutText({ ...aboutText, title: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
              className="bg-transparent border-none outline-none text-lg font-semibold text-white w-full"
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

  const ProjectsWidget = ({ widgetId, column }: { widgetId: string; column: "left" | "right" }) => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-neutral-600 rounded flex items-center justify-center">
            <div className="w-3 h-3 border border-neutral-400 rounded-sm"></div>
          </div>
          <h2 className="text-xl font-bold">Projects</h2>
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
        {/* Simple placeholder card */}
        <div className="bg-neutral-800/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Recent Work</span>
            <Upload className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Briefly describe a project result (impact, users, metrics). You can add links or media later.
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">Tech</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">Design</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400">Draft</span>
            <span className="text-2xl font-bold">—</span>
          </div>
        </div>

        {/* Spotlight with theme picker */}
        <div
          className={`bg-gradient-to-br ${projectColorOptions.find((c) => c.name === projectColors.spotlight)?.gradient} rounded-2xl p-4 space-y-3 relative group/spotlight`}
        >
          {!isPreviewMode && (
            <div className="absolute top-2 right-2">
              {showProjectColorPicker.spotlight && (
                <div className="absolute bottom-full right-0 mb-2 bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-4 z-50 min-w-[200px]">
                  <div className="grid grid-cols-3 gap-3">
                    {projectColorOptions.map((color) => (
                      <button
                        key={color.name}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient} ${
                          projectColors.spotlight === color.name ? "ring-2 ring-white" : ""
                        } hover:ring-2 hover:ring-white/50 transition-all`}
                        onClick={() => {
                          setProjectColors({ spotlight: color.name })
                          setShowProjectColorPicker({ spotlight: false })
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover/spotlight:opacity-100 transition-opacity bg-black/20 hover:bg-black/30 text-white p-2"
                onClick={() => setShowProjectColorPicker((p) => ({ spotlight: !p.spotlight }))}
              >
                <Palette className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium bg-black/20 px-2 py-1 rounded">Spotlight</span>
            <Play className="w-4 h-4" />
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            Showcase your best piece. Add 1–2 crisp sentences on the outcome.
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-black/20 px-2 py-1 rounded">Keyword</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">Tag</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/80">Status</span>
            <span className="text-2xl font-bold">✓</span>
          </div>
        </div>
      </div>
    </div>
  )

  const QuickStartWidget = ({ widgetId, column }: { widgetId: string; column: "left" | "right" }) => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-6 group cursor-grab active:cursor-grabbing">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Quick Start</h3>
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

      <div className="space-y-3 text-sm">
        {[
          "Click your name and role to edit",
          "Add one recent project with outcome",
          "Drop in a profile photo",
          "Publish when ready",
        ].map((t) => (
          <div key={t} className="flex items-center gap-2 text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>{t}</span>
          </div>
        ))}

        {!isPreviewMode && (
          <div className="pt-2">
            <Button
              onClick={() => setShowAddDropdown(true)}
              variant="outline"
              size="sm"
              className="bg-neutral-800/50 border-neutral-700 hover:bg-neutral-700/50 text-neutral-300 hover:text-white"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add a widget
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  /** RIGHT-SLOT ADD MENU (same pattern) */
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
                  onClick={() => setSelectedWidgetType("about")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-neutral-700/80 rounded-lg transition-colors"
                >
                  About Widget
                </button>
                <button
                  onClick={() => setSelectedWidgetType("quickstart")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-neutral-700/80 rounded-lg transition-colors"
                >
                  Quick Start Widget
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <BackButton onClick={() => setShowAddDropdown(!showAddDropdown)} icon={Plus} />
    </div>
  )

  /** WIDGET RENDER SWITCH */
  const renderWidget = (widget: { id: string; type: string }, column: "left" | "right") => {
    switch (widget.type) {
      case "profile":
        return <ProfileWidget key={widget.id} widgetId={widget.id} column={column} />
      case "about":
        return <AboutWidget key={widget.id} widgetId={widget.id} column={column} />
      case "projects":
        return <ProjectsWidget key={widget.id} widgetId={widget.id} column={column} />
      case "quickstart":
        return <QuickStartWidget key={widget.id} widgetId={widget.id} column={column} />
      default:
        return null
    }
  }

  /** LAYOUT */
  return (
    <PortfolioShell title="your portfolio." isPreviewMode={isPreviewMode} rightSlot={rightSlot}>
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
  )
}
