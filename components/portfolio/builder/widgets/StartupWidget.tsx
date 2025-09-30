"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ArrowLeft, ArrowRight, Check, Plus, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type StartupContent = {
  title: string
  slides: {
    identity: {
      companyName: string
      tagline: string
      stage: string
      ask: string
      logoUrl?: string
    }
    problem: {
      title: string
      description: string
    }
    solution: {
      title: string
      description: string
      links: Array<{ name: string; url: string }>
    }
    market: {
      title: string
      targetCustomer: string
      marketSize: string
      useCase: string
    }
    traction: {
      title: string
      milestones: Array<{ text: string; completed: boolean }>
      metrics: string
    }
    team: {
      title: string
      members: Array<{ name: string; role: string; linkedinUrl?: string }>
    }
    cta: {
      title: string
      asks: Array<{ text: string; active: boolean }>
      contact: string
    }
  }
}

type Props = {
  widgetId: string
  column: "left" | "right"
  isPreviewMode: boolean
  content: StartupContent
  onContentChange: (content: StartupContent) => void
  onDelete: () => void
  onMove: () => void
  editingField: string | null
  setEditingField: (field: string | null) => void
}

const slideNames = [
  { key: "identity", label: "Identity" },
  { key: "problem", label: "Problem" },
  { key: "solution", label: "Solution" },
  { key: "market", label: "Market" },
  { key: "traction", label: "Traction" },
  { key: "team", label: "Team" },
  { key: "cta", label: "Call to Action" },
] as const

