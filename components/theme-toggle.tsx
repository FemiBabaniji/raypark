"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <div className="h-4 w-4" />
      </Button>
    )
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("black")
    } else {
      setTheme("light")
    }
  }

  const getIcon = () => {
    if (theme === "light") return <Sun className="h-4 w-4 text-foreground" />
    if (theme === "dark") return <Moon className="h-4 w-4 text-foreground" />
    return <Monitor className="h-4 w-4 text-foreground" />
  }

  return (
    <Button variant="ghost" size="sm" onClick={cycleTheme} className="h-8 w-8 p-0 hover:bg-accent">
      {getIcon()}
      <span className="sr-only">Toggle theme (Light/Dark/Black)</span>
    </Button>
  )
}
