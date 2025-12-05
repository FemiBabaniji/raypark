import { Badge } from "@/components/ui/badge"
import type { CommunityRole, CohortRole } from "@/types/admin"

interface RoleBadgeProps {
  role: CommunityRole | CohortRole
  variant?: "default" | "secondary" | "outline"
}

const roleConfig: Record<CommunityRole | CohortRole, { label: string; variant: "default" | "secondary" | "outline" }> =
  {
    community_admin: { label: "Community Admin", variant: "default" },
    moderator: { label: "Moderator", variant: "secondary" },
    content_manager: { label: "Content Manager", variant: "secondary" },
    cohort_admin: { label: "Cohort Admin", variant: "default" },
    event_coordinator: { label: "Event Coordinator", variant: "secondary" },
  }

export function RoleBadge({ role, variant }: RoleBadgeProps) {
  const config = roleConfig[role]

  return <Badge variant={variant || config.variant}>{config.label}</Badge>
}

interface RoleBadgeListProps {
  communityRoles?: CommunityRole[]
  cohortRoles?: CohortRole[]
  maxDisplay?: number
}

export function RoleBadgeList({ communityRoles = [], cohortRoles = [], maxDisplay = 3 }: RoleBadgeListProps) {
  const allRoles = [...communityRoles, ...cohortRoles]
  const displayRoles = allRoles.slice(0, maxDisplay)
  const remainingCount = allRoles.length - maxDisplay

  if (allRoles.length === 0) {
    return <span className="text-muted-foreground text-sm">Member</span>
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {displayRoles.map((role) => (
        <RoleBadge key={role} role={role} />
      ))}
      {remainingCount > 0 && <Badge variant="outline">+{remainingCount} more</Badge>}
    </div>
  )
}
