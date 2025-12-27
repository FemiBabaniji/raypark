"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { PortfolioTemplate } from "@/lib/template-service"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Copy, Trash2 } from "lucide-react"
import { CreateTemplateModal } from "./create-template-modal"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface AdminTemplatesProps {
  communityId: string
}

export function AdminTemplates({ communityId }: AdminTemplatesProps) {
  const [templates, setTemplates] = useState<PortfolioTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<PortfolioTemplate | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [communityId])

  async function loadTemplates() {
    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("portfolio_templates")
      .select("*")
      .eq("community_id", communityId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error loading templates:", error)
    } else {
      setTemplates((data as PortfolioTemplate[]) || [])
    }

    setLoading(false)
  }

  async function handleDelete(templateId: string) {
    if (!confirm("Are you sure you want to delete this template? This cannot be undone.")) {
      return
    }

    const supabase = createClient()
    const { error } = await supabase.from("portfolio_templates").update({ is_active: false }).eq("id", templateId)

    if (error) {
      console.error("[v0] Error deleting template:", error)
      alert("Failed to delete template")
    } else {
      loadTemplates()
    }
  }

  async function handleDuplicate(template: PortfolioTemplate) {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase.from("portfolio_templates").insert({
      community_id: communityId,
      name: `${template.name} (Copy)`,
      description: template.description,
      layout: template.layout,
      widget_configs: template.widget_configs,
      preview_image_url: template.preview_image_url,
      is_active: true,
      is_mandatory: false,
      created_by: user.id,
    })

    if (error) {
      console.error("[v0] Error duplicating template:", error)
      alert("Failed to duplicate template")
    } else {
      loadTemplates()
    }
  }

  function handleEdit(template: PortfolioTemplate) {
    setEditingTemplate(template)
    setShowCreateModal(true)
  }

  function handleModalClose() {
    setShowCreateModal(false)
    setEditingTemplate(null)
    loadTemplates()
  }

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading templates...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Portfolio Templates</h2>
          <p className="text-sm text-muted-foreground mt-1">Create custom templates for your community members</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="size-4 mr-2" />
          Create Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12 border border-white/10 rounded-lg bg-card">
          <p className="text-muted-foreground mb-4">No templates created yet</p>
          <Button onClick={() => setShowCreateModal(true)} variant="outline">
            <Plus className="size-4 mr-2" />
            Create Your First Template
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-white/10 rounded-lg bg-card p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">{template.name}</h3>
                    {template.is_mandatory && (
                      <Badge variant="default" className="bg-purple-600">
                        Required
                      </Badge>
                    )}
                    {!template.is_active && (
                      <Badge variant="secondary" className="bg-red-600/20 text-red-400">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{template.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      {template.widget_configs?.length || 0} widget{template.widget_configs?.length !== 1 ? "s" : ""}
                    </span>
                    <span>•</span>
                    <span>Created {formatDistanceToNow(new Date(template.created_at), { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDuplicate(template)}>
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateTemplateModal communityId={communityId} existingTemplate={editingTemplate} onClose={handleModalClose} />
      )}
    </div>
  )
}
