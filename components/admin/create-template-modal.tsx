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

    console.log("[v0] Saving template:", {
      communityId,
      name: name.trim(),
      isMandatory,
      isActive,
      isUpdate: !!existingTemplate,
    })

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
      console.log("[v0] Template update result:", error ? "ERROR" : "SUCCESS", error)
    } else {
      // Create new template
      const result = await supabase.from("portfolio_templates").insert(templateData).select()

      error = result.error
      console.log("[v0] Template creation result:", error ? "ERROR" : "SUCCESS", error)
      if (!error && result.data) {
        console.log("[v0] Created template ID:", result.data[0]?.id)
      }
    }

    if (error) {
      console.error("[v0] Error saving template:", error)
      alert("Failed to save template: " + error.message)
    } else {
      console.log("[v0] Template saved successfully, closing modal")
      onClose()
    }

    setSaving(false)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="!max-w-none w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[1200px] max-h-[90vh] overflow-y-auto bg-white/5 backdrop-blur-sm border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            {existingTemplate ? "Edit Template" : "Create New Template"}
          </DialogTitle>
          {communityName && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-white/60">For community:</span>
              <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1 text-sm font-medium text-white">
                {communityName}
              </span>
            </div>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-white/40" />
          </div>
        ) : (
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
                  className="bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-white/40"
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
                    <Label htmlFor="mandatory" className="text-sm text-white/60 cursor-pointer">
                      Required Template
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="active"
                      checked={isActive}
                      onCheckedChange={(checked) => setIsActive(checked as boolean)}
                    />
                    <Label htmlFor="active" className="text-sm text-white/60 cursor-pointer">
                      Active
                    </Label>
                  </div>
                </div>
                {isMandatory && (
                  <p className="text-xs text-white/60 mt-2">Members will be required to use this template</p>
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
                className="bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-white/40 resize-none"
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
              <Button variant="ghost" onClick={onClose} disabled={saving} className="text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
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
