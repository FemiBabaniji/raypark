"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GripVertical, X, Plus, Trash2 } from "lucide-react"

type EducationItem = {
  degree: string
  school: string
  year: string
  description: string
  certified?: boolean
}

type EducationContent = {
  title: string
  items: EducationItem[]
}

type Props = {
  widgetId: string
  column: "left" | "right"
  isPreviewMode: boolean
  content: EducationContent
  onContentChange: (content: EducationContent) => void
  onDelete: () => void
  onMove: () => void
  editingField: string | null
  setEditingField: (field: string | null) => void
}

export default function EducationWidget({
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
  const [isHovering, setIsHovering] = useState<number | null>(null)
  const [widgetColor, setWidgetColor] = useState("bg-zinc-900/40")
  const [showColorPicker, setShowColorPicker] = useState(false)

  const colorOptions = [
    { name: "Default", value: "bg-zinc-900/40" },
    { name: "Blue", value: "bg-gradient-to-br from-blue-900/40 to-cyan-900/40" },
    { name: "Purple", value: "bg-gradient-to-br from-purple-900/40 to-pink-900/40" },
    { name: "Green", value: "bg-gradient-to-br from-green-900/40 to-emerald-900/40" },
    { name: "Orange", value: "bg-gradient-to-br from-orange-900/40 to-red-900/40" },
  ]

  const addEducationItem = () => {
    const newItem: EducationItem = {
      degree: "New Degree",
      school: "School Name",
      year: "2024",
      description: "",
      certified: false,
    }
    onContentChange({ ...content, items: [...content.items, newItem] })
  }

  const updateItem = (index: number, updates: Partial<EducationItem>) => {
    const newItems = [...content.items]
    newItems[index] = { ...newItems[index], ...updates }
    onContentChange({ ...content, items: newItems })
  }

  const deleteItem = (index: number) => {
    const newItems = content.items.filter((_, i) => i !== index)
    onContentChange({ ...content, items: newItems })
  }

  return (
    <div
      className={`${widgetColor} backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing relative`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {editingField === `${widgetId}-title` ? (
            <input
              type="text"
              value={content.title}
              onChange={(e) => onContentChange({ ...content, title: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  setEditingField(null)
                }
                if (e.key === "Escape") setEditingField(null)
              }}
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-xl font-bold text-white px-2 py-1 h-9 transition-all duration-200"
              autoFocus
            />
          ) : (
            <span
              onClick={() => !isPreviewMode && setEditingField(`${widgetId}-title`)}
              className={
                !isPreviewMode
                  ? "cursor-text hover:bg-white/5 rounded-lg px-2 py-1 -mx-2 -my-1 text-white transition-all duration-200"
                  : "text-white"
              }
            >
              {content.title}
            </span>
          )}
        </h2>
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
        {content.items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 transition-all duration-200 hover:bg-white/10 relative group/item"
            onMouseEnter={() => setIsHovering(idx)}
            onMouseLeave={() => setIsHovering(null)}
          >
            <div className={item.certified ? "flex justify-between items-start" : ""}>
              <div className="flex-1 space-y-2">
                {editingField === `${widgetId}-degree-${idx}` ? (
                  <input
                    type="text"
                    value={item.degree}
                    onChange={(e) => updateItem(idx, { degree: e.target.value })}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        setEditingField(null)
                      }
                      if (e.key === "Escape") setEditingField(null)
                    }}
                    className="bg-white/10 border border-white/30 rounded-lg outline-none focus:ring-2 focus:ring-white/40 text-white font-semibold px-2 py-1 w-full h-8 transition-all duration-200"
                    autoFocus
                  />
                ) : (
                  <h3
                    onClick={() => !isPreviewMode && setEditingField(`${widgetId}-degree-${idx}`)}
                    className={`font-semibold text-white min-h-[24px] ${
                      !isPreviewMode && isHovering === idx
                        ? "cursor-text hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 -my-1 transition-all duration-200"
                        : ""
                    }`}
                  >
                    {item.degree}
                  </h3>
                )}

                {editingField === `${widgetId}-school-${idx}` ? (
                  <input
                    type="text"
                    value={item.school}
                    onChange={(e) => updateItem(idx, { school: e.target.value })}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        setEditingField(null)
                      }
                      if (e.key === "Escape") setEditingField(null)
                    }}
                    className="bg-white/10 border border-white/30 rounded-lg outline-none focus:ring-2 focus:ring-white/40 text-white text-sm px-2 py-1 w-full h-7 transition-all duration-200"
                    autoFocus
                  />
                ) : (
                  <p
                    onClick={() => !isPreviewMode && setEditingField(`${widgetId}-school-${idx}`)}
                    className={`text-neutral-300 text-sm min-h-[20px] ${
                      !isPreviewMode && isHovering === idx
                        ? "cursor-text hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 -my-1 transition-all duration-200"
                        : ""
                    }`}
                  >
                    {item.school}
                  </p>
                )}

                {editingField === `${widgetId}-year-${idx}` ? (
                  <input
                    type="text"
                    value={item.year}
                    onChange={(e) => updateItem(idx, { year: e.target.value })}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        setEditingField(null)
                      }
                      if (e.key === "Escape") setEditingField(null)
                    }}
                    className="bg-white/10 border border-white/30 rounded-lg outline-none focus:ring-2 focus:ring-white/40 text-white text-xs px-2 py-1 w-full h-6 transition-all duration-200"
                    autoFocus
                  />
                ) : (
                  <p
                    onClick={() => !isPreviewMode && setEditingField(`${widgetId}-year-${idx}`)}
                    className={`text-neutral-400 text-xs min-h-[18px] ${
                      !isPreviewMode && isHovering === idx
                        ? "cursor-text hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 -my-1 transition-all duration-200"
                        : ""
                    }`}
                  >
                    {item.year}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {item.certified && (
                  <span className="inline-block bg-green-600/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    Certified
                  </span>
                )}
                {!isPreviewMode && isHovering === idx && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover/item:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2"
                    onClick={() => deleteItem(idx)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isPreviewMode && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all duration-200"
          onClick={addEducationItem}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      )}
    </div>
  )
}
