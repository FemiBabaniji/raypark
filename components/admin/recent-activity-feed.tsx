"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  description: string
  created_at: string
  activity_type: string
}

interface RecentActivityFeedProps {
  communityId: string
}

export function RecentActivityFeed({ communityId }: RecentActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActivities = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      try {
        const { data } = await supabase
          .from("activity_log")
          .select("id, description, created_at, activity_type")
          .eq("community_id", communityId)
          .order("created_at", { ascending: false })
          .limit(10)

        if (data && data.length > 0) {
          setActivities(data)
        } else {
          // Placeholder activities if none exist
          setActivities([
            {
              id: "1",
              description: "Sarah Chen joined AI Innovation Cohort",
              created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              activity_type: "member_joined",
            },
            {
              id: "2",
              description: "New event published: Founder Networking Mixer",
              created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
              activity_type: "event_created",
            },
            {
              id: "3",
              description: "23 members registered for AI Workshop",
              created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              activity_type: "event_registration",
            },
          ])
        }
      } catch (error) {
        console.error("[v0] Error loading recent activity:", error)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [communityId])

  const getActivityColor = (type: string) => {
    switch (type) {
      case "member_joined":
        return "bg-green-500"
      case "event_created":
        return "bg-blue-500"
      case "event_registration":
        return "bg-purple-500"
      default:
        return "bg-white/40"
    }
  }

  if (loading) {
    return (
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-white/60 text-sm">Loading activity...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/[0.03] border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`size-2 rounded-full ${getActivityColor(activity.activity_type)} mt-1.5 shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-white/90 text-sm leading-relaxed">{activity.description}</p>
                <p className="text-white/40 text-xs mt-1">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
