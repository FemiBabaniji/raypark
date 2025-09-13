"use client"

import type React from "react"

interface TopRailProps {
  leftSlot?: React.ReactNode
  centerSlot?: React.ReactNode
  rightSlot?: React.ReactNode
}

export default function TopRail({ leftSlot, centerSlot, rightSlot }: TopRailProps) {
  return (
    <>
      {/* Left slot */}
      {leftSlot && <div className="fixed top-8 left-8 z-50">{leftSlot}</div>}

      {/* Center slot */}
      {centerSlot && <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40">{centerSlot}</div>}

      {/* Right slot */}
      {rightSlot && <div className="fixed top-8 right-8 z-50">{rightSlot}</div>}
    </>
  )
}
