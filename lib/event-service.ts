import { createBrowserClient } from "@supabase/ssr"

export interface CommunityEvent {
  id: string
  community_id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  location_type: "physical" | "virtual" | "hybrid"
  location_name: string | null
  location_address: string | null
  location_url: string | null
  capacity: number | null
  rsvp_enabled: boolean
  require_approval: boolean
  visibility: "public" | "members_only" | "private"
  status: "draft" | "upcoming" | "active" | "past" | "cancelled"
  cohort_id: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface EventRSVP {
  id: string
  event_id: string
  user_id: string
  status: "yes" | "no" | "maybe"
  response_date: string
  attended: boolean | null
  checked_in_at: string | null
}

export async function getEventsForCommunity(communityId: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data, error } = await supabase
    .from("community_events")
    .select("*")
    .eq("community_id", communityId)
    .in("status", ["upcoming", "active"])
    .in("visibility", ["public", "members_only"])
    .order("start_date", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching events:", error)
    return []
  }

  return data as CommunityEvent[]
}

export async function getEventById(eventId: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data, error } = await supabase.from("community_events").select("*").eq("id", eventId).single()

  if (error) {
    console.error("[v0] Error fetching event:", error)
    return null
  }

  return data as CommunityEvent
}

export async function getEventRSVPs(eventId: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data, error } = await supabase
    .from("event_rsvps")
    .select(`
      *,
      user:auth.users(id, email)
    `)
    .eq("event_id", eventId)
    .eq("status", "yes")

  if (error) {
    console.error("[v0] Error fetching RSVPs:", error)
    return []
  }

  return data
}

export async function createRSVP(eventId: string, userId: string, status: "yes" | "no" | "maybe") {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data, error } = await supabase
    .from("event_rsvps")
    .upsert({
      event_id: eventId,
      user_id: userId,
      status,
      response_date: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating RSVP:", error)
    throw error
  }

  return data
}

export async function getUserRSVPForEvent(eventId: string, userId: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data, error } = await supabase
    .from("event_rsvps")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle()

  if (error) {
    console.error("[v0] Error fetching user RSVP:", error)
    return null
  }

  return data as EventRSVP | null
}

export async function getEventAttendanceCount(eventId: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { count, error } = await supabase
    .from("event_rsvps")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("status", "yes")

  if (error) {
    console.error("[v0] Error counting attendance:", error)
    return 0
  }

  return count || 0
}
