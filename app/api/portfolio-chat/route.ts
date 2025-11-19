import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, portfolioContext } = await req.json()

  const systemPrompt = `You are a helpful community admin assistant for ${portfolioContext.communityName || 'DMZ'}.

You're helping ${portfolioContext.userName || 'the user'} build their portfolio. Here's their current info:
- Name: ${portfolioContext.userName || 'Not set'}
- Title: ${portfolioContext.userTitle || 'Not set'}
- Bio: ${portfolioContext.userBio || 'Not set'}
- Handle: ${portfolioContext.userHandle || 'Not set'}
- Skills: ${portfolioContext.userSkills?.length > 0 ? portfolioContext.userSkills.join(', ') : 'None added'}

Your role:
- Give specific, actionable advice for improving their portfolio
- Suggest content for missing sections (bio, title, skills, projects, etc.)
- Recommend relevant skills or descriptions based on their current info
- Be encouraging, professional, and supportive
- Reference the community (${portfolioContext.communityName || 'DMZ'}) when relevant
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
