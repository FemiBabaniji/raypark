"use client"

interface ChipProps {
  label: string
  active: boolean
  onClick: () => void
}

export function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3 font-medium transition-all duration-200 border rounded-2xl text-xs"
      style={{
        backgroundColor: active ? "#393939" : "transparent",
        color: active ? "#FFFFFF" : "#B3B3B3",
        borderColor: "#444",
      }}
    >
      {label}
    </button>
  )
}
