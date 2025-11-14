import { EventDetail } from "@/components/events/event-detail"

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  return <EventDetail eventId={params.eventId} />
}
