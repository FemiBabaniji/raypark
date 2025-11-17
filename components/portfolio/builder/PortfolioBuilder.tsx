"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Reorder, motion } from "framer-motion"
import { X, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import AddButton from "@/components/ui/add-button"
import PortfolioShell from "@/components/portfolio/portfolio-shell"
import { useAuth } from "@/lib/auth"
import { createPortfolioOnce, updatePortfolioById, saveWidgetLayout, loadPortfolioData } from "@/lib/portfolio-service"
import {
  IdentityWidget,
  EducationWidget,
  ProjectsWidget,
  DescriptionWidget,
  ServicesWidget,
  GalleryWidget,
  StartupWidget,
  MeetingSchedulerWidget,
} from "./widgets"
import type { Identity, WidgetDef } from "./types"
import type { ThemeIndex } from "@/lib/theme"
import type { MeetingSchedulerContent } from "./widgets/MeetingSchedulerWidget"

type Props = {
  isPreviewMode?: boolean
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
  identity,
  onIdentityChange,
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
  const hasLoadedDataRef = useRef(false)

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
    "meeting-scheduler": {
      mode: "custom",
      calendlyUrl: "https://calendly.com/your-username/30min",
    },
  })

  useEffect(() => {
    async function loadData() {
      const idToLoad = identity.id || portfolioId
      
      if (!idToLoad || hasLoadedDataRef.current || isLoadingData) {
        console.log("[v0] Skipping load:", { idToLoad, hasLoaded: hasLoadedDataRef.current, isLoading: isLoadingData })
        
        if (!idToLoad && !hasLoadedDataRef.current) {
          console.log("[v0] No portfolio ID - user needs to create portfolio first")
          hasLoadedDataRef.current = true
          setIsLoadingData(false)
          return
        }
        return
      }

      setIsLoadingData(true)
      hasLoadedDataRef.current = true

      try {
        console.log("[v0] 🔄 Loading portfolio data for ID:", idToLoad)
        console.log("[v0] 🔍 Community context:", communityId)
        
        const data = await loadPortfolioData(idToLoad, communityId)

        if (data) {
          console.log("[v0] ✅ Loaded data from database")

          if (data.layout.left.length > 0) {
            console.log("[v0] Setting left widgets:", data.layout.left)
            setLeftWidgets(data.layout.left)
          }
          if (data.layout.right.length > 0) {
            console.log("[v0] Setting right widgets:", data.layout.right)
            setRightWidgets(data.layout.right)
          }

          if (Object.keys(data.widgetContent).length > 0) {
            console.log("[v0] Setting widget content:", Object.keys(data.widgetContent))
            setWidgetContent(data.widgetContent)
          }

          if (data.identity && data.identity.name) {
            console.log("[v0] Setting identity from database:", data.identity.name)
            onIdentityChange(data.identity)
          }

          if (data.projectColors && Object.keys(data.projectColors).length > 0) {
            console.log("[v0] Setting project colors")
            setProjectColors(data.projectColors)
          }

          if (data.widgetColors && Object.keys(data.widgetColors).length > 0) {
            console.log("[v0] Setting widget colors")
            setWidgetColors(data.widgetColors)
          }

          if (data.galleryGroups && Object.keys(data.galleryGroups).length > 0) {
            console.log("[v0] Setting gallery groups")
            setGalleryGroups(data.galleryGroups)
          }

          console.log("[v0] ✅ Data loaded and state updated successfully")
        } else {
          console.log("[v0] ℹ️ No saved data found, using defaults")
        }
        
        setTimeout(() => {
          console.log("[v0] ✅ Enabling auto-save after data load")
          setHasInitialized(true)
        }, 1000)
        
      } catch (error) {
        console.error("[v0] ❌ Failed to load portfolio data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    loadData()
  }, [identity.id, portfolioId, onIdentityChange, communityId])

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      name: identity.name || "Untitled Portfolio",
      is_public: isLive,
    }))
  }, [identity.name, isLive])

  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const debouncedSave = useCallback(async () => {
    const currentPortfolioId = portfolioIdRef.current
    
    if (!user?.id) {
      console.log("[v0] ⏸️ Skipping save - no authenticated user")
      return
    }
    
    if (!hasInitialized) {
      console.log("[v0] ⏸️ Skipping save - not initialized yet")
      return
    }
    
    if (isLoadingData) {
      console.log("[v0] ⏸️ Skipping save - still loading data")
      return
    }

    if (!currentPortfolioId) {
      console.log("[v0] ⏸️ Skipping save - no portfolio ID (user needs to create portfolio first)")
      setSaveError("Please create a portfolio before editing")
      return
    }

    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    const timeout = setTimeout(async () => {
      setIsSaving(true)
      setSaveError(null)
      console.log("[v0] 💾 Starting auto-save...")
      
      try {
        console.log("[v0] 💾 Saving to portfolio:", currentPortfolioId)
        console.log("[v0] 💾 With community context:", communityId)

        await updatePortfolioById(currentPortfolioId, {
          name: state.name?.trim() || "Untitled Portfolio",
          description: state.description?.trim(),
          theme_id: state.theme_id,
          is_public: !!state.is_public,
        })

        const contentToSave = {
          ...widgetContent,
          identity: {
            name: identity.name,
            handle: identity.handle,
            avatarUrl: identity.avatar,
            selectedColor: identity.selectedColor,
            title: identity.title,
            email: identity.email,
            location: identity.location,
            bio: identity.bio,
            linkedin: identity.linkedin,
            dribbble: identity.dribbble,
            behance: identity.behance,
            twitter: identity.twitter,
            unsplash: identity.unsplash,
            instagram: identity.instagram,
          },
        }

        await saveWidgetLayout(currentPortfolioId, leftWidgets, rightWidgets, contentToSave, communityId)

        setLastSaveTime(new Date())
        console.log("[v0] ✅ Auto-save completed successfully")
        window.dispatchEvent(new Event("portfolio-updated"))
      } catch (error) {
        console.error("[v0] ❌ Auto-save failed:", error)
        setSaveError(error instanceof Error ? error.message : "Save failed")
      } finally {
        setIsSaving(false)
      }
    }, 1500)

    setSaveTimeout(timeout)
  }, [hasInitialized, user, state, identity, leftWidgets, rightWidgets, widgetContent, isLoadingData, saveTimeout, communityId])

  useEffect(() => {
    if (hasInitialized && portfolioId) {
      console.log("[v0] 🔄 State changed, triggering auto-save debounce")
      debouncedSave()
    }
  }, [
    hasInitialized,
    portfolioId,
    state.name,
    state.description,
    identity.name,
    identity.handle,
    identity.title,
    identity.email,
    identity.location,
    identity.bio,
    leftWidgets,
    rightWidgets,
    widgetContent,
    debouncedSave
  ])

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
    // Check if widget already exists
    const existsInLeft = leftWidgets.some(w => w.type === type)
    const existsInRight = rightWidgets.some(w => w.type === type)
    
    if (existsInLeft || existsInRight) {
      console.warn("[v0] ⚠️ Widget type already exists:", type)
      alert(`You already have a ${type} widget. Only one widget of each type is allowed.`)
      return
    }

    const newWidget: WidgetDef = {
      id: type,  // Use type as ID
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
              selectedColor={widgetColors[w.type] ?? 5}
              onColorChange={(color) => setWidgetColors((prev) => ({ ...prev, [w.type]: color }))}
              content={widgetContent[w.type]}
              onContentChange={(content: MeetingSchedulerContent) =>
                setWidgetContent((prev) => ({ ...prev, [w.type]: content }))
              }
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
    <div className="flex gap-2 items-center">
      {isSaving && (
        <span className="text-white/60 text-xs animate-pulse">Saving...</span>
      )}
      {lastSaveTime && !isSaving && !saveError && (
        <span className="text-green-400/60 text-xs">
          Saved {new Date(lastSaveTime).toLocaleTimeString()}
        </span>
      )}
      {saveError && (
        <span className="text-red-400 text-xs">{saveError}</span>
      )}
      
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
        logoSrc="/dmz-logo-white.svg"
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
