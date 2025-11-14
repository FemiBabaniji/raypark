"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { Navigation } from "./navigation"
import { useAuth } from "@/lib/auth"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [currentView, setCurrentView] = useState("dashboard")
  const { user, loading } = useAuth()
  const isLoggedIn = !!user && !loading
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

  useEffect(() => {
    if (pathname === "/") setCurrentView("dashboard")
    else if (pathname === "/dashboard") setCurrentView("dashboard")
    else if (pathname === "/network") setCurrentView("network")
    else if (pathname === "/discover") setCurrentView("discover")
    else if (pathname === "/events") setCurrentView("events")
    else if (pathname === "/calendars") setCurrentView("calendars")
    else if (pathname.startsWith("/network/")) setCurrentView("network")
    else if (pathname.startsWith("/events/")) setCurrentView("events")
    else if (pathname.startsWith("/calendars/")) setCurrentView("calendars")
    else setCurrentView("dashboard")
  }, [pathname])

  const handleSetCurrentView = (view: string) => {
    setCurrentView(view)
    switch (view) {
      case "dashboard":
        router.push("/dashboard")
        break
      case "portfolio":
        router.push("/")
        break
      case "discover":
        router.push("/discover")
        break
      case "network":
        router.push("/network")
        break
      case "events":
        router.push("/events")
        break
      case "calendars":
        router.push("/calendars")
        break
      // </CHANGE>
      default:
        break
    }
  }

  const isPortfolioBuilder = pathname.startsWith("/portfolio")
  const isAuthPage = pathname === "/auth" || pathname === "/login" || pathname.startsWith("/auth/")
  const isDashboard = pathname === "/" || pathname === "/dashboard"
  const isNetworkWorkflow = pathname.startsWith("/network") && pathname !== "/network"
  const isEventsOrCalendars = pathname.startsWith("/events") || pathname.startsWith("/calendars")
  
  const shouldShowNavigation = isLoggedIn && !isPortfolioBuilder && !isAuthPage && !isNetworkWorkflow && (isEventsOrCalendars || pathname === "/events" || pathname === "/calendars")

  return (
    <>
      {shouldShowNavigation && !isDashboard && (
        <Navigation
          currentView={currentView}
          isLoggedIn={isLoggedIn}
          isSearchExpanded={isSearchExpanded}
          isUserDropdownOpen={isUserDropdownOpen}
          setCurrentView={handleSetCurrentView}
          setIsSearchExpanded={setIsSearchExpanded}
          setIsUserDropdownOpen={setIsUserDropdownOpen}
          setIsLoggedIn={() => {}}
        />
      )}
      <div>{children}</div>
    </>
  )
}
