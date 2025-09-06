"use client"

import { Button } from "@/components/ui/button"
import { GripVertical, X, Plus } from "lucide-react"

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
  const addService = () => {
    onContentChange({
      ...content,
      items: [...content.items, "New Service"],
    })
  }

  const updateService = (index: number, value: string) => {
    const updatedItems = content.items.map((item, i) => (i === index ? value : item))
    onContentChange({ ...content, items: updatedItems })
  }

  const removeService = (index: number) => {
    onContentChange({
      ...content,
      items: content.items.filter((_, i) => i !== index),
    })
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
        <h3 className="text-xl font-bold text-white">
          {editingField === `${widgetId}-title` ? (
            <input
              type="text"
              value={content.title}
              onChange={(e) => onContentChange({ ...content, title: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
              className="bg-transparent border-none outline-none text-xl font-bold text-white w-full"
              autoFocus
            />
          ) : (
            <span
              onClick={() => !isPreviewMode && setEditingField(`${widgetId}-title`)}
              className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
            >
              {content.title}
            </span>
          )}
        </h3>
        <div className="space-y-4">
          <p className="text-white leading-relaxed">
            {editingField === `${widgetId}-description` ? (
              <textarea
                value={content.description}
                onChange={(e) => onContentChange({ ...content, description: e.target.value })}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && setEditingField(null)}
                className="bg-transparent border-none outline-none text-white leading-relaxed w-full resize-none"
                rows={3}
                autoFocus
              />
            ) : (
              <span
                onClick={() => !isPreviewMode && setEditingField(`${widgetId}-description`)}
                className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
              >
                {content.description}
              </span>
            )}
          </p>

          <div className="space-y-2">
            {content.items.map((service, idx) => (
              <div key={idx} className="flex items-center gap-2 group/service">
                <span className="text-white/80">•</span>
                {editingField === `${widgetId}-service-${idx}` ? (
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => updateService(idx, e.target.value)}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                    className="bg-transparent border-none outline-none text-white/80 flex-1"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => !isPreviewMode && setEditingField(`${widgetId}-service-${idx}`)}
                    className={`text-white/80 flex-1 ${!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}`}
                  >
                    {service}
                  </span>
                )}
                {!isPreviewMode && (
                  <button
                    onClick={() => removeService(idx)}
                    className="opacity-0 group-hover/service:opacity-100 transition-opacity text-red-400 hover:text-red-300 p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {!isPreviewMode && (
              <button
                onClick={addService}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
