"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import AddButton from "@/components/ui/add-button"

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
  const [showAddLeft, setShowAddLeft] = useState(false)
  const [showAddRight, setShowAddRight] = useState(false)

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

  function addWidget(column: "left" | "right", widgetId: string) {
    const widget = availableWidgets.find((w) => w.id === widgetId)
    if (!widget) return

    const newLayout = {
      ...layout,
      [column]: {
        ...layout[column],
        widgets: [...layout[column].widgets, widget.id],
      },
    }
    onLayoutChange(newLayout)

    const newConfig = {
      id: widget.id,
      type: widget.key,
      props: {},
    }
    onWidgetConfigsChange([...widgetConfigs, newConfig])

    setShowAddLeft(false)
    setShowAddRight(false)
  }

  function removeWidget(column: "left" | "right", widgetId: string) {
    const newLayout = {
      ...layout,
      [column]: {
        ...layout[column],
        widgets: layout[column].widgets.filter((id) => id !== widgetId),
      },
    }
    onLayoutChange(newLayout)
    onWidgetConfigsChange(widgetConfigs.filter((config) => config.id !== widgetId))
  }

  function getWidgetName(widgetId: string) {
    const widget = availableWidgets.find((w) => w.id === widgetId)
    return widget?.name || widgetId
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white/60">Left Column</h3>
          <span className="text-xs text-white/40">{layout.left.widgets.length} widgets</span>
        </div>

        <div className="space-y-3">
          {layout.left.widgets.map((widgetId) => (
            <div
              key={widgetId}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between group hover:border-white/20 transition-colors"
            >
              <span className="text-sm text-white">{getWidgetName(widgetId)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeWidget("left", widgetId)}
                className="opacity-0 group-hover:opacity-100 h-7 w-7 p-0 hover:bg-white/10"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        {layout.left.widgets.length === 0 && (
          <div className="text-center py-12 text-sm text-white/40 border border-dashed border-white/10 rounded-lg">
            No widgets
          </div>
        )}

        <div className="relative">
          <AddButton
            onClick={() => setShowAddLeft(!showAddLeft)}
            variant="compact"
            size="sm"
            label="Add Widget"
            className="w-full"
          />

          {showAddLeft && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto">
              {availableWidgets.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() => addWidget("left", widget.id)}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors"
                >
                  {widget.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white/60">Right Column</h3>
          <span className="text-xs text-white/40">{layout.right.widgets.length} widgets</span>
        </div>

        <div className="space-y-3">
          {layout.right.widgets.map((widgetId) => (
            <div
              key={widgetId}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between group hover:border-white/20 transition-colors"
            >
              <span className="text-sm text-white">{getWidgetName(widgetId)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeWidget("right", widgetId)}
                className="opacity-0 group-hover:opacity-100 h-7 w-7 p-0 hover:bg-white/10"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        {layout.right.widgets.length === 0 && (
          <div className="text-center py-12 text-sm text-white/40 border border-dashed border-white/10 rounded-lg">
            No widgets
          </div>
        )}

        <div className="relative">
          <AddButton
            onClick={() => setShowAddRight(!showAddRight)}
            variant="compact"
            size="sm"
            label="Add Widget"
            className="w-full"
          />

          {showAddRight && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto">
              {availableWidgets.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() => addWidget("right", widget.id)}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors"
                >
                  {widget.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
