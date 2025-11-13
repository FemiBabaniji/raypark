import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] ========== RESUME PARSING STARTED ==========")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("[v0] ❌ No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] 📄 File received:", {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    // Extract text from PDF
    const buffer = await file.arrayBuffer()
    console.log("[v0] 📦 Buffer size:", buffer.byteLength)

    const text = await extractTextFromPDF(buffer)

    console.log("[v0] 📝 Extracted text length:", text.length)
    console.log("[v0] 📝 First 500 characters of extracted text:")
    console.log(text.substring(0, 500))

    if (!text || text.trim().length < 50) {
      console.log("[v0] ❌ Text too short or empty")
      return NextResponse.json(
        { error: "Could not extract text from PDF. Please ensure it is a text-based PDF, not a scanned image." },
        { status: 400 },
      )
    }

    console.log("[v0] 🤖 Sending to OpenAI for parsing...")

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

    console.log("[v0] ✅ OpenAI response received")
    console.log("[v0] 📄 Raw AI response:")
    console.log(parsedJson)

    // Parse the JSON response
    let parsedData
    try {
      // Remove any markdown code blocks if present
      const cleanJson = parsedJson.replace(/```json\n?|\n?```/g, "").trim()
      parsedData = JSON.parse(cleanJson)

      console.log("[v0] ✅ Successfully parsed JSON")
      console.log("[v0] 📊 Parsed data structure:")
      console.log(JSON.stringify(parsedData, null, 2))
    } catch (parseError) {
      console.error("[v0] ❌ Failed to parse AI response as JSON:", parseError)
      console.error("[v0] Raw response was:", parsedJson)
      return NextResponse.json({ error: "Failed to parse resume data. Please try again." }, { status: 500 })
    }

    // Validate required fields
    if (!parsedData.personalInfo?.name) {
      console.log("[v0] ❌ No name found in parsed data")
      return NextResponse.json(
        { error: "Could not extract name from resume. Please ensure your resume includes your name prominently." },
        { status: 400 },
      )
    }

    console.log("[v0] ✅ Validation passed. Name found:", parsedData.personalInfo.name)
    console.log("[v0] ========== RESUME PARSING COMPLETE ==========")

    return NextResponse.json({ success: true, data: parsedData })
  } catch (error: any) {
    console.error("[v0] ❌ Resume parsing error:", error)
    console.error("[v0] Error stack:", error.stack)
    return NextResponse.json({ error: error.message || "Failed to parse resume" }, { status: 500 })
  }
}

async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  const uint8Array = new Uint8Array(buffer)
  let text = ""

  // Try UTF-8 decoding first
  try {
    const decoder = new TextDecoder("utf-8")
    text = decoder.decode(uint8Array)
  } catch {
    // Fallback to latin1 if UTF-8 fails
    const decoder = new TextDecoder("latin1")
    text = decoder.decode(uint8Array)
  }

  // Extract text between PDF stream objects
  // PDF format stores text in content streams
  const textMatches = text.match(/$$([^)]+)$$/g) || []
  const extractedText = textMatches.map((match) => match.replace(/[()]/g, "")).join(" ")

  // Also extract text after "Tj" operators (text showing commands)
  const tjMatches = text.match(/\[([^\]]+)\]\s*TJ/g) || []
  const tjText = tjMatches.map((match) => match.replace(/[[\]]/g, "").replace(/TJ/g, "")).join(" ")

  // Combine both extraction methods
  const combinedText = (extractedText + " " + tjText)
    .replace(/[\x00-\x1F\x7F-\x9F]/g, " ") // Remove control characters
    .replace(/\\[nrt]/g, " ") // Remove escape sequences
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()

  console.log("[v0] 📝 Extracted text preview:", combinedText.substring(0, 200))

  return combinedText
}
