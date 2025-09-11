"use client"

import { useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Bell } from "lucide-react"

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
    <div className="border-b border-zinc-800 fixed top-0 left-0 right-0 bg-zinc-900 z-50">
      <div className="flex items-center justify-between p-4 max-w-[calc(4*20rem+3*1.5rem)] mx-auto">
        <div
          className={`flex items-center gap-3 ${
            !isLoggedIn && currentView !== "landing"
              ? "cursor-pointer hover:opacity-80 transition-opacity"
              : isLoggedIn
                ? "cursor-default"
                : "cursor-pointer"
          }`}
          onClick={() => {
            if (!isLoggedIn && currentView !== "landing") {
              setCurrentView("landing")
            }
          }}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-purple-600 text-white text-sm">P</AvatarFallback>
          </Avatar>
          <span className="text-sm text-zinc-300">PathwAI</span>
        </div>

        {/* Center Navigation - Only on landing page */}
        {currentView === "landing" && (
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6">
            <button className="px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors">Features</button>
            <button className="px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors">Pricing</button>
            <button className="px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors">About</button>
          </div>
        )}

        {/* Logged in navigation */}
        {isLoggedIn && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentView("dashboard")}
              className="flex items-center justify-center px-3 py-2 h-8 text-sm text-zinc-300 hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView("portfolio")}
              className="flex items-center justify-center px-3 py-2 h-8 text-sm text-zinc-300 hover:text-white transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => setCurrentView("discover")}
              className="flex items-center justify-center px-3 py-2 h-8 text-sm text-zinc-300 hover:text-white transition-colors"
            >
              Discover
            </button>
            <button
              onClick={() => setCurrentView("network")}
              className="flex items-center justify-center px-3 py-2 h-8 text-sm text-zinc-300 hover:text-white transition-colors"
            >
              Network
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <>
              <div className="relative flex items-center">
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className={`w-8 h-8 flex items-center justify-center text-sm text-zinc-300 hover:text-white transition-colors ${isSearchExpanded ? "opacity-0" : "opacity-100"}`}
                >
                  <Search className="w-4 h-4" />
                </button>
                {isSearchExpanded && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search"
                        className="w-[244px] pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                        onBlur={() => setIsSearchExpanded(false)}
                        autoFocus
                      />
                    </div>
                  </div>
                )}
              </div>
              <button className="w-8 h-8 flex items-center justify-center text-sm text-zinc-300 hover:text-white transition-colors">
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
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-800 border border-zinc-600 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false)
                        }}
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
            </>
          )}
          {currentView === "landing" && (
            <>
              <button
                onClick={() => setCurrentView("signin")}
                className="px-4 py-2 border border-purple-600 hover:border-purple-500 text-purple-400 hover:text-purple-300 text-sm rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setCurrentView("signup-form")}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