export default function StartupWidget({
  widgetId,
  column,
  isPreviewMode,
  content,
  onContentChange,
  onDelete,
  onMove,
  editingField,
  setEditingField,
}: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const safeContent = content || {
    title: "Startup Pitch",
    slides: {
      identity: {
        companyName: "Your Startup",
        tagline: "We're building X for Y",
        stage: "Seed",
        ask: "$50K seed funding",
      },
      problem: {
        title: "Problem",
        description: "Describe the problem you're solving...",
      },
      solution: {
        title: "Solution",
        description: "Describe your solution...",
        links: [],
      },
      market: {
        title: "Market",
        targetCustomer: "Your target customers",
        marketSize: "$X billion market",
        useCase: "How customers use your product",
      },
      traction: {
        title: "Traction",
        milestones: [
          { text: "Prototype built", completed: true },
          { text: "First customers", completed: false },
        ],
        metrics: "Key metrics and growth",
      },
      team: {
        title: "Team",
        members: [{ name: "Your Name", role: "CEO" }],
      },
      cta: {
        title: "Call to Action",
        asks: [
          { text: "Funding", active: true },
          { text: "Mentorship", active: true },
          { text: "Partnerships", active: false },
        ],
        contact: "hello@yourcompany.com",
      },
    },
  }

  console.log("[v0] StartupWidget content:", content)
  console.log("[v0] StartupWidget safeContent:", safeContent)

  const updateSlideContent = (slideKey: keyof StartupContent["slides"], updates: any) => {
    console.log("[v0] Updating slide content:", slideKey, updates)
    onContentChange({
      ...safeContent,
      slides: {
        ...safeContent.slides,
        [slideKey]: {
          ...safeContent.slides[slideKey],
          ...updates,
        },
      },
    })
  }

  const EditableField = ({
    value,
    onChange,
    fieldKey,
    placeholder,
    multiline = false,
    className = "",
  }: {
    value: string
    onChange: (value: string) => void
    fieldKey: string
    placeholder: string
    multiline?: boolean
    className?: string
  }) => {
    const isEditing = editingField === `${widgetId}-${fieldKey}`

    if (isPreviewMode || !isEditing) {
      return (
        <div
          className={`cursor-pointer hover:bg-white/5 rounded px-2 py-1 transition-colors ${className}`}
          onClick={() => !isPreviewMode && setEditingField(`${widgetId}-${fieldKey}`)}
        >
          {value || placeholder}
        </div>
      )
    }

    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditingField(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              setEditingField(null)
            }
          }}
          placeholder={placeholder}
          className={`bg-white/10 border border-white/20 rounded px-2 py-1 text-white placeholder-white/50 resize-none ${className}`}
          autoFocus
          rows={3}
        />
      )
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditingField(null)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditingField(null)
          }
        }}
        placeholder={placeholder}
        className={`bg-white/10 border border-white/20 rounded px-2 py-1 text-white placeholder-white/50 ${className}`}
        autoFocus
      />
    )
  }

  const renderSlideContent = () => {
    const slide = slideNames[currentSlide]
    const slideData = safeContent.slides[slide.key]

    console.log("[v0] Rendering slide:", slide.key, slideData)

    switch (slide.key) {
      case "identity":
        const identityData = slideData || {
          companyName: "Your Startup",
          tagline: "We're building X for Y",
          stage: "Seed",
          ask: "$50K seed funding",
        }
        return (
          <div className="space-y-4">
            <div className="text-center">
              <EditableField
                value={identityData.companyName || ""}
                onChange={(value) => updateSlideContent("identity", { companyName: value })}
                fieldKey="identity-companyName"
                placeholder="Company Name"
                className="text-2xl font-bold text-center w-full"
              />
              <EditableField
                value={identityData.tagline || ""}
                onChange={(value) => updateSlideContent("identity", { tagline: value })}
                fieldKey="identity-tagline"
                placeholder="Your tagline here"
                className="text-white/70 text-center w-full mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/50">Stage:</span>
                <EditableField
                  value={identityData.stage || ""}
                  onChange={(value) => updateSlideContent("identity", { stage: value })}
                  fieldKey="identity-stage"
                  placeholder="Seed, Series A, etc."
                  className="ml-2"
                />
              </div>
              <div>
                <span className="text-white/50">Ask:</span>
                <EditableField
                  value={identityData.ask || ""}
                  onChange={(value) => updateSlideContent("identity", { ask: value })}
                  fieldKey="identity-ask"
                  placeholder="$50K seed funding"
                  className="ml-2"
                />
              </div>
            </div>
          </div>
        )

      case "problem":
        const problemData = slideData || { title: "Problem", description: "" }
        return (
          <div className="space-y-4">
            <EditableField
              value={problemData.title || ""}
              onChange={(value) => updateSlideContent("problem", { title: value })}
              fieldKey="problem-title"
              placeholder="Problem"
              className="text-xl font-semibold w-full"
            />
            <div className="border-t border-white/20 pt-4">
              <EditableField
                value={problemData.description || ""}
                onChange={(value) => updateSlideContent("problem", { description: value })}
                fieldKey="problem-description"
                placeholder="Describe the problem you're solving..."
                multiline
                className="w-full"
              />
            </div>
          </div>
        )

      case "solution":
        const solutionData = slideData || { title: "Solution", description: "", links: [] }
        return (
          <div className="space-y-4">
            <EditableField
              value={solutionData.title || ""}
              onChange={(value) => updateSlideContent("solution", { title: value })}
              fieldKey="solution-title"
              placeholder="Solution"
              className="text-xl font-semibold w-full"
            />
            <div className="border-t border-white/20 pt-4">
              <EditableField
                value={solutionData.description || ""}
                onChange={(value) => updateSlideContent("solution", { description: value })}
                fieldKey="solution-description"
                placeholder="Describe your solution..."
                multiline
                className="w-full"
              />
            </div>
            {(solutionData.links || []).length > 0 && (
              <div className="space-y-2">
                <span className="text-white/70 text-sm">Links:</span>
                {(solutionData.links || []).map((link, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-blue-400">{link.name}</span>
                    {!isPreviewMode && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newLinks = (solutionData.links || []).filter((_, i) => i !== index)
                          updateSlideContent("solution", { links: newLinks })
                        }}
                        className="p-1 h-6 w-6 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {!isPreviewMode && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const newLinks = [...(solutionData.links || []), { name: "New Link", url: "" }]
                  updateSlideContent("solution", { links: newLinks })
                }}
                className="text-white/70 hover:bg-white/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            )}
          </div>
        )

      case "market":
        const marketData = slideData || { title: "Market", targetCustomer: "", marketSize: "", useCase: "" }
        return (
          <div className="space-y-4">
            <EditableField
              value={marketData.title || ""}
              onChange={(value) => updateSlideContent("market", { title: value })}
              fieldKey="market-title"
              placeholder="Market"
              className="text-xl font-semibold w-full"
            />
            <div className="border-t border-white/20 pt-4 space-y-3">
              <div>
                <span className="text-white/50 text-sm">Target Customer:</span>
                <EditableField
                  value={marketData.targetCustomer || ""}
                  onChange={(value) => updateSlideContent("market", { targetCustomer: value })}
                  fieldKey="market-targetCustomer"
                  placeholder="University incubators, bootcamps..."
                  className="w-full mt-1"
                />
              </div>
              <div>
                <span className="text-white/50 text-sm">Market Size:</span>
                <EditableField
                  value={marketData.marketSize || ""}
                  onChange={(value) => updateSlideContent("market", { marketSize: value })}
                  fieldKey="market-marketSize"
                  placeholder="$2.5B education/mentor SaaS"
                  className="w-full mt-1"
                />
              </div>
            </div>
          </div>
        )

      case "traction":
        const tractionData = slideData || { title: "Traction", milestones: [], metrics: "" }
        return (
          <div className="space-y-4">
            <EditableField
              value={tractionData.title || ""}
              onChange={(value) => updateSlideContent("traction", { title: value })}
              fieldKey="traction-title"
              placeholder="Traction"
              className="text-xl font-semibold w-full"
            />
            <div className="border-t border-white/20 pt-4 space-y-3">
              {(tractionData.milestones || []).map((milestone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer ${
                      milestone.completed ? "bg-green-500 border-green-500" : "border-white/30"
                    }`}
                    onClick={() => {
                      if (!isPreviewMode) {
                        const newMilestones = [...(tractionData.milestones || [])]
                        newMilestones[index].completed = !newMilestones[index].completed
                        updateSlideContent("traction", { milestones: newMilestones })
                      }
                    }}
                  >
                    {milestone.completed && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <EditableField
                    value={milestone.text || ""}
                    onChange={(value) => {
                      const newMilestones = [...(tractionData.milestones || [])]
                      newMilestones[index].text = value
                      updateSlideContent("traction", { milestones: newMilestones })
                    }}
                    fieldKey={`traction-milestone-${index}`}
                    placeholder="Milestone description"
                    className="flex-1"
                  />
                  {!isPreviewMode && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const newMilestones = (tractionData.milestones || []).filter((_, i) => i !== index)
                        updateSlideContent("traction", { milestones: newMilestones })
                      }}
                      className="p-1 h-6 w-6 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
              {!isPreviewMode && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newMilestones = [
                      ...(tractionData.milestones || []),
                      { text: "New milestone", completed: false },
                    ]
                    updateSlideContent("traction", { milestones: newMilestones })
                  }}
                  className="text-white/70 hover:bg-white/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
              )}
            </div>
          </div>
        )

      case "team":
        const teamData = slideData || { title: "Team", members: [] }
        return (
          <div className="space-y-4">
            <EditableField
              value={teamData.title || ""}
              onChange={(value) => updateSlideContent("team", { title: value })}
              fieldKey="team-title"
              placeholder="Team"
              className="text-xl font-semibold w-full"
            />
            <div className="border-t border-white/20 pt-4 space-y-3">
              {(teamData.members || []).map((member, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <EditableField
                      value={member.name || ""}
                      onChange={(value) => {
                        const newMembers = [...(teamData.members || [])]
                        newMembers[index].name = value
                        updateSlideContent("team", { members: newMembers })
                      }}
                      fieldKey={`team-member-name-${index}`}
                      placeholder="Name"
                      className="font-medium"
                    />
                    <span className="text-white/50">–</span>
                    <EditableField
                      value={member.role || ""}
                      onChange={(value) => {
                        const newMembers = [...(teamData.members || [])]
                        newMembers[index].role = value
                        updateSlideContent("team", { members: newMembers })
                      }}
                      fieldKey={`team-member-role-${index}`}
                      placeholder="Role"
                      className="text-white/70"
                    />
                    {!isPreviewMode && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newMembers = (teamData.members || []).filter((_, i) => i !== index)
                          updateSlideContent("team", { members: newMembers })
                        }}
                        className="p-1 h-6 w-6 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {!isPreviewMode && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newMembers = [...(teamData.members || []), { name: "New Member", role: "Role" }]
                    updateSlideContent("team", { members: newMembers })
                  }}
                  className="text-white/70 hover:bg-white/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              )}
            </div>
          </div>
        )

      case "cta":
        const ctaData = slideData || { title: "Call to Action", asks: [], contact: "" }
        return (
          <div className="space-y-4">
            <EditableField
              value={ctaData.title || ""}
              onChange={(value) => updateSlideContent("cta", { title: value })}
              fieldKey="cta-title"
              placeholder="Call to Action"
              className="text-xl font-semibold w-full"
            />
            <div className="border-t border-white/20 pt-4 space-y-3">
              {(ctaData.asks || []).map((ask, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer ${
                      ask.active ? "bg-green-500 border-green-500" : "border-white/30"
                    }`}
                    onClick={() => {
                      if (!isPreviewMode) {
                        const newAsks = [...(ctaData.asks || [])]
                        newAsks[index].active = !newAsks[index].active
                        updateSlideContent("cta", { asks: newAsks })
                      }
                    }}
                  >
                    {ask.active && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <EditableField
                    value={ask.text || ""}
                    onChange={(value) => {
                      const newAsks = [...(ctaData.asks || [])]
                      newAsks[index].text = value
                      updateSlideContent("cta", { asks: newAsks })
                    }}
                    fieldKey={`cta-ask-${index}`}
                    placeholder="What you're looking for"
                    className="flex-1"
                  />
                  {!isPreviewMode && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const newAsks = (ctaData.asks || []).filter((_, i) => i !== index)
                        updateSlideContent("cta", { asks: newAsks })
                      }}
                      className="p-1 h-6 w-6 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
              {!isPreviewMode && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newAsks = [...(ctaData.asks || []), { text: "New ask", active: true }]
                    updateSlideContent("cta", { asks: newAsks })
                  }}
                  className="text-white/70 hover:bg-white/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ask
                </Button>
              )}
              <div className="pt-2 border-t border-white/10">
                <span className="text-white/50 text-sm">Contact:</span>
                <EditableField
                  value={ctaData.contact || ""}
                  onChange={(value) => updateSlideContent("cta", { contact: value })}
                  fieldKey="cta-contact"
                  placeholder="hello@yourcompany.com"
                  className="w-full mt-1"
                />
              </div>
            </div>
          </div>
        )

      default:
        return <div>Unknown slide</div>
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-colors group relative overflow-hidden"
    >
      {/* Widget Controls */}
      {!isPreviewMode && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
          <Button
            size="sm"
            variant="ghost"
            onClick={onMove}
            className="p-1 h-7 w-7 bg-white/10 hover:bg-white/20 text-white"
            title={`Move to ${column === "left" ? "right" : "left"} column`}
          >
            <ArrowRight className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="p-1 h-7 w-7 bg-red-500/20 hover:bg-red-500/30 text-white"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <EditableField
            value={safeContent.title || ""}
            onChange={(value) => onContentChange({ ...safeContent, title: value })}
            fieldKey="title"
            placeholder="Startup Pitch"
            className="text-lg font-semibold"
          />
          <div className="text-sm text-white/50">
            {currentSlide + 1} / {slideNames.length}
          </div>
        </div>

        {/* Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[200px]"
          >
            {renderSlideContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slideNames.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCurrentSlide(Math.min(slideNames.length - 1, currentSlide + 1))}
            disabled={currentSlide === slideNames.length - 1}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
