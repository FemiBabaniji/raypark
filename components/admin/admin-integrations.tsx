"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminIntegrationsProps {
  communityId: string
}

export function AdminIntegrations({ communityId }: AdminIntegrationsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Integration Management</CardTitle>
          <CardDescription className="text-white/60">
            Configure third-party integrations and data sync settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-white/60">Integration configuration options will be displayed here.</div>
        </CardContent>
      </Card>
    </div>
  )
}
