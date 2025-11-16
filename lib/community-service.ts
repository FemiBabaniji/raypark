import { createClient } from "@/lib/supabase/client"

export interface Community {
  id: string
  name: string
  code: string
  description?: string
  logo_url?: string
  settings?: any
}

export interface CommunityMembership {
  id: string
  community_id: string
  user_id: string
  role: string
  joined_at: string
  metadata?: any
}

/**
 * Load all communities that a user is a member of
 */
export async function loadUserCommunities(userId?: string): Promise<Community[]> {
  if (!userId) {
    console.log("[v0] No user ID provided, returning empty communities list")
    return []
  }

  const supabase = createClient()

  try {
    // Get all community memberships for this user
    const { data: memberships, error: memberError } = await supabase
      .from("community_members")
      .select("community_id")
      .eq("user_id", userId)

    if (memberError) {
      console.error("[v0] Error loading community memberships:", memberError)
      throw new Error(`Failed to load community memberships: ${memberError.message}`)
    }

    if (!memberships || memberships.length === 0) {
      console.log("[v0] User is not a member of any communities")
      return []
    }

    const communityIds = memberships.map((m) => m.community_id)

    // Get full community details
    const { data: communities, error: commError } = await supabase
      .from("communities")
      .select("*")
      .in("id", communityIds)
      .order("name", { ascending: true })

    if (commError) {
      console.error("[v0] Error loading communities:", commError)
      throw new Error(`Failed to load communities: ${commError.message}`)
    }

    console.log(`[v0] Loaded ${communities?.length || 0} communities for user`)
    return communities || []
  } catch (error) {
    console.error("[v0] Failed to load user communities:", error)
    return []
  }
}

/**
 * Get a single community by ID
 */
export async function getCommunityById(communityId: string): Promise<Community | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("id", communityId)
    .maybeSingle()

  if (error) {
    console.error("[v0] Error loading community:", error)
    return null
  }

  return data
}

/**
 * Check if a user already has a portfolio linked to a specific community
 */
export async function getPortfolioForCommunity(
  userId: string,
  communityId: string
): Promise<{ id: string; name: string } | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("portfolios")
    .select("id, name")
    .eq("user_id", userId)
    .eq("community_id", communityId)
    .maybeSingle()

  if (error) {
    console.error("[v0] Error checking for existing portfolio:", error)
    return null
  }

  return data
}

/**
 * Link a portfolio to a community
 */
export async function linkPortfolioToCommunity(
  portfolioId: string,
  communityId: string | null,
  userId: string
): Promise<void> {
  const supabase = createClient()

  // Verify user owns this portfolio
  const { data: portfolio, error: checkError } = await supabase
    .from("portfolios")
    .select("id, user_id")
    .eq("id", portfolioId)
    .maybeSingle()

  if (checkError || !portfolio) {
    throw new Error("Portfolio not found")
  }

  if (portfolio.user_id !== userId) {
    throw new Error("You do not own this portfolio")
  }

  // Update the portfolio's community_id
  const { error: updateError } = await supabase
    .from("portfolios")
    .update({ community_id: communityId })
    .eq("id", portfolioId)
    .eq("user_id", userId)

  if (updateError) {
    console.error("[v0] Error linking portfolio to community:", updateError)
    throw new Error(`Failed to link portfolio: ${updateError.message}`)
  }

  console.log(`[v0] Portfolio ${portfolioId} linked to community ${communityId}`)
}

/**
 * Swap a portfolio to a community, unlinking any existing portfolio from that community
 */
export async function swapPortfolioToCommunity(
  newPortfolioId: string,
  communityId: string,
  userId: string
): Promise<void> {
  const supabase = createClient()

  // First, unlink any existing portfolio from this community
  const { error: unlinkError } = await supabase
    .from("portfolios")
    .update({ community_id: null })
    .eq("user_id", userId)
    .eq("community_id", communityId)

  if (unlinkError) {
    console.error("[v0] Error unlinking old portfolio:", unlinkError)
    throw new Error(`Failed to unlink old portfolio: ${unlinkError.message}`)
  }

  // Then link the new portfolio
  await linkPortfolioToCommunity(newPortfolioId, communityId, userId)
  
  console.log(`[v0] Swapped portfolio ${newPortfolioId} to community ${communityId}`)
}
