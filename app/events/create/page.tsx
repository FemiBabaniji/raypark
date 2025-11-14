import { CreateEventForm } from "@/components/events/create-event-form"

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create Event</h1>
          <p className="text-muted-foreground">Set up your event details and invite attendees</p>
        </div>
        <CreateEventForm />
      </div>
    </div>
  )
}
