import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

async function extractPdfText(pdfBase64: string): Promise<string> {
  try {
    console.log("[v0] 📄 Extracting text from PDF using Node.js library...")

    // Dynamic import of pdf-parse
    const pdfParse = (await import("pdf-parse")).default

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, "base64")
    console.log("[v0] 📄 PDF buffer size:", pdfBuffer.length, "bytes")

    // Parse PDF
    const data = await pdfParse(pdfBuffer)

    console.log("[v0] ✅ PDF parsed successfully")
    console.log("[v0] 📄 Pages:", data.numpages)
    console.log("[v0] 📄 Text length:", data.text.length)

    return data.text
  } catch (error: any) {
    console.error("[v0] ❌ PDF parsing failed:", error.message)
    throw new Error("Could not extract text from PDF. Please ensure it is a text-based PDF, not a scanned image.")
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] ========== RESUME PARSING STARTED ==========")

    const body = await request.json()
    const { text, pdfBase64, filename } = body

    let resumeText = ""

    if (pdfBase64) {
      console.log("[v0] 📄 PDF file received:", filename)
      console.log("[v0] 📄 Base64 length:", pdfBase64.length)

      const estimatedSizeMB = (pdfBase64.length * 0.75) / (1024 * 1024)
      console.log("[v0] 📄 Estimated PDF size:", estimatedSizeMB.toFixed(2), "MB")

      if (estimatedSizeMB > 10) {
        return NextResponse.json(
          { error: "PDF file is too large. Please use a file smaller than 10MB." },
          { status: 400 },
        )
      }

      try {
        resumeText = await extractPdfText(pdfBase64)
        console.log("[v0] ✅ PDF extracted, text length:", resumeText.length)
      } catch (error: any) {
        console.error("[v0] ❌ PDF extraction failed:", error)
        return NextResponse.json(
          { error: error.message || "Could not extract text from PDF. Please try pasting your resume text instead." },
          { status: 400 },
        )
      }
    } else if (text) {
      resumeText = text
      console.log("[v0] 📝 Text received, length:", resumeText.length)
    } else {
      console.log("[v0] ❌ No text or PDF provided")
      return NextResponse.json({ error: "No resume text or PDF provided" }, { status: 400 })
    }

    console.log("[v0] 📝 First 500 characters:")
    console.log(resumeText.substring(0, 500))

    if (resumeText.trim().length < 50) {
      console.log("[v0] ❌ Text too short")
      return NextResponse.json({ error: "Resume text is too short. Please provide more information." }, { status: 400 })
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
${resumeText}

Return only the JSON object, no markdown formatting or additional text.`,
    })

    console.log("[v0] ✅ OpenAI response received")
    console.log("[v0] 📄 Raw AI response:")
    console.log(parsedJson)

    let parsedData
    try {
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
