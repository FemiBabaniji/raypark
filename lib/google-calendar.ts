import { google } from 'googleapis'

export async function refreshAccessToken(refreshToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  oauth2Client.setCredentials({ refresh_token: refreshToken })

  try {
    const { credentials } = await oauth2Client.refreshAccessToken()
    return credentials.access_token
  } catch (error) {
    console.error('Error refreshing access token:', error)
    throw error
  }
}

export async function createGoogleCalendarClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })
  
  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/google/auth/callback`
  )
}
