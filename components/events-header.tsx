"use client"

import { Bell, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

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
  const [activeTab, setActiveTab] = useState('home')
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
    <div className="px-6 py-3 bg-zinc-900/80 backdrop-blur-md">
      <div className="flex items-center justify-between w-full">
        {/* Left: Logo/Brand with tagline */}
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center justify-center rounded-xl aspect-square"
            style={{
              height: '2.5rem',
              background: 'linear-gradient(135deg, #FEF08A 0%, #BFDBFE 40%, #DDD6FE 80%, #E9D5FF 100%)',
              boxShadow: '0 4px 24px rgba(191, 219, 254, 0.2)'
            }}
          >
            <span className="text-zinc-900 font-bold text-lg tracking-tight">
              {communityName}
            </span>
          </div>
          <div className="text-2xl text-white">
            Your hub. <span className="text-white">Your community.</span>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center gap-2">
          <Link 
            href="/dashboard"
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-lg ${
              activeTab === 'home' 
                ? 'text-white bg-white/10' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/network"
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-lg ${
              activeTab === 'events' 
                ? 'text-white bg-white/10' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Events
          </Link>
          <Link 
            href="/network"
            onClick={() => setActiveTab('network')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-lg ${
              activeTab === 'network' 
                ? 'text-white bg-white/10' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Network
          </Link>
          <Link 
            href="/network"
            onClick={() => setActiveTab('meetings')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-lg ${
              activeTab === 'meetings' 
                ? 'text-white bg-white/10' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Meetings
          </Link>
        </nav>
        
        {/* Right: Existing elements (gradient toggle, notification, user menu) */}
        <div className="flex items-center gap-3">
          {/* Gradient toggle button */}
          <button
            onClick={onToggleGradient}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Toggle background"
          >
            <div className="w-3 h-3 rounded-full" style={{
              background: useGradient 
                ? "linear-gradient(135deg, #4169E1, #8B5CF6)" 
                : "#52525b"
            }} />
            <span className="text-xs text-white/70">{useGradient ? "Gradient" : "Grey"}</span>
          </button>

          {/* Notification bell */}
          <button 
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-white" strokeWidth={2} />
          </button>

          {/* User icon with dropdown */}
          <div className="relative z-50" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
              aria-label="User menu"
            >
              <User className="w-4 h-4 text-white" strokeWidth={2} />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border border-white/10 overflow-hidden"
                   style={{ backgroundColor: "oklch(0.22 0 0)" }}>
                <Link
                  href="/dashboard"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-colors"
                >
                  Dashboard
                </Link>
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
      
      {/* Divider below navbar */}
      <div className="w-full h-px bg-white/10 mt-3" />
    </div>
  )
}
