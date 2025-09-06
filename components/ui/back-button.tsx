"use client"

import type React from "react"

interface BackButtonProps {
  onClick: () => void
  className?: string
  "aria-label"?: string
  icon?: React.ComponentType<any>
}

export default function BackButton({
  onClick,
  className = "",
  "aria-label": ariaLabel = "Back",
  icon: Icon,
}: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 bg-neutral-800/90 backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-neutral-700/90 transition-colors ${className}`}
      aria-label={ariaLabel}
    >
      {Icon ? (
        <Icon className="w-5 h-5" />
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      )}
    </button>
  )
}

export { BackButton }
