"use client"
import { Button } from "@/components/ui/button"
import { GripVertical, X, Plus } from "lucide-react"

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
  const addEducationItem = () => {
    const newItem: EducationItem = {
      degree: "New Degree",
      school: "School Name",
      year: "Year",
      description: "",
    }
    onContentChange({
      ...content,
      items: [...content.items, newItem],
    })
  }

  const updateEducationItem = (index: number, updates: Partial<EducationItem>) => {
    const updatedItems = content.items.map((item, i) => (i === index ? { ...item, ...updates } : item))
    onContentChange({ ...content, items: updatedItems })
  }

  const removeEducationItem = (index: number) => {
    onContentChange({
      ...content,
      items: content.items.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
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
              className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1 text-white" : "text-white"}
            >
              {content.title}
            </span>
          )}
        </h2>
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
        {content.items.map((item, idx) => (
          <div key={idx} className="bg-neutral-800/50 rounded-2xl p-4 relative group/item">
            {!isPreviewMode && (
              <button
                onClick={() => removeEducationItem(idx)}
                className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <div className={item.certified ? "flex justify-between items-start" : ""}>
              <div className="flex-1 pr-6">
                <h3 className="font-semibold text-white">
                  {editingField === `${widgetId}-degree-${idx}` ? (
                    <input
                      type="text"
                      value={item.degree}
                      onChange={(e) => updateEducationItem(idx, { degree: e.target.value })}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                      className="bg-transparent border-none outline-none font-semibold text-white w-full"
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => !isPreviewMode && setEditingField(`${widgetId}-degree-${idx}`)}
                      className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
                    >
                      {item.degree}
                    </span>
                  )}
                </h3>
                <p className="text-neutral-300 text-sm">
                  {editingField === `${widgetId}-school-${idx}` ? (
                    <input
                      type="text"
                      value={item.school}
                      onChange={(e) => updateEducationItem(idx, { school: e.target.value })}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                      className="bg-transparent border-none outline-none text-neutral-300 text-sm w-full"
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => !isPreviewMode && setEditingField(`${widgetId}-school-${idx}`)}
                      className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
                    >
                      {item.school}
                    </span>
                  )}
                </p>
                <p className="text-neutral-400 text-xs">
                  {editingField === `${widgetId}-year-${idx}` ? (
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => updateEducationItem(idx, { year: e.target.value })}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                      className="bg-transparent border-none outline-none text-neutral-400 text-xs w-full"
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => !isPreviewMode && setEditingField(`${widgetId}-year-${idx}`)}
                      className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
                    >
                      {item.year}
                    </span>
                  )}
                </p>
              </div>
              {item.certified && (
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">Certified</span>
                  {!isPreviewMode && (
                    <button
                      onClick={() => updateEducationItem(idx, { certified: false })}
                      className="text-xs text-neutral-400 hover:text-white"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
              {!item.certified && !isPreviewMode && (
                <button
                  onClick={() => updateEducationItem(idx, { certified: true })}
                  className="text-xs text-green-400 hover:text-green-300"
                >
                  Mark Certified
                </button>
              )}
            </div>
          </div>
        ))}

        {!isPreviewMode && (
          <button
            onClick={addEducationItem}
            className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white/70 hover:text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        )}
      </div>
    </div>
  )
}
