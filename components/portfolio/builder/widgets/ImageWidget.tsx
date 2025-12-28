"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { GripVertical, ArrowLeft, ArrowRight, X, Upload, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"

type Props = {
  widgetId: string
  column: "left" | "right"
  isPreviewMode: boolean
  onDelete: () => void
  onMove: () => void
  imageUrl?: string
  caption?: string
  onImageChange: (url: string) => void
  onCaptionChange: (caption: string) => void
}

export default function ImageWidget({
  widgetId,
  column,
  isPreviewMode,
  onDelete,
  onMove,
  imageUrl,
  caption,
  onImageChange,
  onCaptionChange,
}: Props) {
  const [isEditingCaption, setIsEditingCaption] = useState(false)
  const [localCaption, setLocalCaption] = useState(caption || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        onImageChange(url)
      }
      reader.readAsDataURL(file)
    }
  }

  const saveCaption = () => {
    onCaptionChange(localCaption)
    setIsEditingCaption(false)
  }

  return (
    <div className="rounded-2xl overflow-hidden group relative">
      {!isPreviewMode && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-20 bg-black/60 backdrop-blur-sm rounded-lg p-1">
          <GripVertical className="w-4 h-4 text-white/70" />
          <Button size="sm" variant="ghost" onClick={onMove} className="p-1 h-6 w-6 bg-white/20 hover:bg-white/30">
            {column === "left" ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="p-1 h-6 w-6 bg-red-500/20 hover:bg-red-500/30"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={caption || "Image"}
            className="w-full h-auto object-cover rounded-2xl"
          />

          {!isPreviewMode && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-4 right-4 p-2 bg-black/60 backdrop-blur-sm hover:bg-black/80"
            >
              <Upload className="w-4 h-4" />
            </Button>
          )}

          {caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 rounded-b-2xl">
              <p className="text-white text-sm">{caption}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-square bg-black/20 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 bg-white/10 rounded-xl mb-4 flex items-center justify-center">
            <Upload className="w-8 h-8 text-white/50" />
          </div>
          <p className="text-white/60 text-sm mb-4">Upload an image</p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            Choose File
          </Button>
        </div>
      )}

      {/* Caption Section */}
      {(caption || !isPreviewMode) && imageUrl && (
        <div className="p-4 bg-black/20 backdrop-blur-sm rounded-b-2xl">
          {isEditingCaption && !isPreviewMode ? (
            <div className="flex gap-2">
              <Input
                value={localCaption}
                onChange={(e) => setLocalCaption(e.target.value)}
                placeholder="Add caption..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/50"
                onKeyPress={(e) => e.key === "Enter" && saveCaption()}
                autoFocus
              />
              <Button onClick={saveCaption} size="sm" className="bg-blue-600 hover:bg-blue-700">
                Save
              </Button>
            </div>
          ) : caption ? (
            <div className="flex items-center justify-between group/caption">
              <p className="text-white/80 text-sm">{caption}</p>
              {!isPreviewMode && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setLocalCaption(caption)
                    setIsEditingCaption(true)
                  }}
                  className="opacity-0 group-hover/caption:opacity-100 p-1 h-6 w-6"
                >
                  <Pencil className="w-3 h-3" />
                </Button>
              )}
            </div>
          ) : (
            !isPreviewMode && (
              <Button
                onClick={() => setIsEditingCaption(true)}
                variant="ghost"
                size="sm"
                className="text-white/50 hover:text-white/80 text-xs w-full"
              >
                + Add caption
              </Button>
            )
          )}
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
    </div>
  )
}
