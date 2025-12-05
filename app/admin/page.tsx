"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHome } from "@/components/admin/admin-home"
import { AdminEvents } from "@/components/admin/admin-events"
import { AdminNetwork } from "@/components/admin/admin-network"
import { AdminCohorts } from "@/components/admin/admin-cohorts"
import { AdminAnalytics } from "@/components/admin/admin-analytics"
import { AdminIntegrations } from "@/components/admin/admin-integrations"
import { AdminSettings } from "@/components/admin/admin-settings"
import { Loader2, LayoutDashboard, Activity, Users, UserCog, FileText, Settings, ShieldCheck } from "lucide-react"
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

      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Community Administration</h1>
              <p className="text-white/60 mt-1">Manage roles, permissions, and community settings</p>
            </div>
            {communities.length > 1 && (
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {communities.map((c) => (
                  <option key={c.id} value={c.id} className="bg-zinc-900">
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="home" className="gap-2">
              <LayoutDashboard className="size-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Activity className="size-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="network" className="gap-2">
              <Users className="size-4" />
              Network
            </TabsTrigger>
            <TabsTrigger value="cohorts" className="gap-2">
              <UserCog className="size-4" />
              Cohorts
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <FileText className="size-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Settings className="size-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <ShieldCheck className="size-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <AdminHome communityId={selectedCommunity} />
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <AdminEvents communityId={selectedCommunity} />
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <AdminNetwork communityId={selectedCommunity} />
          </TabsContent>

          <TabsContent value="cohorts" className="space-y-6">
            <AdminCohorts communityId={selectedCommunity} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AdminAnalytics communityId={selectedCommunity} />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <AdminIntegrations communityId={selectedCommunity} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/[0.03] border-white/10 max-w-3xl">
              <AdminSettings communityId={selectedCommunity} currentUserId={user?.id} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
