"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddButton from "@/components/ui/add-button"
import PortfolioShell from "@/components/portfolio/portfolio-shell"
import { useAuth } from "@/lib/auth"
import {
  updatePortfolioById,
  saveWidgetLayout,
  loadPortfolioData,
  materializeTemplateWidgets,
} from "@/lib/portfolio-service"
import {
  IdentityWidget,
  EducationWidget,
  ProjectsWidget,
  DescriptionWidget,
  ServicesWidget,
  GalleryWidget,
  StartupWidget,
  MeetingSchedulerWidget,
  ImageWidget,
} from "./widgets"
import type { Identity, WidgetDef } from "./types"
import type { ThemeIndex } from "@/lib/theme"
import { Reorder } from "framer-motion"

type Props = {
  isPreviewMode?: boolean
  imagesOnlyMode?: boolean // Added imagesOnlyMode prop
  identity: Identity
  onIdentityChange: (updates: Partial<Identity>) => void
  onExportData?: (data: PortfolioExportData) => void
  onSavePortfolio?: (data: any) => void
  isLive?: boolean
  onToggleLive?: (isLive: boolean) => void
  initialPortfolio?: { id?: string; name?: string; description?: string; theme_id?: string }
  communityId?: string | null // Add communityId prop for community context
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
  imagesOnlyMode = false, // Added imagesOnlyMode prop
  identity,
  onIdentityChange: parentOnIdentityChange,
  onExportData,
  onSavePortfolio,
  isLive = false,
  onToggleLive,
  initialPortfolio,
  communityId, // Receive communityId from parent
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

  const [portfolioId, setPortfolioId] = useState<string | null>(identity.id ?? initialPortfolio?.id ?? null)
  const portfolioIdRef = useRef<string | null>(identity.id ?? initialPortfolio?.id ?? null)
  const prevUserRef = useRef(user)

  const [isLoadingData, setIsLoadingData] = useState(false)
  const hasLoadedDataRef = useRef<string | null>(null)

  const [isFromTemplate, setIsFromTemplate] = useState(false)

  useEffect(() => {
    portfolioIdRef.current = portfolioId
  }, [portfolioId])

  useEffect(() => {
    if (identity.id && identity.id !== portfolioId) {
      console.log("[v0] 🔄 Syncing portfolioId to match identity.id:", identity.id)
      setPortfolioId(identity.id)
      portfolioIdRef.current = identity.id
    }
  }, [identity.id, portfolioId])

  const [leftWidgets, setLeftWidgets] = useState<WidgetDef[]>([])
  const [rightWidgets, setRightWidgets] = useState<WidgetDef[]>([])

  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [selectedWidgetType, setSelectedWidgetType] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)

  const [widgetContent, setWidgetContent] = useState<Record<string, any>>({})

  const identityFromContent = widgetContent.identity || {}
  const currentIdentity: Identity = {
    ...identity,
    ...identityFromContent,
  }

  const handleIdentityChange = useCallback(
    (updates: Partial<Identity>) => {
      console.log("[v0] 🎨 handleIdentityChange called with updates:", updates)

      // Generate slug from profileName if it changed
      if (updates.profileName) {
        const slug = toSlug(updates.profileName)
        console.log("[v0] Generated slug from profileName:", slug)
        // You can optionally update the portfolio slug here if needed
        // This would require an additional API call or state update
      }

      setWidgetContent((prev) => ({
        ...prev,
        identity: {
          ...prev.identity,
          ...updates,
        },
      }))

      parentOnIdentityChange(updates)
    },
    [parentOnIdentityChange],
  )

  useEffect(() => {
    async function loadData() {
      const idToLoad = identity.id || portfolioId

      if (!idToLoad || isLoadingData) {
        console.log("[v0] Skipping load:", { idToLoad, isLoading: isLoadingData })
        return
      }

      if (hasLoadedDataRef.current === idToLoad) {
        console.log("[v0] Already loaded this portfolio:", idToLoad)
        return
      }

      setIsLoadingData(true)

      try {
        console.log("[v0] 🔄 Loading portfolio data for ID:", idToLoad)
        console.log("[v0] 🔍 Community context:", communityId)

        const data = await loadPortfolioData(idToLoad, communityId)

        if (data) {
          console.log("[v0] ✅ Loaded data from", data.isFromTemplate ? "template" : "database")

          console.log("[v0] 📦 Full widgetContent loaded:", JSON.stringify(data.widgetContent, null, 2))
          console.log("[v0] 📦 Widget content keys:", Object.keys(data.widgetContent))

          setIsFromTemplate(data.isFromTemplate)

          if (data.widgetContent.identity) {
            console.log("[v0] 🎨 Loading identity with selectedColor:", data.widgetContent.identity.selectedColor)
            parentOnIdentityChange(data.widgetContent.identity)
          }

          if (data.layout.left.length > 0 || data.layout.right.length > 0) {
            console.log("[v0] Setting widgets from", data.isFromTemplate ? "template" : "database")
            console.log("[v0] 📍 Left widgets:", data.layout.left)
            console.log("[v0] 📍 Right widgets:", data.layout.right)
            setLeftWidgets(data.layout.left.length > 0 ? data.layout.left : [{ id: "identity", type: "identity" }])
            setRightWidgets(data.layout.right)
          } else {
            console.log("[v0] No widgets found, using default identity widget")
            setLeftWidgets([{ id: "identity", type: "identity" }])
            setRightWidgets([])
          }

          if (Object.keys(data.widgetContent).length > 0) {
            console.log("[v0] Setting widget content with", Object.keys(data.widgetContent).length, "widgets")
            Object.keys(data.widgetContent).forEach((key) => {
              console.log(`[v0] 📦 Widget ${key} content:`, data.widgetContent[key])
            })
            setWidgetContent(data.widgetContent)

            const loadedGalleryGroups: Record<string, any[]> = {}
            Object.entries(data.widgetContent).forEach(([widgetId, content]: [string, any]) => {
              if (content?.groups && Array.isArray(content.groups)) {
                console.log(`[v0] 🖼️ Loading gallery groups for widget ${widgetId}:`, content.groups.length, "groups")
                loadedGalleryGroups[widgetId] = content.groups
              }
            })

            if (Object.keys(loadedGalleryGroups).length > 0) {
              console.log("[v0] 🖼️ Setting gallery groups from database:", loadedGalleryGroups)
              setGalleryGroups(loadedGalleryGroups)
            }
          }

          console.log("[v0] ✅ Data loaded and state updated successfully")

          hasLoadedDataRef.current = idToLoad
        } else {
          console.log("[v0] ℹ️ No saved data found, using default layout")
          setLeftWidgets([{ id: "identity", type: "identity" }])
          setRightWidgets([])
          hasLoadedDataRef.current = idToLoad
        }

        setTimeout(() => {
          console.log("[v0] ✅ Enabling auto-save after data load")
          setHasInitialized(true)
        }, 1500)
      } catch (error) {
        console.error("[v0] ❌ Failed to load portfolio data:", error)
        setLeftWidgets([{ id: "identity", type: "identity" }])
        setRightWidgets([])
        setTimeout(() => setHasInitialized(true), 1500)
      } finally {
        setIsLoadingData(false)
      }
    }

    loadData()
  }, [identity.id, portfolioId, parentOnIdentityChange, communityId])

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
      captions?: string[]
      authorName?: string
      authorHandle?: string
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
      captions?: string[]
      authorName?: string
      authorHandle?: string
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

  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const debouncedSave = useCallback(async () => {
    const currentPortfolioId = portfolioIdRef.current

    if (!user?.id) {
      return
    }

    if (!hasInitialized) {
      return
    }

    if (isLoadingData) {
      return
    }

    if (!currentPortfolioId) {
      setSaveError("No portfolio selected")
      return
    }

    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    const timeout = setTimeout(async () => {
      setIsSaving(true)
      setSaveError(null)

      try {
        if (isFromTemplate) {
          await materializeTemplateWidgets(currentPortfolioId)
          setIsFromTemplate(false)
        }

        await updatePortfolioById(currentPortfolioId, {
          name: state.name?.trim() || "Untitled Portfolio",
          description: state.description?.trim(),
          theme_id: state.theme_id,
          is_public: !!state.is_public,
        })

        await saveWidgetLayout(currentPortfolioId, leftWidgets, rightWidgets, widgetContent, communityId)

        setLastSaveTime(new Date())

        window.dispatchEvent(
          new CustomEvent("portfolio-identity-updated", {
            detail: {
              portfolioId: currentPortfolioId,
              updates: widgetContent.identity || {},
            },
          }),
        )

        window.dispatchEvent(new Event("portfolio-updated"))
      } catch (error) {
        console.error("[v0] ❌ Auto-save failed:", error)
        setSaveError(error instanceof Error ? error.message : "Save failed")
      } finally {
        setIsSaving(false)
      }
    }, 800)

    setSaveTimeout(timeout)
  }, [
    hasInitialized,
    user,
    state,
    leftWidgets,
    rightWidgets,
    widgetContent,
    isLoadingData,
    saveTimeout,
    communityId,
    isFromTemplate,
  ])

  const prevLeftWidgetsRef = useRef<string>("")
  const prevRightWidgetsRef = useRef<string>("")
  const prevWidgetContentRef = useRef<string>("")

  useEffect(() => {
    if (!hasInitialized || !portfolioId || isLoadingData) {
      return
    }

    const leftSerialized = JSON.stringify(leftWidgets)
    const rightSerialized = JSON.stringify(rightWidgets)
    const contentSerialized = JSON.stringify(widgetContent)

    const leftChanged = leftSerialized !== prevLeftWidgetsRef.current
    const rightChanged = rightSerialized !== prevRightWidgetsRef.current
    const contentChanged = contentSerialized !== prevWidgetContentRef.current

    if (leftChanged || rightChanged || contentChanged) {
      prevLeftWidgetsRef.current = leftSerialized
      prevRightWidgetsRef.current = rightSerialized
      prevWidgetContentRef.current = contentSerialized

      debouncedSave()
    }
  }, [leftWidgets, rightWidgets, widgetContent, hasInitialized, portfolioId, isLoadingData, debouncedSave])

  useEffect(() => {
    if (!hasInitialized) return

    // Sync gallery groups into widgetContent for all gallery widgets
    const updates: Record<string, any> = {}
    let hasChanges = false

    Object.entries(galleryGroups).forEach(([widgetId, groups]) => {
      const currentContent = widgetContent[widgetId]?.groups
      const newContent = groups

      // Only update if content has actually changed
      if (JSON.stringify(currentContent) !== JSON.stringify(newContent)) {
        console.log(`[v0] 🖼️ Syncing gallery groups for widget ${widgetId}:`, groups.length, "groups")
        updates[widgetId] = {
          ...widgetContent[widgetId],
          groups: newContent,
        }
        hasChanges = true
      }
    })

    if (hasChanges) {
      console.log("[v0] 🖼️ Gallery groups changed, updating widgetContent")
      setWidgetContent((prev) => ({ ...prev, ...updates }))
    }
  }, [galleryGroups, hasInitialized])

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
    console.log("[v0] 🎯 addWidget called with:", { type, column })

    const newWidgetId =
      type === "identity"
        ? "identity"
        : typeof crypto !== "undefined" && crypto.randomUUID
          ? `${type}-${crypto.randomUUID()}`
          : `${type}-${Date.now()}`

    const newWidget: WidgetDef = {
      id: newWidgetId,
      type: type, // Keep type as just the type name, not including ID
    }

    const defaultContent: Record<string, any> = {
      education: {
        title: "Education",
        items: [
          {
            degree: "Bachelor of Science",
            school: "University Name",
            year: "2020-2024",
            description: "",
            certified: false,
          },
        ],
      },
      projects: {
        title: "Projects",
        items: [
          {
            name: "Project Name",
            description: "Project description goes here...",
            year: "2024",
            tags: ["React", "TypeScript"],
          },
        ],
      },
      description: {
        title: "About Me",
        description: "Tell your story here...",
        subdescription: "Add more details about yourself...",
      },
      services: {
        title: "Services",
        description: "Describe the services you offer...",
        items: [],
      },
      gallery: {
        title: "Gallery",
        groups: [],
      },
      startup: {
        title: "Startup",
        description: "Describe your startup...",
      },
      "meeting-scheduler": {
        mode: "button",
        calendlyUrl: "",
      },
      image: {
        url: "",
        caption: "",
      },
    }

    if (defaultContent[type]) {
      setWidgetContent((prev) => ({
        ...prev,
        [newWidgetId]: defaultContent[type],
      }))
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
      identity: currentIdentity,
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
      a.download = `${currentIdentity.name || "portfolio"}-export.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleWidgetContentChange = useCallback((widgetId: string, newContent: any) => {
    console.log("[v0] Widget content changing:", widgetId, newContent)
    setWidgetContent((prev) => {
      const updated = { ...prev, [widgetId]: newContent }
      console.log("[v0] Updated widgetContent:", updated)
      return updated
    })
  }, [])

  const dedupeById = (items: WidgetDef[]) => {
    const seen = new Set<string>()
    return items.filter((w) => {
      if (!w?.id) return false
      if (seen.has(w.id)) return false
      seen.add(w.id)
      return true
    })
  }

  const handleLeftReorder = useCallback((newOrder: WidgetDef[]) => {
    setLeftWidgets(dedupeById(newOrder))
  }, [])

  const handleRightReorder = useCallback((newOrder: WidgetDef[]) => {
    setRightWidgets(dedupeById(newOrder))
  }, [])

  const renderWidget = (widget: WidgetDef, column: "left" | "right") => {
    const canDelete = widget.id !== "identity"
    const canMove = widget.id !== "identity"

    switch (widget.type) {
      case "identity": {
        return (
          <motion.div
            key={widget.id}
            id="widget-identity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
          >
            <IdentityWidget
              identity={currentIdentity}
              isPreviewMode={isPreviewMode}
              onChange={handleIdentityChange}
              editingField={editingField}
              setEditingField={setEditingField}
            />
          </motion.div>
        )
      }

      case "education": {
        const educationContent = widgetContent[widget.id] ?? {
          title: "Education",
          items: [],
        }
        return (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <EducationWidget
              widgetId={widget.id}
              column={column}
              isPreviewMode={isPreviewMode}
              content={{
                ...educationContent,
                items: Array.isArray(educationContent.items) ? educationContent.items : [],
              }}
              onContentChange={(updates) => handleWidgetContentChange(widget.id, updates)}
              onDelete={() => deleteWidget(widget.id, column)}
              onMove={() => moveWidgetToColumn(widget, column, column === "left" ? "right" : "left")}
              editingField={editingField}
              setEditingField={setEditingField}
            />
          </motion.div>
        )
      }

      case "projects": {
        const projectsContent = widgetContent[widget.id] ?? {
          title: "Projects",
          items: [],
        }
        return (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <ProjectsWidget
              widgetId={widget.id}
              column={column}
              isPreviewMode={isPreviewMode}
              content={{ ...projectsContent, items: Array.isArray(projectsContent.items) ? projectsContent.items : [] }}
              onContentChange={(updates) => handleWidgetContentChange(widget.id, updates)}
              onDelete={() => deleteWidget(widget.id, column)}
              onMove={() => moveWidgetToColumn(widget, column, column === "left" ? "right" : "left")}
              projectColors={projectColors}
              setProjectColors={setProjectColors}
              showProjectColorPicker={showProjectColorPicker}
              setShowProjectColorPicker={setShowProjectColorPicker}
              editingField={editingField}
              setEditingField={setEditingField}
            />
          </motion.div>
        )
      }

      case "description": {
        const descriptionContent = widgetContent[widget.id] ?? {
          title: "About Me",
          description: "",
          subdescription: "",
        }
        return (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <DescriptionWidget
              widgetId={widget.id}
              column={column}
              isPreviewMode={isPreviewMode}
              content={descriptionContent}
              onContentChange={(updates) => handleWidgetContentChange(widget.id, updates)}
              onDelete={() => deleteWidget(widget.id, column)}
              onMove={() => moveWidgetToColumn(widget, column, column === "left" ? "right" : "left")}
              editingField={editingField}
              setEditingField={setEditingField}
              widgetColors={widgetColors}
              setWidgetColors={setWidgetColors}
            />
          </motion.div>
        )
      }

      case "services": {
        const servicesContent = widgetContent[widget.id] ?? {
          title: "Services",
          description: "",
          items: [],
        }
        return (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <ServicesWidget
              widgetId={widget.id}
              column={column}
              isPreviewMode={isPreviewMode}
              content={{ ...servicesContent, items: Array.isArray(servicesContent.items) ? servicesContent.items : [] }}
              onContentChange={(updates) => handleWidgetContentChange(widget.id, updates)}
              onDelete={() => deleteWidget(widget.id, column)}
              onMove={() => moveWidgetToColumn(widget, column, column === "left" ? "right" : "left")}
              editingField={editingField}
              setEditingField={setEditingField}
            />
          </motion.div>
        )
      }

      case "gallery": {
        return (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <GalleryWidget
              widgetId={widget.id}
              column={column}
              isPreviewMode={isPreviewMode}
              groups={galleryGroups[widget.id] || []}
              onGroupsChange={(groups) => {
                setGalleryGroups((prev) => ({
                  ...prev,
                  [widget.id]: groups,
                }))
              }}
              onDelete={() => deleteWidget(widget.id, column)}
              onMove={() => moveWidgetToColumn(widget, column, column === "left" ? "right" : "left")}
            />
          </motion.div>
        )
      }

      case "meeting-scheduler": {
        const meetingContent = widgetContent[widget.id] ?? {
          mode: "button",
          calendlyUrl: "",
        }
        return (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <MeetingSchedulerWidget
              widgetId={widget.id}
              column={column}
              isPreviewMode={isPreviewMode}
              content={meetingContent}
              onContentChange={(updates) => handleWidgetContentChange(widget.id, updates)}
              onDelete={() => deleteWidget(widget.id, column)}
              onMove={() => moveWidgetToColumn(widget, column, column === "left" ? "right" : "left")}
            />
          </motion.div>
        )
      }

      case "startup": {
        const startupContent = widgetContent[widget.id] ?? {
          title: "Startup",
          description: "",
        }
        return (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <StartupWidget
              widgetId={widget.id}
              column={column}
              isPreviewMode={isPreviewMode}
              content={startupContent}
              onContentChange={(updates) => handleWidgetContentChange(widget.id, updates)}
              onDelete={() => deleteWidget(widget.id, column)}
              onMove={() => moveWidgetToColumn(widget, column, column === "left" ? "right" : "left")}
              editingField={editingField}
              setEditingField={setEditingField}
            />
          </motion.div>
        )
      }

      case "image": {
        const imageData = widgetContent[widget.id] || { url: "", caption: "" }
        return (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <ImageWidget
              widgetId={widget.id}
              column={column}
              isPreviewMode={isPreviewMode}
              imageUrl={imageData.url || ""}
              caption={imageData.caption || ""}
              onImageChange={(url) => handleWidgetContentChange(widget.id, { ...imageData, url })}
              onCaptionChange={(caption) => handleWidgetContentChange(widget.id, { ...imageData, caption })}
              onDelete={() => deleteWidget(widget.id, column)}
              onMove={() => moveWidgetToColumn(widget, column, column === "left" ? "right" : "left")}
            />
          </motion.div>
        )
      }

      default:
        return (
          <motion.div
            key={widget.id}
            className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="text-white">Widget: {widget.type}</span>
          </motion.div>
        )
    }
  }

  const safeLeftWidgets = Array.isArray(leftWidgets) ? leftWidgets : []
  const safeRightWidgets = Array.isArray(rightWidgets) ? rightWidgets : []

  const leftForRender = imagesOnlyMode
    ? safeLeftWidgets.filter((w) => w.type === "image" || w.type === "gallery")
    : safeLeftWidgets

  const rightForRender = imagesOnlyMode
    ? safeRightWidgets.filter((w) => w.type === "image" || w.type === "gallery")
    : safeRightWidgets

  const rightSlot = !isPreviewMode ? (
    <div className="flex gap-2 items-center">
      {isSaving && <span className="text-white/60 text-xs animate-pulse">Saving...</span>}
      {lastSaveTime && !isSaving && !saveError && (
        <span className="text-green-400/60 text-xs">Saved {new Date(lastSaveTime).toLocaleTimeString()}</span>
      )}
      {saveError && <span className="text-red-400 text-xs">{saveError}</span>}

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
                  {[
                    "projects",
                    "education",
                    "description",
                    "services",
                    "gallery",
                    "startup",
                    "meeting-scheduler",
                    "image",
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedWidgetType(type)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg transition-colors capitalize"
                    >
                      {type === "meeting-scheduler" ? "Meeting Scheduler" : `${type} Widget`}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-black">
      <PortfolioShell
        title={`${currentIdentity.name || "your name"}.`}
        isPreviewMode={isPreviewMode}
        rightSlot={rightSlot}
        logoHref="/network"
        logoSrc="/dmz-logo-white.svg"
      >
        {imagesOnlyMode ? (
          <div className="col-span-full px-4">
            <div className="grid grid-cols-3 gap-4">
              {[...safeLeftWidgets, ...safeRightWidgets]
                .filter((w) => w.type === "image")
                .map((w) => {
                  const imageData = widgetContent[w.id] || { url: "", caption: "" }
                  if (!imageData.url) return null

                  return (
                    <div key={w.id} className="w-full">
                      <div className="rounded-lg overflow-hidden bg-black/20">
                        <img
                          src={imageData.url || "/placeholder.svg"}
                          alt={imageData.caption || "Image"}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      {imageData.caption && (
                        <p className="text-white/70 text-xs mt-1.5 line-clamp-2">{imageData.caption}</p>
                      )}
                    </div>
                  )
                })}

              {[...safeLeftWidgets, ...safeRightWidgets]
                .filter((w) => w.type === "gallery")
                .flatMap((w) => {
                  const groups = galleryGroups[w.id] || []
                  return groups.flatMap((group) =>
                    (group.images || []).map((img, idx) => ({
                      widgetId: w.id,
                      groupId: group.id,
                      image: img,
                      caption: group.captions?.[idx] || "",
                      authorName: group.authorName || group.name,
                      authorHandle: group.authorHandle,
                    })),
                  )
                })
                .map((item, index) => (
                  <div key={`${item.widgetId}-${item.groupId}-${index}`} className="w-full">
                    <div className="rounded-lg overflow-hidden bg-black/20">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.caption || `Image ${index + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <div className="mt-1.5">
                      {item.caption && <p className="text-white/70 text-xs line-clamp-2">{item.caption}</p>}
                      {(item.authorName || item.authorHandle) && (
                        <p className="text-white/50 text-xs mt-0.5">
                          {item.authorName} {item.authorHandle && `• ${item.authorHandle}`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <>
            <div className="lg:w-1/2 flex flex-col gap-4 sm:gap-6">
              {!isPreviewMode && leftForRender.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No widgets yet. Click + to add widgets.</div>
              )}

              {isLoadingData ? (
                <div className="text-white/50 text-sm">Loading...</div>
              ) : (
                <Reorder.Group axis="y" values={leftForRender} onReorder={handleLeftReorder} className="space-y-4">
                  {leftForRender.map((widget) => (
                    <Reorder.Item
                      key={widget.id}
                      value={widget}
                      layout
                      layoutId={widget.id}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      {renderWidget(widget, "left")}
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
            </div>

            <div className="lg:w-1/2 flex flex-col gap-4 sm:gap-6">
              {!isPreviewMode && rightForRender.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No widgets yet. Click + to add widgets.</div>
              )}

              {isLoadingData ? (
                <div className="text-white/50 text-sm">Loading...</div>
              ) : (
                <Reorder.Group axis="y" values={rightForRender} onReorder={handleRightReorder} className="space-y-4">
                  {rightForRender.map((widget) => (
                    <Reorder.Item
                      key={widget.id}
                      value={widget}
                      layout
                      layoutId={widget.id}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      {renderWidget(widget, "right")}
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
            </div>
          </>
        )}
      </PortfolioShell>

      <GroupDetailView />
    </div>
  )
}

// Helper function for slug generation
const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64)
