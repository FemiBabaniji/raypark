import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/onboarding/bea"

  console.log("[v0] Auth callback - code:", code ? "present" : "missing")
  console.log("[v0] Auth callback - next:", next)

  if (code) {
    const supabase = await createClient()

    console.log("[v0] Exchanging code for session...")
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log("[v0] Exchange result - error:", error)
    console.log("[v0] Exchange result - session exists:", !!data.session)
    console.log("[v0] Exchange result - user:", data.session?.user?.email)

    if (!error && data.session) {
      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"

      console.log("[v0] Session created successfully, redirecting to:", next)
      console.log("[v0] Environment - isLocalEnv:", isLocalEnv)
      console.log("[v0] Environment - forwardedHost:", forwardedHost)

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }

    console.error("[v0] Failed to exchange code for session:", error)
  }

  console.error("[v0] No code provided or authentication failed, redirecting to auth page")
  return NextResponse.redirect(`${origin}/auth?error=Could not authenticate user`)
}
