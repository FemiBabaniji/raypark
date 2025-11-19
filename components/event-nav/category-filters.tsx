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
    <div className="flex gap-1.5 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onCategoryChange(filter.key)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            selectedCategory === filter.key ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
