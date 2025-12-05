"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import type { CommunityRole, CohortRole } from "@/types/admin"

interface RoleAssignmentFormProps {
  communityId: string
}

export function RoleAssignmentForm({ communityId }: RoleAssignmentFormProps) {
  const [userEmail, setUserEmail] = useState("")
  const [role, setRole] = useState<CommunityRole | CohortRole>("moderator")
  const [scope, setScope] = useState<"community" | "cohort">("community")
  const [cohortId, setCohortId] = useState("")
  const [cohorts, setCohorts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleScopeChange = async (newScope: "community" | "cohort") => {
    setScope(newScope)
    if (newScope === "cohort") {
      const supabase = createClient()
      const { data } = await supabase.from("cohorts").select("id, name").eq("community_id", communityId)
      setCohorts(data || [])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()

      const { data: users } = await supabase.from("users").select("id").eq("email", userEmail).maybeSingle()

      if (!users) {
        setMessage({ type: "error", text: "User not found with that email" })
        setLoading(false)
        return
      }

      const response = await fetch("/api/admin/roles/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: users.id,
          role,
          scope,
          scopeId: scope === "community" ? communityId : cohortId,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: `Successfully assigned ${role} role to ${userEmail}` })
        setUserEmail("")
        setRole("moderator")
      } else {
        setMessage({ type: "error", text: result.error || "Failed to assign role" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while assigning the role" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">User Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="user@example.com"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scope">Scope</Label>
        <Select value={scope} onValueChange={handleScopeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="community">Community-wide</SelectItem>
            <SelectItem value="cohort">Specific Cohort</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {scope === "cohort" && (
        <div className="space-y-2">
          <Label htmlFor="cohort">Cohort</Label>
          <Select value={cohortId} onValueChange={setCohortId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a cohort" />
            </SelectTrigger>
            <SelectContent>
              {cohorts.map((cohort) => (
                <SelectItem key={cohort.id} value={cohort.id}>
                  {cohort.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={(v) => setRole(v as CommunityRole | CohortRole)} required>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {scope === "community" ? (
              <>
                <SelectItem value="community_admin">Community Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="content_manager">Content Manager</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="cohort_admin">Cohort Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="event_coordinator">Event Coordinator</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Assigning...
          </>
        ) : (
          "Assign Role"
        )}
      </Button>
    </form>
  )
}
