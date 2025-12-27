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

  return (
    <div className="border border-white/10 rounded-lg bg-[#2a2a2d] p-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Left Column</h3>
            <span className="text-xs text-muted-foreground">{layout.left.widgets.length} widgets</span>
          </div>

          <div className="space-y-2">
            {layout.left.widgets.map((widgetId) => (
              <div
                key={widgetId}
                className="flex items-center justify-between bg-[#1a1a1d] border border-white/10 rounded px-3 py-2"
              >
                <span className="text-sm text-white">{getWidgetName(widgetId)}</span>
                <Button variant="ghost" size="sm" onClick={() => removeWidget("left", widgetId)}>
                  <X className="size-4" />
                </Button>
              </div>
            ))}

            {layout.left.widgets.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-white/10 rounded">
                No widgets added yet
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Select value={selectedWidget} onValueChange={setSelectedWidget}>
              <SelectTrigger className="bg-[#1a1a1d] border-white/10 text-white">
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
            <Button onClick={() => addWidget("left")} disabled={!selectedWidget} size="sm">
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Right Column</h3>
            <span className="text-xs text-muted-foreground">{layout.right.widgets.length} widgets</span>
          </div>

          <div className="space-y-2">
            {layout.right.widgets.map((widgetId) => (
              <div
                key={widgetId}
                className="flex items-center justify-between bg-[#1a1a1d] border border-white/10 rounded px-3 py-2"
              >
                <span className="text-sm text-white">{getWidgetName(widgetId)}</span>
                <Button variant="ghost" size="sm" onClick={() => removeWidget("right", widgetId)}>
                  <X className="size-4" />
                </Button>
              </div>
            ))}

            {layout.right.widgets.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-white/10 rounded">
                No widgets added yet
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Select value={selectedWidget} onValueChange={setSelectedWidget}>
              <SelectTrigger className="bg-[#1a1a1d] border-white/10 text-white">
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
            <Button onClick={() => addWidget("right")} disabled={!selectedWidget} size="sm">
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
