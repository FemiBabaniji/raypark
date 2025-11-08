"use client"

import { Chip } from "./chip"

interface FilterTabsProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
  return (
    <div className="flex gap-4">
      {tabs.map((tab) => (
        <Chip key={tab} label={tab} active={tab === activeTab} onClick={() => onTabChange(tab)} />
      ))}
    </div>
  )
}
