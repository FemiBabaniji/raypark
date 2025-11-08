"use client"

interface TimeToggleProps {
  showPast: boolean
  onToggle: (showPast: boolean) => void
  upcomingLabel?: string
  pastLabel?: string
}

export function TimeToggle({ showPast, onToggle, upcomingLabel = "Upcoming", pastLabel = "Past" }: TimeToggleProps) {
  return (
    <div className="flex items-center gap-8 text-sm">
      <button onClick={() => onToggle(false)} className="relative transition-colors duration-200">
        <div className={`font-semibold text-xl py-0.5 ${!showPast ? "text-white" : "text-gray-400"}`}>
          {upcomingLabel}
        </div>
        {!showPast && <div className="absolute left-0 -bottom-2 h-[2px] w-10 rounded-full bg-white" />}
      </button>
      <button onClick={() => onToggle(true)} className="relative transition-colors duration-200">
        <div className={`text-xl px-14 py-2 ${showPast ? "text-white font-semibold" : "text-gray-400"}`}>
          {pastLabel}
        </div>
        {showPast && <div className="absolute left-14 -bottom-2 h-[2px] w-10 rounded-full bg-white" />}
      </button>
    </div>
  )
}
