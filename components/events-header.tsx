"use client"

import { ChevronRight, ChevronLeft, Search, Bell, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface EventsHeaderProps {
  communityName: string
  useGradient: boolean
  showRightColumn: boolean
  onToggleGradient: () => void
  onToggleRightColumn: () => void
}

export default function EventsHeader({
  communityName,
  useGradient,
  showRightColumn,
  onToggleGradient,
  onToggleRightColumn
}: EventsHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <div className="pt-1 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center justify-center rounded-xl aspect-square"
            style={{
              height: '3rem',
              background: 'linear-gradient(135deg, #FEF08A 0%, #BFDBFE 40%, #DDD6FE 80%, #E9D5FF 100%)',
              boxShadow: '0 4px 24px rgba(191, 219, 254, 0.2)'
            }}
          >
            <span className="text-zinc-900 font-bold text-xl tracking-tight">
              {communityName}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            <span className="text-white">Your hub. </span>
            <span style={{ color: "#4169E1" }}>Your community.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search icon */}
          <button 
            className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-white" strokeWidth={2} />
          </button>

          {/* Notification bell */}
          <button 
            className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-white" strokeWidth={2} />
          </button>

          {/* User icon with dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
              aria-label="User menu"
            >
              <User className="w-5 h-5 text-white" strokeWidth={2} />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border border-white/10 overflow-hidden"
                   style={{ backgroundColor: "oklch(0.22 0 0)" }}>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false)
                    // Navigate to dashboard
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false)
                    // Navigate to settings
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
