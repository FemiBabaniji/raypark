"use client"
import { Button } from "@/components/ui/button"
import { GripVertical, X } from "lucide-react"

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
  const demoEducation = [
    {
      degree: "MS Computer Science",
      school: "Stanford University",
      year: "2020 • GPA: 3.8",
      description: "",
    },
    {
      degree: "BS Software Engineering",
      school: "UC Berkeley",
      year: "2018 • GPA: 3.7",
      description: "",
    },
    {
      degree: "AWS Solutions Architect",
      school: "Coursera",
      year: "2021",
      description: "",
      certified: true,
    },
  ]

  return (
    <div className="bg-[#252525] backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing">
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
        {demoEducation.map((item, idx) => (
          <div key={idx} className="bg-neutral-800/50 rounded-2xl p-4">
            <div className={item.certified ? "flex justify-between items-start" : ""}>
              <div>
                <h3 className="font-semibold text-white">{item.degree}</h3>
                <p className="text-neutral-300 text-sm">{item.school}</p>
                <p className="text-neutral-400 text-xs">{item.year}</p>
              </div>
              {item.certified && (
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">Certified</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
