"use client"

import { useState, useRef, useEffect } from "react"
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
  const [isHoveringTitle, setIsHoveringTitle] = useState(false)
  const [isHoveringDesc, setIsHoveringDesc] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const title = content.title || "Services"
  const description =
    content.description ||
    "As a digital designer, I offer a comprehensive range of services to help bring your vision to life."

  useEffect(() => {
    if (textareaRef.current && editingField === `${widgetId}-description`) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [description, editingField, widgetId])

  return (
    <div className="bg-[#1a1a1a] backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
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
        <div
          className="relative"
          onMouseEnter={() => !isPreviewMode && setIsHoveringTitle(true)}
          onMouseLeave={() => !isPreviewMode && setIsHoveringTitle(false)}
        >
          {editingField === `${widgetId}-title` ? (
            <input
              type="text"
              value={title}
              onChange={(e) => onContentChange({ ...content, title: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  setEditingField(null)
                }
                if (e.key === "Escape") {
                  setEditingField(null)
                }
              }}
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-xl font-bold text-white w-full px-3 py-2 transition-all duration-200"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => !isPreviewMode && setEditingField(`${widgetId}-title`)}
              className={`text-xl font-bold text-white transition-all duration-200 ${
                !isPreviewMode
                  ? `cursor-text rounded-xl px-3 py-2 -mx-3 -my-2 ${isHoveringTitle ? "bg-white/5 backdrop-blur-sm" : ""}`
                  : ""
              }`}
            >
              {title}
            </h3>
          )}
        </div>

        <div
          className="relative"
          onMouseEnter={() => !isPreviewMode && setIsHoveringDesc(true)}
          onMouseLeave={() => !isPreviewMode && setIsHoveringDesc(false)}
        >
          {editingField === `${widgetId}-description` ? (
            <textarea
              ref={textareaRef}
              value={description}
              onChange={(e) => {
                onContentChange({ ...content, description: e.target.value })
                e.target.style.height = "auto"
                e.target.style.height = `${e.target.scrollHeight}px`
              }}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  setEditingField(null)
                }
                if (e.key === "Escape") {
                  setEditingField(null)
                }
              }}
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-white leading-relaxed w-full resize-none px-3 py-2 transition-all duration-200 break-words"
              autoFocus
              style={{
                overflow: "hidden",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            />
          ) : (
            <p
              onClick={() => !isPreviewMode && setEditingField(`${widgetId}-description`)}
              className={`text-white leading-relaxed transition-all duration-200 break-words ${
                !isPreviewMode
                  ? `cursor-text rounded-xl px-3 py-2 -mx-3 -my-2 ${isHoveringDesc ? "bg-white/5 backdrop-blur-sm" : ""}`
                  : ""
              }`}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
