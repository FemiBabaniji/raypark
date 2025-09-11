"use client"

import { useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Bell, Network } from "lucide-react"

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
    <div className="border-b border-white/10 fixed top-0 left-0 right-0 bg-neutral-950/80 backdrop-blur-xl z-50">
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
            <AvatarFallback className="bg-gradient-to-br from-rose-400 to-rose-600 text-white text-sm font-medium">
              P
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-white/90 font-medium">PathwAI</span>
        </div>

        {/* Center Navigation - Only on landing page */}
        {currentView === "landing" && (
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6">
            <button className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors font-medium">
              Features
            </button>
            <button className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors font-medium">
              Pricing
            </button>
            <button className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors font-medium">
              About
            </button>
          </div>
        )}

        {/* Logged in navigation */}
        {isLoggedIn && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`flex items-center justify-center px-4 py-2 h-9 text-sm font-medium rounded-xl transition-all ${
                currentView === "dashboard"
                  ? "bg-white/10 text-white backdrop-blur-sm"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView("portfolio")}
              className={`flex items-center justify-center px-4 py-2 h-9 text-sm font-medium rounded-xl transition-all ${
                currentView === "portfolio"
                  ? "bg-white/10 text-white backdrop-blur-sm"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setCurrentView("discover")}
              className={`flex items-center justify-center px-4 py-2 h-9 text-sm font-medium rounded-xl transition-all ${
                currentView === "discover"
                  ? "bg-white/10 text-white backdrop-blur-sm"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setCurrentView("network")}
              className={`flex items-center justify-center gap-2 px-4 py-2 h-9 text-sm font-medium rounded-xl transition-all ${
                currentView === "network"
                  ? "bg-gradient-to-r from-rose-500/20 to-purple-500/20 text-white border border-rose-500/30 backdrop-blur-sm"
                  : "bg-gradient-to-r from-rose-500/10 to-purple-500/10 text-white/90 hover:from-rose-500/20 hover:to-purple-500/20 border border-rose-500/20 hover:border-rose-500/30"
              }`}
            >
              <Network className="w-4 h-4" />
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
                  className={`w-9 h-9 flex items-center justify-center text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all ${isSearchExpanded ? "opacity-0" : "opacity-100"}`}
                >
                  <Search className="w-4 h-4" />
                </button>
                {isSearchExpanded && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search"
                        className="w-[244px] pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 backdrop-blur-sm"
                        onBlur={() => setIsSearchExpanded(false)}
                        autoFocus
                      />
                    </div>
                  </div>
                )}
              </div>
              <button className="w-9 h-9 flex items-center justify-center text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Bell className="w-4 h-4" />
              </button>
              <div className="relative user-dropdown">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="w-9 h-9 flex items-center justify-center hover:opacity-80 transition-opacity rounded-xl"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white text-sm font-medium">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900/90 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl z-50">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                      >
                        Settings
                      </button>
                      <button
                        onClick={() => {
                          setIsLoggedIn(false)
                          setCurrentView("landing")
                          setIsUserDropdownOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
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
                className="px-4 py-2 border border-white/20 hover:border-white/30 text-white/90 hover:text-white text-sm rounded-xl transition-all font-medium backdrop-blur-sm"
              >
                Login
              </button>
              <button
                onClick={() => setCurrentView("signup-form")}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-sm rounded-xl transition-all font-medium shadow-lg"
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
