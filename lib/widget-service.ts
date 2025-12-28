import { createClient } from "@/lib/supabase/client"

export type IdentityProps = {
  name?: string
  handle?: string
  avatarUrl?: string
  selectedColor?: number
  title?: string
  email?: string
  location?: string
  bio?: string
  linkedin?: string
  dribbble?: string
  behance?: string
  twitter?: string
  unsplash?: string
  instagram?: string
}

export async function getIdentityProps(portfolioId: string): Promise<IdentityProps> {
  const supabase = createClient()

  try {
    // Get the main page for this portfolio
    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("portfolio_id", portfolioId)
      .eq("key", "main")
      .maybeSingle()

    if (!page?.id) {
      console.log("[v0] No page found for portfolio:", portfolioId)
      return {}
    }

    // Get widget types to find identity widget type ID
    const { data: widgetTypes } = await supabase.from("widget_types").select("id, key")

    const identityTypeId = widgetTypes?.find((t) => t.key === "identity")?.id

    if (!identityTypeId) {
      console.log("[v0] Identity widget type not found")
      return {}
    }

    // Get the identity widget instance for this page
    const { data: widgetInstance } = await supabase
      .from("widget_instances")
      .select("props")
      .eq("page_id", page.id)
      .eq("widget_type_id", identityTypeId)
      .maybeSingle()

    if (!widgetInstance?.props) {
      console.log("[v0] No identity widget found for portfolio:", portfolioId)
      return {}
    }

    return widgetInstance.props as IdentityProps
  } catch (error) {
    console.error("[v0] Error fetching identity props:", error)
    return {}
  }
}

export async function updateIdentityProps(portfolioId: string, props: IdentityProps): Promise<void> {
  const supabase = createClient()

  try {
    // Get the main page for this portfolio
    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("portfolio_id", portfolioId)
      .eq("key", "main")
      .maybeSingle()

    if (!page?.id) {
      throw new Error("No page found for portfolio")
    }

    // Get widget types to find identity widget type ID
    const { data: widgetTypes } = await supabase.from("widget_types").select("id, key")

    const identityTypeId = widgetTypes?.find((t) => t.key === "identity")?.id

    if (!identityTypeId) {
      throw new Error("Identity widget type not found")
    }

    // Update or insert the identity widget instance
    const { error } = await supabase.from("widget_instances").upsert(
      {
        page_id: page.id,
        widget_type_id: identityTypeId,
        props,
        enabled: true,
      },
      {
        onConflict: "page_id,widget_type_id",
      },
    )

    if (error) {
      throw error
    }

    console.log("[v0] Identity props updated successfully")
  } catch (error) {
    console.error("[v0] Error updating identity props:", error)
    throw error
  }
}
