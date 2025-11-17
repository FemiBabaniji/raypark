"use client"

import { useState, useEffect } from "react"
import { MoreVertical, Grid3x3, List, Plus, Trash2 } from 'lucide-react'
import { THEME_COLOR_OPTIONS } from "@/lib/theme"
import type { ThemeIndex } from "@/lib/theme"

export interface ExtendedPortfolio {
  id: string
  name: string
  title: string
  email?: string
  location?: string
  handle?: string
  avatarUrl?: string
  initials?: string
  selectedColor: ThemeIndex
  isLive?: boolean
  isTemplate?: boolean
  community?: {
    id: string
    name: string
    code?: string
  }
}

interface DashboardPortfolioGridProps {
  portfolios: ExtendedPortfolio[]
  onPortfolioClick: (portfolioId: string) => void
  onCreatePortfolio: () => void
  onSyncCommunity: (portfolioId: string, communityId: string | null) => void
  onDeletePortfolio: (portfolioId: string) => void
  userCommunities: Array<{ id: string; name: string; code: string }>
  onCheckExistingPortfolio?: (communityId: string) => Promise<{ id: string; name: string } | null>
}

const ConfirmSwapModal = ({
  isOpen,
  onClose,
  onConfirm,
  existingPortfolioName,
  newPortfolioName,
  communityName,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  existingPortfolioName: string
  newPortfolioName: string
  communityName: string
}) => {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-neutral-900 rounded-2xl border border-white/10 shadow-2xl z-[101] p-6">
        <h3 className="text-xl font-semibold text-white mb-3">Replace Community Portfolio?</h3>
        <p className="text-white/70 text-sm mb-6">
          You already have <span className="text-white font-medium">"{existingPortfolioName}"</span> synced to{" "}
          <span className="text-white font-medium">{communityName}</span>. 
          <br /><br />
          Syncing <span className="text-white font-medium">"{newPortfolioName}"</span> will unlink the previous portfolio. Are you sure?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-sm font-medium transition-colors"
          >
            Replace Portfolio
          </button>
        </div>
      </div>
    </>
  )
}

