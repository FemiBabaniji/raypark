"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GripVertical, X, Upload, Play, Palette } from "lucide-react"
import dynamic from "next/dynamic"
import FullscreenWidgetOverlay from "@/components/FullscreenWidgetOverlay"

const ProjectWorkflowTab = dynamic(() => import("@/components/ProjectWorkflowTab"), { ssr: false })

type ProjectItem = {
  name: string
  description: string
  year: string
  tags: string[]
}

type ProjectsContent = {
  title: string
  items: ProjectItem[]
}

type Props = {
  widgetId: string
  column: "left" | "right"
  isPreviewMode: boolean
  content: ProjectsContent
  onContentChange: (content: ProjectsContent) => void
  onDelete: () => void
  onMove: () => void
  projectColors: Record<string, string>
  setProjectColors: (colors: Record<string, string>) => void
  showProjectColorPicker: Record<string, boolean>
  setShowProjectColorPicker: (picker: Record<string, boolean>) => void
  projectColorOptions: Array<{ name: string; gradient: string }>
}

export default function ProjectsWidget({
  widgetId,
  column,
  isPreviewMode,
  content,
  onContentChange,
  onDelete,
  onMove,
  projectColors,
  setProjectColors,
  showProjectColorPicker,
  setShowProjectColorPicker,
  projectColorOptions,
}: Props) {
  const [open, setOpen] = useState(false)
  const layoutId = `widget-${widgetId}`

  return (
    <>
      <motion.div
        layoutId={layoutId}
        className="bg-[#252525] backdrop-blur-xl rounded-3xl p-8 cursor-pointer group relative"
        onClick={() => setOpen(true)}
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
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
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
              <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded text-white">AWS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-400">In Progress</span>
              <span className="text-2xl font-bold text-white">85%</span>
            </div>
          </div>

          {/* AI/ML */}
          <div
            className={`bg-gradient-to-br ${projectColorOptions.find((c) => c.name === projectColors.aiml)?.gradient || "from-purple-500/20 to-pink-500/20"} rounded-2xl p-4 space-y-3 relative group/aiml`}
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
                          onClick={(e) => {
                            e.stopPropagation()
                            setProjectColors({ ...projectColors, aiml: color.name })
                            setShowProjectColorPicker({ ...showProjectColorPicker, aiml: false })
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
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowProjectColorPicker({ ...showProjectColorPicker, aiml: !showProjectColorPicker.aiml })
                  }}
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
              Real-time insights with machine learning predictions and interactive data visual...
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs bg-black/20 px-2 py-1 rounded text-white">Python</span>
              <span className="text-xs bg-black/20 px-2 py-1 rounded text-white">React</span>
              <span className="text-xs bg-black/20 px-2 py-1 rounded text-white">TensorFlow</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/80">In Progress</span>
              <span className="text-2xl font-bold text-white">60%</span>
            </div>
          </div>

          {/* Mobile */}
          <div
            className={`bg-gradient-to-br ${projectColorOptions.find((c) => c.name === projectColors.mobile)?.gradient || "from-blue-500/20 to-cyan-500/20"} rounded-2xl p-4 space-y-3 relative group/mobile`}
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
                          onClick={(e) => {
                            e.stopPropagation()
                            setProjectColors({ ...projectColors, mobile: color.name })
                            setShowProjectColorPicker({ ...showProjectColorPicker, mobile: false })
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
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowProjectColorPicker({ ...showProjectColorPicker, mobile: !showProjectColorPicker.mobile })
                  }}
                >
                  <Palette className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium bg-black/20 px-2 py-1 rounded text-white">Mobile</span>
              <Play className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Cross-platform mobile solution for enhanced customer engagement with offline cap...
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs bg-black/20 px-2 py-1 rounded text-white">React Native</span>
              <span className="text-xs bg-black/20 px-2 py-1 rounded text-white">TypeScript</span>
              <span className="text-xs bg-black/20 px-2 py-1 rounded text-white">Firebase</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-400">Completed</span>
              <span className="text-2xl font-bold text-white">100%</span>
            </div>
          </div>

          {/* DevOps */}
          <div className="bg-neutral-800/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">DevOps</span>
              <Upload className="w-4 h-4 text-neutral-400" />
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Scalable cloud architecture implementation with automated deployment pipelines a...
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded text-white">AWS</span>
              <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded text-white">Terraform</span>
              <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded text-white">Kubernetes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-400">Completed</span>
              <span className="text-2xl font-bold text-white">100%</span>
            </div>
          </div>
        </div>
      </motion.div>

      <FullscreenWidgetOverlay
        open={open}
        onClose={() => setOpen(false)}
        layoutId={layoutId}
        title="Projects Dashboard"
      >
        <ProjectWorkflowTab />
      </FullscreenWidgetOverlay>
    </>
  )
}
