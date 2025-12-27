"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle>{templateName || "New Template"}</DialogTitle>
          <DialogDescription>Design the portfolio layout for this community template</DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  )
}
