import { createClient } from "@/lib/supabase/client"

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
  is_mandatory: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

/**
 * Fetch templates available to the current user
 * Includes system templates (community_id = null) and community-specific templates
 */
export async function getAvailableTemplates(communityId?: string): Promise<PortfolioTemplate[]> {
  console.log("[v0] 🔍 getAvailableTemplates called:")
  console.log("[v0]   - communityId:", communityId)
  console.log("[v0]   - communityId type:", typeof communityId)

  const supabase = await createClient()

  let query = supabase
    .from("portfolio_templates")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // If communityId provided, include community-specific templates
  if (communityId) {
    const orFilter = `community_id.is.null,community_id.eq.${communityId}`
    console.log("[v0]   - Using OR filter:", orFilter)
    query = query.or(orFilter)
  } else {
    // Only system templates
    console.log("[v0]   - Fetching system templates only (community_id IS NULL)")
    query = query.is("community_id", null)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] ❌ Error fetching templates:", error)
    return []
  }

  console.log("[v0] ✅ Successfully fetched templates:")
  console.log("[v0]   - Total count:", data?.length || 0)

  if (data && data.length > 0) {
    console.log("[v0]   - Breakdown:")
    console.log("[v0]     * System templates:", data.filter((t) => t.community_id === null).length)
    console.log("[v0]     * Community templates:", data.filter((t) => t.community_id !== null).length)
    console.log("[v0]     * Mandatory templates:", data.filter((t) => t.is_mandatory).length)
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
  template: Omit<PortfolioTemplate, "id" | "created_at" | "updated_at" | "created_by">,
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
  updates: Partial<Omit<PortfolioTemplate, "id" | "created_at" | "created_by">>,
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

/**
 * Get the mandatory template for a specific community
 * Returns null if no mandatory template exists
 */
export async function getMandatoryTemplate(communityId: string): Promise<PortfolioTemplate | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("portfolio_templates")
    .select("*")
    .eq("community_id", communityId)
    .eq("is_mandatory", true)
    .eq("is_active", true)
    .maybeSingle()

  if (error) {
    console.error("[v0] Error fetching mandatory template:", error)
    return null
  }

  return data as PortfolioTemplate | null
}

/**
 * Ensure only one template is mandatory per community
 * Automatically un-marks other templates when setting a new mandatory template
 */
export async function ensureSingleMandatoryTemplate(
  communityId: string,
  newMandatoryTemplateId: string,
): Promise<void> {
  const supabase = await createClient()

  console.log(
    "[v0] Ensuring single mandatory template for community:",
    communityId,
    "new mandatory:",
    newMandatoryTemplateId,
  )

  // Un-mark all other templates in this community as mandatory
  const { error } = await supabase
    .from("portfolio_templates")
    .update({ is_mandatory: false, updated_at: new Date().toISOString() })
    .eq("community_id", communityId)
    .neq("id", newMandatoryTemplateId)
    .eq("is_mandatory", true)

  if (error) {
    console.error("[v0] Error ensuring single mandatory template:", error)
  }
}
