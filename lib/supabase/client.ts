import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const client = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  client.auth.getSession().then(({ data: { session } }) => {
    console.log("[v0] Browser client - Session check:", {
      hasSession: !!session,
      userId: session?.user?.id,
      expiresAt: session?.expires_at,
    })
  })

  return client
}
