import { NextResponse, type NextRequest } from "next/server"

// Simplified middleware that avoids the toArray() compatibility issue
export async function updateSession(request: NextRequest) {
  // Just pass through - auth will be handled at component level
  return NextResponse.next({
    request,
  })
}
