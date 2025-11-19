import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, portfolio, communityName } = await req.json()

  const userName = portfolio?.name || portfolio?.firstName || 'User'
  const userTitle = portfolio?.title || 'Not set'
  const userBio = portfolio?.bio || 'Not set'
  const userHandle = portfolio?.handle || 'Not set'
  const userSkills = portfolio?.skills || []

  const systemPrompt = `You are a helpful community admin assistant for ${communityName || 'DMZ'}.

You're helping ${userName} build their portfolio. Here's their current info:
- Name: ${userName}
- Title: ${userTitle}
- Bio: ${userBio}
- Handle: ${userHandle}
- Skills: ${userSkills.length > 0 ? userSkills.join(', ') : 'None added'}

Your role:
- Give specific, actionable advice for improving their portfolio
- Suggest content for missing sections (bio, title, skills, projects, etc.)
- Recommend relevant skills or descriptions based on their current info
- Be encouraging, professional, and supportive
- Reference the community (${communityName || 'DMZ'}) when relevant
- Help them understand what makes a great portfolio

Keep responses concise (2-4 sentences unless asked for more detail). Be conversational and friendly.`

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
  })

  return result.toUIMessageStreamResponse()
}
