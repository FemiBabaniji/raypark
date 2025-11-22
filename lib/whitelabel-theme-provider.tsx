"use client"

import { useEffect } from "react"
import { useTheme } from "./theme-context"
import { getWhitelabelTheme } from "./whitelabel-themes"

export function WhitelabelThemeApplier() {
  const { whitelabelTheme } = useTheme()

  useEffect(() => {
    const colors = getWhitelabelTheme(whitelabelTheme)

    document.documentElement.style.setProperty("--page-background", colors.pageBackground)
    document.documentElement.style.setProperty("--widget-background", colors.widgetBackground)
    document.documentElement.style.setProperty("--text-primary", colors.textPrimary)
    document.documentElement.style.setProperty("--text-secondary", colors.textSecondary)
    document.documentElement.style.setProperty("--text-muted", colors.textMuted)
    document.documentElement.style.setProperty("--accent-primary", colors.accentPrimary)

    // Apply gradient backgrounds if available
    if (colors.pageBackgroundGradient) {
      document.documentElement.style.setProperty(
        "--page-background-gradient",
        `linear-gradient(135deg, ${colors.pageBackgroundGradient.from}, ${colors.pageBackgroundGradient.to})`,
      )
    } else {
      document.documentElement.style.setProperty("--page-background-gradient", colors.pageBackground)
    }

    if (colors.widgetBackgroundGradient) {
      document.documentElement.style.setProperty(
        "--widget-background-gradient",
        `linear-gradient(135deg, ${colors.widgetBackgroundGradient.from}, ${colors.widgetBackgroundGradient.to})`,
      )
    } else {
      document.documentElement.style.setProperty("--widget-background-gradient", colors.widgetBackground)
    }

    // Apply glassmorphism properties if enabled
    if (colors.isGlassmorphic) {
      document.documentElement.style.setProperty("--glass-backdrop-blur", colors.glassBackdropBlur || "blur(16px)")
      document.documentElement.style.setProperty(
        "--glass-border",
        colors.glassBorder || "1px solid rgba(255, 255, 255, 0.1)",
      )
    }

    // Update body background
    document.body.style.background = colors.pageBackgroundGradient
      ? `linear-gradient(135deg, ${colors.pageBackgroundGradient.from}, ${colors.pageBackgroundGradient.to})`
      : colors.pageBackground
    document.body.style.color = colors.textPrimary
  }, [whitelabelTheme])

  return null
}
