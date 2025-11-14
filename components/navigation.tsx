"use client"

import { useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, LayoutDashboard, Briefcase, Compass, NetworkIcon, Calendar, CalendarDays } from 'lucide-react'

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
    <div className="absolute top-12 left-0 right-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left - Logo */}
        <div className="flex items-center ml-6">
          <img src="/bea-logo.svg" alt="BEA" className="h-12 w-auto" />
        </div>

        {/* Right - User Actions */}
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="relative user-dropdown">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-pink-500 text-white text-sm">JD</AvatarFallback>
              </Avatar>
            </button>
            {isUserDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <button
                    onClick={() => handleNavClick("dashboard")}
                    className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors text-sm ${
                      currentView === "dashboard"
                        ? "text-white bg-zinc-700"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-700"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavClick("portfolio")}
                    className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors text-sm ${
                      currentView === "portfolio"
                        ? "text-white bg-zinc-700"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-700"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    Projects
                  </button>
                  <button
                    onClick={() => handleNavClick("discover")}
                    className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors text-sm ${
                      currentView === "discover"
                        ? "text-white bg-zinc-700"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-700"
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    Discover
                  </button>
                  <a
                    href="/network"
                    className="w-full px-4 py-2 text-left flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors text-sm"
                  >
                    <NetworkIcon className="w-4 h-4" />
                    Network
                  </a>

                  <a
                    href="/events"
                    className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors text-sm ${
                      currentView === "events"
                        ? "text-white bg-zinc-700"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-700"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Events
                  </a>
                  <a
                    href="/calendars"
                    className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors text-sm ${
                      currentView === "calendars"
                        ? "text-white bg-zinc-700"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-700"
                    }`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    Calendars
                  </a>

                  <div className="my-2 border-t border-zinc-700" />

                  <button
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="w-full px-4 py-2 text-left text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors text-sm"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false)
                      setCurrentView("landing")
                      setIsUserDropdownOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors text-sm"
                  >
                    Logout
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
