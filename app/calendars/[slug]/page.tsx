import { CalendarDetailView } from "@/components/calendars/calendar-detail-view"

export default function CalendarDetailPage({ params }: { params: { slug: string } }) {
  return <CalendarDetailView slug={params.slug} />
}
