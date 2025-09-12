"use client"
import { Plus } from "lucide-react"

interface AddButtonProps {
  onClick: () => void
  label?: string
  className?: string
  variant?: "card" | "icon" | "compact"
  size?: "sm" | "md" | "lg"
  "aria-label"?: string
}

export default function AddButton({
  onClick,
  label = "Add New",
  className = "",
  variant = "card",
  size = "md",
  "aria-label": ariaLabel,
}: AddButtonProps) {
  const sizeClasses = {
    sm: {
      icon: "w-8 h-8",
      plusIcon: "w-4 h-4",
      text: "text-xs",
      padding: "p-2",
    },
    md: {
      icon: "w-10 h-10",
      plusIcon: "w-5 h-5",
      text: "text-sm",
      padding: "p-3",
    },
    lg: {
      icon: "w-12 h-12",
      plusIcon: "w-6 h-6",
      text: "text-base",
      padding: "p-4",
    },
  }

  const currentSize = sizeClasses[size]

  if (variant === "card") {
    return (
      <div
        onClick={onClick}
        className={`w-full aspect-[4/5] rounded-3xl border-2 border-dashed border-neutral-700 hover:border-neutral-500 transition-colors cursor-pointer flex flex-col items-center justify-center group backdrop-blur-sm hover:scale-105 transition-all ${className}`}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel || `Add new item`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onClick()
          }
        }}
      >
        <div
          className={`${currentSize.icon} bg-neutral-800/90 backdrop-blur-xl rounded-xl flex items-center justify-center text-white group-hover:bg-neutral-700/90 transition-colors`}
        >
          <Plus className={currentSize.plusIcon} />
        </div>
        <span className={`text-neutral-400 font-medium ${currentSize.text} mt-2`}>{label}</span>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-2 ${currentSize.padding} rounded-xl bg-neutral-800/90 hover:bg-neutral-700/90 backdrop-blur-xl text-white transition-colors ${className}`}
        aria-label={ariaLabel || `Add new item`}
      >
        <Plus className={currentSize.plusIcon} />
        <span className={`font-medium ${currentSize.text}`}>{label}</span>
      </button>
    )
  }

  // Default icon variant
  return (
    <button
      onClick={onClick}
      className={`${currentSize.icon} bg-neutral-800/90 backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-neutral-700/90 transition-colors ${className}`}
      aria-label={ariaLabel || `Add new item`}
    >
      <Plus className={currentSize.plusIcon} />
    </button>
  )
}

export { AddButton }
