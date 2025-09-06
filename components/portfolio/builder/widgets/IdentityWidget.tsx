"use client"

import type React from "react"

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
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  useEffect(() => {
    if (editingField && inputRefs.current[editingField]) {
      inputRefs.current[editingField]?.focus()
    }
  }, [editingField])

  const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
    if (e.key === "Enter") {
      setEditingField?.(null)
    } else if (e.key === "Escape") {
      setEditingField?.(null)
    }
  }

  const gradient = THEME_COLOR_OPTIONS[identity.selectedColor]?.gradient ?? "from-neutral-600/50 to-neutral-800/50"

  return (
    <div
      className={`bg-gradient-to-br ${gradient} backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing relative`}
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
        <h1 className="text-3xl font-bold leading-tight text-white">
          {editingField === "identity-name" ? (
            <input
              ref={(el) => (inputRefs.current["identity-name"] = el)}
              type="text"
              value={identity.name || ""}
              onChange={(e) => onChange({ name: e.target.value })}
              onBlur={() => setEditingField?.(null)}
              onKeyDown={(e) => handleKeyDown(e, "identity-name")}
              className="bg-transparent border-none outline-none text-3xl font-bold text-white w-full"
              aria-label="Edit name"
            />
          ) : (
            <span
              onClick={() => !isPreviewMode && setEditingField?.("identity-name")}
              className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
              role={!isPreviewMode ? "button" : undefined}
              tabIndex={!isPreviewMode ? 0 : undefined}
              aria-label={!isPreviewMode ? "Click to edit name" : undefined}
            >
              {identity.name || "jenny wilson"}
            </span>
          )}
          <br />
          {editingField === "identity-title" ? (
            <input
              ref={(el) => (inputRefs.current["identity-title"] = el)}
              type="text"
              value={identity.title || ""}
              onChange={(e) => onChange({ title: e.target.value })}
              onBlur={() => setEditingField?.(null)}
              onKeyDown={(e) => handleKeyDown(e, "identity-title")}
              className="bg-transparent border-none outline-none text-3xl font-bold text-white w-full"
              aria-label="Edit title"
            />
          ) : (
            <span
              onClick={() => !isPreviewMode && setEditingField?.("identity-title")}
              className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
              role={!isPreviewMode ? "button" : undefined}
              tabIndex={!isPreviewMode ? 0 : undefined}
              aria-label={!isPreviewMode ? "Click to edit title" : undefined}
            >
              {identity.title || "is a digital product designer"}
            </span>
          )}
          <br />
          <span className="text-white/70">
            {editingField === "identity-subtitle" ? (
              <input
                ref={(el) => (inputRefs.current["identity-subtitle"] = el)}
                type="text"
                value={identity.subtitle || ""}
                onChange={(e) => onChange({ subtitle: e.target.value })}
                onBlur={() => setEditingField?.(null)}
                onKeyDown={(e) => handleKeyDown(e, "identity-subtitle")}
                className="bg-transparent border-none outline-none text-3xl font-bold text-white/70 w-full"
                aria-label="Edit subtitle"
              />
            ) : (
              <span
                onClick={() => !isPreviewMode && setEditingField?.("identity-subtitle")}
                className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-1 -mx-1" : ""}
                role={!isPreviewMode ? "button" : undefined}
                tabIndex={!isPreviewMode ? 0 : undefined}
                aria-label={!isPreviewMode ? "Click to edit subtitle" : undefined}
              >
                {identity.subtitle || "currently designing at acme."}
              </span>
            )}
          </span>
        </h1>

        <div className="flex flex-wrap gap-3 pt-4">
          {["linkedin.", "dribbble.", "behance.", "twitter.", "unsplash.", "instagram."].map((social) => (
            <Button
              key={social}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {social}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
