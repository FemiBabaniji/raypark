import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { spawn } from "child_process"

async function extractPdfText(pdfBase64: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log("[v0] 🐍 Calling Python script for PDF extraction...")

    const python = spawn("python3", ["scripts/extract_pdf_text.py"])

    let output = ""
    let errorOutput = ""

    python.stdout.on("data", (data) => {
      output += data.toString()
    })

    python.stderr.on("data", (data) => {
      errorOutput += data.toString()
      console.error("[v0] Python stderr:", data.toString())
    })

    python.on("close", (code) => {
      if (code !== 0) {
        console.error("[v0] ❌ Python script failed with code:", code)
        console.error("[v0] Error output:", errorOutput)
        reject(new Error("PDF extraction failed"))
        return
      }

      try {
        const result = JSON.parse(output)
        if (result.success) {
          console.log("[v0] ✅ PDF extracted successfully, length:", result.length)
          resolve(result.text)
        } else {
          console.error("[v0] ❌ PDF extraction failed:", result.error)
          reject(new Error(result.error))
        }
      } catch (e) {
        console.error("[v0] ❌ Failed to parse Python output:", e)
        reject(new Error("Failed to parse PDF extraction result"))
      }
    })

    // Send PDF data to Python script
    python.stdin.write(JSON.stringify({ pdf_base64: pdfBase64 }))
    python.stdin.end()
  })
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

      try {
        resumeText = await extractPdfText(pdfBase64)
        console.log("[v0] ✅ PDF extracted, text length:", resumeText.length)
      } catch (error: any) {
        console.error("[v0] ❌ PDF extraction failed:", error)
        return NextResponse.json(
          { error: "Could not extract text from PDF. Please ensure it is a text-based PDF, not a scanned image." },
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
