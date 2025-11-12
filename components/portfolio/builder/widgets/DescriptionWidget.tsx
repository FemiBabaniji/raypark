"use client"

import { useState, useRef, useEffect } from "react"
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
  const [isHoveringTitle, setIsHoveringTitle] = useState(false)
  const [isHoveringDesc, setIsHoveringDesc] = useState(false)
  const [isHoveringSubdesc, setIsHoveringSubdesc] = useState(false)
  const textareaRefDesc = useRef<HTMLTextAreaElement>(null)
  const textareaRefSubdesc = useRef<HTMLTextAreaElement>(null)

  const title = content.title || "About me"
  const description =
    content.description ||
    "I'm a passionate digital designer with over 8 years of experience creating user-centered designs that solve real problems."
  const subdescription =
    content.subdescription ||
    "When I'm not designing, you can find me exploring new coffee shops, hiking local trails, or experimenting with new design tools."

  useEffect(() => {
    if (textareaRefDesc.current && editingField === `${widgetId}-description`) {
      textareaRefDesc.current.style.height = "auto"
      textareaRefDesc.current.style.height = `${textareaRefDesc.current.scrollHeight}px`
    }
    if (textareaRefSubdesc.current && editingField === `${widgetId}-subdescription`) {
      textareaRefSubdesc.current.style.height = "auto"
      textareaRefSubdesc.current.style.height = `${textareaRefSubdesc.current.scrollHeight}px`
    }
  }, [description, subdescription, editingField, widgetId])

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
              className={`text-xl font-bold transition-all duration-200 ${
                !isPreviewMode
                  ? `cursor-text rounded-xl px-3 py-2 -mx-3 -my-2 ${isHoveringTitle ? "bg-white/5 backdrop-blur-sm" : ""}`
                  : ""
              }`}
            >
              {title}
            </h3>
          )}
        </div>

        <div className="text-white leading-relaxed">
          <div
            className="relative inline"
            onMouseEnter={() => !isPreviewMode && setIsHoveringDesc(true)}
            onMouseLeave={() => !isPreviewMode && setIsHoveringDesc(false)}
          >
            {editingField === `${widgetId}-description` ? (
              <textarea
                ref={textareaRefDesc}
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
              <span
                onClick={() => !isPreviewMode && setEditingField(`${widgetId}-description`)}
                className={`transition-all duration-200 break-words ${
                  !isPreviewMode
                    ? `cursor-text rounded-xl px-1 -mx-1 ${isHoveringDesc ? "bg-white/5 backdrop-blur-sm" : ""}`
                    : ""
                }`}
              >
                {description}
              </span>
            )}
          </div>{" "}
          <div
            className="relative inline"
            onMouseEnter={() => !isPreviewMode && setIsHoveringSubdesc(true)}
            onMouseLeave={() => !isPreviewMode && setIsHoveringSubdesc(false)}
          >
            {editingField === `${widgetId}-subdescription` ? (
              <textarea
                ref={textareaRefSubdesc}
                value={subdescription}
                onChange={(e) => {
                  onContentChange({ ...content, subdescription: e.target.value })
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
                className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-neutral-400 leading-relaxed w-full resize-none px-3 py-2 transition-all duration-200 break-words"
                autoFocus
                style={{
                  overflow: "hidden",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              />
            ) : (
              <span
                onClick={() => !isPreviewMode && setEditingField(`${widgetId}-subdescription`)}
                className={`text-neutral-400 transition-all duration-200 break-words ${
                  !isPreviewMode
                    ? `cursor-text rounded-xl px-1 -mx-1 ${isHoveringSubdesc ? "bg-white/5 backdrop-blur-sm" : ""}`
                    : ""
                }`}
              >
                {subdescription}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
