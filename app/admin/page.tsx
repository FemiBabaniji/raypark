"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoleBadge } from "@/components/admin/role-badge"
import { RoleAssignmentForm } from "@/components/admin/role-assignment-form"
import { RoleList } from "@/components/admin/role-list"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminSettings } from "@/components/admin/admin-settings"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage roles and permissions for your community</p>
          </div>
          <div className="flex items-center gap-4">
            <RoleBadge role="community_admin" />
            {communities.length > 1 && (
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background"
              >
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <AdminStats communityId={selectedCommunity} />

        <Tabs defaultValue="community-roles" className="mt-8">
          <TabsList>
            <TabsTrigger value="community-roles">Community Roles</TabsTrigger>
            <TabsTrigger value="cohort-roles">Cohort Roles</TabsTrigger>
            <TabsTrigger value="assign-role">Assign Role</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="community-roles">
            <Card>
              <CardHeader>
                <CardTitle>Community Administrators</CardTitle>
                <CardDescription>
                  Manage community-wide admin roles. Community admins have full access to all cohorts and members.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RoleList scope="community" scopeId={selectedCommunity} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cohort-roles">
            <Card>
              <CardHeader>
                <CardTitle>Cohort Administrators</CardTitle>
                <CardDescription>
                  Manage cohort-specific admin roles. Cohort admins can only manage their assigned cohort.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RoleList scope="cohort" scopeId={selectedCommunity} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assign-role">
            <Card>
              <CardHeader>
                <CardTitle>Assign New Role</CardTitle>
                <CardDescription>Grant admin roles to community members</CardDescription>
              </CardHeader>
              <CardContent>
                <RoleAssignmentForm communityId={selectedCommunity} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Community Settings</CardTitle>
                <CardDescription>Configure admin access control and security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminSettings communityId={selectedCommunity} currentUserId={user?.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
