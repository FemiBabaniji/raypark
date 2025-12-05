"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHome } from "@/components/admin/admin-home"
import { AdminEvents } from "@/components/admin/admin-events"
import { AdminNetwork } from "@/components/admin/admin-network"
import { AdminCohorts } from "@/components/admin/admin-cohorts"
import { AdminAnalytics } from "@/components/admin/admin-analytics"
import { AdminIntegrations } from "@/components/admin/admin-integrations"
import { AdminSettings } from "@/components/admin/admin-settings"
import { AdminAssignments } from "@/components/admin/admin-assignments"
import {
  Loader2,
  LayoutDashboard,
  Calendar,
  Users,
  GraduationCap,
  UserCheck,
  BarChart3,
  Puzzle,
  Settings,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import EventsHeader from "@/components/events-header"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [communities, setCommunities] = useState<any[]>([])
  const [selectedCommunity, setSelectedCommunity] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const { isAdmin, isLoading: roleLoading } = useIsAdmin(selectedCommunity)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push("/auth")
        return
      }

      setUser(authUser)

      const { data: memberCommunities } = await supabase
        .from("community_members")
        .select("community_id, communities(id, name, code)")
        .eq("user_id", authUser.id)

      const communitiesList = (memberCommunities || []).map((m: any) => m.communities).filter(Boolean)

      setCommunities(communitiesList)

      if (communitiesList.length > 0) {
        setSelectedCommunity(communitiesList[0].id)
      }

      setLoading(false)
    }

    loadUser()
  }, [router])

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!selectedCommunity) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Alert>
          <AlertDescription>You are not a member of any communities. Please join a community first.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Alert>
          <AlertDescription>
            You do not have admin access to this community. Contact a community admin for assistance.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const selectedCommunityData = communities.find((c) => c.id === selectedCommunity)

  return (
    <div className="min-h-screen bg-background">
      <EventsHeader
        communityName={selectedCommunityData?.code || "BEA"}
        showRightColumn={false}
        onToggleRightColumn={() => {}}
        activeTab="Admin"
      />

      <main className="max-w-[1400px] mx-auto px-8 py-8">
        <Tabs defaultValue="home" className="space-y-6">
          <TabsList>
            <TabsTrigger value="home">
              <LayoutDashboard className="size-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="size-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="network">
              <Users className="size-4" />
              Network
            </TabsTrigger>
            <TabsTrigger value="cohorts">
              <GraduationCap className="size-4" />
              Cohorts
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <UserCheck className="size-4" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="size-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Puzzle className="size-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="size-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <AdminHome communityId={selectedCommunity} />
          </TabsContent>

          <TabsContent value="events">
            <AdminEvents communityId={selectedCommunity} />
          </TabsContent>

          <TabsContent value="network">
            <AdminNetwork communityId={selectedCommunity} />
          </TabsContent>

          <TabsContent value="cohorts">
            <AdminCohorts communityId={selectedCommunity} />
          </TabsContent>

          <TabsContent value="assignments">
            <AdminAssignments communityId={selectedCommunity} />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics communityId={selectedCommunity} />
          </TabsContent>

          <TabsContent value="integrations">
            <AdminIntegrations communityId={selectedCommunity} />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings communityId={selectedCommunity} currentUserId={user?.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
