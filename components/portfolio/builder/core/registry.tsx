"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import {
  IdentityWidget,
  EducationWidget,
  ProjectsWidget,
  DescriptionWidget,
  ServicesWidget,
  GalleryWidget,
  StartupWidget,
  MeetingSchedulerWidget,
  ImageWidget,
} from "../widgets"
import type { Column, WidgetDef, Identity } from "./usePortfolioBuilder"

export type RegistryDeps = {
  identity: Identity
  isPreviewMode: boolean
  editingField: string | null
  setEditingField: (v: string | null) => void
  widgetContent: any
  onContentChange: (section: string, value: any) => void
  onDelete: (id: string) => void
  onMove: (id: string, from: Column, to: Column) => void
  onIdentityChange: (patch: Partial<Identity>) => void
  projectColors: Record<string, string>
  setProjectColors: (c: Record<string, string>) => void
  showProjectColorPicker: Record<string, boolean>
  setShowProjectColorPicker: (p: Record<string, boolean>) => void
  projectColorOptions: Array<{ name: string; gradient: string }>
  galleryGroups: Record<string, any[]>
  setGalleryGroups: (updater: (prev: Record<string, any[]>) => Record<string, any[]>) => void
}

export function renderWidget(def: WidgetDef, column: Column, deps: RegistryDeps) {
  const w = def
  const move = () => deps.onMove(w.id, column, column === "left" ? "right" : "left")
  const del = () => deps.onDelete(w.id)

  switch (w.type) {
    case "identity":
      return (
        <IdentityWidget
          key={w.id}
          identity={deps.identity}
          isPreviewMode={deps.isPreviewMode}
          onChange={deps.onIdentityChange}
          editingField={deps.editingField}
          setEditingField={deps.setEditingField}
        />
      )
    case "education":
      return (
        <EducationWidget
          key={w.id}
          widgetId={w.id}
          column={column}
          isPreviewMode={deps.isPreviewMode}
          content={deps.widgetContent.education}
          onContentChange={(c) => deps.onContentChange("education", c)}
          onDelete={del}
          onMove={move}
          editingField={deps.editingField}
          setEditingField={deps.setEditingField}
        />
      )
    case "projects":
      return (
        <ProjectsWidget
          key={w.id}
          widgetId={w.id}
          column={column}
          isPreviewMode={deps.isPreviewMode}
          content={deps.widgetContent.projects}
          onContentChange={(c) => deps.onContentChange("projects", c)}
          onDelete={del}
          onMove={move}
          projectColors={deps.projectColors}
          setProjectColors={deps.setProjectColors}
          showProjectColorPicker={deps.showProjectColorPicker}
          setShowProjectColorPicker={deps.setShowProjectColorPicker}
          projectColorOptions={deps.projectColorOptions}
          editingField={deps.editingField}
          setEditingField={deps.setEditingField}
        />
      )
    case "description":
      return (
        <DescriptionWidget
          key={w.id}
          widgetId={w.id}
          column={column}
          isPreviewMode={deps.isPreviewMode}
          content={deps.widgetContent.description}
          onContentChange={(c) => deps.onContentChange("description", c)}
          onDelete={del}
          onMove={move}
          editingField={deps.editingField}
          setEditingField={deps.setEditingField}
        />
      )
    case "services":
      return (
        <ServicesWidget
          key={w.id}
          widgetId={w.id}
          column={column}
          isPreviewMode={deps.isPreviewMode}
          content={deps.widgetContent.services}
          onContentChange={(c) => deps.onContentChange("services", c)}
          onDelete={del}
          onMove={move}
          editingField={deps.editingField}
          setEditingField={deps.setEditingField}
        />
      )
    case "gallery":
      return (
        <GalleryWidget
          key={w.id}
          widgetId={w.id}
          column={column}
          isPreviewMode={deps.isPreviewMode}
          onDelete={del}
          onMove={move}
          galleryGroups={deps.galleryGroups[w.id] || []}
          onGroupsChange={(groups) => deps.setGalleryGroups((prev) => ({ ...prev, [w.id]: groups }))}
          onGroupClick={() => {}}
        />
      )
    case "startup":
      return (
        <StartupWidget
          key={w.id}
          widgetId={w.id}
          column={column}
          isPreviewMode={deps.isPreviewMode}
          content={deps.widgetContent.startup}
          onContentChange={(c) => deps.onContentChange("startup", c)}
          onDelete={del}
          onMove={move}
          editingField={deps.editingField}
          setEditingField={deps.setEditingField}
        />
      )
    case "meeting-scheduler":
      return (
        <MeetingSchedulerWidget
          key={w.id}
          widgetId={w.id}
          column={column}
          isPreviewMode={deps.isPreviewMode}
          content={deps.widgetContent[w.id]}
          onContentChange={(c) => deps.onContentChange(w.id, c)}
          onDelete={del}
        />
      )
    case "image":
      const imageContent = deps.widgetContent.image || {}
      const imageData = imageContent[w.id] || { url: "", caption: "" }
      console.log("[v0] Rendering image widget:", w.id, "data:", imageData)
      return (
        <ImageWidget
          key={w.id}
          widgetId={w.id}
          column={column}
          isPreviewMode={deps.isPreviewMode}
          onDelete={del}
          onMove={move}
          imageUrl={imageData.url}
          caption={imageData.caption}
          onImageChange={(url) => {
            console.log("[v0] Image changed:", w.id, url)
            const updatedImageContent = { ...(deps.widgetContent.image || {}), [w.id]: { ...imageData, url } }
            deps.onContentChange("image", updatedImageContent)
          }}
          onCaptionChange={(caption) => {
            console.log("[v0] Caption changed:", w.id, caption)
            const updatedImageContent = { ...(deps.widgetContent.image || {}), [w.id]: { ...imageData, caption } }
            deps.onContentChange("image", updatedImageContent)
          }}
        />
      )
    default:
      return (
        <div key={w.id} className="p-4 bg-white/10 rounded-lg group relative">
          <Button
            size="sm"
            variant="ghost"
            onClick={del}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 h-6 w-6 bg-red-500/20 hover:bg-red-500/30"
          >
            <X className="w-3 h-3" />
          </Button>
          Unknown widget: {w.type}
        </div>
      )
  }
}
