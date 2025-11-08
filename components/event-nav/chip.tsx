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
      className="px-4 py-2 font-medium transition-all duration-200 border rounded-xl text-xs whitespace-nowrap"
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
