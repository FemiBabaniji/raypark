"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { GripVertical, X, ChevronLeft, ChevronRight, Plus, Trash2, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { nanoid } from "nanoid"

type ProjectTask = {
  id: string
  title: string
  completed: boolean
}

type ProjectItem = {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "archived"
  tags: string[]
  dueDate?: string
  progress?: number
  tasks: ProjectTask[]
}

type SwipeableProjectsContent = {
  title: string
  items: ProjectItem[]
}

type Props = {
  widgetId: string
  column: "left" | "right"
  isPreviewMode: boolean
  content: SwipeableProjectsContent
  onContentChange: (content: SwipeableProjectsContent) => void
  onDelete: () => void
  onMove: () => void
  editingField: string | null
  setEditingField: (field: string | null) => void
}

export default function SwipeableProjectsWidget({
  widgetId,
  column,
  isPreviewMode,
  content,
  onContentChange,
  onDelete,
  onMove,
  editingField,
  setEditingField,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [widgetColor, setWidgetColor] = useState("bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [expandedTasks, setExpandedTasks] = useState(true)

  const items = content?.items || []
  const currentItem = items[currentIndex]

  const colorOptions = [
    { name: "Blue Wave", value: "bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40" },
    { name: "Sunset", value: "bg-gradient-to-br from-orange-900/40 via-red-900/40 to-pink-900/40" },
    { name: "Forest", value: "bg-gradient-to-br from-green-900/40 via-emerald-900/40 to-teal-900/40" },
    { name: "Ocean", value: "bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-indigo-900/40" },
    { name: "Purple Dream", value: "bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-rose-900/40" },
  ]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStart) return
    const currentX = e.touches[0].clientX
    const diff = dragStart - currentX

    if (Math.abs(diff) > 80) {
      if (diff > 0) handleNext()
      else handlePrevious()
      setDragStart(null)
    }
  }

  const addProject = () => {
    const newProject: ProjectItem = {
      id: nanoid(6),
      name: "New Project",
      description: "Project description",
      status: "active",
      tags: ["new"],
      progress: 0,
      tasks: [{ id: nanoid(6), title: "First task", completed: false }],
    }
    onContentChange({ ...content, items: [...items, newProject] })
    setCurrentIndex(items.length)
  }

  const updateProject = (index: number, updates: Partial<ProjectItem>) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], ...updates }
    onContentChange({ ...content, items: newItems })
  }

  const deleteProject = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onContentChange({ ...content, items: newItems })
    if (currentIndex >= newItems.length) {
      setCurrentIndex(Math.max(0, newItems.length - 1))
    }
  }

  const addTask = (projectIndex: number) => {
    const project = items[projectIndex]
    const newTask: ProjectTask = {
      id: nanoid(6),
      title: "New task",
      completed: false,
    }
    updateProject(projectIndex, { tasks: [...project.tasks, newTask] })
  }

  const updateTask = (projectIndex: number, taskIndex: number, updates: Partial<ProjectTask>) => {
    const project = items[projectIndex]
    const newTasks = [...project.tasks]
    newTasks[taskIndex] = { ...newTasks[taskIndex], ...updates }
    updateProject(projectIndex, { tasks: newTasks })
  }

  const deleteTask = (projectIndex: number, taskIndex: number) => {
    const project = items[projectIndex]
    const newTasks = (project.tasks || []).filter((_, i) => i !== taskIndex)
    updateProject(projectIndex, { tasks: newTasks })
  }

  const toggleTaskComplete = (projectIndex: number, taskIndex: number) => {
    const project = items[projectIndex]
    if (!project.tasks || !project.tasks[taskIndex]) return
    const task = project.tasks[taskIndex]
    updateTask(projectIndex, taskIndex, { completed: !task.completed })
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

  const completedTasks = currentItem?.tasks?.filter((t) => t.completed).length || 0
  const totalTasks = currentItem?.tasks?.length || 0

  return (
    <div className={`${widgetColor} backdrop-blur-xl rounded-3xl p-8 group relative overflow-hidden`}>
      {/* Decorative wave pattern overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          {[...Array(40)].map((_, i) => (
            <line
              key={i}
              x1={i * 10}
              y1="0"
              x2={i * 10}
              y2="400"
              stroke="url(#wave-gradient)"
              strokeWidth="2"
              opacity="0.6"
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {editingField === `${widgetId}-title` ? (
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
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-white/30 text-2xl font-bold text-white px-3 py-2 transition-all duration-200"
              autoFocus
            />
          ) : (
            <h2
              onClick={() => !isPreviewMode && setEditingField(`${widgetId}-title`)}
              className={`text-2xl font-bold text-white ${
                !isPreviewMode
                  ? "cursor-text hover:bg-white/5 rounded-lg px-3 py-2 -mx-3 -my-2 transition-all duration-200"
                  : ""
              }`}
            >
              {content.title}
            </h2>
          )}
          {!isPreviewMode && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 text-white p-2"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                </Button>
                {showColorPicker && (
                  <div className="absolute top-full right-0 mt-2 bg-zinc-900 border border-white/20 rounded-lg p-2 z-50 min-w-[150px]">
                    {colorOptions.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
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
                onClick={onDelete}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5 text-neutral-400" />
              </div>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <p className="mb-4">No projects added yet</p>
            {!isPreviewMode && (
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                onClick={addProject}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Swipeable Project Card */}
            <div
              className="relative overflow-hidden rounded-2xl"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => setDragStart(null)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 min-h-[200px]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      {editingField === `name-${currentIndex}` ? (
                        <input
                          type="text"
                          value={currentItem?.name}
                          onChange={(e) => updateProject(currentIndex, { name: e.target.value })}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              setEditingField(null)
                            }
                            if (e.key === "Escape") setEditingField(null)
                          }}
                          className="bg-white/10 border border-white/30 rounded-lg outline-none focus:ring-2 focus:ring-white/40 text-white text-xl font-bold px-2 py-1 w-full"
                          autoFocus
                        />
                      ) : (
                        <h3
                          onClick={() => !isPreviewMode && setEditingField(`name-${currentIndex}`)}
                          className={`text-xl font-bold text-white ${
                            !isPreviewMode ? "cursor-text hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 -my-1" : ""
                          }`}
                        >
                          {currentItem?.name}
                        </h3>
                      )}

                      {editingField === `description-${currentIndex}` ? (
                        <textarea
                          value={currentItem?.description}
                          onChange={(e) => updateProject(currentIndex, { description: e.target.value })}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setEditingField(null)
                          }}
                          className="bg-white/10 border border-white/30 rounded-lg outline-none focus:ring-2 focus:ring-white/40 text-white text-sm px-2 py-1 w-full mt-2 resize-none"
                          rows={2}
                          autoFocus
                        />
                      ) : (
                        <p
                          onClick={() => !isPreviewMode && setEditingField(`description-${currentIndex}`)}
                          className={`text-sm text-white/70 mt-2 ${
                            !isPreviewMode ? "cursor-text hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 -my-1" : ""
                          }`}
                        >
                          {currentItem?.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={currentItem?.status}
                        onChange={(e) =>
                          updateProject(currentIndex, { status: e.target.value as "active" | "completed" | "archived" })
                        }
                        disabled={isPreviewMode}
                        className={`text-xs px-3 py-1.5 rounded-full ${
                          currentItem?.status === "active"
                            ? "bg-green-500/30 text-green-300"
                            : currentItem?.status === "completed"
                              ? "bg-blue-500/30 text-blue-300"
                              : "bg-gray-500/30 text-gray-300"
                        } ${!isPreviewMode ? "cursor-pointer hover:opacity-80" : ""}`}
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                      </select>
                      {!isPreviewMode && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5"
                          onClick={() => deleteProject(currentIndex)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {currentItem?.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-white/70 font-medium flex items-center gap-2">
                          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-white/60" />
                          </div>
                          {completedTasks}/{totalTasks} tasks
                        </span>
                        <span className="text-xs text-white/70 font-medium">
                          {Math.round((completedTasks / totalTasks) * 100) || 0}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-300"
                          style={{ width: `${Math.round((completedTasks / totalTasks) * 100) || 0}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {currentItem?.tags && currentItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentItem.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded text-white group/tag relative">
                          {tag}
                          {!isPreviewMode && (
                            <button
                              className="absolute -top-1 -right-1 bg-red-500/80 rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover/tag:opacity-100 transition-opacity"
                              onClick={() => removeTag(currentIndex, idx)}
                            >
                              <X className="w-2 h-2 text-white" />
                            </button>
                          )}
                        </span>
                      ))}
                      {!isPreviewMode && (
                        <button
                          onClick={() => addTag(currentIndex)}
                          className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <Button
                size="sm"
                variant="ghost"
                onClick={handlePrevious}
                disabled={items.length <= 1}
                className="bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex gap-2">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60 w-2"
                    }`}
                  />
                ))}
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleNext}
                disabled={items.length <= 1}
                className="bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Tasks Section */}
            {currentItem && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-white">Tasks</h4>
                  {!isPreviewMode && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/10 hover:bg-white/20 text-white p-1.5"
                      onClick={() => addTask(currentIndex)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                {currentItem.tasks.length === 0 ? (
                  <p className="text-xs text-white/50 text-center py-4">No tasks yet</p>
                ) : (
                  <div className="space-y-2">
                    {currentItem.tasks.map((task, taskIdx) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 bg-white/5 rounded-lg p-3 group/task hover:bg-white/10 transition-all"
                      >
                        <button
                          onClick={() => !isPreviewMode && toggleTaskComplete(currentIndex, taskIdx)}
                          disabled={isPreviewMode}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            task.completed
                              ? "bg-green-500/30 border-green-400"
                              : "border-white/30 hover:border-white/50"
                          } ${!isPreviewMode ? "cursor-pointer" : "cursor-default"}`}
                        >
                          {task.completed && <Check className="w-3 h-3 text-green-400" />}
                        </button>

                        {editingField === `task-${currentIndex}-${taskIdx}` ? (
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) => updateTask(currentIndex, taskIdx, { title: e.target.value })}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                setEditingField(null)
                              }
                              if (e.key === "Escape") setEditingField(null)
                            }}
                            className="bg-white/10 border border-white/30 rounded-lg outline-none focus:ring-2 focus:ring-white/40 text-white text-sm px-2 py-1 flex-1"
                            autoFocus
                          />
                        ) : (
                          <span
                            onClick={() => !isPreviewMode && setEditingField(`task-${currentIndex}-${taskIdx}`)}
                            className={`text-sm flex-1 ${
                              task.completed ? "line-through text-white/50" : "text-white"
                            } ${!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-2 py-1 -mx-2 -my-1" : ""}`}
                          >
                            {task.title}
                          </span>
                        )}

                        {!isPreviewMode && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover/task:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5"
                            onClick={() => deleteTask(currentIndex, taskIdx)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Completed Tasks Section */}
                {currentItem.tasks.filter((t) => t.completed).length > 0 && (
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs text-white/50 font-medium">
                      COMPLETED ({currentItem.tasks.filter((t) => t.completed).length})
                    </p>
                  </div>
                )}
              </div>
            )}

            {!isPreviewMode && (
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all"
                onClick={addProject}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
