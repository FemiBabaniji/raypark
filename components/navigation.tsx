"use client"

import { useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Settings, LayoutDashboard } from 'lucide-react'

interface NavigationProps {
  currentView: string
  isLoggedIn: boolean
  isUserDropdownOpen: boolean
  setCurrentView: (view: string) => void
  setIsUserDropdownOpen: (open: boolean) => void
  setIsLoggedIn: (loggedIn: boolean) => void
}

export function Navigation({
  currentView,
  isLoggedIn,
  isUserDropdownOpen,
  setCurrentView,
  setIsUserDropdownOpen,
  setIsLoggedIn,
}: NavigationProps) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserDropdownOpen && !(event.target as Element)?.closest(".user-dropdown")) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserDropdownOpen, setIsUserDropdownOpen])

  const handleNavClick = (view: string) => {
    setCurrentView(view)
    setIsUserDropdownOpen(false)
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left - Logo */}
        <div className="flex items-center ml-6">
          <img src="/bea-logo.svg" alt="BEA" className="h-12 w-auto" />
        </div>

        {/* Right - Action Icons */}
        <div className="flex items-center gap-4">
          {/* Search Icon */}
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-800/50 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-zinc-400" strokeWidth={2.5} />
          </button>

          {/* Notification Bell */}
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-800/50 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-zinc-400" strokeWidth={2.5} />
          </button>

          {/* User Avatar with Dropdown */}
          <div className="relative user-dropdown">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="User menu"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-teal-500 text-white text-sm font-medium">
                  😊
                </AvatarFallback>
              </Avatar>
            </button>
            
            {isUserDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <button
                    onClick={() => handleNavClick("dashboard")}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavClick("settings")}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