const PortfolioCard = ({
  portfolio,
  onClick,
  onSyncCommunity,
  onDeletePortfolio,
  userCommunities,
  onCheckExistingPortfolio,
}: {
  portfolio: ExtendedPortfolio
  onClick: () => void
  onSyncCommunity: (portfolioId: string, communityId: string | null) => void
  onDeletePortfolio: (portfolioId: string) => void
  userCommunities: Array<{ id: string; name: string; code: string }>
  onCheckExistingPortfolio?: (communityId: string) => Promise<{ id: string; name: string } | null>
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    communityId: string | null
    communityName: string
    existingPortfolioName: string
  }>({
    isOpen: false,
    communityId: null,
    communityName: "",
    existingPortfolioName: "",
  })
  
  const gradient = THEME_COLOR_OPTIONS[portfolio.selectedColor]?.gradient ?? "from-neutral-600/40 to-neutral-800/60"
  
  const initials = portfolio.initials || portfolio.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  
  const communityText = portfolio.community?.name || "No Community"

  const handleCommunitySelect = async (communityId: string | null) => {
    if (communityId === null) {
      // Unlinking is always safe
      onSyncCommunity(portfolio.id, null)
      setIsMenuOpen(false)
      return
    }

    // Check if there's already a portfolio for this community
    if (onCheckExistingPortfolio) {
      const existing = await onCheckExistingPortfolio(communityId)
      
      if (existing && existing.id !== portfolio.id) {
        // Show confirmation modal
        const community = userCommunities.find(c => c.id === communityId)
        setConfirmModal({
          isOpen: true,
          communityId,
          communityName: community?.name || "this community",
          existingPortfolioName: existing.name,
        })
        setIsMenuOpen(false)
        return
      }
    }

    // No existing portfolio or same portfolio, proceed normally
    onSyncCommunity(portfolio.id, communityId)
    setIsMenuOpen(false)
  }

  return (
    <>
      <div className="relative w-full bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-sm rounded-2xl transition-all duration-200 border border-white/[0.08] group">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsMenuOpen(!isMenuOpen)
          }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-neutral-900/90 backdrop-blur-sm hover:bg-neutral-800/90 border border-white/10 transition-colors flex items-center justify-center z-20"
          aria-label="Portfolio options"
        >
          <MoreVertical className="w-4 h-4 text-white/70" />
        </button>

        <button
          onClick={onClick}
          className="w-full p-6 text-left"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="relative">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                {portfolio.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={portfolio.avatarUrl || "/placeholder.svg"} alt={portfolio.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <span className="text-white font-bold text-lg">{initials}</span>
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[2.5px] border-[#1a1a1a] ${portfolio.isLive ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </div>
          </div>
          
          <h3 className="text-white font-semibold text-lg mb-1.5 group-hover:text-white/90 transition-colors">
            {portfolio.name}
          </h3>
          
          <p className="text-xs text-white/40">
            {communityText}
          </p>
        </button>

        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={(e) => {
                e.stopPropagation()
                setIsMenuOpen(false)
              }} 
            />
            <div className="absolute right-0 top-10 w-56 bg-neutral-900/95 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 overflow-hidden z-50">
              <div className="p-2">
                <div className="px-3 py-2 text-xs text-white/50 font-medium uppercase tracking-wider">
                  Sync to Community
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCommunitySelect(null)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !portfolio.community
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  None (Personal)
                  {!portfolio.community && (
                    <span className="ml-2 text-emerald-400">✓</span>
                  )}
                </button>

                {userCommunities.length > 0 ? (
                  userCommunities.map((community) => (
                    <button
                      key={community.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCommunitySelect(community.id)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        portfolio.community?.id === community.id
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {community.name}
                      {portfolio.community?.id === community.id && (
                        <span className="ml-2 text-emerald-400">✓</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-xs text-white/30 text-center">
                    No communities available
                  </div>
                )}
                
                <div className="border-t border-white/10 mt-2 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Are you sure you want to delete "${portfolio.name}"? This action cannot be undone.`)) {
                        onDeletePortfolio(portfolio.id)
                      }
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Portfolio
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmSwapModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => {
          if (confirmModal.communityId) {
            onSyncCommunity(portfolio.id, confirmModal.communityId)
          }
        }}
        existingPortfolioName={confirmModal.existingPortfolioName}
        newPortfolioName={portfolio.name}
        communityName={confirmModal.communityName}
      />
    </>
  )
}

const EmptyState = ({ onCreatePortfolio }: { onCreatePortfolio: () => void }) => {
  return (
    <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
      <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
        <div className="w-8 h-8 text-white/40">📁</div>
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">No Portfolios</h3>
      <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto">
        You haven't created any portfolios yet. Get started by creating your first portfolio.
      </p>
      <button
        onClick={onCreatePortfolio}
        className="px-6 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white text-sm font-medium transition-colors"
      >
        Create Portfolio
      </button>
    </div>
  )
}

export function DashboardPortfolioGrid({
  portfolios,
  onPortfolioClick,
  onCreatePortfolio,
  onSyncCommunity,
  onDeletePortfolio,
  userCommunities,
  onCheckExistingPortfolio,
}: DashboardPortfolioGridProps) {
  const [displayView, setDisplayView] = useState<"grid" | "list">("grid")
  const [localPortfolios, setLocalPortfolios] = useState(portfolios)

  useEffect(() => {
    setLocalPortfolios(portfolios)
  }, [portfolios])

  useEffect(() => {
    const handleColorUpdate = (event: CustomEvent) => {
      const { portfolioId: updatedPortfolioId, selectedColor } = event.detail
      
      console.log("[v0] Dashboard received color update for:", updatedPortfolioId, "color:", selectedColor)
      
      setLocalPortfolios(prev => 
        prev.map(p => 
          p.id === updatedPortfolioId ? { ...p, selectedColor } : p
        )
      )
    }

    window.addEventListener("portfolio-color-updated" as any, handleColorUpdate)

    return () => {
      window.removeEventListener("portfolio-color-updated" as any, handleColorUpdate)
    }
  }, [])

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">My Portfolios</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDisplayView("grid")}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                displayView === "grid"
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
              aria-label="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDisplayView("list")}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                displayView === "list"
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onCreatePortfolio}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-colors border border-white/10"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
        </div>
      </div>

      {localPortfolios.length > 0 ? (
        displayView === "grid" ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {localPortfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onClick={() => onPortfolioClick(portfolio.id)}
                onSyncCommunity={onSyncCommunity}
                onDeletePortfolio={onDeletePortfolio}
                userCommunities={userCommunities}
                onCheckExistingPortfolio={onCheckExistingPortfolio}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {localPortfolios.map((portfolio) => {
              const gradient = THEME_COLOR_OPTIONS[portfolio.selectedColor]?.gradient ?? "from-neutral-600/40 to-neutral-800/60"
              const initials = portfolio.initials || portfolio.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
              const communityText = portfolio.community?.name || "No Community"
              const [isMenuOpen, setIsMenuOpen] = useState(false)
              const [confirmModal, setConfirmModal] = useState<{
                isOpen: boolean
                communityId: string | null
                communityName: string
                existingPortfolioName: string
              }>({
                isOpen: false,
                communityId: null,
                communityName: "",
                existingPortfolioName: "",
              })

              const handleCommunitySelect = async (communityId: string | null) => {
                if (communityId === null) {
                  onSyncCommunity(portfolio.id, null)
                  setIsMenuOpen(false)
                  return
                }

                if (onCheckExistingPortfolio) {
                  const existing = await onCheckExistingPortfolio(communityId)
                  
                  if (existing && existing.id !== portfolio.id) {
                    const community = userCommunities.find(c => c.id === communityId)
                    setConfirmModal({
                      isOpen: true,
                      communityId,
                      communityName: community?.name || "this community",
                      existingPortfolioName: existing.name,
                    })
                    setIsMenuOpen(false)
                    return
                  }
                }

                onSyncCommunity(portfolio.id, communityId)
                setIsMenuOpen(false)
              }

              return (
                <div key={portfolio.id} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsMenuOpen(!isMenuOpen)
                    }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-neutral-900/90 backdrop-blur-sm hover:bg-neutral-800/90 border border-white/10 transition-colors flex items-center justify-center z-20"
                    aria-label="Portfolio options"
                  >
                    <MoreVertical className="w-4 h-4 text-white/70" />
                  </button>
                  
                  <button
                    onClick={() => onPortfolioClick(portfolio.id)}
                    className="w-full bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-sm rounded-2xl p-4 transition-all duration-200 border border-white/[0.08] text-left flex items-center gap-4"
                  >
                    <div className="relative flex-shrink-0">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        {portfolio.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={portfolio.avatarUrl || "/placeholder.svg"} alt={portfolio.name} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <span className="text-white font-bold text-base">{initials}</span>
                        )}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[2px] border-[#1a1a1a] ${portfolio.isLive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-base mb-0.5 truncate">
                        {portfolio.name}
                      </h3>
                      <p className="text-xs text-white/40 truncate">
                        {communityText}
                      </p>
                    </div>
                  </button>

                  {isMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsMenuOpen(false)
                        }} 
                      />
                      <div className="absolute right-0 top-16 w-56 bg-neutral-900/95 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 overflow-hidden z-50">
                        <div className="p-2">
                          <div className="px-3 py-2 text-xs text-white/50 font-medium uppercase tracking-wider">
                            Sync to Community
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCommunitySelect(null)
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              !portfolio.community
                                ? 'bg-white/10 text-white'
                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            None (Personal)
                            {!portfolio.community && (
                              <span className="ml-2 text-emerald-400">✓</span>
                            )}
                          </button>

                          {userCommunities.length > 0 ? (
                            userCommunities.map((community) => (
                              <button
                                key={community.id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCommunitySelect(community.id)
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                  portfolio.community?.id === community.id
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                {community.name}
                                {portfolio.community?.id === community.id && (
                                  <span className="ml-2 text-emerald-400">✓</span>
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-4 text-xs text-white/30 text-center">
                              No communities available
                            </div>
                          )}
                          
                          <div className="border-t border-white/10 mt-2 pt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (confirm(`Are you sure you want to delete "${portfolio.name}"? This action cannot be undone.`)) {
                                  onDeletePortfolio(portfolio.id)
                                }
                                setIsMenuOpen(false)
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Portfolio
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <ConfirmSwapModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                    onConfirm={() => {
                      if (confirmModal.communityId) {
                        onSyncCommunity(portfolio.id, confirmModal.communityId)
                      }
                    }}
                    existingPortfolioName={confirmModal.existingPortfolioName}
                    newPortfolioName={portfolio.name}
                    communityName={confirmModal.communityName}
                  />
                </div>
              )
            })}
          </div>
        )
      ) : (
        <EmptyState onCreatePortfolio={onCreatePortfolio} />
      )}
    </div>
  )
}
