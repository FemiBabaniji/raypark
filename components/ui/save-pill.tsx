interface SavePillProps {
  status: "idle" | "dirty" | "saving" | "saved" | "error"
}

export function SavePill({ status }: SavePillProps) {
  const map = {
    idle: "",
    dirty: "• unsaved",
    saving: "saving…",
    saved: "saved ✓",
    error: "error",
  } as const

  if (!map[status]) return null

  return <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">{map[status]}</span>
}
