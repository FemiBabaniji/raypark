"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus } from "lucide-react"

interface WidgetType {
  id: string
  key: string
  name: string
}

interface TemplateWidgetEditorProps {
  layout: {
    left: { type: string; widgets: string[] }
    right: { type: string; widgets: string[] }
  }
  widgetConfigs: any[]
  onLayoutChange: (layout: any) => void
  onWidgetConfigsChange: (configs: any[]) => void
}

export function TemplateWidgetEditor({
  layout,
  widgetConfigs,
  onLayoutChange,
  onWidgetConfigsChange,
}: TemplateWidgetEditorProps) {
  const [availableWidgets, setAvailableWidgets] = useState<WidgetType[]>([])
  const [selectedWidget, setSelectedWidget] = useState<string>("")
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null)

  useEffect(() => {
    loadWidgetTypes()
  }, [])

  async function loadWidgetTypes() {
    const supabase = createClient()
    const { data, error } = await supabase.from("widget_types").select("id, key, name").order("name")

    if (error) {
      console.error("[v0] Error loading widget types:", error)
    } else {
      setAvailableWidgets((data as WidgetType[]) || [])
    }
  }

  function addWidget(column: "left" | "right") {
    if (!selectedWidget) return

    const widget = availableWidgets.find((w) => w.id === selectedWidget)
    if (!widget) return

    // Add widget to layout
    const newLayout = {
      ...layout,
      [column]: {
        ...layout[column],
        widgets: [...layout[column].widgets, widget.id],
      },
    }
    onLayoutChange(newLayout)

    // Add widget config
    const newConfig = {
      id: widget.id,
      type: widget.key,
      props: {},
    }
    onWidgetConfigsChange([...widgetConfigs, newConfig])

    setSelectedWidget("")
  }

  function removeWidget(column: "left" | "right", widgetId: string) {
    // Remove from layout
    const newLayout = {
      ...layout,
      [column]: {
        ...layout[column],
        widgets: layout[column].widgets.filter((id) => id !== widgetId),
      },
    }
    onLayoutChange(newLayout)

    // Remove from configs
    onWidgetConfigsChange(widgetConfigs.filter((config) => config.id !== widgetId))
  }

  function getWidgetName(widgetId: string) {
    const widget = availableWidgets.find((w) => w.id === widgetId)
    return widget?.name || widgetId
  }

  const widgetInfo: Record<string, { description: string }> = {
    identity: { description: "Name, title, avatar" },
    description: { description: "About section, bio" },
    projects: { description: "Project showcase grid" },
    education: { description: "Education history" },
    services: { description: "Services offered" },
    gallery: { description: "Image gallery" },
    startup: { description: "Startup info, metrics" },
    meeting: { description: "Meeting scheduler" },
  }

  function getWidgetDescription(widgetId: string) {
    const widget = availableWidgets.find((w) => w.id === widgetId)
    if (!widget) return null
    return widgetInfo[widget.key]?.description || "Widget"
  }

  return (
    <div className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm p-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Left Column</h3>
            <span className="text-xs text-white/60">{layout.left.widgets.length} widgets</span>
          </div>

          <div className="space-y-2">
            {layout.left.widgets.map((widgetId) => {
              const description = getWidgetDescription(widgetId)
              const isExpanded = expandedWidget === widgetId

              return (
                <div
                  key={widgetId}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg group hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    <button
                      onClick={() => setExpandedWidget(isExpanded ? null : widgetId)}
                      className="flex-1 text-left"
                    >
                      <div className="text-sm font-medium text-white">{getWidgetName(widgetId)}</div>
                      {description && <div className="text-xs text-white/60 mt-1">{description}</div>}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWidget("left", widgetId)}
                      className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6 bg-red-500/20 hover:bg-red-500/30"
                    >
                      <X className="size-3" />
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-white/10 p-4 bg-white/5">
                      <div className="text-xs text-white/60 mb-3">Preview</div>
                      <div className="rounded border border-white/10 p-4 space-y-2">
                        <div className="h-3 bg-white/10 rounded w-3/4"></div>
                        <div className="h-2 bg-white/10 rounded w-full"></div>
                        <div className="h-2 bg-white/10 rounded w-5/6"></div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {layout.left.widgets.length === 0 && (
            <div className="text-center py-8 text-sm text-white/60 border border-dashed border-white/10 rounded-lg">
              No widgets added yet
            </div>
          )}

          <div className="flex gap-2">
            <Select value={selectedWidget} onValueChange={setSelectedWidget}>
              <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/10 text-white">
                <SelectValue placeholder="Select widget..." />
              </SelectTrigger>
              <SelectContent>
                {availableWidgets.map((widget) => (
                  <SelectItem key={widget.id} value={widget.id}>
                    {widget.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => addWidget("left")}
              disabled={!selectedWidget}
              size="sm"
              className="bg-white/10 hover:bg-white/20 border border-white/20"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Right Column</h3>
            <span className="text-xs text-white/60">{layout.right.widgets.length} widgets</span>
          </div>

          <div className="space-y-2">
            {layout.right.widgets.map((widgetId) => {
              const description = getWidgetDescription(widgetId)
              const isExpanded = expandedWidget === widgetId

              return (
                <div
                  key={widgetId}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg group hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    <button
                      onClick={() => setExpandedWidget(isExpanded ? null : widgetId)}
                      className="flex-1 text-left"
                    >
                      <div className="text-sm font-medium text-white">{getWidgetName(widgetId)}</div>
                      {description && <div className="text-xs text-white/60 mt-1">{description}</div>}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWidget("right", widgetId)}
                      className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6 bg-red-500/20 hover:bg-red-500/30"
                    >
                      <X className="size-3" />
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-white/10 p-4 bg-white/5">
                      <div className="text-xs text-white/60 mb-3">Preview</div>
                      <div className="rounded border border-white/10 p-4 space-y-2">
                        <div className="h-3 bg-white/10 rounded w-3/4"></div>
                        <div className="h-2 bg-white/10 rounded w-full"></div>
                        <div className="h-2 bg-white/10 rounded w-5/6"></div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {layout.right.widgets.length === 0 && (
            <div className="text-center py-8 text-sm text-white/60 border border-dashed border-white/10 rounded-lg">
              No widgets added yet
            </div>
          )}

          <div className="flex gap-2">
            <Select value={selectedWidget} onValueChange={setSelectedWidget}>
              <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/10 text-white">
                <SelectValue placeholder="Select widget..." />
              </SelectTrigger>
              <SelectContent>
                {availableWidgets.map((widget) => (
                  <SelectItem key={widget.id} value={widget.id}>
                    {widget.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => addWidget("right")}
              disabled={!selectedWidget}
              size="sm"
              className="bg-white/10 hover:bg-white/20 border border-white/20"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
