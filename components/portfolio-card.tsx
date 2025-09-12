"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Share } from "lucide-react"

export type Portfolio = {
  id: string
  name: string
  title: string
  email: string
  location: string
  handle: string
  avatarUrl?: string
  initials: string
  selectedColor?: number
}

const colorOptions = [
  { name: "rose", gradient: "from-rose-400/40 to-rose-600/60" },
  { name: "blue", gradient: "from-blue-400/40 to-blue-600/60" },
  { name: "purple", gradient: "from-purple-400/40 to-purple-600/60" },
  { name: "green", gradient: "from-green-400/40 to-green-600/60" },
  { name: "orange", gradient: "from-orange-400/40 to-orange-600/60" },
  { name: "teal", gradient: "from-teal-400/40 to-teal-600/60" },
  { name: "neutral", gradient: "from-neutral-400/40 to-neutral-600/60" },
]

export function PortfolioCard({
  portfolio,
  onClick,
  onShare,
  onMore,
}: {
  portfolio: Portfolio
  onClick?: (id: string) => void
  onShare?: (id: string) => void
  onMore?: (id: string) => void
}) {
  const selectedColorOption = colorOptions[portfolio.selectedColor || 0]

  return (
    <Card
      className={`bg-gradient-to-b ${selectedColorOption.gradient} border-none text-white cursor-pointer hover:scale-105 transition-transform w-full h-96 relative overflow-hidden`}
      onClick={() => onClick?.(portfolio.id)}
    >
      <CardContent className="p-6 h-full flex flex-col relative">
        {/* Profile Photo */}
        <Avatar className="w-20 h-20 mb-6">
          {portfolio.avatarUrl ? (
            <AvatarImage src={portfolio.avatarUrl || "/placeholder.svg"} className="object-cover w-full h-full" />
          ) : null}
          <AvatarFallback>{portfolio.initials}</AvatarFallback>
        </Avatar>

        {/* Name and Title */}
        <div className="flex-1">
          <h1 className="text-4xl text-black mb-2 leading-tight">{portfolio.name}</h1>
          <p className="text-lg text-black/80">{portfolio.title}</p>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 mt-8">
          <div className="text-white">{portfolio.email}</div>
          <div className="text-white/90">{portfolio.location}</div>
          <div className="flex items-center justify-between">
            <Badge className="bg-foreground/20 text-white border-none hover:bg-foreground/30 px-4 py-2 rounded-full">
              {portfolio.handle}
            </Badge>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onShare?.(portfolio.id)
              }}
              className="w-10 h-10 bg-foreground/20 rounded-full flex items-center justify-center hover:bg-foreground/30 transition-colors"
            >
              <Share className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* More Options */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onMore?.(portfolio.id)
          }}
          className="absolute top-6 right-6 text-black/60 hover:text-black"
        >
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </CardContent>
    </Card>
  )
}
