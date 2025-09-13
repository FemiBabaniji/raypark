"use client"

import { Search, Home } from "lucide-react"
import BackButton from "@/components/ui/back-button"
import TopRail from "@/components/ui/top-rail"

interface NetworkNavbarProps {
  onBackClick: () => void
  onHomeClick: () => void
}

export default function NetworkNavbar({ onBackClick, onHomeClick }: NetworkNavbarProps) {
  return (
    <TopRail
      leftSlot={<BackButton onClick={onBackClick} />}
      centerSlot={
        <div className="relative h-10 w-full max-w-md rounded-2xl" style={{ backgroundColor: "oklch(0.145 0 0)" }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: "#B3B3B3" }} />
          <input
            placeholder="Search"
            className="h-full w-full bg-transparent outline-none pl-12 pr-4 text-sm border-none shadow-none"
            style={{ color: "#FFFFFF" }}
          />
        </div>
      }
      rightSlot={
        <button
          onClick={onHomeClick}
          className="h-10 px-4 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors text-sm font-medium flex items-center justify-center"
        >
          <Home className="w-5 h-5" fill="white" />
        </button>
      }
    />
  )
}
