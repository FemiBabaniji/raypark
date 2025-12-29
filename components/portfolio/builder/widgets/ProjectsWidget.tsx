"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GripVertical, X, Upload, Plus, Trash2 } from "lucide-react"
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
  const [isHovering, setIsHovering] = useState<number | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [widgetColor, setWidgetColor] = useState("bg-zinc-900/40")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const layoutId = `widget-${widgetId}`

  const items = Array.isArray(content?.items) ? content.items : []

  const colorOptions = [
    { name: "Default", value: "bg-zinc-900/40" },
    { name: "Blue", value: "bg-gradient-to-br from-blue-900/40 to-cyan-900/40" },
    { name: "Purple", value: "bg-gradient-to-br from-purple-900/40 to-pink-900/40" },
    { name: "Green", value: "bg-gradient-to-br from-green-900/40 to-emerald-900/40" },
    { name: "Orange", value: "bg-gradient-to-br from-orange-900/40 to-red-900/40" },
  ]

  const addProject = () => {
    const newProject: ProjectItem = {
      name: "New Project",
      description: "Project description...",
      year: "2024",
      tags: ["React"],
    }
    onContentChange({ ...content, items: [...items, newProject] })
  }

  const updateProject = (index: number, updates: Partial<ProjectItem>) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], ...updates }
    onContentChange({ ...content, items: newItems })
  }

  const deleteProject = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onContentChange({ ...content, items: newItems })
  }

  const addTag = (projectIndex: number) => {
    const newTag = prompt("Enter tag name:")
    if (newTag) {
      const project = items[projectIndex]
      updateProject(projectIndex, { tags: [...project.tags, newTag] })
    }
  }

  const removeTag = (projectIndex: number, tagIndex: number) => {
    const project = items[projectIndex]
    const newTags = project.tags.filter((_, i) => i !== tagIndex)
    updateProject(projectIndex, { tags: newTags })
  }

  return (
    <>
      <motion.div
        layoutId={layoutId}
        className={`${widgetColor} backdrop-blur-xl rounded-3xl p-8 group relative`}
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest("input, button, textarea")) {
            setOpen(true)
          }
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm">
              <div className="w-3 h-3 border border-white rounded-sm"></div>
            </div>
            {editingField === "title" ? (
              <input
                type="text"
                value={content.title}
                onChange={(e) => onContentChange({ ...content, title: e.target.value })}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    setEditingField(null)
                  }
                  if (e.key === "Escape") setEditingField(null)
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-white/30 text-xl font-bold text-white px-2 py-1 h-9 transition-all duration-200"
                autoFocus
              />
            ) : (
              <h2
                onClick={(e) => {
                  e.stopPropagation()
                  !isPreviewMode && setEditingField("title")
                }}
                className={`text-xl font-bold text-white ${
                  !isPreviewMode
                    ? "cursor-text hover:bg-white/5 rounded-lg px-2 py-1 -mx-2 -my-1 transition-all duration-200"
                    : ""
                }`}
              >
                {content.title}
              </h2>
            )}
          </div>
          {!isPreviewMode && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 text-white p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowColorPicker(!showColorPicker)
                  }}
                >
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                </Button>
                {showColorPicker && (
                  <div className="absolute top-full right-0 mt-2 bg-zinc-900 border border-white/20 rounded-lg p-2 z-50 min-w-[150px]">
                    {colorOptions.map((color) => (
                      <button
                        key={color.name}
                        onClick={(e) => {
                          e.stopPropagation()
                          setWidgetColor(color.value)
                          setShowColorPicker(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-white text-sm flex items-center gap-2"
                      >
                        <div className={`w-4 h-4 rounded ${color.value}`} />
                        {color.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
          {items.map((project, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 space-y-3 transition-all duration-200 hover:bg-white/10 relative group/project min-h-[180px]"
              onMouseEnter={() => setIsHovering(idx)}
              onMouseLeave={() => setIsHovering(null)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                {editingField === `name-${idx}` ? (
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(idx, { name: e.target.value })}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        setEditingField(null)
                      }
                      if (e.key === "Escape") setEditingField(null)
                    }}
                    className="bg-white/10 border border-white/30 rounded-lg outline-none focus:ring-2 focus:ring-white/40 text-white text-sm font-medium px-2 py-1 flex-1 h-8 transition-all duration-200"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => !isPreviewMode && setEditingField(`name-${idx}`)}
                    className={`text-sm font-medium text-white min-h-[24px] block ${
                      !isPreviewMode && isHovering === idx
                        ? "cursor-text hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 -my-1 transition-all duration-200"
                        : ""
                    }`}
                  >
                    {project.name}
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-neutral-400" />
                  {!isPreviewMode && isHovering === idx && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover/project:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1"
                      onClick={() => deleteProject(idx)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>

              {editingField === `description-${idx}` ? (
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(idx, { description: e.target.value })}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      setEditingField(null)
                    }
                    if (e.key === "Escape") setEditingField(null)
                  }}
                  className="bg-white/10 border border-white/30 rounded-lg outline-none focus:ring-2 focus:ring-white/40 text-white text-xs px-2 py-1 w-full resize-none transition-all duration-200"
                  rows={3}
                  autoFocus
                />
              ) : (
                <p
                  onClick={() => !isPreviewMode && setEditingField(`description-${idx}`)}
                  className={`text-xs text-neutral-300 leading-relaxed ${
                    !isPreviewMode && isHovering === idx
                      ? "cursor-text hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 -my-1 transition-all duration-200"
                      : ""
                  }`}
                >
                  {project.description}
                </p>
              )}

              <div className="flex flex-wrap gap-1">
                {project.tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className="text-xs bg-white/10 px-2 py-1 rounded text-white group/tag relative">
                    {tag}
                    {!isPreviewMode && isHovering === idx && (
                      <button
                        className="absolute -top-1 -right-1 bg-red-500/80 rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover/tag:opacity-100 transition-opacity"
                        onClick={() => removeTag(idx, tagIdx)}
                      >
                        <X className="w-2 h-2 text-white" />
                      </button>
                    )}
                  </span>
                ))}
                {!isPreviewMode && isHovering === idx && (
                  <button
                    onClick={() => addTag(idx)}
                    className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-all duration-200"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>

              {editingField === `year-${idx}` ? (
                <input
                  type="text"
                  value={project.year}
                  onChange={(e) => updateProject(idx, { year: e.target.value })}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      setEditingField(null)
                    }
                    if (e.key === "Escape") setEditingField(null)
                  }}
                  className="bg-white/10 border border-white/30 rounded-lg outline-none focus:ring-2 focus:ring-white/40 text-white text-xs px-2 py-1 w-20 transition-all duration-200"
                  autoFocus
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span
                    onClick={() => !isPreviewMode && setEditingField(`year-${idx}`)}
                    className={`text-xs text-blue-400 ${
                      !isPreviewMode && isHovering === idx
                        ? "cursor-text hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 -my-1 transition-all duration-200"
                        : ""
                    }`}
                  >
                    {project.year}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {!isPreviewMode && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation()
              addProject()
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        )}
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
