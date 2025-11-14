"use client"

import { useState } from "react"
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
  const [widgetColor, setWidgetColor] = useState("bg-[#1a1a1a]")
  const [showColorPicker, setShowColorPicker] = useState(false)

  const colorOptions = [
    { name: "Default", value: "bg-[#1a1a1a]" },
    { name: "Blue", value: "bg-gradient-to-br from-blue-900/40 to-cyan-900/40" },
    { name: "Purple", value: "bg-gradient-to-br from-purple-900/40 to-pink-900/40" },
    { name: "Green", value: "bg-gradient-to-br from-green-900/40 to-emerald-900/40" },
    { name: "Orange", value: "bg-gradient-to-br from-orange-900/40 to-red-900/40" },
  ]

  const title = content.title || "Services"
  const description =
    content.description ||
    "As a digital designer, I offer a comprehensive range of services to help bring your vision to life."

  return (
    <div className={`${widgetColor} backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing`}>
      <div className="flex items-center justify-between mb-4">
        <div></div>
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
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-xl font-bold text-white w-full px-3 py-2 h-11 transition-all duration-200"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => !isPreviewMode && setEditingField(`${widgetId}-title`)}
              className={`text-xl font-bold text-white min-h-[44px] flex items-center transition-all duration-200 ${
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
              value={description}
              onChange={(e) => onContentChange({ ...content, description: e.target.value })}
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
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-white leading-relaxed w-full resize-none px-3 py-2 h-24 transition-all duration-200 break-words"
              autoFocus
            />
          ) : (
            <p
              onClick={() => !isPreviewMode && setEditingField(`${widgetId}-description`)}
              className={`text-white leading-relaxed min-h-[96px] flex items-start transition-all duration-200 break-words ${
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
