"use client"
import { Card } from "@/components/ui/card"
import { Users, Calendar, TrendingUp } from "lucide-react"

interface Project {
  id: number
  name: string
  description: string
  status: string
  due: string
  priority: string
  progress: number
  team: any[]
  requirements: any[]
}

interface NetworkMember {
  id: string
  name: string
  role: string
  avatar?: string
}

interface ProjectCardWithMatchesProps {
  project: Project
  networkMembers: NetworkMember[]
  onCardClick: () => void
  className?: string
}

export function ProjectCardWithMatches({
  project,
  networkMembers,
  onCardClick,
  className,
}: ProjectCardWithMatchesProps) {
  return (
    <Card className={`p-6 cursor-pointer transition-all duration-300 ${className}`} onClick={onCardClick}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-white mb-2">{project.name}</h3>
          <p className="text-white/70 text-sm">{project.description}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-white/60">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{project.due}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{project.progress}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <Users className="w-4 h-4 text-white/60" />
          <span className="text-sm text-white/60">{networkMembers.length} potential matches</span>
        </div>
      </div>
    </Card>
  )
}
