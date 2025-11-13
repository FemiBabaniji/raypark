import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Extract text from PDF
    const buffer = await file.arrayBuffer()
    const text = await extractTextFromPDF(buffer)

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. Please ensure it is a text-based PDF, not a scanned image." },
        { status: 400 },
      )
    }

    // Parse resume with OpenAI
    const { text: parsedJson } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a resume parser. Extract structured information from the following resume and return ONLY valid JSON with this exact structure (no additional text or markdown):

{
  "personalInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "website": "string",
    "summary": "string (2-3 sentence professional summary)"
  },
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "string",
      "endDate": "string or Present",
      "description": "string (brief overview)",
      "achievements": ["string array of key achievements"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string (year)",
      "endDate": "string (year)",
      "gpa": "string (optional)"
    }
  ],
  "skills": {
    "technical": ["string array"],
    "soft": ["string array"],
    "languages": ["string array"]
  },
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string array"],
      "link": "string (optional)"
    }
  ],
  "certifications": ["string array"],
  "awards": ["string array"]
}

Resume text:
${text}

Return only the JSON object, no markdown formatting or additional text.`,
    })

    // Parse the JSON response
    let parsedData
    try {
      // Remove any markdown code blocks if present
      const cleanJson = parsedJson.replace(/```json\n?|\n?```/g, "").trim()
      parsedData = JSON.parse(cleanJson)
    } catch (parseError) {
      console.error("[v0] Failed to parse AI response:", parsedJson)
      return NextResponse.json({ error: "Failed to parse resume data. Please try again." }, { status: 500 })
    }

    // Validate required fields
    if (!parsedData.personalInfo?.name) {
      return NextResponse.json(
        { error: "Could not extract name from resume. Please ensure your resume includes your name prominently." },
        { status: 400 },
      )
    }

    return NextResponse.json({ success: true, data: parsedData })
  } catch (error: any) {
    console.error("[v0] Resume parsing error:", error)
    return NextResponse.json({ error: error.message || "Failed to parse resume" }, { status: 500 })
  }
}

async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  // Simple PDF text extraction
  // In production, you'd use a library like pdf-parse or pdfjs-dist
  // For now, we'll convert buffer to string and extract visible text

  const uint8Array = new Uint8Array(buffer)
  const decoder = new TextDecoder("utf-8")
  let text = decoder.decode(uint8Array)

  // Remove PDF binary markers and extract readable text
  // This is a simplified approach - in production use proper PDF parsing
  text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, " ")
  text = text.replace(/\s+/g, " ")

  return text.trim()
}
