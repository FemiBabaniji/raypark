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
import { Loader2 } from "lucide-react"
import { TemplateWidgetEditor } from "./template-widget-editor"

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
  const [widgetConfigs, setWidgetConfigs] = useState<any[]>([])
  const [layout, setLayout] = useState<any>({
    left: { type: "column", widgets: [] },
    right: { type: "column", widgets: [] },
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
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
  }, [existingTemplate])

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
      // Update existing template
      const result = await supabase
        .from("portfolio_templates")
        .update({
          ...templateData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingTemplate.id)

      error = result.error
    } else {
      // Create new template
      const result = await supabase.from("portfolio_templates").insert(templateData)

      error = result.error
    }

    if (error) {
      console.error("[v0] Error saving template:", error)
      alert("Failed to save template: " + error.message)
    } else {
      onClose()
    }

    setSaving(false)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="!max-w-none w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[1200px] max-h-[90vh] overflow-y-auto bg-[#1a1a1d] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            {existingTemplate ? "Edit Template" : "Create New Template"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-6">
          {/* Basic Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Template Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Startup Founder Portfolio"
                className="bg-[#2a2a2d] border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Settings</Label>
              <div className="flex gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="mandatory"
                    checked={isMandatory}
                    onCheckedChange={(checked) => setIsMandatory(checked as boolean)}
                  />
                  <Label htmlFor="mandatory" className="text-sm text-muted-foreground cursor-pointer">
                    Required Template
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="active"
                    checked={isActive}
                    onCheckedChange={(checked) => setIsActive(checked as boolean)}
                  />
                  <Label htmlFor="active" className="text-sm text-muted-foreground cursor-pointer">
                    Active
                  </Label>
                </div>
              </div>
              {isMandatory && (
                <p className="text-xs text-yellow-400 mt-2">
                  Members will be required to use this template when creating portfolios
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template is best suited for..."
              rows={3}
              className="bg-[#2a2a2d] border-white/10 text-white resize-none"
            />
          </div>

          {/* Widget Editor */}
          <div className="space-y-2">
            <Label className="text-white">Template Layout</Label>
            <TemplateWidgetEditor
              layout={layout}
              widgetConfigs={widgetConfigs}
              onLayoutChange={setLayout}
              onWidgetConfigsChange={setWidgetConfigs}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
              {existingTemplate ? "Update Template" : "Create Template"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
