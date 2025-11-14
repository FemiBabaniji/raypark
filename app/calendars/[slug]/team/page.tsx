import { TeamManagement } from "@/components/calendars/team-management"

export default function TeamManagementPage({ params }: { params: { slug: string } }) {
  return <TeamManagement slug={params.slug} />
}
