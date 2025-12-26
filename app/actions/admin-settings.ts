"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function enableAdminRestriction(communityId: string) {
  try {
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get the current user from the regular client
    const cookieStore = await cookies()
    const supabase = await createServerClient(cookieStore)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Use service role client to insert the admin role (bypasses RLS)
    const { error: roleError } = await supabaseAdmin.from("user_community_roles").upsert(
      {
        user_id: user.id,
        community_id: communityId,
        role: "community_admin",
        assigned_by: user.id,
        assigned_at: new Date().toISOString(),
        notes: "Auto-assigned when enabling admin access restriction",
      },
      {
        onConflict: "user_id,community_id,role",
      },
    )

    if (roleError) {
      console.error("[v0] Role assignment error:", roleError)
      return { success: false, error: roleError.message }
    }

    // Update community setting
    const { error: updateError } = await supabaseAdmin
      .from("communities")
      .update({ admin_access_restricted: true })
      .eq("id", communityId)

    if (updateError) {
      console.error("[v0] Community update error:", updateError)
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Enable admin restriction error:", error)
    return { success: false, error: error.message || "Failed to enable admin restriction" }
  }
}

export async function disableAdminRestriction(communityId: string) {
  try {
    const cookieStore = await cookies()
    const supabase = await createServerClient(cookieStore)

    const { error } = await supabase
      .from("communities")
      .update({ admin_access_restricted: false })
      .eq("id", communityId)

    if (error) {
      console.error("[v0] Disable admin restriction error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Disable admin restriction error:", error)
    return { success: false, error: error.message || "Failed to disable admin restriction" }
  }
}
