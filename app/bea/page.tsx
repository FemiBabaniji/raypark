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

  return <EventsPage />
}
