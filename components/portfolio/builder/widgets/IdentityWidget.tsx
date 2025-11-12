"use client"

import { useState, useRef, useEffect } from "react"
import { GripVertical, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { THEME_COLOR_OPTIONS } from "@/lib/theme"
import type { Identity, ThemeIndex } from "../types"

type Props = {
  identity: Identity
  isPreviewMode?: boolean
  onChange: (updates: Partial<Identity>) => void
  editingField?: string | null
  setEditingField?: (field: string | null) => void
}

export default function IdentityWidget({
  identity,
  isPreviewMode = false,
  onChange,
  editingField,
  setEditingField,
}: Props) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const gradient = THEME_COLOR_OPTIONS[identity.selectedColor]?.gradient ?? "from-neutral-600/50 to-neutral-800/50"
  const backgroundStyle = identity.selectedColor !== undefined ? `bg-gradient-to-br ${gradient}` : "bg-[#1a1a1a]"

  const defaultBio = `${identity.name || "jenny wilson"} ${identity.title || "is a digital product designer"} ${identity.subtitle || "currently designing at acme."}`
  const displayBio = identity.bio || defaultBio

  useEffect(() => {
    if (textareaRef.current && editingField === "identity-bio") {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [displayBio, editingField])

  return (
    <div
      className={`${backgroundStyle} backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing relative`}
    >
      <div className="flex items-center justify-between mb-4">
        {!isPreviewMode && (
          <div className="opacity-60 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-5 h-5 text-white/70" />
          </div>
        )}
        <div className="relative">
          {!isPreviewMode && (
            <>
              {showColorPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-4 z-50 min-w-[200px]">
                  <div className="grid grid-cols-3 gap-3">
                    {THEME_COLOR_OPTIONS.map((color, idx) => (
                      <button
                        key={color.name}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient} ${
                          identity.selectedColor === idx ? "ring-2 ring-white" : ""
                        } hover:ring-2 hover:ring-white/50 transition-all`}
                        onClick={() => {
                          const i = idx as ThemeIndex
                          onChange({ selectedColor: i })
                          setShowColorPicker(false)
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 text-white p-2"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <Palette className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden">
          <img
            src={identity.avatarUrl || "/professional-woman-headshot.png"}
            alt={identity.name || "Profile"}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div
          className="relative"
          onMouseEnter={() => !isPreviewMode && setIsHovering(true)}
          onMouseLeave={() => !isPreviewMode && setIsHovering(false)}
        >
          {editingField === "identity-bio" ? (
            <textarea
              ref={textareaRef}
              value={displayBio}
              onChange={(e) => {
                onChange({ bio: e.target.value })
                // Auto-resize on change
                e.target.style.height = "auto"
                e.target.style.height = `${e.target.scrollHeight}px`
              }}
              onBlur={() => setEditingField?.(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  setEditingField?.(null)
                }
                if (e.key === "Escape") {
                  setEditingField?.(null)
                }
              }}
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-3xl font-bold text-white w-full resize-none leading-tight p-3 transition-all duration-200 break-words"
              autoFocus
              style={{
                overflow: "hidden",
                minHeight: "3.75rem",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            />
          ) : (
            <h1
              onClick={() => !isPreviewMode && setEditingField?.("identity-bio")}
              className={`text-3xl font-bold leading-tight text-white transition-all duration-200 break-words ${
                !isPreviewMode
                  ? `cursor-text rounded-xl p-3 -m-3 ${isHovering ? "bg-white/5 backdrop-blur-sm" : ""}`
                  : ""
              }`}
            >
              {displayBio}
            </h1>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          {["linkedin.", "dribbble.", "behance.", "twitter.", "unsplash.", "instagram."].map((social) => (
            <Button
              key={social}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-200"
            >
              {social}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
