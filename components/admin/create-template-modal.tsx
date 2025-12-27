"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { PortfolioTemplate } from "@/lib/template-service"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Maximize2 } from "lucide-react"
import { TemplateBuilderExpanded } from "./template-builder-expanded"

interface CreateTemplateModalProps {
  communityId: string
  existingTemplate?: PortfolioTemplate | null
  onClose: () => void
}

export function CreateTemplateModal({ communityId, existingTemplate, onClose }: CreateTemplateModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isMandatory, setIsMandatory] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [widgetConfigs, setWidgetConfigs] = useState<any[]>([])
  const [layout, setLayout] = useState<any>({
    left: { type: "column", widgets: [] },
    right: { type: "column", widgets: [] },
  })
  const [saving, setSaving] = useState(false)
  const [communityName, setCommunityName] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCommunityInfo()
    if (existingTemplate) {
      setName(existingTemplate.name)
      setDescription(existingTemplate.description || "")
      setIsMandatory(existingTemplate.is_mandatory || false)
      setIsActive(existingTemplate.is_active)
      setWidgetConfigs(existingTemplate.widget_configs || [])
      setLayout(
        existingTemplate.layout || { left: { type: "column", widgets: [] }, right: { type: "column", widgets: [] } },
      )
    }
  }, [existingTemplate, communityId])

  async function loadCommunityInfo() {
    const supabase = createClient()
    const { data } = await supabase.from("communities").select("name").eq("id", communityId).single()

    if (data) {
      setCommunityName(data.name)
    }
    setLoading(false)
  }

  async function handleSave() {
    if (!name.trim()) {
      alert("Please enter a template name")
      return
    }

    setSaving(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("You must be logged in to create templates")
      setSaving(false)
      return
    }

    const templateData = {
      community_id: communityId,
      name: name.trim(),
      description: description.trim() || null,
      layout,
      widget_configs: widgetConfigs,
      preview_image_url: null,
      is_active: isActive,
      is_mandatory: isMandatory,
      created_by: user.id,
    }

    let error

    if (existingTemplate) {
      const result = await supabase
        .from("portfolio_templates")
        .update({
          ...templateData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingTemplate.id)

      error = result.error
    } else {
      const result = await supabase.from("portfolio_templates").insert(templateData).select()

      error = result.error
    }

    if (error) {
      console.error("Error saving template:", error)
      alert("Failed to save template: " + error.message)
    } else {
      onClose()
    }

    setSaving(false)
  }

  function handleSaveFromExpanded(builderLayout: any, builderWidgetConfigs: any[]) {
    setLayout(builderLayout)
    setWidgetConfigs(builderWidgetConfigs)
    setIsExpanded(false)
  }

  if (isExpanded) {
    return (
      <TemplateBuilderExpanded
        communityId={communityId}
        templateName={name}
        templateDescription={description}
        isMandatory={isMandatory}
        isActive={isActive}
        initialLayout={layout}
        initialWidgetConfigs={widgetConfigs}
        onSave={handleSaveFromExpanded}
        onClose={() => setIsExpanded(false)}
      />
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="!max-w-none w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[800px] max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl">{existingTemplate ? "Edit Template" : "Create New Template"}</DialogTitle>
          {communityName && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">For community:</span>
              <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-sm font-medium">
                {communityName}
              </span>
            </div>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Startup Founder Portfolio"
                />
              </div>

              <div className="space-y-2">
                <Label>Settings</Label>
                <div className="flex gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="mandatory"
                      checked={isMandatory}
                      onCheckedChange={(checked) => setIsMandatory(checked as boolean)}
                    />
                    <Label htmlFor="mandatory" className="text-sm cursor-pointer font-normal">
                      Required Template
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="active"
                      checked={isActive}
                      onCheckedChange={(checked) => setIsActive(checked as boolean)}
                    />
                    <Label htmlFor="active" className="text-sm cursor-pointer font-normal">
                      Active
                    </Label>
                  </div>
                </div>
                {isMandatory && (
                  <p className="text-xs text-muted-foreground mt-2">Members will be required to use this template</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this template is best suited for..."
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Template Layout</Label>
              <div className="border border-border rounded-lg p-8 bg-muted/20">
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Use the portfolio builder to create your template layout
                  </p>
                  <Button onClick={() => setIsExpanded(true)} variant="outline" className="gap-2">
                    <Maximize2 className="size-4" />
                    Open Portfolio Builder
                  </Button>
                  {widgetConfigs.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {widgetConfigs.length} widget{widgetConfigs.length !== 1 ? "s" : ""} configured
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="ghost" onClick={onClose} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                {existingTemplate ? "Update Template" : "Create Template"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
