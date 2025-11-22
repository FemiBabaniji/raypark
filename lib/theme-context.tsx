"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type ThemeName, getDefaultTheme } from "./theme-colors"
import type { WhitelabelTheme } from "./whitelabel-themes"

interface ThemeContextType {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
  whitelabelTheme: WhitelabelTheme
  setWhitelabelTheme: (theme: WhitelabelTheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(getDefaultTheme())
  const [whitelabelTheme, setWhitelabelThemeState] = useState<WhitelabelTheme>("default")
  const [mounted, setMounted] = useState(false)

  // Load themes from localStorage on mount
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const savedTheme = localStorage.getItem("event-theme") as ThemeName | null
    if (savedTheme && ["green", "blue", "purple", "orange", "pink", "teal"].includes(savedTheme)) {
      setThemeState(savedTheme)
    }

    const savedWhitelabelTheme = localStorage.getItem("whitelabel-theme") as WhitelabelTheme | null
    if (
      savedWhitelabelTheme &&
      ["default", "purple-incubator", "corporate-blue", "sunset-orange", "glassmorphic-purple", "light-mode"].includes(
        savedWhitelabelTheme,
      )
    ) {
      setWhitelabelThemeState(savedWhitelabelTheme)
    }
  }, [mounted])

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme)
    if (typeof window !== "undefined") {
      localStorage.setItem("event-theme", newTheme)
    }
  }

  const setWhitelabelTheme = (newTheme: WhitelabelTheme) => {
    setWhitelabelThemeState(newTheme)
    if (typeof window !== "undefined") {
      localStorage.setItem("whitelabel-theme", newTheme)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, whitelabelTheme, setWhitelabelTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
