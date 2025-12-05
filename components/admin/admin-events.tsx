"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminEventsProps {
  communityId: string
}

export function AdminEvents({ communityId }: AdminEventsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Event Management</CardTitle>
          <CardDescription className="text-white/60">
            Configure event settings, scheduling, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-white/60">Event configuration options will be displayed here.</div>
        </CardContent>
      </Card>
    </div>
  )
}
