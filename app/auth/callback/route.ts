import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/onboarding/bea"

  console.log("[v0] Auth callback - code present:", !!code)
  console.log("[v0] Auth callback - redirect to:", next)

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log("[v0] Auth callback - exchange result:", {
      hasSession: !!data.session,
      hasUser: !!data.user,
      userId: data.user?.id,
      error: error?.message,
    })

    if (!error && data.session) {
      console.log("[v0] Auth callback - session established, redirecting to:", next)

      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      console.log("[v0] Auth callback - failed to establish session:", error?.message)
    }
  }

  console.log("[v0] Auth callback - authentication failed, redirecting to error page")
  return NextResponse.redirect(`${origin}/auth?error=Could not authenticate user`)
}
