"use client"

import type React from "react"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface AddMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  communityId: string
  cohorts?: Array<{ id: string; name: string }>
}

export function AddMemberModal({ open, onOpenChange, communityId, cohorts = [] }: AddMemberModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [selectedCohort, setSelectedCohort] = useState<string>("")
  const [lifecycleStage, setLifecycleStage] = useState<string>("new")

  const resetForm = () => {
    setFullName("")
    setEmail("")
    setSelectedCohort("")
    setLifecycleStage("new")
    setError(null)
    setSuccess(false)
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required")
      return
    }

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      // Check if user already exists by email
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", email.toLowerCase().trim())
        .maybeSingle()

      let userId = existingUser?.id

      // If user doesn't exist, create a placeholder user record
      if (!userId) {
        const { data: newUser, error: userError } = await supabase
          .from("users")
          .insert({
            email: email.toLowerCase().trim(),
            full_name: fullName.trim(),
          })
          .select("id")
          .single()

        if (userError) {
          console.error("[v0] Error creating user:", userError)
          throw new Error("Failed to create user record")
        }

        userId = newUser.id
      }

      // Check if user is already a member of this community
      const { data: existingMember } = await supabase
        .from("community_members")
        .select("id")
        .eq("user_id", userId)
        .eq("community_id", communityId)
        .maybeSingle()

      if (existingMember) {
        setError("This user is already a member of the community")
        setLoading(false)
        return
      }

      // Add user to community
      const { error: memberError } = await supabase.from("community_members").insert({
        user_id: userId,
        community_id: communityId,
        lifecycle_stage: lifecycleStage,
        joined_at: new Date().toISOString(),
        metadata: {
          added_by_admin: true,
        },
      })

      if (memberError) {
        console.error("[v0] Error adding member:", memberError)
        throw new Error("Failed to add member to community")
      }

      // Add to cohort if selected
      if (selectedCohort) {
        const { error: cohortError } = await supabase.from("cohort_members").insert({
          user_id: userId,
          cohort_id: selectedCohort,
          joined_at: new Date().toISOString(),
        })

        if (cohortError) {
          console.error("[v0] Error adding to cohort:", cohortError)
          // Don't fail the whole operation if cohort add fails
        }
      }

      // Create a portfolio for the new member
      try {
        const portfolioSlug = `${fullName.toLowerCase().replace(/\s+/g, "-")}-${userId.slice(0, 8)}`

        const { error: portfolioError } = await supabase.from("portfolios").insert({
          user_id: userId,
          community_id: communityId,
          name: `${fullName}'s Portfolio`,
          slug: portfolioSlug,
          description: `${fullName}'s portfolio`,
          is_public: false,
        })

        if (portfolioError) {
          console.error("[v0] Error creating portfolio:", portfolioError)
          // Don't fail the whole operation if portfolio creation fails
        }
      } catch (portfolioErr) {
        console.error("[v0] Portfolio creation error:", portfolioErr)
      }

      setSuccess(true)
      setTimeout(() => {
        handleClose()
        // Trigger a refresh of the member list
        window.location.reload()
      }, 1500)
    } catch (err) {
      console.error("[v0] Add member error:", err)
      setError(err instanceof Error ? err.message : "Failed to add member")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1a1a1d] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Member</DialogTitle>
          <DialogDescription className="text-white/60">
            Add a new member to your community. They will receive an invitation email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white/90">
              Full Name *
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              disabled={loading}
              className="bg-white/[0.05] border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/90">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              disabled={loading}
              className="bg-white/[0.05] border-white/10 text-white"
            />
          </div>

          {cohorts.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="cohort" className="text-white/90">
                Cohort (Optional)
              </Label>
              <Select value={selectedCohort} onValueChange={setSelectedCohort} disabled={loading}>
                <SelectTrigger className="bg-white/[0.05] border-white/10 text-white">
                  <SelectValue placeholder="Select a cohort" />
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
          )}

          <div className="space-y-2">
            <Label htmlFor="lifecycle" className="text-white/90">
              Lifecycle Stage
            </Label>
            <Select value={lifecycleStage} onValueChange={setLifecycleStage} disabled={loading}>
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
                <SelectItem value="at_risk" className="text-white">
                  At Risk
                </SelectItem>
                <SelectItem value="dormant" className="text-white">
                  Dormant
                </SelectItem>
                <SelectItem value="alumni" className="text-white">
                  Alumni
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
              <p className="text-green-400 text-sm">Member added successfully!</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="bg-white/[0.05] hover:bg-white/[0.08] text-white border-white/10"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
