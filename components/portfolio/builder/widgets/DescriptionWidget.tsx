"use client"

import { Button } from "@/components/ui/button"
import { GripVertical, X } from "lucide-react"

type DescriptionContent = {
  title: string
  description: string
  subdescription: string
}

type Props = {
  widgetId: string
  column: "left" | "right"
  isPreviewMode: boolean
  content: DescriptionContent
  onContentChange: (content: DescriptionContent) => void
  onDelete: () => void
  onMove: () => void
  editingField: string | null
  setEditingField: (field: string | null) => void
}

export default function DescriptionWidget({
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
  const demoContent = {
    title: "About me",
    description:
      "I'm a passionate digital designer with over 8 years of experience creating user-centered designs that solve real problems. I specialize in UI/UX design, product strategy, and design systems.",
    subdescription:
      "When I'm not designing, you can find me exploring new coffee shops, hiking local trails, or experimenting with new design tools and techniques.",
  }

  return (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
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
              <GripVertical className="w-5 h-5 text-neutral-400" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">
          {editingField === `${widgetId}-title` ? (
            <input
              type="text"
              value={demoContent.title}
              onChange={(e) => onContentChange({ ...content, title: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
              className="bg-transparent border-none outline-none text-xl font-bold text-white w-full"
              autoFocus
            />
          ) : (
            <span
              onClick={() => !isPreviewMode && setEditingField(`${widgetId}-title`)}
              className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1 text-white" : "text-white"}
            >
              {demoContent.title}
            </span>
          )}
        </h3>
        <p className="text-white leading-relaxed">
          {editingField === `${widgetId}-description` ? (
            <textarea
              value={demoContent.description}
              onChange={(e) => onContentChange({ ...content, description: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === "Enter" && e.shiftKey === false && setEditingField(null)}
              className="bg-transparent border-none outline-none text-white leading-relaxed w-full resize-none"
              rows={2}
              autoFocus
            />
          ) : (
            <span
              onClick={() => !isPreviewMode && setEditingField(`${widgetId}-description`)}
              className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
            >
              {demoContent.description}
            </span>
          )}{" "}
          <span className="text-neutral-400">
            {editingField === `${widgetId}-subdescription` ? (
              <textarea
                value={demoContent.subdescription}
                onChange={(e) => onContentChange({ ...content, subdescription: e.target.value })}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === "Enter" && e.shiftKey === false && setEditingField(null)}
                className="bg-transparent border-none outline-none text-neutral-400 leading-relaxed w-full resize-none"
                rows={2}
                autoFocus
              />
            ) : (
              <span
                onClick={() => !isPreviewMode && setEditingField(`${widgetId}-subdescription`)}
                className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
              >
                {demoContent.subdescription}
              </span>
            )}
          </span>
        </p>
      </div>
    </div>
  )
}
