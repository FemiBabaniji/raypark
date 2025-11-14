import { Suspense } from "react"
import { EventsList } from "@/components/events/events-list"
import { EventsHeader } from "@/components/events/events-header"

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <EventsHeader />
      <Suspense fallback={<EventsListSkeleton />}>
        <EventsList />
      </Suspense>
    </div>
  )
}

function EventsListSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-80 bg-card rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
