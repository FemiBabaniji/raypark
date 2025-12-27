"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GripVertical, ArrowLeft, ArrowRight, X, Plus, Upload } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

type GalleryGroup = {
  id: string
  name: string
  description?: string
  images: string[]
  isVideo?: boolean
  authorName?: string
  authorHandle?: string
  authorAvatar?: string
}

type Props = {
  widgetId: string
  column: "left" | "right"
  isPreviewMode: boolean
  onDelete: () => void
  onMove: () => void
  galleryGroups: GalleryGroup[]
  onGroupsChange: (groups: GalleryGroup[]) => void
  onGroupClick: (group: GalleryGroup) => void
}

export default function GalleryWidget({
  widgetId,
  column,
  isPreviewMode,
  onDelete,
  onMove,
  galleryGroups,
  onGroupsChange,
  onGroupClick,
}: Props) {
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")

  const addGroup = () => {
    if (!newGroupName.trim()) return

    const newGroup: GalleryGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName,
      description: "",
      images: [],
      isVideo: false,
      authorName: newGroupName,
      authorHandle: "@" + newGroupName.toLowerCase().replace(/\s+/g, ""),
    }

    onGroupsChange([...galleryGroups, newGroup])
    setNewGroupName("")
    setShowAddGroup(false)
  }

  const removeGroup = (groupId: string) => {
    onGroupsChange(galleryGroups.filter((group) => group.id !== groupId))
  }

  const addImagesToGroup = (groupId: string) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.multiple = true

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string
            onGroupsChange(
              galleryGroups.map((group) =>
                group.id === groupId ? { ...group, images: [...group.images, imageUrl] } : group,
              ),
            )
          }
          reader.readAsDataURL(file)
        })
      }
    }

    input.click()
  }

  return (
    <div className="bg-[#1a1a1a] backdrop-blur-xl rounded-3xl p-6 group relative">
      {!isPreviewMode && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
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

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Image Gallery</h3>
      </div>

      <div className="space-y-3">
        {!isPreviewMode && (
          <>
            {showAddGroup ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Group name..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  onKeyPress={(e) => e.key === "Enter" && addGroup()}
                  autoFocus
                />
                <Button onClick={addGroup} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Add
                </Button>
                <Button
                  onClick={() => {
                    setShowAddGroup(false)
                    setNewGroupName("")
                  }}
                  size="sm"
                  variant="ghost"
                  className="text-white/70 hover:text-white"
                >
                  ×
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowAddGroup(true)}
                variant="outline"
                size="sm"
                className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Group
              </Button>
            )}
          </>
        )}

        {galleryGroups.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {galleryGroups.map((group) => (
              <div
                key={group.id}
                className="bg-[#2a2a2a] rounded-2xl overflow-hidden relative group/group cursor-pointer hover:bg-[#333333] transition-colors"
                onClick={() => onGroupClick(group)}
              >
                {!isPreviewMode && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover/group:opacity-100 transition-opacity flex gap-1 z-10">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        addImagesToGroup(group.id)
                      }}
                      size="sm"
                      variant="ghost"
                      className="bg-white/20 hover:bg-white/30 text-white p-1 h-6 w-6"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeGroup(group.id)
                      }}
                      size="sm"
                      variant="ghost"
                      className="bg-red-500/20 hover:bg-red-500/30 text-white p-1 h-6 w-6"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                {group.images.length > 0 ? (
                  <div className="relative">
                    <div className="grid grid-cols-2 gap-1 p-3">
                      {group.images.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-white/5">
                          <img
                            src={img || "/placeholder.svg"}
                            alt={`${group.name} ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {/* Fill empty slots if less than 4 images */}
                      {Array.from({ length: Math.max(0, 4 - group.images.length) }).map((_, idx) => (
                        <div
                          key={`empty-${idx}`}
                          className="aspect-square rounded-lg bg-white/5 border border-dashed border-white/10 flex items-center justify-center"
                        >
                          <Upload className="w-6 h-6 text-white/30" />
                        </div>
                      ))}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black/80 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-white/20">
                          <AvatarImage src={group.authorAvatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
                            {group.authorName?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-white font-medium text-base leading-tight">
                            by {group.authorName || group.name}
                          </p>
                          <p className="text-white/60 text-sm leading-tight">
                            {group.authorHandle || `@${group.name.toLowerCase()}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-white/50 mb-2" />
                    <p className="text-white/60 text-sm">Upload images</p>
                  </div>
                )}

                {/* Bottom Author Attribution */}
                <div className="p-3 flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={group.authorAvatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                      {group.authorName?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white text-sm font-medium">{group.authorHandle || group.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {galleryGroups.length === 0 && (
          <div className="text-center py-6 text-white/60">
            <div className="w-12 h-12 bg-white/10 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm">Create groups to organize your gallery</p>
          </div>
        )}
      </div>
    </div>
  )
}
