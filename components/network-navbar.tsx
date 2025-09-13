"use client"
import { Search, Home } from "lucide-react"
import BackButton from "@/components/back-button"

interface NetworkNavbarProps {
  onBackClick: () => void
  onHomeClick: () => void
}

export default function NetworkNavbar({ onBackClick, onHomeClick }: NetworkNavbarProps) {
  return (
    <>
      {/* Back button in top left corner */}
      <div className="fixed top-8 left-8 z-50">
        <div className="h-10 flex items-center">
          <BackButton onClick={onBackClick} />
        </div>
      </div>

      {/* Home button in top right corner */}
      <div className="fixed top-8 right-8 z-50">
        <button
          onClick={onHomeClick}
          className="h-10 px-4 bg-neutral-900/80 backdrop-blur-xl rounded-2xl text-white hover:bg-neutral-800/80 transition-colors text-sm font-medium flex items-center justify-center"
        >
          <Home className="w-5 h-5" fill="white" />
        </button>
      </div>

      {/* Search bar centered */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40">
        <div className="relative h-10 w-full max-w-md rounded-2xl" style={{ backgroundColor: "oklch(0.145 0 0)" }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: "#B3B3B3" }} />
          <input
            placeholder="Search"
            className="h-full w-full bg-transparent outline-none pl-12 pr-4 text-sm border-none shadow-none"
            style={{ color: "#FFFFFF" }}
          />
        </div>
      </div>
    </>
  )
}
