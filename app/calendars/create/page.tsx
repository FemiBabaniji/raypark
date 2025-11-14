import { CreateCalendarForm } from "@/components/calendars/create-calendar-form"

export default function CreateCalendarPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-12">Create Calendar</h1>
        <CreateCalendarForm />
      </div>
    </div>
  )
}
