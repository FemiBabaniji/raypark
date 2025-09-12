import type * as React from "react"
import { cn } from "@/lib/utils"

type Variant = "widget" | "module" | "tile" | "ghost"

export function Panel({
  variant = "widget",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: Variant }) {
  const base = "rounded-3xl backdrop-blur-sm transition-colors duration-200"

  const variants: Record<Variant, string> = {
    widget: "shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_10px_30px_rgba(0,0,0,0.35)]",

    module: "rounded-2xl shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_6px_18px_rgba(0,0,0,0.25)]",

    tile: "shadow-none",

    // Transparent container - no background or borders
    ghost: "bg-transparent shadow-none",
  }

  const getBackgroundColor = () => {
    switch (variant) {
      case "widget":
        return { backgroundColor: "#393939" }
      case "module":
        return { backgroundColor: "#393939" }
      case "tile":
        return { backgroundColor: "#2B2B2B" }
      default:
        return {}
    }
  }

  return <div className={cn(base, variants[variant], className)} style={getBackgroundColor()} {...props} />
}
