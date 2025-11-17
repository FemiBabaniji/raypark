import { createClient } from "@/lib/supabase/server"

export interface PortfolioTemplate {
  id: string
  community_id: string | null
  name: string
  description: string | null
  layout: {
    left: { type: string; widgets: string[] }
    right: { type: string; widgets: string[] }
  }
  widget_configs: Array<{
    id: string
    type: string
    props: Record<string, any>
  }>
  preview_image_url: string | null
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

/**
 * Fetch templates available to the current user
 * Includes system templates (community_id = null) and community-specific templates
 */
export async function getAvailableTemplates(communityId?: string): Promise<PortfolioTemplate[]> {
  const supabase = await createClient()

  let query = supabase
    .from("portfolio_templates")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // If communityId provided, include community-specific templates
  if (communityId) {
    query = query.or(`community_id.is.null,community_id.eq.${communityId}`)
  } else {
    // Only system templates
    query = query.is("community_id", null)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching templates:", error)
    return []
  }

  return (data as PortfolioTemplate[]) || []
}

/**
 * Get a specific template by ID
 */
export async function getTemplateById(templateId: string): Promise<PortfolioTemplate | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("portfolio_templates")
    .select("*")
    .eq("id", templateId)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error("[v0] Error fetching template:", error)
    return null
  }

  return data as PortfolioTemplate
}

/**
 * Create a new template (for community admins)
 */
export async function createTemplate(
  template: Omit<PortfolioTemplate, "id" | "created_at" | "updated_at" | "created_by">
): Promise<PortfolioTemplate | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.error("[v0] Cannot create template: User not authenticated")
    return null
  }

  const { data, error } = await supabase
    .from("portfolio_templates")
    .insert({
      ...template,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating template:", error)
    return null
  }

  return data as PortfolioTemplate
}

/**
 * Update an existing template
 */
export async function updateTemplate(
  templateId: string,
  updates: Partial<Omit<PortfolioTemplate, "id" | "created_at" | "created_by">>
): Promise<PortfolioTemplate | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("portfolio_templates")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", templateId)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating template:", error)
    return null
  }

  return data as PortfolioTemplate
}

/**
 * Delete a template (soft delete by setting is_active = false)
 */
export async function deleteTemplate(templateId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("portfolio_templates")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", templateId)

  if (error) {
    console.error("[v0] Error deleting template:", error)
    return false
  }

  return true
}
