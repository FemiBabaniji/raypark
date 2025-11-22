"use client"

interface Filter {
  key: string
  label: string
}

interface CategoryFiltersProps {
  filters: Filter[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilters({ filters, selectedCategory, onCategoryChange }: CategoryFiltersProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onCategoryChange(filter.key)}
          className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === filter.key
              ? "bg-white text-black"
              : "bg-[#2a2a2a] text-gray-400 hover:bg-[#333333] hover:text-gray-300"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
