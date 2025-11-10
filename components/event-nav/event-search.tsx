"use client"

import { Search } from "lucide-react"

interface EventSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function EventSearch({
  value,
  onChange,
  placeholder = "Search workshops by name, description, or tags...",
}: EventSearchProps) {
  return (
    <div className="relative inline-block">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-3 pl-12 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 text-xs"
        style={{
          backgroundColor: "#393939",
          width: "600px",
        }}
      />
    </div>
  )
}
