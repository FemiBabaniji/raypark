"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminAnalyticsProps {
  communityId: string
}

export function AdminAnalytics({ communityId }: AdminAnalyticsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Analytics Configuration</CardTitle>
          <CardDescription className="text-white/60">
            Configure custom analytics, KPI tracking, and reporting features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-white/60">Analytics configuration options will be displayed here.</div>
        </CardContent>
      </Card>
    </div>
  )
}
