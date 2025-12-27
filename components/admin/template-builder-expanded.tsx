"use client"

import { useState } from "react"
import { X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import PortfolioBuilder from "@/components/portfolio/builder/PortfolioBuilder"

interface TemplateBuilderExpandedProps {
  communityId: string
  templateName: string
  templateDescription: string
  isMandatory: boolean
  isActive: boolean
  initialLayout: any
  initialWidgetConfigs: any[]
  onSave: (layout: any, widgetConfigs: any[]) => void
  onClose: () => void
}

export function TemplateBuilderExpanded({
  communityId,
  templateName,
  templateDescription,
  isMandatory,
  isActive,
  initialLayout,
  initialWidgetConfigs,
  onSave,
  onClose,
}: TemplateBuilderExpandedProps) {
  const [currentLayout, setCurrentLayout] = useState(initialLayout)
  const [currentWidgetConfigs, setCurrentWidgetConfigs] = useState(initialWidgetConfigs)

  function handleSave() {
    onSave(currentLayout, currentWidgetConfigs)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between h-full px-6">
          <div>
            <h2 className="text-lg font-semibold">{templateName || "New Template"}</h2>
            <p className="text-xs text-muted-foreground">Building template for community</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} className="gap-2">
              <Save className="size-4" />
              Save Template
            </Button>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Portfolio Builder */}
      <div className="pt-16 h-screen overflow-auto">
        <PortfolioBuilder
          portfolioId={null}
          mode="template"
          communityId={communityId}
          onLayoutChange={setCurrentLayout}
          onWidgetConfigsChange={setCurrentWidgetConfigs}
        />
      </div>
    </div>
  )
}
