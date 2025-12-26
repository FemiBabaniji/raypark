"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedMetricCardProps {
  title: string
  value: number | string
  trend?: number | null
  trendType?: "up" | "down" | "neutral"
  icon?: LucideIcon
  suffix?: string
}

export function EnhancedMetricCard({
  title,
  value,
  trend,
  trendType = "neutral",
  icon: Icon,
  suffix = "",
}: EnhancedMetricCardProps) {
  const displayValue = typeof value === "number" ? value.toLocaleString() : value
  const showTrend = trend !== null && trend !== undefined

  return (
    <Card className="relative bg-[#1a1a1d] border-white/5 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white/60 truncate pr-2">{title}</CardTitle>
        {showTrend && (
          <div
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 tabular-nums",
              trendType === "up" && "bg-green-500/20 text-green-400",
              trendType === "down" && "bg-red-500/20 text-red-400",
              trendType === "neutral" && "bg-white/5 text-white/40",
            )}
          >
            {trend > 0 && "+"}
            {trend}
            {suffix}
          </div>
        )}
        {!showTrend && Icon && <Icon className="size-4 text-white/20 shrink-0" />}
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-white tabular-nums">
          {displayValue}
          {suffix && !showTrend && <span className="text-2xl ml-0.5">{suffix}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
