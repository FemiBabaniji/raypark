"use client"

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  host: string
  attendees: number
  type: "1-on-1" | "team" | "all-hands"
}

interface MeetingsSectionProps {
  onMeetingClick?: (meetingId: string) => void
}

export function MeetingsSection({ onMeetingClick }: MeetingsSectionProps) {
  const upcomingMeetings: Meeting[] = [
    {
      id: "1",
      title: "Weekly Sync",
      date: "Sept 2",
      time: "10:00 AM",
      host: "Sarah Chen",
      attendees: 8,
      type: "team",
    },
    {
      id: "2",
      title: "1:1 Check-in",
      date: "Sept 3",
      time: "2:00 PM",
      host: "Marcus J.",
      attendees: 2,
      type: "1-on-1",
    },
    {
      id: "3",
      title: "All Hands",
      date: "Sept 5",
      time: "11:00 AM",
      host: "Leadership",
      attendees: 45,
      type: "all-hands",
    },
    {
      id: "4",
      title: "Project Review",
      date: "Sept 6",
      time: "3:00 PM",
      host: "Elena R.",
      attendees: 12,
      type: "team",
    },
  ]

  const getTypeColor = (type: Meeting["type"]) => {
    switch (type) {
      case "1-on-1":
        return "from-blue-900/30 to-cyan-900/30"
      case "team":
        return "from-purple-900/30 to-pink-900/30"
      case "all-hands":
        return "from-emerald-900/30 to-teal-900/30"
      default:
        return "from-zinc-900/30 to-zinc-800/30"
    }
  }

  return (
    <div className="space-y-3">
      {upcomingMeetings.map((meeting) => (
        <button
          key={meeting.id}
          onClick={() => onMeetingClick?.(meeting.id)}
          className={`w-full text-left bg-gradient-to-br ${getTypeColor(meeting.type)} backdrop-blur-sm rounded-2xl p-4 transition-all hover:scale-[1.02] border border-white/5 shadow-lg shadow-black/10`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1">{meeting.title}</h3>
              <p className="text-xs text-zinc-400">{meeting.host}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              {meeting.date} • {meeting.time}
            </span>
            <span className="text-zinc-500">{meeting.attendees} attending</span>
          </div>
        </button>
      ))}
    </div>
  )
}
