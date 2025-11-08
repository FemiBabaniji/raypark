"use client"

import { EventSearch } from "./event-search"
import { FilterTabs } from "./filter-tabs"

interface NavbarContentProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export function NavbarContent({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  tabs,
  activeTab,
  onTabChange,
}: NavbarContentProps) {
  return (
    <div className="flex items-center gap-6 max-w-3xl w-full">
      <div className="flex-shrink-0">
        <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      <div className="flex-1 max-w-md">
        <EventSearch value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} />
      </div>
    </div>
  )
}
