"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleAssignmentForm } from "@/components/admin/role-assignment-form"
import { RoleList } from "@/components/admin/role-list"

interface AdminAssignmentsProps {
  communityId: string
}

export function AdminAssignments({ communityId }: AdminAssignmentsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="bg-white/[0.03] border-white/10 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-white">Assign Admin Role</CardTitle>
          <CardDescription className="text-white/60">Grant admin access to community members</CardDescription>
        </CardHeader>
        <CardContent>
          <RoleAssignmentForm communityId={communityId} />
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-white/[0.03] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Community Administrators</CardTitle>
            <CardDescription className="text-white/60">
              Manage community-wide admin roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoleList scope="community" scopeId={communityId} />
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Cohort Administrators</CardTitle>
            <CardDescription className="text-white/60">Manage cohort-specific admin roles</CardDescription>
          </CardHeader>
          <CardContent>
            <RoleList scope="cohort" scopeId={communityId} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
