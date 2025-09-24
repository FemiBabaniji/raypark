"use client"

import { useState } from "react"
import { GripVertical, Palette, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { THEME_COLOR_OPTIONS } from "@/lib/theme"
import type { ThemeIndex } from "../types"

type StartupData = {
  name: string
  tagline: string
  stage: "Idea" | "Prototype" | "Pilot" | "Growth" | "Scaling"
  ask: string
  problem: string
  solution: string
  market: string
  targetCustomer: string
  marketSize: string
  traction: string[]
  team: Array<{ name: string; role: string; linkedin?: string }>
  callToAction: {
    funding: boolean
    mentorship: boolean
    partnerships: boolean
    hiring: boolean
    pilotCustomers: boolean
  }
  links: {
    github?: string
    website?: string
    demo?: string
    deck?: string
  }
}

type Props = {
  startupData: StartupData
  isPreviewMode?: boolean
  onChange: (updates: Partial<StartupData>) => void
  editingField?: string | null
  setEditingField?: (field: string | null) => void
  selectedColor: ThemeIndex
  onColorChange?: (color: ThemeIndex) => void
}

const SLIDES = [
  { id: "identity", title: "Identity" },
  { id: "problem", title: "Problem" },
  { id: "solution", title: "Solution" },
  { id: "market", title: "Market" },
  { id: "traction", title: "Traction" },
  { id: "team", title: "Team" },
  { id: "cta", title: "Call to Action" },
]

export default function StartupWidget({
  startupData,
  isPreviewMode = false,
  onChange,
  editingField,
  setEditingField,
  selectedColor,
  onColorChange,
}: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const gradient = THEME_COLOR_OPTIONS[selectedColor]?.gradient ?? "from-neutral-600/50 to-neutral-800/50"
  const backgroundStyle = selectedColor !== undefined ? `bg-gradient-to-br ${gradient}` : "bg-[#1a1a1a]"

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)

  const renderSlide = () => {
    const slide = SLIDES[currentSlide]

    switch (slide.id) {
      case "identity":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{startupData.name?.charAt(0) || "S"}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {editingField === "startup-name" ? (
                  <input
                    type="text"
                    value={startupData.name || ""}
                    onChange={(e) => onChange({ name: e.target.value })}
                    onBlur={() => setEditingField?.(null)}
                    className="bg-transparent border-none outline-none text-2xl font-bold text-white text-center w-full"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => !isPreviewMode && setEditingField?.("startup-name")}
                    className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-2 -mx-2" : ""}
                  >
                    {startupData.name || "Startup Name"}
                  </span>
                )}
              </h2>
              <p className="text-white/70 mb-4">
                {editingField === "startup-tagline" ? (
                  <input
                    type="text"
                    value={startupData.tagline || ""}
                    onChange={(e) => onChange({ tagline: e.target.value })}
                    onBlur={() => setEditingField?.(null)}
                    className="bg-transparent border-none outline-none text-white/70 text-center w-full"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => !isPreviewMode && setEditingField?.("startup-tagline")}
                    className={!isPreviewMode ? "cursor-text hover:bg-white/10 rounded px-2 -mx-2" : ""}
                  >
                    "{startupData.tagline || "We're building X for Y"}"
                  </span>
                )}
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <div className="bg-white/20 rounded-full px-3 py-1">Stage: {startupData.stage || "Pilot"}</div>
                <div className="bg-white/20 rounded-full px-3 py-1">
                  Ask: {startupData.ask || "Funding + Partnerships"}
                </div>
              </div>
            </div>
          </div>
        )

      case "problem":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Problem We're Solving</h3>
            {editingField === "startup-problem" ? (
              <textarea
                value={startupData.problem || ""}
                onChange={(e) => onChange({ problem: e.target.value })}
                onBlur={() => setEditingField?.(null)}
                className="bg-transparent border border-white/20 rounded-lg p-3 text-white w-full h-32 resize-none"
                autoFocus
              />
            ) : (
              <p
                onClick={() => !isPreviewMode && setEditingField?.("startup-problem")}
                className={`text-white/80 ${!isPreviewMode ? "cursor-text hover:bg-white/10 rounded p-2 -m-2" : ""}`}
              >
                {startupData.problem || "Describe the problem your startup solves..."}
              </p>
            )}
          </div>
        )

      case "solution":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Our Solution</h3>
            {editingField === "startup-solution" ? (
              <textarea
                value={startupData.solution || ""}
                onChange={(e) => onChange({ solution: e.target.value })}
                onBlur={() => setEditingField?.(null)}
                className="bg-transparent border border-white/20 rounded-lg p-3 text-white w-full h-32 resize-none"
                autoFocus
              />
            ) : (
              <p
                onClick={() => !isPreviewMode && setEditingField?.("startup-solution")}
                className={`text-white/80 ${!isPreviewMode ? "cursor-text hover:bg-white/10 rounded p-2 -m-2" : ""}`}
              >
                {startupData.solution || "Describe how you solve the problem..."}
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.entries(startupData.links || {}).map(
                ([key, url]) =>
                  url && (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                      onClick={() => window.open(url, "_blank")}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      {key}
                    </Button>
                  ),
              )}
            </div>
          </div>
        )

      case "market":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Target Market</h3>
            <div className="space-y-3">
              <div>
                <label className="text-white/60 text-sm">Target Customer</label>
                <p className="text-white/80">{startupData.targetCustomer || "Students, SMEs, Creators, etc."}</p>
              </div>
              <div>
                <label className="text-white/60 text-sm">Market Size</label>
                <p className="text-white/80">{startupData.marketSize || "$1.2B (estimated)"}</p>
              </div>
              <div>
                <label className="text-white/60 text-sm">Market Description</label>
                <p className="text-white/80">{startupData.market || "Describe your market opportunity..."}</p>
              </div>
            </div>
          </div>
        )

      case "traction":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Traction & Milestones</h3>
            <div className="space-y-2">
              {(startupData.traction || ["1,200 beta users", "5 paid pilots", "Raised $20k pre-seed"]).map(
                (item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/60"></div>
                    <span className="text-white/80">{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        )

      case "team":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Team</h3>
            <div className="space-y-3">
              {(
                startupData.team || [
                  { name: "Jane Doe", role: "CEO" },
                  { name: "John Smith", role: "CTO" },
                ]
              ).map((member, idx) =>
                member ? (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{member.name || "Team Member"}</p>
                      <p className="text-white/60 text-sm">{member.role || "Role"}</p>
                    </div>
                    {member.linkedin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/60 hover:text-white"
                        onClick={() => window.open(member.linkedin, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ) : null,
              )}
            </div>
          </div>
        )

      case "cta":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">We're Looking For</h3>
            <div className="space-y-2">
              {Object.entries(
                startupData.callToAction || {
                  mentorship: true,
                  pilotCustomers: true,
                  funding: false,
                  partnerships: false,
                  hiring: false,
                },
              ).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={`text-lg ${value ? "text-green-400" : "text-red-400"}`}>{value ? "✅" : "❌"}</span>
                  <span className="text-white/80 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={`${backgroundStyle} backdrop-blur-xl rounded-3xl p-8 group cursor-grab active:cursor-grabbing relative min-h-[400px]`}
    >
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-6">
        {!isPreviewMode && (
          <div className="opacity-60 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-5 h-5 text-white/70" />
          </div>
        )}
        <div className="relative">
          {!isPreviewMode && (
            <>
              {showColorPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-4 z-50 min-w-[200px]">
                  <div className="grid grid-cols-3 gap-3">
                    {THEME_COLOR_OPTIONS.map((color, idx) => (
                      <button
                        key={color.name}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient} ${
                          selectedColor === idx ? "ring-2 ring-white" : ""
                        } hover:ring-2 hover:ring-white/50 transition-all`}
                        onClick={() => {
                          const i = idx as ThemeIndex
                          onColorChange?.(i)
                          setShowColorPicker(false)
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 text-white p-2"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <Palette className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 mb-6">{renderSlide()}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          className="text-white/60 hover:text-white hover:bg-white/20"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Progress dots */}
        <div className="flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          className="text-white/60 hover:text-white hover:bg-white/20"
          disabled={currentSlide === SLIDES.length - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Slide indicator */}
      <div className="text-center mt-2">
        <span className="text-white/40 text-xs">
          {currentSlide + 1} / {SLIDES.length} - {SLIDES[currentSlide].title}
        </span>
      </div>
    </div>
  )
}
