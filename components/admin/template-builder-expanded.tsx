"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import PortfolioBuilder from "@/components/portfolio/builder/PortfolioBuilder"
import type { Identity } from "@/components/portfolio/builder/PortfolioBuilder"

interface TemplateBuilderExpandedProps {
  isOpen: boolean
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
  isOpen,
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[70vw] h-[90vh] bg-background rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold">{templateName || "New Template"}</h2>
            <p className="text-sm text-muted-foreground">Design the portfolio layout for this community template</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Portfolio Builder */}
        <div className="flex-1 overflow-auto p-6">
          <PortfolioBuilder
            identity={identity}
            onIdentityChange={setIdentity}
            onSavePortfolio={handleSavePortfolio}
            communityId={communityId}
            initialPortfolio={{
              name: templateName,
              description: templateDescription,
              layout: {
                left: [{ id: "identity", type: "identity" }],
                right: [],
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
