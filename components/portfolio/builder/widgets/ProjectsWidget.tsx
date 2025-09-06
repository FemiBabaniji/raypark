"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GripVertical, X } from "lucide-react"
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
        className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 cursor-pointer group relative"
        onClick={() => setOpen(true)}
      >
        {!isPreviewMode && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
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

        <h2 className="text-xl font-bold text-white mb-4">Projects</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 rounded-2xl bg-white/10" />
          <div className="h-20 rounded-2xl bg-white/10" />
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
