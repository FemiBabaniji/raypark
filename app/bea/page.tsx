import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import EventsPage from "@/components/events-page"

export const dynamic = "force-dynamic"

export default async function BeaNetworkPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth?redirect=/bea")
  }

  const { data: portfolios, error } = await supabase.from("portfolios").select("id").eq("user_id", user.id).limit(1)

  if (!error && (!portfolios || portfolios.length === 0)) {
    // No portfolio exists, redirect to resume onboarding
    redirect("/onboarding/resume")
  }

  return <EventsPage />
}
