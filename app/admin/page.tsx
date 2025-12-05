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
import BackButton from "@/components/ui/back-button"

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

  return (
    <div className="min-h-screen relative bg-background overflow-hidden">
      {/* Background gradient and texture layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "linear-gradient(135deg, #0d0d15 0%, #12121d 15%, #0a0a12 30%, #15152a 45%, #0f0f1a 60%, #1a1a28 75%, #0e0e16 90%, #13132a 100%)",
            filter: "blur(20px)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.008]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* BackButton in fixed position matching workspace layout */}
      <div className="fixed top-8 left-8 z-50">
        <BackButton onClick={() => router.back()} aria-label="Back" />
      </div>

      <div className="relative z-10">
        <main className="pt-20 pb-16 px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-12">Admin Portal</h1>

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
          </div>
        </main>
      </div>
    </div>
  )
}
