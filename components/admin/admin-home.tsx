"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminStats } from "@/components/admin/admin-stats"
import { EngagementMetricsPanel } from "@/components/admin/engagement-metrics-panel"
import { RecentActivityFeed } from "@/components/admin/recent-activity-feed"
import { AddMemberModal } from "@/components/admin/add-member-modal"
import { CreateEventModal } from "@/components/admin/create-event-modal"
import { ImportDataModal } from "@/components/admin/import-data-modal"
import { Plus, UserPlus, Upload } from "lucide-react"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"

interface AdminHomeProps {
  communityId: string
}

export function AdminHome({ communityId }: AdminHomeProps) {
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showImportData, setShowImportData] = useState(false)
  const [cohorts, setCohorts] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    const loadCohorts = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { data } = await supabase.from("cohorts").select("id, name").eq("community_id", communityId).order("name")

      if (data) {
        setCohorts(data)
      }
    }

    loadCohorts()
  }, [communityId])

  return (
    <div className="space-y-6">
      <AdminStats communityId={communityId} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-white/[0.03] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold">Quick Actions</CardTitle>
            <CardDescription className="text-white/60 text-sm">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              onClick={() => setShowCreateEvent(true)}
              className="w-full justify-center h-12 bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-600 hover:to-pink-600 text-white font-semibold border-0 shadow-lg shadow-purple-500/20 transition-all duration-200 hover:shadow-purple-500/30"
            >
              <Plus className="size-5" />
              Create New Event
            </Button>

            <Button
              onClick={() => setShowAddMember(true)}
              variant="secondary"
              className="w-full justify-center h-12 bg-white/[0.05] hover:bg-white/[0.08] text-white/90 font-medium border-white/10 transition-all duration-200"
            >
              <UserPlus className="size-5" />
              Add Member
            </Button>

            <Button
              onClick={() => setShowImportData(true)}
              variant="secondary"
              className="w-full justify-center h-12 bg-white/[0.05] hover:bg-white/[0.08] text-white/90 font-medium border-white/10 transition-all duration-200"
            >
              <Upload className="size-5" />
              Import Data
            </Button>
          </CardContent>
        </Card>

        <EngagementMetricsPanel communityId={communityId} />
      </div>

      <RecentActivityFeed communityId={communityId} className="w-full" />

      <AddMemberModal
        open={showAddMember}
        onOpenChange={setShowAddMember}
        communityId={communityId}
        cohorts={cohorts}
      />

      <CreateEventModal
        open={showCreateEvent}
        onOpenChange={setShowCreateEvent}
        communityId={communityId}
        cohorts={cohorts}
      />

      <ImportDataModal
        open={showImportData}
        onOpenChange={setShowImportData}
        communityId={communityId}
        cohorts={cohorts}
      />
    </div>
  )
}
