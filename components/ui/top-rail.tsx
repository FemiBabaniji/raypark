"use client"

import type React from "react"
import { APP_MAX_WIDTH, APP_PADDING_X, APP_TOP_OFFSET, APP_Z } from "@/lib/layout"

interface TopRailProps {
  leftSlot?: React.ReactNode
  centerSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  maxWidthClass?: string
  paddingX?: string
  topClass?: string
  zClass?: string
}

export default function TopRail({
  leftSlot,
  centerSlot,
  rightSlot,
  maxWidthClass = APP_MAX_WIDTH,
  paddingX = APP_PADDING_X,
  topClass = APP_TOP_OFFSET,
  zClass = APP_Z,
}: TopRailProps) {
  return (
    <div className={`fixed inset-x-0 ${topClass} ${zClass}`}>
      <div className={`mx-auto ${maxWidthClass} ${paddingX}`}>
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <div className="h-10 flex items-center">{leftSlot}</div>
          <div className="flex justify-center">{centerSlot}</div>
          <div className="h-10 flex items-center justify-end">{rightSlot}</div>
        </div>
      </div>
    </div>
  )
}
