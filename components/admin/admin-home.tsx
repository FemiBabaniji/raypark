"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminStats } from "@/components/admin/admin-stats"
import { UserPlus, Settings, FileText, UserCog } from "lucide-react"

interface AdminHomeProps {
  communityId: string
}

export function AdminHome({ communityId }: AdminHomeProps) {
  return (
    <div className="space-y-6">
      <AdminStats communityId={communityId} />

      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserCog className="size-5" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-white/60">Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="w-full justify-start h-auto py-4" variant="secondary">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <UserPlus className="size-4" />
                <span className="font-medium">Assign Admin Role</span>
              </div>
              <span className="text-xs text-white/60">Grant admin access to members</span>
            </div>
          </Button>
          <Button className="w-full justify-start h-auto py-4 bg-transparent" variant="outline">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <Settings className="size-4" />
                <span className="font-medium">Configure Access</span>
              </div>
              <span className="text-xs text-white/60">Manage restriction settings</span>
            </div>
          </Button>
          <Button className="w-full justify-start h-auto py-4 bg-transparent" variant="outline">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <FileText className="size-4" />
                <span className="font-medium">View Audit Log</span>
              </div>
              <span className="text-xs text-white/60">Track admin activities</span>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
