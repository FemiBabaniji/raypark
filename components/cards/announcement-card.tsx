"use client"

interface AnnouncementCardProps {
  title: string
  initials: string
  gradientFrom: string
  gradientTo: string
}

export function AnnouncementCard({ title, initials, gradientFrom, gradientTo }: AnnouncementCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
        style={{
          background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm">{title}</p>
      </div>
      <button className="text-gray-400 hover:text-white transition-colors flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}
