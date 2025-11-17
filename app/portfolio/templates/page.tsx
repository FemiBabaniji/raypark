"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { PORTFOLIO_TEMPLATES, type PortfolioTemplate } from "@/lib/portfolio-templates"
import { THEME_COLOR_OPTIONS } from "@/lib/theme"
import { useAuth } from "@/lib/auth"
import { createPortfolio } from "@/lib/portfolio-service"

export default function TemplateSelectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  const communityId = searchParams?.get('community')

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth?redirect=/portfolio/templates")
    }
  }, [user, loading, router])

  const handleTemplateSelect = async (templateId: string | null) => {
    if (isCreating || !user) return
    
    setIsCreating(true)
    
    try {
      const template = templateId ? PORTFOLIO_TEMPLATES.find(t => t.id === templateId) : null
      
      const portfolioName = template ? `My ${template.name} Portfolio` : "My Portfolio"
      const newPortfolio = await createPortfolio(user, portfolioName, communityId || null)
      
      if (template) {
        localStorage.setItem('pending-template', JSON.stringify({
          portfolioId: newPortfolio.id,
          template: template,
          timestamp: Date.now()
        }))
      }
      
      const params = new URLSearchParams()
      params.set('portfolio', newPortfolio.id)
      if (communityId) {
        params.set('community', communityId)
      }
      
      router.push(`/portfolio/builder?${params.toString()}`)
    } catch (error) {
      console.error("[v0] Failed to create portfolio:", error)
      setIsCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[oklch(0.18_0_0)] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[oklch(0.18_0_0)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Template</h1>
          <p className="text-white/60 text-base">
            Start with a professional template tailored to your profession, or build from scratch
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 mb-8">
          <button
            onClick={() => handleTemplateSelect(null)}
            disabled={isCreating}
            className={`relative w-full bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-sm rounded-2xl p-6 transition-all duration-200 border text-left group ${
              selectedTemplateId === null 
                ? 'border-white/30 ring-2 ring-white/20' 
                : 'border-white/[0.08] hover:border-white/20'
            } ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-600/40 to-neutral-800/60 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8 text-white/60" />
              </div>
            </div>
            
            <h3 className="text-white font-semibold text-lg mb-2">
              Start from Scratch
            </h3>
            
            <p className="text-white/50 text-sm mb-4">
              Build your portfolio from the ground up with complete creative freedom
            </p>
            
            <div className="flex flex-wrap gap-2 text-xs text-white/40">
              <span className="px-2 py-1 bg-white/5 rounded">Blank Canvas</span>
              <span className="px-2 py-1 bg-white/5 rounded">Full Control</span>
            </div>
          </button>

          {PORTFOLIO_TEMPLATES.map((template) => {
            const gradient = THEME_COLOR_OPTIONS[template.selectedColor]?.gradient ?? "from-neutral-600/40 to-neutral-800/60"
            
            return (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                disabled={isCreating}
                className={`relative w-full bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-sm rounded-2xl p-6 transition-all duration-200 border text-left group ${
                  selectedTemplateId === template.id 
                    ? 'border-white/30 ring-2 ring-white/20' 
                    : 'border-white/[0.08] hover:border-white/20'
                } ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-3xl">{template.icon}</span>
                  </div>
                </div>
                
                <h3 className="text-white font-semibold text-lg mb-2">
                  {template.name}
                </h3>
                
                <p className="text-white/50 text-sm mb-4">
                  {template.description}
                </p>
                
                <div className="flex flex-wrap gap-2 text-xs text-white/40">
                  {template.presets.widgets.left.slice(0, 2).map((widget, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/5 rounded capitalize">
                      {widget}
                    </span>
                  ))}
                  {template.presets.widgets.right.slice(0, 1).map((widget, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/5 rounded capitalize">
                      {widget}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {isCreating && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-neutral-900 rounded-2xl p-8 border border-white/10 max-w-md text-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white font-medium">Creating your portfolio...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
