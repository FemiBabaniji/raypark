"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminNetworkProps {
  communityId: string
}

export function AdminNetwork({ communityId }: AdminNetworkProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Network Settings</CardTitle>
          <CardDescription className="text-white/60">
            Manage member networking, filtering, and connection features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-white/60">Network configuration options will be displayed here.</div>
        </CardContent>
      </Card>
    </div>
  )
}
