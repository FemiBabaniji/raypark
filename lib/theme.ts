export const THEME_COLOR_OPTIONS = [
  { name: "rose", gradient: "from-rose-400/40 to-rose-600/60" },
  { name: "blue", gradient: "from-blue-400/40 to-blue-600/60" },
  { name: "purple", gradient: "from-purple-400/40 to-purple-600/60" },
  { name: "green", gradient: "from-green-400/40 to-green-600/60" },
  { name: "orange", gradient: "from-orange-400/40 to-red-500/60" },
  { name: "teal", gradient: "from-teal-400/40 to-teal-600/60" },
  { name: "neutral", gradient: "from-neutral-400/40 to-neutral-600/60" },
] as const

export type ThemeIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6
