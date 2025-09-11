"use client"

import { useState } from "react"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import type { UnifiedPortfolio } from "@/components/unified-portfolio-card"

const DISCOVER_PORTFOLIOS: UnifiedPortfolio[] = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    title: "UX Designer",
    email: "sarah@example.com",
    location: "San Francisco, CA",
    handle: "@sarahchen",
    initials: "SC",
    selectedColor: 0,
    isLive: true,
    isTemplate: false,
  },
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    title: "Full Stack Developer",
    email: "alex@example.com",
    location: "Austin, TX",
    handle: "@alexrivera",
    initials: "AR",
    selectedColor: 1,
    isLive: true,
    isTemplate: false,
  },
  {
    id: "maya-patel",
    name: "Maya Patel",
    title: "Product Manager",
    email: "maya@example.com",
    location: "New York, NY",
    handle: "@mayapatel",
    initials: "MP",
    selectedColor: 2,
    isLive: true,
    isTemplate: false,
  },
  {
    id: "jordan-kim",
    name: "Jordan Kim",
    title: "Data Scientist",
    email: "jordan@example.com",
    location: "Seattle, WA",
    handle: "@jordankim",
    initials: "JK",
    selectedColor: 3,
    isLive: true,
    isTemplate: false,
  },
  {
    id: "taylor-brown",
    name: "Taylor Brown",
    title: "Marketing Specialist",
    email: "taylor@example.com",
    location: "Chicago, IL",
    handle: "@taylorbrown",
    initials: "TB",
    selectedColor: 4,
    isLive: true,
    isTemplate: false,
  },
  {
    id: "casey-wong",
    name: "Casey Wong",
    title: "DevOps Engineer",
    email: "casey@example.com",
    location: "Portland, OR",
    handle: "@caseywong",
    initials: "CW",
    selectedColor: 5,
    isLive: true,
    isTemplate: false,
  },
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filteredPortfolios = DISCOVER_PORTFOLIOS.filter((portfolio) => {
    const matchesSearch =
      portfolio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portfolio.title.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedFilter === "all") return matchesSearch
    if (selectedFilter === "designers") return matchesSearch && portfolio.title.toLowerCase().includes("design")
    if (selectedFilter === "developers")
      return (
        matchesSearch &&
        (portfolio.title.toLowerCase().includes("developer") || portfolio.title.toLowerCase().includes("engineer"))
      )
    if (selectedFilter === "managers") return matchesSearch && portfolio.title.toLowerCase().includes("manager")

    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Discover Talent</h1>
          <p className="text-zinc-400">Explore portfolios from talented professionals</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: "all", label: "All" },
              { key: "designers", label: "Designers" },
              { key: "developers", label: "Developers" },
              { key: "managers", label: "Managers" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  selectedFilter === filter.key
                    ? "bg-white text-zinc-900"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((portfolio) => (
            <UnifiedPortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              onClick={() => {
                // Handle portfolio click - could navigate to portfolio view
                console.log("Clicked portfolio:", portfolio.id)
              }}
              showActions={false}
            />
          ))}
        </div>

        {filteredPortfolios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No portfolios found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
