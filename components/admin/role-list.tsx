"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { RoleBadge } from "@/components/admin/role-badge"
import { Loader2, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { UserCommunityRole, UserCohortRole } from "@/types/admin"

interface RoleListProps {
  scope: "community" | "cohort"
  scopeId: string
}

export function RoleList({ scope, scopeId }: RoleListProps) {
  const [roles, setRoles] = useState<(UserCommunityRole | UserCohortRole)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRoles = async () => {
    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (scope === "community") {
        const { data, error: queryError } = await supabase
          .from("user_community_roles")
          .select("*, users(full_name, email)")
          .eq("community_id", scopeId)
          .or("expires_at.is.null,expires_at.gt.now()")
          .order("assigned_at", { ascending: false })

        if (queryError) throw queryError
        setRoles(data || [])
      } else {
        const { data: cohortData, error: cohortError } = await supabase
          .from("cohorts")
          .select("id")
          .eq("community_id", scopeId)

        if (cohortError) throw cohortError

        const cohortIds = cohortData.map((c) => c.id)

        const { data, error: queryError } = await supabase
          .from("user_cohort_roles")
          .select("*, users(full_name, email), cohorts(name)")
          .in("cohort_id", cohortIds)
          .or("expires_at.is.null,expires_at.gt.now()")
          .order("assigned_at", { ascending: false })

        if (queryError) throw queryError
        setRoles(data || [])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoles()
  }, [scope, scopeId])

  const handleRevoke = async (roleId: string) => {
    if (!confirm("Are you sure you want to revoke this role?")) return

    try {
      const response = await fetch("/api/admin/roles/revoke", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId, scope }),
      })

      if (response.ok) {
        loadRoles()
      } else {
        const result = await response.json()
        setError(result.error || "Failed to revoke role")
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (roles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No {scope} roles assigned yet. Use the "Assign Role" tab to add administrators.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {roles.map((role: any) => (
        <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium">{role.users?.full_name || "Unknown User"}</p>
                <p className="text-sm text-muted-foreground">{role.users?.email}</p>
              </div>
              <RoleBadge role={role.role} />
            </div>
            {scope === "cohort" && role.cohorts && (
              <p className="text-sm text-muted-foreground mt-2">Cohort: {role.cohorts.name}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Assigned {new Date(role.assigned_at).toLocaleDateString()}
              {role.expires_at && ` • Expires ${new Date(role.expires_at).toLocaleDateString()}`}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => handleRevoke(role.id)}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  )
}
