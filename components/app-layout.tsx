"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
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
    else if (pathname.startsWith("/network/")) setCurrentView("network")
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
      default:
        break
    }
  }

  const isPortfolioBuilder = pathname.startsWith("/portfolio")
  const isAuthPage = pathname === "/auth" || pathname === "/login" || pathname.startsWith("/auth/")
  const isDashboard = pathname === "/" || pathname === "/dashboard"
  const isNetworkWorkflow = pathname.startsWith("/network")
  const shouldShowNavigation = isLoggedIn && !isPortfolioBuilder && !isAuthPage && !isNetworkWorkflow

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
          setIsLoggedIn={() => {}} // Empty function since auth is handled by AuthProvider
        />
      )}
      <div className={shouldShowNavigation && !isDashboard && !isNetworkWorkflow ? "pt-16" : ""}>{children}</div>
    </>
  )
}
