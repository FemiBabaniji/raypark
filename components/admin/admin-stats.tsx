"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, UserPlus, Activity } from "lucide-react"

interface AdminStatsProps {
  communityId: string
}

export function AdminStats({ communityId }: AdminStatsProps) {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalAdmins: 0,
    newMembersThisMonth: 0,
    activeMembers: 0,
  })

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient()

      const { count: memberCount } = await supabase
        .from("community_members")
        .select("*", { count: "exact", head: true })
        .eq("community_id", communityId)

      const { count: adminCount } = await supabase
        .from("user_community_roles")
        .select("*", { count: "exact", head: true })
        .eq("community_id", communityId)

      const firstDayOfMonth = new Date()
      firstDayOfMonth.setDate(1)
      firstDayOfMonth.setHours(0, 0, 0, 0)

      const { count: newMemberCount } = await supabase
        .from("community_members")
        .select("*", { count: "exact", head: true })
        .eq("community_id", communityId)
        .gte("joined_at", firstDayOfMonth.toISOString())

      const { count: activeCount } = await supabase
        .from("community_members")
        .select("*", { count: "exact", head: true })
        .eq("community_id", communityId)
        .eq("lifecycle_stage", "active")

      setStats({
        totalMembers: memberCount || 0,
        totalAdmins: adminCount || 0,
        newMembersThisMonth: newMemberCount || 0,
        activeMembers: activeCount || 0,
      })
    }

    loadStats()
  }, [communityId])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMembers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Administrators</CardTitle>
          <Shield className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAdmins}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          <UserPlus className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.newMembersThisMonth}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          <Activity className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeMembers}</div>
        </CardContent>
      </Card>
    </div>
  )
}
