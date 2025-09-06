"use client"

import { Button } from "@/components/ui/button"
import { Upload, Play, GripVertical, Palette, X } from "lucide-react"
import { useState } from "react"
import { Reorder } from "framer-motion"
import PortfolioShell from "./portfolio-shell"
import { useRouter } from "next/navigation"

export default function JohnDoePortfolio({ isPreviewMode = true }: { isPreviewMode?: boolean }) {
  const router = useRouter()
  const [profileColor, setProfileColor] = useState("rose") // Same color as Jenny Wilson
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [projectColors, setProjectColors] = useState({
    ml: "blue",
    analytics: "blue",
  })
  const [showProjectColorPicker, setShowProjectColorPicker] = useState({
    ml: false,
    analytics: false,
  })

  const [leftWidgets, setLeftWidgets] = useState([
    { id: "profile", type: "profile" },
    { id: "education", type: "education" },
  ])

  const [rightWidgets, setRightWidgets] = useState([
    { id: "description", type: "description" },
    { id: "projects", type: "projects" },
    { id: "services", type: "services" },
  ])

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

  const [isDragging, setIsDragging] = useState(false)
  const [dragOverColumn, setDragOverColumn] = useState<"left" | "right" | null>(null)

  const [profileText, setProfileText] = useState({
    name: "john doe",
    title: "is a data scientist",
    subtitle: "currently analyzing at data team.",
  })

  const [aboutText, setAboutText] = useState({
    title: "About Me",
    description:
      "I'm a passionate data scientist with over 4 years of experience turning complex data into actionable insights.",
    subdescription:
      "I focus on machine learning, statistical analysis, and building predictive models that drive business decisions.",
  })

  const [editingField, setEditingField] = useState<string | null>(null)

  const deleteWidget = (widgetId: string, column: "left" | "right") => {
    if (column === "left") {
      setLeftWidgets(leftWidgets.filter((widget) => widget.id !== widgetId))
    } else {
      setRightWidgets(rightWidgets.filter((widget) => widget.id !== widgetId))
    }
  }

  const ProfileWidget = ({ widgetId, column }: { widgetId?: string; column?: "left" | "right" }) => (
    <div
      className={`bg-gradient-to-br ${
        colorOptions?.find((c) => c.name === profileColor)?.gradient || "from-rose-400/40 to-rose-600/60"
      } backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing relative`}
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
        <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden">
          <img src="/man-developer.png" alt="John Doe" className="w-full h-full object-cover" />
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
          scientist{" "}
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
          {["linkedin.", "github.", "kaggle.", "twitter.", "medium.", "researchgate."].map((social) => (
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
        {/* MS Data Science */}
        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-white">MS Data Science</h3>
            <p className="text-neutral-300 text-sm">MIT</p>
            <p className="text-neutral-400 text-xs">2019 • GPA: 3.9</p>
          </div>
        </div>

        {/* BS Statistics */}
        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-white">BS Statistics</h3>
            <p className="text-neutral-300 text-sm">Harvard University</p>
            <p className="text-neutral-400 text-xs">2017 • GPA: 3.8</p>
          </div>
        </div>

        {/* Google Analytics Certified */}
        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-semibold text-white">Google Analytics Certified</h3>
              <p className="text-neutral-300 text-sm">Google</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-neutral-400 text-xs">2020</p>
              <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">Certified</span>
            </div>
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
          <h2 className="text-xl font-bold">Data Science Portfolio</h2>
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
        {/* Predictive Analytics */}
        <div className="bg-neutral-800/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Predictive Analytics</span>
            <Upload className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Customer churn prediction model using ensemble methods and feature engineering...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">Python</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">Scikit-learn</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">Pandas</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400">In Progress</span>
            <span className="text-2xl font-bold">75%</span>
          </div>
        </div>

        {/* Machine Learning */}
        <div
          className={`bg-gradient-to-br ${
            projectColorOptions?.find((c) => c.name === projectColors.ml)?.gradient || "from-blue-500/70 to-cyan-500/70"
          } rounded-2xl p-4 space-y-3 relative group/ml`}
        >
          {!isPreviewMode && (
            <div className="absolute top-2 right-2">
              {showProjectColorPicker.ml && (
                <div className="absolute bottom-full right-0 mb-2 bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-4 z-50 min-w-[200px]">
                  <div className="grid grid-cols-3 gap-3">
                    {projectColorOptions.map((color) => (
                      <button
                        key={color.name}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient} ${
                          projectColors.ml === color.name ? "ring-2 ring-white" : ""
                        } hover:ring-2 hover:ring-white/50 transition-all`}
                        onClick={() => {
                          setProjectColors((prev) => ({ ...prev, ml: color.name }))
                          setShowProjectColorPicker((prev) => ({ ...prev, ml: false }))
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover/ml:opacity-100 transition-opacity bg-black/20 hover:bg-black/30 text-white p-2"
                onClick={() => setShowProjectColorPicker((prev) => ({ ...prev, ml: !prev.ml }))}
              >
                <Palette className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium bg-black/20 px-2 py-1 rounded">ML Pipeline</span>
            <Play className="w-4 h-4" />
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            End-to-end machine learning pipeline for real-time fraud detection with 95% accuracy...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-black/20 px-2 py-1 rounded">TensorFlow</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">Apache Spark</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">Docker</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-400">Completed</span>
            <span className="text-2xl font-bold">100%</span>
          </div>
        </div>

        {/* Data Analytics */}
        <div
          className={`bg-gradient-to-br ${
            projectColorOptions?.find((c) => c.name === projectColors.analytics)?.gradient ||
            "from-purple-500/70 to-blue-500/70"
          } rounded-2xl p-4 space-y-3 relative group/analytics`}
        >
          {!isPreviewMode && (
            <div className="absolute top-2 right-2">
              {showProjectColorPicker.analytics && (
                <div className="absolute bottom-full right-0 mb-2 bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-4 z-50 min-w-[200px]">
                  <div className="grid grid-cols-3 gap-3">
                    {projectColorOptions.map((color) => (
                      <button
                        key={color.name}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient} ${
                          projectColors.analytics === color.name ? "ring-2 ring-white" : ""
                        } hover:ring-2 hover:ring-white/50 transition-all`}
                        onClick={() => {
                          setProjectColors((prev) => ({ ...prev, analytics: color.name }))
                          setShowProjectColorPicker((prev) => ({ ...prev, analytics: false }))
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover/analytics:opacity-100 transition-opacity bg-black/20 hover:bg-black/30 text-white p-2"
                onClick={() => setShowProjectColorPicker((prev) => ({ ...prev, analytics: !prev.analytics }))}
              >
                <Palette className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium bg-black/20 px-2 py-1 rounded">Analytics Dashboard</span>
            <Play className="w-4 h-4" />
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            Interactive business intelligence dashboard with real-time KPI tracking and insights...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-black/20 px-2 py-1 rounded">Tableau</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">SQL</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">Power BI</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400">In Progress</span>
            <span className="text-2xl font-bold">80%</span>
          </div>
        </div>

        {/* Research */}
        <div className="bg-neutral-800/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Research Paper</span>
            <Upload className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Published research on deep learning applications in natural language processing...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">PyTorch</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">NLP</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">BERT</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-400">Published</span>
            <span className="text-2xl font-bold">100%</span>
          </div>
        </div>
      </div>
    </div>
  )

  const ServicesWidget = ({ widgetId, column }: { widgetId: string; column: "left" | "right" }) => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
      <div className="flex items-center justify-between mb-6">
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
        <h3 className="text-xl font-bold mb-4">As a data scientist,</h3>
        <p className="text-white leading-relaxed">
          I specialize in extracting meaningful insights from complex datasets.{" "}
          <span className="text-neutral-400">
            I believe that great data science starts with understanding the business problem, asking the right
            questions, and communicating findings clearly to stakeholders.
          </span>
        </p>
      </div>
    </div>
  )

  const DescriptionWidget = ({ widgetId, column }: { widgetId: string; column: "left" | "right" }) => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
      <div className="flex items-center justify-between mb-6">
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
        <h3 className="text-xl font-bold mb-4">
          {editingField === "about-title" ? (
            <input
              type="text"
              value={aboutText.title}
              onChange={(e) => setAboutText({ ...aboutText, title: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === "Enter" && e.shiftKey === false && setEditingField(null)}
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
      default:
        return null
    }
  }

  return (
    <PortfolioShell title="john doe." isPreviewMode={isPreviewMode}>
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
              {renderWidget(widget, "right")}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </PortfolioShell>
  )
}
