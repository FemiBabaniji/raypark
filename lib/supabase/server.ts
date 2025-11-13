import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your Project Settings and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    )
  }

  const cookieStore = await cookies()

  console.log("[v0] Server client - creating with URL:", supabaseUrl)
  console.log("[v0] Server client - cookies available:", cookieStore.getAll().length)

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const allCookies = cookieStore.getAll()
        console.log("[v0] Server client - getAll cookies:", allCookies.length)
        return allCookies
      },
      setAll(cookiesToSet) {
        try {
          console.log("[v0] Server client - setting", cookiesToSet.length, "cookies")
          cookiesToSet.forEach(({ name, value, options }) => {
            console.log("[v0] Server client - setting cookie:", name)
            cookieStore.set(name, value, options)
          })
        } catch (error) {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
          console.log("[v0] Server client - setAll failed (expected in Server Components):", error)
        }
      },
    },
  })
}
