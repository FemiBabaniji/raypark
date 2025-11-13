import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  console.log("[v0] Creating browser Supabase client")
  console.log("[v0] SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "present" : "missing")
  console.log("[v0] SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "present" : "missing")

  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
