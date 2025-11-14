"use client"

import { LayoutGrid, Calendar } from "lucide-react"

interface ViewToggleProps {
  view: "grid" | "calendar"
  onViewChange: (view: "grid" | "calendar") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-lg">
      <button
        onClick={() => onViewChange("grid")}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md transition-all
          ${view === "grid" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-300"}
        `}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="text-sm font-medium">Grid</span>
      </button>
      <button
        onClick={() => onViewChange("calendar")}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md transition-all
          ${view === "calendar" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-300"}
        `}
      >
        <Calendar className="h-4 w-4" />
        <span className="text-sm font-medium">Calendar</span>
      </button>
    </div>
  )
}
