"use client"

export function MeetingsWidget({ onMeetingClick }: { onMeetingClick?: (id: string) => void }) {
  const meetings = [
    {
      id: "1",
      time: "8:00 AM",
      title: "Dental Cleaning and Care",
      person: "Edward Johanson",
      color: "bg-purple-500",
      shadowColor: "#a855f7",
    },
    {
      id: "2",
      time: "8:30 AM",
      title: "Status update to John Doe",
      person: "John Do",
      color: "bg-purple-500",
      shadowColor: "#a855f7",
    },
    {
      id: "3",
      time: "9:00 AM",
      title: "Calendar Updates",
      person: "Edward Johanson",
      color: "bg-cyan-400",
      shadowColor: "#22d3ee",
    },
    {
      id: "4",
      time: "11:00 AM",
      title: "Send Detailed Status Update",
      person: "Mike Taylor",
      color: "bg-emerald-400",
      shadowColor: "#34d399",
    },
    {
      id: "5",
      time: "12:00 PM",
      title: "Meeting with AR Shakir",
      person: "AR Shakir",
      color: "bg-orange-400",
      shadowColor: "#fb923c",
    },
    {
      id: "6",
      time: "1:00 PM",
      title: "Call New Leads",
      person: "Mike, John, Chris",
      color: "bg-purple-500",
      shadowColor: "#a855f7",
    },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl mb-1">Today's Schedule</h2>
          <p className="text-gray-400 text-sm">Friday, 12 Dec</p>
        </div>
        <button className="w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      <div className="max-h-[200px] overflow-y-auto pr-2 space-y-3 scrollbar-hide scroll-smooth">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            onClick={() => onMeetingClick?.(meeting.id)}
            className="flex items-start gap-4 p-4 bg-white/[0.02] rounded-xl hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
          >
            <div
              className={`w-2 h-2 rounded-full ${meeting.color} flex-shrink-0 mt-2`}
              style={{ boxShadow: `0 0 8px ${meeting.shadowColor}` }}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-white text-sm font-medium">{meeting.title}</h3>
              </div>
              <p className="text-gray-400 text-xs mb-1">{meeting.person}</p>
              <div className="flex items-center gap-1.5 text-gray-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-xs">{meeting.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
