"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import PortfolioBuilder from "@/components/portfolio/builder/PortfolioBuilder"
import type { Identity } from "@/components/portfolio/builder/PortfolioBuilder"

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
  const [identity, setIdentity] = useState<Identity>({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    skills: [],
    avatarUrl: "",
  })

  function handleSavePortfolio(data: any) {
    console.log("[v0] Template builder - saving portfolio data:", data)
    if (data) {
      onSave(data.layout || initialLayout, data.widgetConfigs || initialWidgetConfigs)
    }
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
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Portfolio Builder */}
      <div className="pt-16 h-screen overflow-auto">
        <PortfolioBuilder
          identity={identity}
          onIdentityChange={setIdentity}
          onSavePortfolio={handleSavePortfolio}
          communityId={communityId}
          initialPortfolio={{
            name: templateName,
            description: templateDescription,
          }}
        />
      </div>
    </div>
  )
}
