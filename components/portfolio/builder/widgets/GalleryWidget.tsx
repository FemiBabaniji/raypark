"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GripVertical, ArrowLeft, ArrowRight, X, Plus, Upload } from "lucide-react"

type GalleryGroup = {
  id: string
  name: string
  description?: string
  images: string[]
  isVideo?: boolean
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
    <div className="bg-card border border-border rounded-3xl p-6 group relative">
      {!isPreviewMode && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <Button
            size="sm"
            variant="ghost"
            onClick={onMove}
            className="p-1 h-6 w-6 bg-foreground/20 hover:bg-foreground/30"
          >
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
        <h3 className="text-xl font-bold text-foreground">Image Gallery</h3>
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
                  className="flex-1 bg-foreground/10 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground/40"
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
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowAddGroup(true)}
                variant="outline"
                size="sm"
                className="w-full bg-foreground/10 border-border hover:bg-foreground/20 text-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Group
              </Button>
            )}
          </>
        )}

        {galleryGroups.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {galleryGroups.map((group) => (
              <div
                key={group.id}
                className="bg-secondary rounded-xl p-3 relative group/group cursor-pointer hover:bg-secondary/80 transition-colors"
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
                  <div className="aspect-video bg-white/10 rounded-lg overflow-hidden mb-2">
                    <img
                      src={group.images[0] || "/placeholder.svg"}
                      alt={`${group.name} main`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-secondary rounded-lg border border-dashed border-border flex items-center justify-center mb-2">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-foreground text-sm truncate">{group.name}</h4>
                  <p className="text-muted-foreground text-xs">
                    {group.images.length} image{group.images.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {galleryGroups.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <div className="w-12 h-12 bg-secondary rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm">Create groups to organize your gallery</p>
          </div>
        )}
      </div>
    </div>
  )
}
