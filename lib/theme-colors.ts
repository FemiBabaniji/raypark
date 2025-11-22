export type ThemeName = "green" | "blue" | "purple" | "orange" | "pink" | "teal"

export type EventCategory = "conference" | "workshop" | "mixer" | "masterclass" | "meetup"

export interface Theme {
  name: ThemeName
  displayName: string
  accentColor: string // High saturation color for badges/highlights
  cardColors: {
    conference: string
    workshop: string
    mixer: string
    masterclass: string
  }
  dotColor: string // Color shown in theme switcher
}

export const THEMES: Record<ThemeName, Theme> = {
  green: {
    name: "green",
    displayName: "Green",
    accentColor: "hsl(120, 75%, 45%)",
    dotColor: "#22c55e",
    cardColors: {
      conference: "#5F7F6B", // Green-gray, muted forest
      workshop: "#7A8066", // Olive-green, muted moss
      mixer: "#6B8B73", // Sage-green, muted mint
      masterclass: "#7A8B5F", // Lime-green, muted sage
    },
  },
  blue: {
    name: "blue",
    displayName: "Blue",
    accentColor: "hsl(210, 75%, 55%)",
    dotColor: "#3b82f6",
    cardColors: {
      conference: "#5B6B7F", // Blue-gray, muted slate
      workshop: "#5F7F8B", // Steel-blue, muted denim
      mixer: "#6B7F8B", // Cyan-blue, muted sky
      masterclass: "#5B7F8B", // Azure-blue, muted ocean
    },
  },
  purple: {
    name: "purple",
    displayName: "Purple",
    accentColor: "hsl(270, 70%, 60%)",
    dotColor: "#a855f7",
    cardColors: {
      conference: "#6B5F7F", // Purple-gray, muted plum
      workshop: "#7F5F8B", // Violet-purple, muted lavender
      mixer: "#7F6B8B", // Mauve-purple, muted orchid
      masterclass: "#8B5F7F", // Magenta-purple, muted lilac
    },
  },
  orange: {
    name: "orange",
    displayName: "Orange",
    accentColor: "hsl(25, 75%, 55%)",
    dotColor: "#f97316",
    cardColors: {
      conference: "#8B6B5F", // Orange-brown, muted clay
      workshop: "#8B735F", // Rust-orange, muted terracotta
      mixer: "#8B7F6B", // Tan-orange, muted sand
      masterclass: "#7F6B5F", // Peach-orange, muted coral
    },
  },
  pink: {
    name: "pink",
    displayName: "Pink",
    accentColor: "hsl(330, 70%, 60%)",
    dotColor: "#ec4899",
    cardColors: {
      conference: "#8B5F73", // Pink-gray, muted rose
      workshop: "#8B6B7F", // Mauve-pink, muted blush
      mixer: "#7F5F73", // Dusty-pink, muted berry
      masterclass: "#8B5F6B", // Rose-pink, muted coral
    },
  },
  teal: {
    name: "teal",
    displayName: "Teal",
    accentColor: "hsl(180, 70%, 45%)",
    dotColor: "#14b8a6",
    cardColors: {
      conference: "#5F7F7F", // Teal-cyan, muted seafoam
      workshop: "#5F8B8B", // Aqua-teal, muted turquoise
      mixer: "#6B8B8B", // Cyan-teal, muted aquamarine
      masterclass: "#5F8B7F", // Green-teal, muted jade
    },
  },
}

export function getThemeColor(themeName: ThemeName, category: EventCategory): string {
  const theme = THEMES[themeName]
  // Map meetup to masterclass colors
  if (category === "meetup") {
    return theme.cardColors.masterclass
  }
  return theme.cardColors[category] || theme.cardColors.workshop
}

export function getDefaultTheme(): ThemeName {
  return "green"
}
