export type WhitelabelTheme =
  | "default"
  | "purple-incubator"
  | "corporate-blue"
  | "sunset-orange"
  | "glassmorphic-purple"
  | "light-mode" // Added light mode theme

export interface WhitelabelColors {
  name: string
  // Page background
  pageBackground: string
  pageBackgroundGradient?: { from: string; to: string }

  // Widget/Card backgrounds
  widgetBackground: string
  widgetBackgroundGradient?: { from: string; to: string }
  widgetBorder?: string
  isGlassmorphic?: boolean
  glassBackdropBlur?: string
  glassOpacity?: number
  glassBorder?: string

  // Text colors
  textPrimary: string
  textSecondary: string
  textMuted: string

  // Accent colors
  accentPrimary: string
  accentGradient: { from: string; to: string }

  // Event card colors (4 variations)
  eventCards: string[]
}

export const whitelabelThemes: Record<WhitelabelTheme, WhitelabelColors> = {
  default: {
    name: "Default Dark",
    pageBackground: "#121212",
    widgetBackground: "#1a1a1a",
    textPrimary: "#ffffff",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",
    accentPrimary: "#84cc16",
    accentGradient: { from: "#84cc16", to: "#10b981" },
    eventCards: ["#5B6B7F", "#7A8066", "#5F7F7F", "#7A8B5F"],
  },
  "purple-incubator": {
    name: "Purple Incubator",
    pageBackground: "#1a1a24",
    pageBackgroundGradient: { from: "#1a1a24", to: "#1e1e2e" },
    widgetBackground: "#2a2d3f",
    widgetBackgroundGradient: { from: "#2a2d3f", to: "#2f3244" },
    textPrimary: "#ffffff",
    textSecondary: "#b4b4c8",
    textMuted: "#8b8b9f",
    accentPrimary: "#8b7fcc",
    accentGradient: { from: "#8b7fcc", to: "#b899ff" },
    eventCards: [
      "#3d4158", // Dark slate-blue
      "#4a3f58", // Purple-gray
      "#3f4a5a", // Steel blue-gray
      "#4d4758", // Muted purple-blue
    ],
  },
  "corporate-blue": {
    name: "Corporate Blue",
    pageBackground: "#0f1419",
    pageBackgroundGradient: { from: "#0f1419", to: "#1a1f2e" },
    widgetBackground: "#1e2530",
    widgetBackgroundGradient: { from: "#1e2530", to: "#232d3d" },
    textPrimary: "#ffffff",
    textSecondary: "#a8b2c1",
    textMuted: "#6b7684",
    accentPrimary: "#3b82f6",
    accentGradient: { from: "#3b82f6", to: "#06b6d4" },
    eventCards: [
      "#2d3847", // Navy blue-gray
      "#374151", // Cool slate
      "#2d4252", // Ocean blue-gray
      "#384554", // Steel gray-blue
    ],
  },
  "sunset-orange": {
    name: "Sunset Orange",
    pageBackground: "#1a1410",
    pageBackgroundGradient: { from: "#1a1410", to: "#221a14" },
    widgetBackground: "#2a2218",
    widgetBackgroundGradient: { from: "#2a2218", to: "#32261d" },
    textPrimary: "#ffffff",
    textSecondary: "#c4b5a0",
    textMuted: "#8b7d6b",
    accentPrimary: "#f97316",
    accentGradient: { from: "#f97316", to: "#fb923c" },
    eventCards: [
      "#3d3328", // Warm brown-gray
      "#453528", // Rusty brown
      "#3d3830", // Taupe gray
      "#473a2d", // Warm slate
    ],
  },
  "glassmorphic-purple": {
    name: "Glassmorphic Purple",
    pageBackground: "#0a0a14",
    pageBackgroundGradient: { from: "#0a0a14", to: "#1a1330" },
    widgetBackground: "rgba(42, 45, 63, 0.4)",
    widgetBorder: "rgba(255, 255, 255, 0.1)",
    textPrimary: "#ffffff",
    textSecondary: "#b4b4c8",
    textMuted: "#8b8b9f",
    accentPrimary: "#8b7fcc",
    accentGradient: { from: "#8b7fcc", to: "#b899ff" },
    isGlassmorphic: true,
    glassBackdropBlur: "blur(16px)",
    glassOpacity: 0.4,
    glassBorder: "1px solid rgba(255, 255, 255, 0.1)",
    eventCards: [
      "rgba(91, 107, 127, 0.6)", // Blue-gray with transparency
      "rgba(122, 128, 102, 0.6)", // Olive-green with transparency
      "rgba(95, 127, 127, 0.6)", // Teal-cyan with transparency
      "rgba(122, 139, 95, 0.6)", // Lime-green with transparency
    ],
  },
  "light-mode": {
    name: "Light Mode",
    pageBackground: "#ffffff",
    widgetBackground: "#f5f5f5",
    widgetBorder: "1px solid #e5e7eb",
    textPrimary: "#111827",
    textSecondary: "#4b5563",
    textMuted: "#9ca3af",
    accentPrimary: "#84cc16",
    accentGradient: { from: "#84cc16", to: "#10b981" },
    eventCards: [
      "#8b96ab", // Lighter blue-gray for light mode
      "#9ba68a", // Lighter olive-green
      "#8ba6a6", // Lighter teal-cyan
      "#a0b187", // Lighter lime-green
    ],
  },
}

export function getWhitelabelTheme(theme: WhitelabelTheme): WhitelabelColors {
  return whitelabelThemes[theme]
}
