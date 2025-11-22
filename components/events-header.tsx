"use client"

import { Bell, User, Palette } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"
import { THEMES, type ThemeName, getMutedGradient } from "@/lib/theme-colors"

interface EventsHeaderProps {
  communityName: string
  showRightColumn: boolean
  onToggleRightColumn: () => void
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export default function EventsHeader({
  communityName,
  showRightColumn,
  onToggleRightColumn,
  activeTab = "Home",
  onTabChange = () => {},
}: EventsHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  const tabs = ["Home", "Events", "Network", "Meetings"]
  const mutedGradient = getMutedGradient(theme)

  return (
    <div className="bg-[#1a1a1a] px-6 py-3.5 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        {/* Left: Logo with theme-based gradient */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mutedGradient.from}, ${mutedGradient.to})`,
            }}
          >
            <span className="text-white font-bold text-sm">{communityName}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">Your Hub.</span>
            <span className="text-zinc-400 text-xs">Your Community.</span>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex gap-2 absolute left-1/2 transform -translate-x-1/2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
                activeTab === tab ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2 ml-2">
          {/* Notification bell */}
          <button
            className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-zinc-400" strokeWidth={2} />
          </button>

          {/* User icon with dropdown */}
          <div className="relative z-50" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center"
              aria-label="User menu"
            >
              <User className="w-5 h-5 text-zinc-400" strokeWidth={2} />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg border border-white/10 overflow-hidden bg-[#1a1a1a]">
                <Link
                  href="/dashboard"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-colors"
                >
                  Dashboard
                </Link>

                {/* Theme Section */}
                <div className="border-t border-white/5 px-4 py-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-white/70" />
                    <span className="text-white/90 text-sm font-medium">Theme</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(Object.keys(THEMES) as ThemeName[]).map((themeName) => (
                      <button
                        key={themeName}
                        onClick={() => setTheme(themeName)}
                        className="relative w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/30"
                        style={{ backgroundColor: THEMES[themeName].dotColor }}
                        aria-label={`Select ${THEMES[themeName].displayName} theme`}
                        title={THEMES[themeName].displayName}
                      >
                        {theme === themeName && (
                          <span className="absolute inset-0 rounded-full ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false)
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-colors border-t border-white/5"
                >
                  Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
