"use client"

import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import { Reorder, motion } from "framer-motion"
import { X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddButton from "@/components/ui/add-button"
import PortfolioShell from "@/components/portfolio/portfolio-shell"
import { useAuth } from "@/lib/auth"
import { createPortfolioOnce, updatePortfolioById } from "@/lib/portfolio-service"
import {
  IdentityWidget,
  EducationWidget,
  ProjectsWidget,
  DescriptionWidget,
  ServicesWidget,
  GalleryWidget,
  StartupWidget,
  MeetingSchedulerWidget, // Added MeetingSchedulerWidget import
} from "./widgets"
import type { Identity, WidgetDef } from "./types"
import type { ThemeIndex } from "@/lib/theme" // Declare ThemeIndex variable

type Props = {
  isPreviewMode?: boolean
  identity: Identity
  onIdentityChange: (updates: Partial<Identity>) => void
  onExportData?: (data: PortfolioExportData) => void
  onSavePortfolio?: (data: any) => void
  isLive?: boolean
  onToggleLive?: (isLive: boolean) => void
  initialPortfolio?: { id?: string; name?: string; description?: string; theme_id?: string }
}

export type PortfolioExportData = {
  identity: Identity
  leftWidgets: WidgetDef[]
  rightWidgets: WidgetDef[]
  metadata: {
    createdAt: string
    version: string
  }
}

type EditorState = {
  name: string
  description?: string
  theme_id?: string
  is_public?: boolean
}

export default function PortfolioBuilder({
  isPreviewMode = false,
  identity,
  onIdentityChange,
  onExportData,
  onSavePortfolio,
  isLive = false,
  onToggleLive,
  initialPortfolio,
}: Props) {
  const { user } = useAuth()
  const [isDragging, setIsDragging] = useState(false)
  const [dragOverColumn, setDragOverColumn] = useState<"left" | "right" | null>(null)

  const [state, setState] = useState<EditorState>({
    name: initialPortfolio?.name || identity.name || "Untitled Portfolio",
    description: initialPortfolio?.description || "",
    theme_id: initialPortfolio?.theme_id,
    is_public: isLive,
  })

  const [portfolioId, setPortfolioId] = useState<string | null>(initialPortfolio?.id ?? null)
  const createInFlight = useRef<Promise<string> | null>(null)

  const draftKey = useMemo(
    () => `pf-draft:${user?.id ?? "anon"}:${initialPortfolio?.id ?? "new"}`,
    [user?.id, initialPortfolio?.id],
  )

  useEffect(() => {
    try {
      const cached = typeof window !== "undefined" ? localStorage.getItem(draftKey) : null
      if (cached && !portfolioId) setPortfolioId(cached)
    } catch {}
  }, [draftKey, portfolioId])

  useEffect(() => {
    try {
      if (portfolioId) localStorage.setItem(draftKey, portfolioId)
    } catch {}
  }, [draftKey, portfolioId])

  async function ensurePortfolioId(): Promise<string> {
    if (portfolioId) return portfolioId
    if (!user?.id) throw new Error("Must be signed in to create a portfolio")

    if (!createInFlight.current) {
      createInFlight.current = (async () => {
        const created = await createPortfolioOnce({
          userId: user.id,
          name: state.name || "Untitled Portfolio",
          theme_id: state.theme_id || "default-theme",
          description: state.description,
        })
        setPortfolioId(created.id)
        return created.id
      })()
    }
    return createInFlight.current
  }

  const [leftWidgets, setLeftWidgets] = useState<WidgetDef[]>([
    { id: "identity", type: "identity" },
    { id: "education", type: "education" },
  ])
  const [rightWidgets, setRightWidgets] = useState<WidgetDef[]>([
    { id: "startup", type: "startup" },
    { id: "description", type: "description" },
    { id: "projects", type: "projects" },
    { id: "services", type: "services" },
  ])

  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [selectedWidgetType, setSelectedWidgetType] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)

  const [widgetContent, setWidgetContent] = useState<Record<string, any>>({
    education: {
      title: "Education",
      items: [
        {
          degree: "Bachelor of Design",
          school: "University of Arts",
          year: "2018-2022",
          description: "Focused on digital product design and user experience",
        },
      ],
    },
    projects: {
      title: "Featured Projects",
      items: [
        {
          name: "E-commerce Platform",
          description: "Complete redesign of shopping experience",
          year: "2023",
          tags: ["UI/UX", "Mobile", "Web"],
        },
      ],
    },
    services: {
      title: "Services",
      items: ["Product Design", "User Research", "Prototyping", "Design Systems"],
    },
    description: {
      title: "About Me",
      content:
        "I'm a passionate designer focused on creating meaningful digital experiences that solve real problems for users.",
    },
  })

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      name: identity.name || "Untitled Portfolio",
      is_public: isLive,
    }))
  }, [identity.name, isLive])

  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  const debouncedSave = useCallback(async () => {
    if (!hasInitialized || !user?.id) return

    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    const timeout = setTimeout(async () => {
      try {
        console.log("[v0] Auto-saving portfolio...")
        const id = await ensurePortfolioId()
        await updatePortfolioById(id, {
          name: state.name?.trim() || "Untitled Portfolio",
          description: state.description?.trim(),
          theme_id: state.theme_id,
          is_public: !!state.is_public,
          identity: {
            name: identity.name,
            title: identity.title,
            subtitle: identity.subtitle,
            selectedColor: identity.selectedColor,
            initials: identity.initials,
            email: identity.email,
            location: identity.location,
            handle: identity.handle,
          },
        })
        console.log("[v0] Portfolio auto-saved successfully")
      } catch (error) {
        console.error("[v0] Auto-save failed:", error)
      }
    }, 800) // 800ms debounce

    setSaveTimeout(timeout)
  }, [hasInitialized, user?.id, state, identity]) // Added identity to dependencies

  useEffect(() => {
    if (hasInitialized) {
      debouncedSave()
    }
  }, [state, hasInitialized, debouncedSave])

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasInitialized(true)
    }, 1000) // Wait 1 second before enabling auto-save

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
    }
  }, [saveTimeout])

  // Ensure identity stays first if lists are reordered externally
  useEffect(() => {
    setLeftWidgets((prev) => {
      const rest = prev.filter((w) => w.id !== "identity")
      return [{ id: "identity", type: "identity" }, ...rest]
    })
  }, [])

  const deleteWidget = (widgetId: string, column: "left" | "right") => {
    if (widgetId === "identity") return // Can't delete identity widget

    if (column === "left") {
      setLeftWidgets(leftWidgets.filter((widget) => widget.id !== widgetId))
    } else {
      setRightWidgets(rightWidgets.filter((widget) => widget.id !== widgetId))
    }
  }

  const moveWidgetToColumn = (widget: WidgetDef, fromColumn: "left" | "right", toColumn: "left" | "right") => {
    if (fromColumn === toColumn || widget.id === "identity") return

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

  const addWidget = (type: string, column: "left" | "right") => {
    const newWidget: WidgetDef = {
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

  const exportPortfolioData = () => {
    const exportData: PortfolioExportData = {
      identity,
      leftWidgets,
      rightWidgets,
      metadata: {
        createdAt: new Date().toISOString(),
        version: "1.0.0",
      },
    }

    if (onExportData) {
      onExportData(exportData)
    } else {
      // Default export as JSON download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${identity.name || "portfolio"}-export.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const renderWidget = (w: WidgetDef, column: "left" | "right") => {
    const canDelete = w.id !== "identity"
    const canMove = w.id !== "identity"

    switch (w.type) {
      case "identity":
        return (
          <motion.div
            key={w.id}
            id="widget-identity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
          >
            <IdentityWidget
              identity={identity}
              isPreviewMode={isPreviewMode}
              onChange={onIdentityChange}
              editingField={editingField}
              setEditingField={setEditingField}
            />
          </motion.div>
        )

      case "education":
        return (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <EducationWidget
              widgetId={w.id}
              column={column}
              isPreviewMode={isPreviewMode}
              content={widgetContent.education}
              onContentChange={(content) => setWidgetContent((prev) => ({ ...prev, education: content }))}
              onDelete={() => deleteWidget(w.id, column)}
              onMove={() => moveWidgetToColumn(w, column, column === "left" ? "right" : "left")}
              editingField={editingField}
              setEditingField={setEditingField}
            />
          </motion.div>
        )

      case "projects":
        return (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <ProjectsWidget
              widgetId={w.id}
              column={column}
              isPreviewMode={isPreviewMode}
              content={widgetContent.projects}
              onContentChange={(content) => setWidgetContent((prev) => ({ ...prev, projects: content }))}
              onDelete={() => deleteWidget(w.id, column)}
              onMove={() => moveWidgetToColumn(w, column, column === "left" ? "right" : "left")}
              projectColors={projectColors}
              setProjectColors={setProjectColors}
              showProjectColorPicker={showProjectColorPicker}
              setShowProjectColorPicker={setShowProjectColorPicker}
              projectColorOptions={projectColorOptions}
            />
          </motion.div>
        )

      case "description":
        return (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <DescriptionWidget
              widgetId={w.id}
              column={column}
              isPreviewMode={isPreviewMode}
              content={widgetContent.description}
              onContentChange={(content) => setWidgetContent((prev) => ({ ...prev, description: content }))}
              onDelete={() => deleteWidget(w.id, column)}
              onMove={() => moveWidgetToColumn(w, column, column === "left" ? "right" : "left")}
              editingField={editingField}
              setEditingField={setEditingField}
            />
          </motion.div>
        )

      case "services":
        return (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <ServicesWidget
              widgetId={w.id}
              column={column}
              isPreviewMode={isPreviewMode}
              content={widgetContent.services}
              onContentChange={(content) => setWidgetContent((prev) => ({ ...prev, services: content }))}
              onDelete={() => deleteWidget(w.id, column)}
              onMove={() => moveWidgetToColumn(w, column, column === "left" ? "right" : "left")}
              editingField={editingField}
              setEditingField={setEditingField}
            />
          </motion.div>
        )

      case "gallery":
        return (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <GalleryWidget
              widgetId={w.id}
              column={column}
              isPreviewMode={isPreviewMode}
              onDelete={() => deleteWidget(w.id, column)}
              onMove={() => moveWidgetToColumn(w, column, column === "left" ? "right" : "left")}
              galleryGroups={galleryGroups[w.id] || []}
              onGroupsChange={(groups) => setGalleryGroups((prev) => ({ ...prev, [w.id]: groups }))}
              onGroupClick={(group) => setSelectedGroup({ widgetId: w.id, groupId: group.id, group })}
            />
          </motion.div>
        )

      case "startup":
        return (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <StartupWidget
              widgetId={w.id}
              column={column}
              isPreviewMode={isPreviewMode}
              onDelete={() => deleteWidget(w.id, column)}
              onMove={() => moveWidgetToColumn(w, column, column === "left" ? "right" : "left")}
              editingField={editingField}
              setEditingField={setEditingField}
            />
          </motion.div>
        )

      case "meeting-scheduler":
        return (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <MeetingSchedulerWidget
              widgetId={w.id}
              column={column}
              isPreviewMode={isPreviewMode}
              onDelete={() => deleteWidget(w.id, column)}
              selectedColor={widgetColors[w.id] ?? 5}
              onColorChange={(color) => setWidgetColors((prev) => ({ ...prev, [w.id]: color }))}
            />
          </motion.div>
        )

      default:
        return (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg group relative border border-white/10 hover:border-white/20 transition-colors">
              {!isPreviewMode && canDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteWidget(w.id, column)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 h-6 w-6 bg-red-500/20 hover:bg-red-500/30"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
              <span className="text-white">Widget: {w.type}</span>
            </div>
          </motion.div>
        )
    }
  }

  const rightSlot = !isPreviewMode ? (
    <div className="flex gap-2">
      <div className="flex items-center gap-2">
        <span className="text-white/70 text-sm">Live</span>
        <button
          onClick={() => onToggleLive?.(!isLive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 ${
            isLive ? "bg-green-500" : "bg-white/20"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isLive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      <div className="relative">
        <AddButton
          onClick={() => setShowAddDropdown(!showAddDropdown)}
          variant="icon"
          size="sm"
          className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
          aria-label="Add widget"
        />

        {showAddDropdown && (
          <div className="absolute top-full right-0 mt-2 bg-neutral-900/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl p-2 z-50 min-w-[220px]">
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Add to Left Column
                  </button>
                  <button
                    onClick={() => addWidget(selectedWidgetType, "right")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Add to Right Column
                  </button>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Select Widget Type
                  </div>
                  {["projects", "education", "description", "services", "gallery", "startup", "meeting-scheduler"].map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedWidgetType(type)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg transition-colors capitalize"
                      >
                        {type === "meeting-scheduler" ? "Meeting Scheduler" : `${type} Widget`}
                      </button>
                    ),
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null

  const [projectColors, setProjectColors] = useState<Record<string, string>>({
    aiml: "purple",
    mobile: "purple",
  })
  const [showProjectColorPicker, setShowProjectColorPicker] = useState<Record<string, boolean>>({
    aiml: false,
    mobile: false,
  })

  const [widgetColors, setWidgetColors] = useState<Record<string, ThemeIndex>>({})

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

  const projectColorOptions = [
    { name: "rose", gradient: "from-rose-500/70 to-pink-500/70" },
    { name: "blue", gradient: "from-blue-500/70 to-cyan-500/70" },
    { name: "purple", gradient: "from-purple-500/70 to-blue-500/70" },
    { name: "green", gradient: "from-green-500/70 to-emerald-500/70" },
    { name: "orange", gradient: "from-orange-500/70 to-red-500/70" },
    { name: "teal", gradient: "from-teal-500/70 to-blue-500/70" },
    { name: "neutral", gradient: "from-neutral-500/70 to-neutral-600/70" },
  ]

  const GroupDetailView = () => {
    if (!selectedGroup) return null

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="p-6 flex justify-between items-center">
          <Button
            onClick={() => setSelectedGroup(null)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {!isPreviewMode && (
            <AddButton
              onClick={() => {
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
                          [selectedGroup.widgetId]:
                            prev[selectedGroup.widgetId]?.map((group) =>
                              group.id === selectedGroup.groupId
                                ? { ...group, images: [...group.images, imageUrl] }
                                : group,
                            ) || [],
                        }))

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
                      reader.readAsDataURL(file)
                    })
                  }
                }

                input.click()
              }}
              variant="compact"
              size="sm"
              label="Add Images"
              className="text-white hover:bg-white/10"
            />
          )}
        </div>

        <div className="px-6 pb-6">
          <h1 className="text-2xl font-bold text-white">{selectedGroup.group.name}</h1>
          <p className="text-white/60 text-sm mt-1">
            {selectedGroup.group.images.length} image{selectedGroup.group.images.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {selectedGroup.group.images.map((image, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${selectedGroup.group.name} ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <PortfolioShell
        title={`${identity.name || "your name"}.`}
        isPreviewMode={isPreviewMode}
        rightSlot={rightSlot}
        logoHref="/network"
      >
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
        </div>

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
        </div>
      </PortfolioShell>

      <GroupDetailView />
    </>
  )
}
