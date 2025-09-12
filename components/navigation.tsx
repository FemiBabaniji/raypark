"use client"

import { useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Bell } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavigationProps {
  currentView: string
  isLoggedIn: boolean
  isSearchExpanded: boolean
  isUserDropdownOpen: boolean
  setCurrentView: (view: string) => void
  setIsSearchExpanded: (expanded: boolean) => void
  setIsUserDropdownOpen: (open: boolean) => void
  setIsLoggedIn: (loggedIn: boolean) => void
}

export function Navigation({
  currentView,
  isLoggedIn,
  isSearchExpanded,
  isUserDropdownOpen,
  setCurrentView,
  setIsSearchExpanded,
  setIsUserDropdownOpen,
  setIsLoggedIn,
}: NavigationProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchExpanded])

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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-purple-600 text-white text-sm">P</AvatarFallback>
          </Avatar>
          <span className="text-foreground font-medium">PathwAI</span>
        </div>

        {/* Center - Main Navigation */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setCurrentView("dashboard")}
            className={`text-sm transition-colors ${
              currentView === "dashboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView("portfolio")}
            className={`text-sm transition-colors ${
              currentView === "portfolio" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setCurrentView("discover")}
            className={`text-sm transition-colors ${
              currentView === "discover" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Discover
          </button>
          <a
            href="/network"
            className={`text-sm transition-colors ${
              currentView === "network" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Network
          </a>
        </div>

        {/* Right - User Actions */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <button
              onClick={() => setIsSearchExpanded(true)}
              className={`w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors ${isSearchExpanded ? "opacity-0" : "opacity-100"}`}
            >
              <Search className="w-4 h-4" />
            </button>
            {isSearchExpanded && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search"
                    className="w-[244px] pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring"
                    onBlur={() => setIsSearchExpanded(false)}
                    autoFocus
                  />
                </div>
              </div>
            )}
          </div>
          <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <ThemeToggle />
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
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <button
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="w-full px-4 py-2 text-left text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false)
                      setCurrentView("landing")
                      setIsUserDropdownOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm"
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
