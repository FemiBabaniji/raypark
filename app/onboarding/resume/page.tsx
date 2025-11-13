"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Sparkles, Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export default function ResumeOnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [resumeText, setResumeText] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadMode, setUploadMode] = useState<"text" | "file">("file")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError("File size must be less than 10MB")
      return
    }

    setSelectedFile(file)
    setError(null)
  }

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    const chunkSize = 0x8000 // 32KB chunks to avoid stack overflow
    let binary = ""

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length))
      binary += String.fromCharCode.apply(null, Array.from(chunk))
    }

    return btoa(binary)
  }

  const handleParse = async () => {
    if (!user) return
    if (uploadMode === "text" && !resumeText.trim()) return
    if (uploadMode === "file" && !selectedFile) return

    setIsUploading(true)
    setError(null)

    try {
      // Added detailed step-by-step logging
      console.log("[v0] ========== ONBOARDING FLOW STARTED ==========")
      console.log("[v0] Step 0: User ID:", user.id)
      console.log("[v0] Step 0: Upload mode:", uploadMode)

      if (uploadMode === "file" && selectedFile) {
        console.log("[v0] Step 1: Converting PDF to base64...")
        console.log("[v0] Step 1: File size:", selectedFile.size, "bytes")

        const arrayBuffer = await selectedFile.arrayBuffer()
        const base64 = arrayBufferToBase64(arrayBuffer)

        console.log("[v0] Step 1: Base64 conversion complete, length:", base64.length)

        // Send to API for extraction
        console.log("[v0] Step 2: Calling /api/parse-resume...")
        const parseResponse = await fetch("/api/parse-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfBase64: base64, filename: selectedFile.name }),
        })

        console.log("[v0] Step 2: Parse response status:", parseResponse.status)

        if (!parseResponse.ok) {
          const errorData = await parseResponse.json()
          console.error("[v0] Step 2: Parse failed with error:", errorData)
          throw new Error(errorData.error || "Failed to parse resume")
        }

        const parseResult = await parseResponse.json()
        console.log("[v0] Step 2: Parse result:", parseResult)

        const parsedData = parseResult.data
        console.log("[v0] Step 2: ✅ Resume parsed successfully")
        console.log("[v0] Step 2: Parsed name:", parsedData?.personalInfo?.name)

        // Create portfolio from parsed data
        console.log("[v0] Step 3: Calling /api/create-portfolio-from-resume...")
        console.log("[v0] Step 3: Sending parsedData:", JSON.stringify(parsedData, null, 2))
        console.log("[v0] Step 3: Sending userId:", user.id)

        const createResponse = await fetch("/api/create-portfolio-from-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parsedData, userId: user.id }),
        })

        console.log("[v0] Step 3: Create response status:", createResponse.status)

        if (!createResponse.ok) {
          const errorData = await createResponse.json()
          console.error("[v0] Step 3: Creation failed with error:", errorData)
          throw new Error(errorData.error || "Failed to create portfolio")
        }

        const createResult = await createResponse.json()
        console.log("[v0] Step 3: Create result:", createResult)

        const portfolioId = createResult.portfolioId
        console.log("[v0] Step 3: ✅ Portfolio created successfully:", portfolioId)

        // Redirect to BEA page
        console.log("[v0] Step 4: Redirecting to /bea...")
        router.push("/bea")
        console.log("[v0] ========== ONBOARDING FLOW COMPLETE ==========")
      } else {
        // Text mode
        console.log("[v0] Step 1: Parsing resume text, length:", resumeText.length)

        console.log("[v0] Step 2: Calling /api/parse-resume...")
        const parseResponse = await fetch("/api/parse-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: resumeText }),
        })

        console.log("[v0] Step 2: Parse response status:", parseResponse.status)

        if (!parseResponse.ok) {
          const errorData = await parseResponse.json()
          console.error("[v0] Step 2: Parse failed with error:", errorData)
          throw new Error(errorData.error || "Failed to parse resume")
        }

        const parseResult = await parseResponse.json()
        console.log("[v0] Step 2: Parse result:", parseResult)

        const parsedData = parseResult.data
        console.log("[v0] Step 2: ✅ Resume parsed successfully")
        console.log("[v0] Step 2: Parsed name:", parsedData?.personalInfo?.name)

        // Create portfolio from parsed data
        console.log("[v0] Step 3: Calling /api/create-portfolio-from-resume...")
        console.log("[v0] Step 3: Sending parsedData:", JSON.stringify(parsedData, null, 2))
        console.log("[v0] Step 3: Sending userId:", user.id)

        const createResponse = await fetch("/api/create-portfolio-from-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parsedData, userId: user.id }),
        })

        console.log("[v0] Step 3: Create response status:", createResponse.status)

        if (!createResponse.ok) {
          const errorData = await createResponse.json()
          console.error("[v0] Step 3: Creation failed with error:", errorData)
          throw new Error(errorData.error || "Failed to create portfolio")
        }

        const createResult = await createResponse.json()
        console.log("[v0] Step 3: Create result:", createResult)

        const portfolioId = createResult.portfolioId
        console.log("[v0] Step 3: ✅ Portfolio created successfully:", portfolioId)

        // Redirect to BEA page
        console.log("[v0] Step 4: Redirecting to /bea...")
        router.push("/bea")
        console.log("[v0] ========== ONBOARDING FLOW COMPLETE ==========")
      }
    } catch (err: any) {
      console.error("[v0] ❌ ONBOARDING FLOW FAILED")
      console.error("[v0] Error message:", err.message)
      console.error("[v0] Error stack:", err.stack)
      console.error("[v0] Full error object:", err)
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const isValid = uploadMode === "text" ? resumeText.trim().length > 0 : selectedFile !== null

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Create Your Portfolio</h1>
          <p className="text-white/60 text-lg">
            Upload your resume and we'll generate a beautiful portfolio automatically
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-6">
          {/* Toggle between file upload and text paste */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
            <button
              onClick={() => setUploadMode("file")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                uploadMode === "file" ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload PDF
            </button>
            <button
              onClick={() => setUploadMode("text")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                uploadMode === "text" ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
              disabled={isUploading}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Paste Text
            </button>
          </div>

          {uploadMode === "file" ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="resume-upload"
                  disabled={isUploading}
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-white/40 mb-4" />
                  <p className="text-white font-medium">
                    {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-white/40 text-sm mt-2">PDF files only, up to 10MB</p>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="resume-text" className="text-white font-medium text-sm">
                Resume Content
              </label>
              <textarea
                id="resume-text"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here...

Example:
John Doe
Software Engineer | john@example.com

EXPERIENCE
Senior Developer at Tech Corp
2020 - Present
- Led team of 5 engineers
- Built scalable microservices

EDUCATION
BS Computer Science
University of Technology
2016-2020"
                className="w-full h-96 bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none font-mono text-sm"
                disabled={isUploading}
              />
              <p className="text-white/40 text-xs">{resumeText.length} characters</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Button onClick={handleParse} disabled={!isValid || isUploading} className="w-full h-12 text-base">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Your Portfolio...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Portfolio with AI
              </>
            )}
          </Button>

          {/* Skip Option */}
          <button
            onClick={() => router.push("/bea")}
            className="w-full text-white/60 hover:text-white text-sm transition-colors"
            disabled={isUploading}
          >
            Skip for now
          </button>
        </div>

        {/* Info Section */}
        <div className="text-center text-white/40 text-sm space-y-2">
          <p>✨ AI will extract your information and create a professional portfolio</p>
          <p>🎨 You can customize colors, layout, and content after creation</p>
          <p>🔒 Your data is secure and only visible to you by default</p>
        </div>
      </div>
    </div>
  )
}
