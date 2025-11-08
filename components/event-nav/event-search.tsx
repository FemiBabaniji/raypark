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
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 pl-9 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
      />
    </div>
  )
}
