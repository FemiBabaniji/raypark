"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createBrowserClient } from "@supabase/ssr"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, FileSpreadsheet, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImportDataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  communityId: string
  cohorts?: Array<{ id: string; name: string }>
}

interface ParsedMember {
  fullName: string
  email: string
  cohortName?: string
  lifecycleStage?: string
  row: number
}

export function ImportDataModal({ open, onOpenChange, communityId, cohorts = [] }: ImportDataModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedMember[]>([])
  const [importProgress, setImportProgress] = useState<{ current: number; total: number } | null>(null)
  const [defaultCohort, setDefaultCohort] = useState<string>("")
  const [defaultLifecycleStage, setDefaultLifecycleStage] = useState<string>("new")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetForm = () => {
    setFile(null)
    setParsedData([])
    setImportProgress(null)
    setDefaultCohort("")
    setDefaultLifecycleStage("new")
    setError(null)
    setSuccess(false)
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = async (selectedFile: File) => {
    setError(null)

    // Validate file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      return
    }

    setFile(selectedFile)

    // Parse CSV
    try {
      const text = await selectedFile.text()
      const lines = text.split("\n").filter((line) => line.trim())

      if (lines.length < 2) {
        setError("CSV file must contain headers and at least one data row")
        return
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

      // Find column indexes
      const nameIndex = headers.findIndex((h) => h.includes("name"))
      const emailIndex = headers.findIndex((h) => h.includes("email"))
      const cohortIndex = headers.findIndex((h) => h.includes("cohort"))
      const stageIndex = headers.findIndex((h) => h.includes("stage") || h.includes("lifecycle"))

      if (nameIndex === -1 || emailIndex === -1) {
        setError("CSV must contain 'name' and 'email' columns")
        return
      }

      const members: ParsedMember[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim())

        if (values[emailIndex]) {
          members.push({
            fullName: values[nameIndex] || "",
            email: values[emailIndex] || "",
            cohortName: cohortIndex !== -1 ? values[cohortIndex] : undefined,
            lifecycleStage: stageIndex !== -1 ? values[stageIndex] : undefined,
            row: i + 1,
          })
        }
      }

      setParsedData(members)
    } catch (err) {
      console.error("[v0] CSV parsing error:", err)
      setError("Failed to parse CSV file")
    }
  }

  const handleImport = async () => {
    if (parsedData.length === 0) {
      setError("No data to import")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)
    setImportProgress({ current: 0, total: parsedData.length })

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      let successCount = 0
      let errorCount = 0
      const errors: string[] = []

      for (let i = 0; i < parsedData.length; i++) {
        const member = parsedData[i]
        setImportProgress({ current: i + 1, total: parsedData.length })

        try {
          // Check if user exists
          const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", member.email.toLowerCase())
            .maybeSingle()

          let userId = existingUser?.id

          // Create user if doesn't exist
          if (!userId) {
            const { data: newUser, error: userError } = await supabase
              .from("users")
              .insert({
                email: member.email.toLowerCase(),
                full_name: member.fullName,
              })
              .select("id")
              .single()

            if (userError) {
              errors.push(`Row ${member.row}: Failed to create user - ${userError.message}`)
              errorCount++
              continue
            }

            userId = newUser.id
          }

          // Check if already a member
          const { data: existingMember } = await supabase
            .from("community_members")
            .select("id")
            .eq("user_id", userId)
            .eq("community_id", communityId)
            .maybeSingle()

          if (existingMember) {
            errors.push(`Row ${member.row}: User already a member`)
            errorCount++
            continue
          }

          // Add to community
          const lifecycleStage = member.lifecycleStage?.toLowerCase() || defaultLifecycleStage
          const { error: memberError } = await supabase.from("community_members").insert({
            user_id: userId,
            community_id: communityId,
            lifecycle_stage: lifecycleStage,
            joined_at: new Date().toISOString(),
            metadata: { imported: true },
          })

          if (memberError) {
            errors.push(`Row ${member.row}: Failed to add member - ${memberError.message}`)
            errorCount++
            continue
          }

          // Add to cohort if specified
          const cohortId = defaultCohort || cohorts.find((c) => c.name === member.cohortName)?.id
          if (cohortId) {
            await supabase.from("cohort_members").insert({
              user_id: userId,
              cohort_id: cohortId,
              joined_at: new Date().toISOString(),
            })
          }

          // Create portfolio
          const portfolioSlug = `${member.fullName.toLowerCase().replace(/\s+/g, "-")}-${userId.slice(0, 8)}`
          await supabase.from("portfolios").insert({
            user_id: userId,
            community_id: communityId,
            name: `${member.fullName}'s Portfolio`,
            slug: portfolioSlug,
            is_public: false,
          })

          successCount++
        } catch (err) {
          console.error(`[v0] Error importing row ${member.row}:`, err)
          errors.push(`Row ${member.row}: ${err instanceof Error ? err.message : "Unknown error"}`)
          errorCount++
        }
      }

      setImportProgress(null)

      if (successCount > 0) {
        setSuccess(true)
        setTimeout(() => {
          handleClose()
          window.location.reload()
        }, 2000)
      }

      if (errorCount > 0) {
        setError(`Imported ${successCount} members successfully. ${errorCount} errors occurred.`)
      }
    } catch (err) {
      console.error("[v0] Import error:", err)
      setError(err instanceof Error ? err.message : "Failed to import data")
      setImportProgress(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a1a1d] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Import Member Data</DialogTitle>
          <DialogDescription className="text-white/60">
            Upload a CSV file with member information to bulk import.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          {!file && (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                dragActive ? "border-purple-500 bg-purple-500/10" : "border-white/10 hover:border-white/20",
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-12 mx-auto mb-4 text-white/40" />
              <p className="text-white/80 font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-white/50 text-sm">
                CSV file with columns: name, email, cohort (optional), lifecycle_stage (optional)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,application/vnd.ms-excel"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          )}

          {/* File Selected */}
          {file && (
            <div className="flex items-center gap-3 p-4 bg-white/[0.05] border border-white/10 rounded-lg">
              <FileSpreadsheet className="size-8 text-green-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{file.name}</p>
                <p className="text-white/60 text-sm">{parsedData.length} members found</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setFile(null)
                  setParsedData([])
                }}
                disabled={loading}
                className="flex-shrink-0"
              >
                <X className="size-4" />
              </Button>
            </div>
          )}

          {/* Configuration */}
          {parsedData.length > 0 && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-white/90">Default Cohort (Optional)</Label>
                <Select value={defaultCohort} onValueChange={setDefaultCohort} disabled={loading}>
                  <SelectTrigger className="bg-white/[0.05] border-white/10 text-white">
                    <SelectValue placeholder="No default cohort" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1d] border-white/10">
                    {cohorts.map((cohort) => (
                      <SelectItem key={cohort.id} value={cohort.id} className="text-white">
                        {cohort.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/90">Default Lifecycle Stage</Label>
                <Select value={defaultLifecycleStage} onValueChange={setDefaultLifecycleStage} disabled={loading}>
                  <SelectTrigger className="bg-white/[0.05] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1d] border-white/10">
                    <SelectItem value="new" className="text-white">
                      New
                    </SelectItem>
                    <SelectItem value="active" className="text-white">
                      Active
                    </SelectItem>
                    <SelectItem value="engaged" className="text-white">
                      Engaged
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Progress */}
          {importProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Importing members...</span>
                <span className="text-white/60">
                  {importProgress.current} / {importProgress.total}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                  style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
              <p className="text-green-400 text-sm">Members imported successfully!</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
            className="bg-white/[0.05] hover:bg-white/[0.08] text-white border-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={loading || parsedData.length === 0}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Importing..." : `Import ${parsedData.length} Members`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
