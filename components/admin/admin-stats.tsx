"use client"

import { useEffect, useState } from "react"
import { EnhancedMetricCard } from "./enhanced-metric-card"
import { Users, Calendar, Activity, GraduationCap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AdminStatsProps {
  communityId: string
}

interface MetricData {
  value: number
  trend: number | null
  trendType: "up" | "down" | "neutral"
}

interface MetricsResponse {
  totalMembers: MetricData
  activeEvents: MetricData
  avgEngagement: MetricData
  cohortsActive: MetricData
}

export function AdminStats({ communityId }: AdminStatsProps) {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMetrics() {
      try {
        const supabase = createClient()

        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        // 1. Total Members with trend
        const { count: currentMemberCount } = await supabase
          .from("community_members")
          .select("*", { count: "exact", head: true })
          .eq("community_id", communityId)

        const { count: previousMemberCount } = await supabase
          .from("community_members")
          .select("*", { count: "exact", head: true })
          .eq("community_id", communityId)
          .lt("joined_at", thirtyDaysAgo.toISOString())

        const memberTrend =
          previousMemberCount && previousMemberCount > 0
            ? Math.round((((currentMemberCount || 0) - previousMemberCount) / previousMemberCount) * 100)
            : 0

        // 2. Active Events with trend
        let currentEventCount = 0
        let previousEventCount = 0

        try {
          const { count: eventCount } = await supabase
            .from("events")
            .select("*", { count: "exact", head: true })
            .eq("community_id", communityId)
            .in("status", ["upcoming", "active"])
            .gte("start_date", now.toISOString())

          currentEventCount = eventCount || 0

          const { count: prevEventCount } = await supabase
            .from("events")
            .select("*", { count: "exact", head: true })
            .eq("community_id", communityId)
            .in("status", ["upcoming", "active"])
            .gte("start_date", thirtyDaysAgo.toISOString())
            .lt("start_date", now.toISOString())

          previousEventCount = prevEventCount || 0
        } catch (eventTableError) {
          console.log("[v0] Events table not yet created, using default values")
        }

        const eventTrend = currentEventCount - previousEventCount

        // 3. Average Engagement with trend
        const { data: currentEngagement } = await supabase
          .from("community_members")
          .select("engagement_score")
          .eq("community_id", communityId)

        const currentAvgEngagement = currentEngagement?.length
          ? Math.round(
              currentEngagement.reduce((sum, m) => sum + (m.engagement_score || 0), 0) / currentEngagement.length,
            )
          : 0

        const { data: previousEngagement } = await supabase
          .from("community_members")
          .select("engagement_score")
          .eq("community_id", communityId)
          .lt("joined_at", thirtyDaysAgo.toISOString())

        const previousAvgEngagement = previousEngagement?.length
          ? Math.round(
              previousEngagement.reduce((sum, m) => sum + (m.engagement_score || 0), 0) / previousEngagement.length,
            )
          : 0

        const engagementTrend =
          previousAvgEngagement > 0
            ? Math.round(((currentAvgEngagement - previousAvgEngagement) / previousAvgEngagement) * 100)
            : 0

        // 4. Active Cohorts (no trend)
        const { count: activeCohorts } = await supabase
          .from("cohorts")
          .select("*", { count: "exact", head: true })
          .eq("community_id", communityId)
          .eq("is_active", true)

        setMetrics({
          totalMembers: {
            value: currentMemberCount || 0,
            trend: memberTrend,
            trendType: memberTrend > 0 ? "up" : memberTrend < 0 ? "down" : "neutral",
          },
          activeEvents: {
            value: currentEventCount,
            trend: eventTrend,
            trendType: eventTrend > 0 ? "up" : eventTrend < 0 ? "down" : "neutral",
          },
          avgEngagement: {
            value: currentAvgEngagement,
            trend: engagementTrend,
            trendType: engagementTrend > 0 ? "up" : engagementTrend < 0 ? "down" : "neutral",
          },
          cohortsActive: {
            value: activeCohorts || 0,
            trend: null,
            trendType: "neutral",
          },
        })
      } catch (error) {
        console.error("[v0] Failed to load metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [communityId])

  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white/[0.03] border border-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <EnhancedMetricCard
        title="Total Members"
        value={metrics.totalMembers.value}
        trend={metrics.totalMembers.trend}
        trendType={metrics.totalMembers.trendType}
        suffix="%"
        icon={Users}
      />

      <EnhancedMetricCard
        title="Active Events"
        value={metrics.activeEvents.value}
        trend={metrics.activeEvents.trend}
        trendType={metrics.activeEvents.trendType}
        icon={Calendar}
      />

      <EnhancedMetricCard
        title="Avg Engagement"
        value={`${metrics.avgEngagement.value}%`}
        trend={metrics.avgEngagement.trend}
        trendType={metrics.avgEngagement.trendType}
        suffix="%"
        icon={Activity}
      />

      <EnhancedMetricCard title="Cohorts Active" value={metrics.cohortsActive.value} icon={GraduationCap} />
    </div>
  )
}
