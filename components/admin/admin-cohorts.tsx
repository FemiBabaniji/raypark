"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Calendar } from "lucide-react"

interface AdminCohortsProps {
  communityId: string
}

interface Cohort {
  id: string
  name: string
  description: string
  start_date: string
  end_date: string
  progress: number
  member_count: number
  color: string
}

export function AdminCohorts({ communityId }: AdminCohortsProps) {
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCohorts() {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("cohorts")
        .select(`
          id,
          name,
          description,
          start_date,
          end_date,
          progress,
          color,
          cohort_members(count)
        `)
        .eq("community_id", communityId)
        .order("start_date", { ascending: false })

      if (data) {
        const cohortsWithCounts = data.map((cohort: any) => ({
          ...cohort,
          member_count: cohort.cohort_members?.[0]?.count || 0,
        }))
        setCohorts(cohortsWithCounts)
      }

      setLoading(false)
    }

    loadCohorts()
  }, [communityId])

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "from-green-500 to-emerald-500"
    if (progress >= 50) return "from-blue-500 to-cyan-500"
    return "from-purple-500 to-pink-500"
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-white/60 text-center py-12">Loading cohorts...</div>
      ) : cohorts.length === 0 ? (
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="py-12 text-center">
            <p className="text-white/60">No cohorts found. Create your first cohort to get started.</p>
          </CardContent>
        </Card>
      ) : (
        cohorts.map((cohort) => (
          <Card key={cohort.id} className="bg-white/[0.03] border-white/10 hover:bg-white/[0.05] transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{cohort.name}</h3>
                  <p className="text-white/60 text-sm flex items-center gap-2">
                    <Calendar className="size-4" />
                    {formatDate(cohort.start_date)} - {formatDate(cohort.end_date)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white/60 text-sm">{cohort.member_count} members</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-white hover:bg-white/5 bg-transparent"
                  >
                    View Details
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Overall Progress</span>
                  <span className="text-white font-bold text-lg">{cohort.progress}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(cohort.progress)} rounded-full transition-all`}
                    style={{ width: `${cohort.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
