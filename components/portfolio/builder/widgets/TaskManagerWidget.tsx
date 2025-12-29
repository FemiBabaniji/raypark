"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, X, Plus, MoreHorizontal, ChevronLeft, Check } from "lucide-react"
import { THEME_COLOR_OPTIONS } from "@/lib/theme"
import type { ThemeIndex } from "@/lib/theme"

type TaskDue = "today" | "tomorrow" | "none"

type TaskItem = {
  id: string
  title: string
  description?: string
  due?: TaskDue
  done: boolean
  createdAt: string
}

type TaskProject = {
  id: string
  name: string
  cover?: { kind: "gradient"; gradient?: string }
  tasks: TaskItem[]
}

export type TaskManagerContent = {
  title?: string
  projects: TaskProject[]
}

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`
}

function safeContent(content?: TaskManagerContent | null): TaskManagerContent {
  return {
    title: content?.title ?? "Your Projects",
    projects: Array.isArray(content?.projects) ? content!.projects : [],
  }
}

export default function TaskManagerWidget({
  widgetId,
  column,
  isPreviewMode = false,
  onDelete,
  selectedColor = 5 as ThemeIndex,
  onColorChange,
  content,
  onContentChange,
}: {
  widgetId: string
  column: "left" | "right"
  isPreviewMode?: boolean
  onDelete?: () => void
  selectedColor?: ThemeIndex
  onColorChange?: (color: ThemeIndex) => void
  content?: TaskManagerContent
  onContentChange?: (content: TaskManagerContent) => void
}) {
  const data = safeContent(content)
  const gradient = THEME_COLOR_OPTIONS[selectedColor]?.gradient ?? "from-teal-400/40 to-teal-600/60"

  const [view, setView] = useState<"projects" | "project" | "newTask">("projects")
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)

  const activeProject = useMemo(() => {
    if (!activeProjectId) return null
    return data.projects.find((p) => p.id === activeProjectId) ?? null
  }, [data.projects, activeProjectId])

  const progressFor = (p: TaskProject) => {
    const total = p.tasks.length
    const done = p.tasks.filter((t) => t.done).length
    return { total, done }
  }

  const update = (next: TaskManagerContent) => onContentChange?.(next)

  const addProject = () => {
    const p: TaskProject = {
      id: uid("project"),
      name: "New Project",
      cover: { kind: "gradient", gradient: "from-sky-500/40 to-indigo-600/60" },
      tasks: [],
    }
    update({ ...data, projects: [...data.projects, p] })
  }

  const renameProject = (projectId: string, name: string) => {
    update({
      ...data,
      projects: data.projects.map((p) => (p.id === projectId ? { ...p, name } : p)),
    })
  }

  const toggleTask = (projectId: string, taskId: string) => {
    update({
      ...data,
      projects: data.projects.map((p) => {
        if (p.id !== projectId) return p
        return {
          ...p,
          tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
        }
      }),
    })
  }

  const addTaskToProject = (projectId: string, task: Omit<TaskItem, "id" | "createdAt">) => {
    const newTask: TaskItem = {
      id: uid("task"),
      createdAt: new Date().toISOString(),
      ...task,
    }
    update({
      ...data,
      projects: data.projects.map((p) => (p.id === projectId ? { ...p, tasks: [newTask, ...p.tasks] } : p)),
    })
  }

  const openProject = (projectId: string) => {
    setActiveProjectId(projectId)
    setView("project")
  }

  const openNewTask = (projectId?: string) => {
    if (projectId) setActiveProjectId(projectId)
    if (!activeProjectId && projectId) setActiveProjectId(projectId)
    setView("newTask")
  }

  const [due, setDue] = useState<TaskDue>("today")
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDesc, setTaskDesc] = useState("")
  const [taskProjectId, setTaskProjectId] = useState<string | null>(null)

  const beginNewTask = () => {
    const pid = activeProjectId ?? data.projects[0]?.id ?? null
    setTaskProjectId(pid)
    setDue("today")
    setTaskTitle("")
    setTaskDesc("")
    setView("newTask")
  }

  const createTask = () => {
    const pid = taskProjectId ?? activeProjectId
    if (!pid) return
    if (!taskTitle.trim()) return

    addTaskToProject(pid, {
      title: taskTitle.trim(),
      description: taskDesc.trim() || undefined,
      due,
      done: false,
    })

    setActiveProjectId(pid)
    setView("project")
  }

  const openTasks = useMemo(() => {
    if (!activeProject) return []
    return activeProject.tasks.filter((t) => !t.done)
  }, [activeProject])

  const doneTasks = useMemo(() => {
    if (!activeProject) return []
    return activeProject.tasks.filter((t) => t.done)
  }, [activeProject])

  const [showCompleted, setShowCompleted] = useState(true)

  return (
    <div className={`bg-gradient-to-br ${gradient} backdrop-blur-xl rounded-3xl p-6 relative group`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          {view !== "projects" && (
            <button
              onClick={() => setView(view === "newTask" ? "project" : "projects")}
              className="text-white/70 hover:text-white transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <Calendar className="w-4 h-4 text-white" />
          <h2 className="text-sm font-bold text-white">
            {view === "projects" && (data.title ?? "Your Projects")}
            {view === "project" && (activeProject?.name ?? "Project")}
            {view === "newTask" && "New Task"}
          </h2>
        </div>

        {!isPreviewMode && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 text-white p-2"
              onClick={() => onColorChange?.(selectedColor)}
              title="Theme"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2"
              onClick={onDelete}
              title="Delete"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {view === "projects" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {data.projects.map((p) => {
              const { done, total } = progressFor(p)
              const cover = p.cover?.gradient ?? "from-fuchsia-500/40 to-orange-500/50"
              return (
                <button
                  key={p.id}
                  onClick={() => openProject(p.id)}
                  className="text-left rounded-2xl overflow-hidden bg-white/10 hover:bg-white/15 transition"
                >
                  <div className={`h-28 bg-gradient-to-br ${cover} relative`}>
                    <div className="absolute inset-0 opacity-30 backdrop-blur-[2px]" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-white font-semibold text-sm line-clamp-2">{p.name}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white/70"
                            style={{ width: total === 0 ? "0%" : `${Math.round((done / total) * 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-white/80">
                          {done}/{total} tasks
                        </div>
                      </div>
                    </div>

                    {!isPreviewMode && (
                      <div className="absolute right-3 bottom-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openNewTask(p.id)
                            setTaskProjectId(p.id)
                          }}
                          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white"
                          title="Add task"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}

            {!isPreviewMode && (
              <button
                onClick={addProject}
                className="rounded-2xl border border-dashed border-white/25 bg-white/5 hover:bg-white/10 transition flex items-center justify-center h-28 text-white/80"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Add Project
                </div>
              </button>
            )}
          </div>

          {!isPreviewMode && (
            <Button onClick={beginNewTask} className="w-full bg-white/20 hover:bg-white/30 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          )}
        </div>
      )}

      {view === "project" && activeProject && (
        <div className="space-y-4">
          {!isPreviewMode && (
            <div className="bg-white/10 rounded-2xl p-3">
              <input
                className="w-full bg-transparent text-white font-semibold outline-none"
                value={activeProject.name}
                onChange={(e) => renameProject(activeProject.id, e.target.value)}
              />
              <div className="text-xs text-white/70 mt-1">
                {progressFor(activeProject).done}/{progressFor(activeProject).total} completed
              </div>
            </div>
          )}

          <div className="max-h-[420px] overflow-y-auto pr-1 space-y-2">
            {openTasks.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTask(activeProject.id, t.id)}
                className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/15 transition rounded-2xl p-3 text-left"
              >
                <span className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center" />
                <div className="flex-1">
                  <div className="text-sm text-white font-medium">{t.title}</div>
                  {t.description && <div className="text-xs text-white/70 line-clamp-2 mt-0.5">{t.description}</div>}
                </div>
                {t.due && t.due !== "none" && (
                  <span className="text-[11px] px-2 py-1 rounded-full bg-white/10 text-white/70">
                    {t.due === "today" ? "Today" : "Tomorrow"}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-2">
              <button
                onClick={() => setShowCompleted((v) => !v)}
                className="w-full flex items-center justify-between text-xs text-white/70 px-1"
              >
                <span>Completed ({doneTasks.length})</span>
                <span className="opacity-70">{showCompleted ? "–" : "+"}</span>
              </button>

              {showCompleted && (
                <div className="mt-2 space-y-2">
                  {doneTasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => toggleTask(activeProject.id, t.id)}
                      className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 transition rounded-2xl p-3 text-left opacity-80"
                    >
                      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white/80" />
                      </span>
                      <div className="flex-1">
                        <div className="text-sm text-white/70 line-through">{t.title}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {openTasks.length === 0 && doneTasks.length === 0 && (
              <div className="text-center text-sm text-white/70 py-10 bg-white/5 rounded-2xl">
                No tasks yet. Add one.
              </div>
            )}
          </div>

          {!isPreviewMode && (
            <Button
              onClick={() => {
                setTaskProjectId(activeProject.id)
                setView("newTask")
              }}
              className="w-full bg-white/20 hover:bg-white/30 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          )}
        </div>
      )}

      {view === "newTask" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setDue("today")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                due === "today" ? "bg-white text-black" : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDue("tomorrow")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                due === "tomorrow" ? "bg-white text-black" : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              Tomorrow
            </button>
          </div>

          <div className="bg-white/10 rounded-2xl p-3">
            <div className="text-[11px] text-white/60 mb-2 tracking-wide">PROJECTS</div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {data.projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setTaskProjectId(p.id)}
                  className={`shrink-0 px-3 py-2 rounded-full text-xs transition ${
                    (taskProjectId ?? activeProjectId) === p.id
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {p.name}
                </button>
              ))}
              {!isPreviewMode && (
                <button
                  onClick={() => {
                    addProject()
                  }}
                  className="shrink-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                  title="Add project"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-[11px] text-white/60 mb-1 tracking-wide">TITLE</div>
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Purchase travel insurance"
                className="w-full bg-white/10 text-white placeholder:text-white/50 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div>
              <input
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full bg-white/5 text-white placeholder:text-white/40 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>

          {!isPreviewMode && (
            <Button onClick={createTask} className="w-full rounded-2xl py-6 bg-black text-white hover:bg-black/90">
              Create
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
