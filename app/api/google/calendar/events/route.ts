import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

async function getValidAccessToken(userId: string, supabase: any) {
  const { data: tokenData, error } = await supabase
    .from("google_calendar_tokens")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error || !tokenData) {
    throw new Error("Google Calendar not connected")
  }

  // Check if token is expired
  if (new Date(tokenData.expires_at) <= new Date()) {
    // Refresh the token
    const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: tokenData.refresh_token,
        grant_type: "refresh_token",
      }),
    })

    if (!refreshResponse.ok) {
      throw new Error("Failed to refresh token")
    }

    const newTokens = await refreshResponse.json()

    // Update tokens in database
    await supabase.from("google_calendar_tokens").update({
      access_token: newTokens.access_token,
      expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("user_id", userId)

    return newTokens.access_token
  }

  return tokenData.access_token
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, startTime, endTime, timezone = "UTC", portfolioId } = body

    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get valid access token
    const accessToken = await getValidAccessToken(user.id, supabase)

    // Create Google Calendar event with Google Meet
    const calendarEvent = {
      summary: title,
      description: description || "",
      start: {
        dateTime: startTime,
        timeZone: timezone,
      },
      end: {
        dateTime: endTime,
        timeZone: timezone,
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    }

    const googleResponse = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(calendarEvent),
      }
    )

    if (!googleResponse.ok) {
      const errorText = await googleResponse.text()
      console.error("[v0] Google Calendar API error:", errorText)
      return NextResponse.json(
        { error: "Failed to create calendar event" },
        { status: 500 }
      )
    }

    const googleEvent = await googleResponse.json()

    // Store meeting in our database
    const { data: meeting, error: dbError } = await supabase
      .from("meetings")
      .insert({
        user_id: user.id,
        portfolio_id: portfolioId,
        title,
        description,
        start_time: startTime,
        end_time: endTime,
        timezone,
        google_calendar_event_id: googleEvent.id,
        google_meet_link: googleEvent.hangoutLink,
        visibility: "public",
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Failed to store meeting:", dbError)
      return NextResponse.json(
        { error: "Failed to store meeting" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      meeting,
      googleMeetLink: googleEvent.hangoutLink,
    })
  } catch (error: any) {
    console.error("[v0] Create meeting error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create meeting" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get("portfolioId")

    let query = supabase
      .from("meetings")
      .select("*")
      .eq("user_id", user.id)
      .order("start_time", { ascending: true })

    if (portfolioId) {
      query = query.eq("portfolio_id", portfolioId)
    }

    const { data: meetings, error } = await query

    if (error) {
      console.error("[v0] Failed to fetch meetings:", error)
      return NextResponse.json(
        { error: "Failed to fetch meetings" },
        { status: 500 }
      )
    }

    return NextResponse.json({ meetings })
  } catch (error) {
    console.error("[v0] Fetch meetings error:", error)
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    )
  }
}
