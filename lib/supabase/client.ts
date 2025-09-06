import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables:", {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey,
      env: process.env.NODE_ENV,
    })
    throw new Error(
      "Missing Supabase environment variables. Please check your Project Settings and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    )
  }

  console.log("[v0] Creating Supabase client with URL:", supabaseUrl.substring(0, 20) + "...")

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
