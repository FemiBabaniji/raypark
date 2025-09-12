"use client"

import { Button } from "@/components/ui/button"
import { GripVertical, X } from "lucide-react"

type ServicesContent = {
  title: string
  description: string
  items: string[]
}

type Props = {
  widgetId: string
  column: "left" | "right"
  isPreviewMode: boolean
  content: ServicesContent
  onContentChange: (content: ServicesContent) => void
  onDelete: () => void
  onMove: () => void
  editingField: string | null
  setEditingField: (field: string | null) => void
}

export default function ServicesWidget({
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
  return (
    <div className="bg-card backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
      <div className="flex items-center justify-between mb-4">
        <div></div>
        {!isPreviewMode && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2"
              onClick={onDelete}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-card-foreground">Services</h3>
        <div className="space-y-4">
          <p className="text-card-foreground leading-relaxed">
            As a digital designer, I offer a comprehensive range of services to help bring your vision to life. From
            initial concept to final implementation, I work closely with clients to create meaningful and impactful
            digital experiences.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            My approach combines strategic thinking with creative execution, ensuring that every project not only looks
            great but also serves its intended purpose effectively.
          </p>
        </div>
      </div>
    </div>
  )
}
