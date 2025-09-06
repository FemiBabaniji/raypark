"use client"

import type React from "react"

import { useRef, useEffect } from "react"
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
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | HTMLTextAreaElement | null }>({})

  useEffect(() => {
    if (editingField && inputRefs.current[editingField]) {
      inputRefs.current[editingField]?.focus()
    }
  }, [editingField])

  const handleKeyDown = (e: React.KeyboardEvent, field: string, isTextarea = false) => {
    if (e.key === "Escape") {
      setEditingField(null)
    } else if (e.key === "Enter" && (!isTextarea || !e.shiftKey)) {
      setEditingField(null)
    }
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
              ref={(el) => (inputRefs.current[`${widgetId}-title`] = el)}
              type="text"
              value={content.title}
              onChange={(e) => onContentChange({ ...content, title: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => handleKeyDown(e, `${widgetId}-title`)}
              className="bg-transparent border-none outline-none text-xl font-bold text-white w-full"
              aria-label="Edit title"
            />
          ) : (
            <span
              onClick={() => !isPreviewMode && setEditingField(`${widgetId}-title`)}
              className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1 text-white" : "text-white"}
              role={!isPreviewMode ? "button" : undefined}
              tabIndex={!isPreviewMode ? 0 : undefined}
              aria-label={!isPreviewMode ? "Click to edit title" : undefined}
            >
              {content.title}
            </span>
          )}
        </h3>
        <p className="text-white leading-relaxed">
          {editingField === `${widgetId}-description` ? (
            <textarea
              ref={(el) => (inputRefs.current[`${widgetId}-description`] = el)}
              value={content.description}
              onChange={(e) => onContentChange({ ...content, description: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => handleKeyDown(e, `${widgetId}-description`, true)}
              className="bg-transparent border-none outline-none text-white leading-relaxed w-full resize-none"
              rows={3}
              aria-label="Edit description"
            />
          ) : (
            <span
              onClick={() => !isPreviewMode && setEditingField(`${widgetId}-description`)}
              className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
              role={!isPreviewMode ? "button" : undefined}
              tabIndex={!isPreviewMode ? 0 : undefined}
              aria-label={!isPreviewMode ? "Click to edit description" : undefined}
            >
              {content.description}
            </span>
          )}{" "}
          <span className="text-neutral-400">
            {editingField === `${widgetId}-subdescription` ? (
              <textarea
                ref={(el) => (inputRefs.current[`${widgetId}-subdescription`] = el)}
                value={content.subdescription}
                onChange={(e) => onContentChange({ ...content, subdescription: e.target.value })}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => handleKeyDown(e, `${widgetId}-subdescription`, true)}
                className="bg-transparent border-none outline-none text-neutral-400 leading-relaxed w-full resize-none"
                rows={2}
                aria-label="Edit subdescription"
              />
            ) : (
              <span
                onClick={() => !isPreviewMode && setEditingField(`${widgetId}-subdescription`)}
                className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
                role={!isPreviewMode ? "button" : undefined}
                tabIndex={!isPreviewMode ? 0 : undefined}
                aria-label={!isPreviewMode ? "Click to edit subdescription" : undefined}
              >
                {content.subdescription}
              </span>
            )}
          </span>
        </p>
      </div>
    </div>
  )
}
