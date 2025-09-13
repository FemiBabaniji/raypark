"use client"

import type { ReactNode } from "react"

export default function TopRail({
  left,
  center,
  right,
  maxWidthClass = "max-w-5xl", // keep identical across pages
  topClass = "top-8", // same vertical offset
  zClass = "z-50", // consistent stacking
  paddingX = "px-8", // same horizontal gutters
}: {
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
  maxWidthClass?: string
  topClass?: string
  zClass?: string
  paddingX?: string
}) {
  return (
    <div className={`fixed inset-x-0 ${topClass} ${zClass}`}>
      <div className={`mx-auto ${maxWidthClass} ${paddingX}`}>
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <div className="h-10 flex items-center">{left}</div>
          <div className="flex justify-center">{center}</div>
          <div className="h-10 flex items-center justify-end">{right}</div>
        </div>
      </div>
    </div>
  )
}
