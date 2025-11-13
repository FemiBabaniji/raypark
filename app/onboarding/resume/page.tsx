"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export default function ResumeOnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.includes("pdf") && !selectedFile.name.endsWith(".pdf")) {
        setError("Please upload a PDF file")
        return
      }

      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file || !user) return

    setIsUploading(true)
    setError(null)

    try {
      // Extract text from PDF
      const formData = new FormData()
      formData.append("file", file)

      const parseResponse = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      })

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json()
        throw new Error(errorData.error || "Failed to parse resume")
      }

      const { data: parsedData } = await parseResponse.json()

      // Create portfolio from parsed data
      const createResponse = await fetch("/api/create-portfolio-from-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData, userId: user.id }),
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        throw new Error(errorData.error || "Failed to create portfolio")
      }

      const { portfolioId } = await createResponse.json()

      // Redirect to BEA page
      router.push("/bea")
    } catch (err: any) {
      console.error("[v0] Resume upload failed:", err)
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Create Your Portfolio</h1>
          <p className="text-white/60 text-lg">
            Upload your resume and we'll automatically generate a beautiful portfolio for you
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              file ? "border-green-500/50 bg-green-500/5" : "border-white/20 hover:border-white/40 bg-white/5"
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
              disabled={isUploading}
            />
            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-4">
              {file ? (
                <>
                  <FileText className="w-16 h-16 text-green-500" />
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-white/60 text-sm mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      setFile(null)
                    }}
                    disabled={isUploading}
                  >
                    Choose Different File
                  </Button>
                </>
              ) : (
                <>
                  <Upload className="w-16 h-16 text-white/40" />
                  <div>
                    <p className="text-white font-medium">Drop your resume here or click to upload</p>
                    <p className="text-white/60 text-sm mt-1">PDF only, max 5MB</p>
                  </div>
                </>
              )}
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Upload Button */}
          <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full h-12 text-base">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Your Portfolio...
              </>
            ) : (
              "Generate Portfolio"
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
