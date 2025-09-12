"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  onClick: () => void
  className?: string
}

export default function BackButton({ onClick, className = "" }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`text-white/80 hover:text-white hover:bg-white/10 transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back
    </Button>
  )
}
