"use client"

import { ReactNode } from 'react'
import { components, animations, colors } from '@/lib/design-system'

interface TimelineCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function TimelineCard({ 
  children, 
  className = '', 
  hover = true,
  onClick 
}: TimelineCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative
        ${className}
        ${onClick ? 'cursor-pointer' : ''}
        ${hover ? 'hover:scale-[1.01] active:scale-[0.99]' : ''}
      `}
      style={{
        backgroundColor: components.card.background,
        borderRadius: components.card.borderRadius,
        padding: components.card.padding,
        border: `1px solid ${components.card.border}`,
        boxShadow: components.card.shadow,
        transition: animations.transition.default,
      }}
    >
      {children}
    </div>
  )
}

interface TimelineRailProps {
  active?: boolean
  className?: string
}

export function TimelineRail({ active = false, className = '' }: TimelineRailProps) {
  return (
    <div 
      className={`absolute left-0 top-0 bottom-0 ${className}`}
      style={{
        width: components.timeline.railWidth,
        backgroundColor: active ? components.timeline.dotColor : components.timeline.railColor,
        transition: animations.transition.colors,
      }}
    />
  )
}

interface TimelineDotProps {
  active?: boolean
  color?: string
  className?: string
}

export function TimelineDot({ active = false, color, className = '' }: TimelineDotProps) {
  return (
    <div 
      className={`rounded-full ${className}`}
      style={{
        width: components.timeline.dotSize,
        height: components.timeline.dotSize,
        backgroundColor: color || (active ? components.timeline.dotColor : colors.border.strong),
        transition: animations.transition.colors,
        boxShadow: active ? `0 0 12px ${color || components.timeline.dotColor}` : 'none',
      }}
    />
  )
}
