"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Palette, Save, X, Bot, Send, Loader2, Plus, Tag, LinkIcon, Brain, ChevronRight } from "lucide-react"
import { THEME_COLOR_OPTIONS, type ThemeIndex } from "@/lib/theme"

/** Types the side panel can use */
type TraitScores = {
  enterprisingPotential: number // -20 to 80
  achievementPotential: number // -40 to 50
  independencePotential: number // -40 to 50
  comfortWithConflict: number // -40 to 50
  emotionalQuotient: number // 40 to 90
  peopleOrientation: number // -40 to 50
  analyticalOrientation: number // -30 to 30
  selfDirected: number // 0 to 60
  lifestyleManagement: number // 0 to 60
  commitmentReluctance: number // 0 to 60
}

type IdentityShape = {
  name?: string
  title?: string
  subtitle?: string
  handle?: string
  email?: string
  location?: string
  avatarUrl?: string
  selectedColor?: ThemeIndex
  skills?: string[]
  socialLinks?: { platform: string; url: string }[]
  traitScores?: TraitScores
}

type BotCommand =
  | { type: "add"; payload: { widgetType: string; column?: "left" | "right" } }
  | { type: "remove"; payload: { idOrType: string } }
  | { type: "move"; payload: { id: string; column: "left" | "right" } }
  | { type: "theme"; payload: { color: string | number } }
  | { type: "rename"; payload: { name?: string; title?: string; subtitle?: string } }
  | { type: "help" }

export default function MusicAppInterface({
  identity,
  onIdentityChange,
  onCommand,
  onTogglePreview,
  getWidgetsSummary,
}: {
  /** Current portfolio identity (optional, but enables edit/save) */
  identity?: IdentityShape
  /** Bubble up identity edits (optional) */
  onIdentityChange?: (next: Partial<IdentityShape>) => void
  /** Bot issues structural commands to the builder/dashboard (optional) */
  onCommand?: (cmd: BotCommand) => void
  /** Allow bot to toggle preview if you pass this (optional) */
  onTogglePreview?: () => void
  /** Optional function that returns a short widgets summary string */
  getWidgetsSummary?: () => string
}) {
  const [editOpen, setEditOpen] = useState(false)
  const [showPalette, setShowPalette] = useState(false)
  const [showTraitQuestionnaire, setShowTraitQuestionnaire] = useState(false)

  // Local editable copy so users can cancel or save
  const [draft, setDraft] = useState<IdentityShape>(() => identity ?? {})
  useEffect(() => setDraft(identity ?? {}), [identity])

  const [skillInput, setSkillInput] = useState("")
  const [linkPlatform, setLinkPlatform] = useState("")
  const [linkUrl, setLinkUrl] = useState("")

  const gradient = useMemo(
    () => THEME_COLOR_OPTIONS[draft.selectedColor ?? 0]?.gradient ?? "from-neutral-500/40 to-neutral-700/60",
    [draft.selectedColor],
  )

  /** -------------------- Chat bot state -------------------- */
  type ChatMsg = { role: "assistant" | "user"; text: string }
  const [msgs, setMsgs] = useState<ChatMsg[]>(() => {
    const intro =
      "Hi! I’m your portfolio co-pilot. Ask me to add/remove/move widgets, change your theme, or rename your profile."
    const summary = getWidgetsSummary?.()
    return [{ role: "assistant", text: summary ? `${intro}\n\nCurrent layout: ${summary}` : intro }]
  })
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), [msgs, loading])

  /** -------------------- Bot command parsing -------------------- */
  function parseCommand(raw: string): BotCommand {
    const s = raw.trim()

    if (/^help$/i.test(s)) return { type: "help" }

    // add gallery right
    const addMatch = /^add\s+(\w+)(?:\s+(left|right))?$/i.exec(s)
    if (addMatch) {
      return { type: "add", payload: { widgetType: addMatch[1].toLowerCase(), column: addMatch[2] as any } }
    }

    // remove projects-123  OR remove projects
    const removeMatch = /^remove\s+([\w-]+)$/i.exec(s)
    if (removeMatch) {
      return { type: "remove", payload: { idOrType: removeMatch[1] } }
    }

    // move education left
    const moveMatch = /^move\s+([\w-]+)\s+(left|right)$/i.exec(s)
    if (moveMatch) {
      return { type: "move", payload: { id: moveMatch[1], column: moveMatch[2] as "left" | "right" } }
    }

    // theme purple  OR theme 2
    const themeMatch = /^theme\s+([\w-]+)$/i.exec(s)
    if (themeMatch) {
      const c = themeMatch[1]
      const maybeNum = Number.isFinite(+c) ? Number(c) : c
      return { type: "theme", payload: { color: maybeNum } }
    }

    // rename "Oliver Babaniji" | title "Senior Designer" | subtitle "at Acme"
    const renameName = /^rename\s+"(.+)"$/i.exec(s)
    if (renameName) return { type: "rename", payload: { name: renameName[1] } }

    const renameTitle = /^title\s+"(.+)"$/i.exec(s)
    if (renameTitle) return { type: "rename", payload: { title: renameTitle[1] } }

    const renameSub = /^subtitle\s+"(.+)"$/i.exec(s)
    if (renameSub) return { type: "rename", payload: { subtitle: renameSub[1] } }

    return { type: "help" }
  }

  function runLocalSideEffects(cmd: BotCommand) {
    if (cmd.type === "theme") {
      const { color } = cmd.payload
      let idx: ThemeIndex | null = null
      if (typeof color === "number") {
        idx = Math.max(0, Math.min(THEME_COLOR_OPTIONS.length - 1, color)) as ThemeIndex
      } else {
        const find = THEME_COLOR_OPTIONS.findIndex((c) => c.name.toLowerCase() === String(color).toLowerCase())
        if (find >= 0) idx = find as ThemeIndex
      }
      if (idx !== null) {
        setDraft((d) => ({ ...d, selectedColor: idx! }))
        onIdentityChange?.({ selectedColor: idx! })
      }
    }
    if (cmd.type === "rename") {
      setDraft((d) => ({ ...d, ...cmd.payload }))
      onIdentityChange?.(cmd.payload)
    }
  }

  async function handleSend() {
    if (!input.trim()) return
    const userLine = input
    setMsgs((m) => [...m, { role: "user", text: userLine }])
    setInput("")
    setLoading(true)
    try {
      const cmd = parseCommand(userLine)
      if (cmd.type === "help") {
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            text:
              "Commands:\n" +
              "• add <widgetType> [left|right]\n" +
              "• remove <widgetId|type>\n" +
              "• move <widgetId> <left|right>\n" +
              "• theme <colorName|index>\n" +
              '• rename "<name>" | title "<title>" | subtitle "<subtitle>"\n' +
              "Try: theme purple   or   add gallery right",
          },
        ])
      } else {
        runLocalSideEffects(cmd)
        onCommand?.(cmd)
        setMsgs((m) => [...m, { role: "assistant", text: "Done ✅" }])
      }
    } finally {
      setLoading(false)
    }
  }

  /** -------------------- UI -------------------- */
  return (
    <>
      <TraitQuestionnaireOverlay
        isOpen={showTraitQuestionnaire}
        onClose={() => setShowTraitQuestionnaire(false)}
        onComplete={(scores) => {
          setDraft((d) => ({ ...d, traitScores: scores }))
          setShowTraitQuestionnaire(false)
        }}
      />

      <div className="fixed right-0 top-0 w-80 xl:w-96 h-screen bg-background text-white pt-20 sm:pt-24 px-4 xl:px-6 pb-4 xl:pb-6 space-y-4 xl:space-y-6 overflow-y-auto">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-[#1a1a1a] backdrop-blur-xl rounded-3xl p-6 text-center border border-white/5">
            {/* Node graphic with theme gradient */}
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} border-2 border-white/30 mx-auto mb-3 relative overflow-hidden`}
            >
              <div className="absolute inset-1 rounded-full bg-white/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-white/90 rounded-full" />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-60" />
            </div>

            {/* Compact profile summary */}
            <h2 className="text-lg font-medium text-white mb-1">{draft.name || "your name"}</h2>
            <p className="text-neutral-400 text-sm mb-2">{draft.title || "your role"}</p>

            {/* Trait scores preview */}
            {draft.traitScores && (
              <div className="mb-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                    Leadership Profile
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="text-left">
                    <div className="text-white/50">Enterprising</div>
                    <div className="text-white/90 font-medium">{draft.traitScores.enterprisingPotential}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-white/50">EQ</div>
                    <div className="text-white/90 font-medium">{draft.traitScores.emotionalQuotient}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-white/50">Independence</div>
                    <div className="text-white/90 font-medium">{draft.traitScores.independencePotential}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-white/50">People</div>
                    <div className="text-white/90 font-medium">{draft.traitScores.peopleOrientation}</div>
                  </div>
                </div>
              </div>
            )}

            {draft.skills && draft.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                {draft.skills.slice(0, 4).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10"
                  >
                    {skill}
                  </span>
                ))}
                {draft.skills.length > 4 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                    +{draft.skills.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Action row */}
            <div className="flex items-center gap-2">
              <button
                className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-colors"
                onClick={() => setEditOpen((s) => !s)}
              >
                {editOpen ? "close" : "edit profile"}
              </button>
              <div className="relative">
                <button
                  className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-colors"
                  onClick={() => setShowPalette((s) => !s)}
                  aria-label="Change theme color"
                >
                  <Palette className="w-4 h-4" />
                </button>
                {showPalette && (
                  <div className="absolute right-0 mt-2 z-50 bg-[#1a1a1a]/95 border border-white/10 rounded-2xl p-3 grid grid-cols-4 gap-2">
                    {THEME_COLOR_OPTIONS.map((c, idx) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setDraft((d) => ({ ...d, selectedColor: idx as ThemeIndex }))
                          onIdentityChange?.({ selectedColor: idx as ThemeIndex })
                          setShowPalette(false)
                        }}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.gradient} ${
                          draft.selectedColor === (idx as ThemeIndex)
                            ? "ring-2 ring-white"
                            : "hover:ring-2 hover:ring-white/60"
                        } transition-all`}
                        aria-label={`Set theme ${c.name}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {editOpen && (
              <div className="text-left mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {/* Basic Info Section */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">Basic Info</div>
                  <Field label="Name">
                    <input
                      className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30"
                      value={draft.name ?? ""}
                      onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                      placeholder="Your full name"
                    />
                  </Field>
                  <Field label="Title">
                    <input
                      className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30"
                      value={draft.title ?? ""}
                      onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                      placeholder="Your professional title"
                    />
                  </Field>
                </div>

                {/* Trait System Section */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">Leadership Traits</div>

                  {!draft.traitScores ? (
                    // Show assessment prompt if no scores
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-start gap-3 mb-3">
                        <Brain className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white mb-1">Personality Assessment</div>
                          <div className="text-xs text-white/60 leading-relaxed">
                            Complete a brief questionnaire to generate your leadership profile and trait scores for
                            better portfolio matching.
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowTraitQuestionnaire(true)}
                        className="w-full py-2 px-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm rounded-lg transition-colors flex items-center justify-center gap-2 border border-purple-500/30"
                      >
                        Take Assessment
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    // Show comprehensive score preview after assessment
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-purple-400" />
                          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                            Leadership Profile Complete
                          </span>
                        </div>
                        <button
                          onClick={() => setShowTraitQuestionnaire(true)}
                          className="text-[10px] px-2 py-1 rounded-md bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors"
                        >
                          Retake
                        </button>
                      </div>

                      {/* Comprehensive Score Display */}
                      <div className="space-y-3">
                        {/* Orientation Factors */}
                        <div className="space-y-2">
                          <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">
                            Orientation & Coaching
                          </div>
                          <TraitScoreBar
                            label="Enterprising"
                            value={draft.traitScores.enterprisingPotential}
                            min={-20}
                            max={80}
                          />
                          <TraitScoreBar
                            label="Achievement"
                            value={draft.traitScores.achievementPotential}
                            min={-40}
                            max={50}
                          />
                          <TraitScoreBar
                            label="Independence"
                            value={draft.traitScores.independencePotential}
                            min={-40}
                            max={50}
                          />
                          <TraitScoreBar
                            label="Conflict Comfort"
                            value={draft.traitScores.comfortWithConflict}
                            min={-40}
                            max={50}
                          />
                        </div>

                        {/* Communication Style */}
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">
                            Communication Style
                          </div>
                          <TraitScoreBar
                            label="People Orientation"
                            value={draft.traitScores.peopleOrientation}
                            min={-40}
                            max={50}
                          />
                          <TraitScoreBar
                            label="Analytical"
                            value={draft.traitScores.analyticalOrientation}
                            min={-30}
                            max={30}
                          />
                        </div>

                        {/* Attitude & EQ */}
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">
                            Attitude & Emotional Intelligence
                          </div>
                          <TraitScoreBar
                            label="Emotional IQ"
                            value={draft.traitScores.emotionalQuotient}
                            min={40}
                            max={90}
                          />
                          <TraitScoreBar
                            label="Self Directed"
                            value={draft.traitScores.selfDirected}
                            min={0}
                            max={60}
                          />
                          <TraitScoreBar
                            label="Lifestyle Management"
                            value={draft.traitScores.lifestyleManagement}
                            min={0}
                            max={60}
                          />
                          <TraitScoreBar
                            label="Commitment"
                            value={draft.traitScores.commitmentReluctance}
                            min={0}
                            max={60}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skills Section */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">Skills & Expertise</div>
                  <Field label="Add Skills (for search & discovery)">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30"
                          placeholder="e.g. React, Design, Python"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && skillInput.trim()) {
                              e.preventDefault()
                              const newSkill = skillInput.trim()
                              if (!draft.skills?.includes(newSkill)) {
                                setDraft((d) => ({ ...d, skills: [...(d.skills || []), newSkill] }))
                              }
                              setSkillInput("")
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (skillInput.trim()) {
                              const newSkill = skillInput.trim()
                              if (!draft.skills?.includes(newSkill)) {
                                setDraft((d) => ({ ...d, skills: [...(d.skills || []), newSkill] }))
                              }
                              setSkillInput("")
                            }
                          }}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          aria-label="Add skill"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {draft.skills && draft.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {draft.skills.map((skill, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setDraft((d) => ({
                                  ...d,
                                  skills: d.skills?.filter((s) => s !== skill),
                                }))
                              }}
                              className="group text-xs px-2 py-1 rounded-md bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-300 border border-white/10 hover:border-red-500/30 transition-colors flex items-center gap-1"
                            >
                              <Tag className="w-3 h-3" />
                              {skill}
                              <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>
                </div>

                {/* Social Links Section */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">Social Links</div>
                  <Field label="Add Social Media Links">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          className="w-24 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30"
                          placeholder="Platform"
                          value={linkPlatform}
                          onChange={(e) => setLinkPlatform(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && linkPlatform.trim() && linkUrl.trim()) {
                              e.preventDefault()
                              const newLink = { platform: linkPlatform.trim(), url: linkUrl.trim() }
                              setDraft((d) => ({ ...d, socialLinks: [...(d.socialLinks || []), newLink] }))
                              setLinkPlatform("")
                              setLinkUrl("")
                            }
                          }}
                        />
                        <input
                          className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30"
                          placeholder="URL"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && linkPlatform.trim() && linkUrl.trim()) {
                              e.preventDefault()
                              const newLink = { platform: linkPlatform.trim(), url: linkUrl.trim() }
                              setDraft((d) => ({ ...d, socialLinks: [...(d.socialLinks || []), newLink] }))
                              setLinkPlatform("")
                              setLinkUrl("")
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (linkPlatform.trim() && linkUrl.trim()) {
                              const newLink = { platform: linkPlatform.trim(), url: linkUrl.trim() }
                              setDraft((d) => ({ ...d, socialLinks: [...(d.socialLinks || []), newLink] }))
                              setLinkPlatform("")
                              setLinkUrl("")
                            }
                          }}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          aria-label="Add social link"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {draft.socialLinks && draft.socialLinks.length > 0 && (
                        <div className="space-y-1.5">
                          {draft.socialLinks.map((link, idx) => (
                            <div
                              key={idx}
                              className="group flex items-center justify-between gap-2 text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <LinkIcon className="w-3 h-3 text-white/60 flex-shrink-0" />
                                <span className="text-white/90 font-medium">{link.platform}</span>
                                <span className="text-white/50 truncate">{link.url}</span>
                              </div>
                              <button
                                onClick={() => {
                                  setDraft((d) => ({
                                    ...d,
                                    socialLinks: d.socialLinks?.filter((_, i) => i !== idx),
                                  }))
                                }}
                                className="p-1 rounded hover:bg-red-500/20 text-white/60 hover:text-red-300 transition-colors"
                                aria-label="Remove link"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10 sticky bottom-0 bg-[#1a1a1a] pb-2">
                  <button
                    className="px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
                    onClick={() => {
                      setDraft(identity ?? {})
                      setSkillInput("")
                      setLinkPlatform("")
                      setLinkUrl("")
                      setEditOpen(false)
                    }}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-sm rounded-lg bg-white text-black hover:bg-white/90 transition-colors flex items-center gap-2 font-medium"
                    onClick={() => {
                      onIdentityChange?.(draft)
                      setEditOpen(false)
                    }}
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bot card (replaces Archetype) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <div className="bg-[#1a1a1a] backdrop-blur-xl rounded-3xl p-6 flex flex-col h-[48vh] border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-300 text-sm">Portfolio Co-pilot</span>
              {onTogglePreview && (
                <button
                  onClick={onTogglePreview}
                  className="ml-auto text-xs px-2 py-1 rounded-md bg-white/10 hover:bg-white/20"
                >
                  Toggle Preview
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`text-sm leading-relaxed ${m.role === "assistant" ? "text-zinc-200" : "text-white"}`}
                >
                  {m.text}
                </div>
              ))}
              {loading && (
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Working…
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder='Try: add gallery right, theme purple, rename "Oliver"'
                className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30"
              />
              <button onClick={handleSend} className="p-2 rounded-lg bg-white/10 hover:bg-white/20" aria-label="Send">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

// TraitScoreBar component for displaying individual trait scores
function TraitScoreBar({ label, value, min, max }: { label: string; value: number; min: number; max: number }) {
  const percentage = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] mb-1">
        <span className="text-white/60">{label}</span>
        <span className="text-white/90 font-medium">{value}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
      </div>
    </div>
  )
}

// TraitQuestionnaireOverlay component
function TraitQuestionnaireOverlay({
  isOpen,
  onClose,
  onComplete,
}: {
  isOpen: boolean
  onClose: () => void
  onComplete: (scores: TraitScores) => void
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [calculatedScores, setCalculatedScores] = useState<TraitScores | null>(null)

  const questions = [
    {
      id: 0,
      text: "I prefer to work independently and set my own goals rather than follow detailed instructions.",
      trait: "enterprising",
    },
    {
      id: 1,
      text: "I am motivated by challenging tasks that push me to achieve significant results.",
      trait: "achievement",
    },
    {
      id: 2,
      text: "I feel comfortable making decisions on my own without needing team consensus.",
      trait: "independence",
    },
    {
      id: 3,
      text: "I am comfortable addressing conflicts directly and having difficult conversations.",
      trait: "conflict",
    },
    {
      id: 4,
      text: "I can easily recognize and understand the emotions of others in social situations.",
      trait: "eq",
    },
    {
      id: 5,
      text: "I enjoy meeting new people and building relationships quickly.",
      trait: "people",
    },
    {
      id: 6,
      text: "I prefer to analyze data and facts before making decisions.",
      trait: "analytical",
    },
    {
      id: 7,
      text: "I feel in control of my life and believe my actions determine my outcomes.",
      trait: "selfDirected",
    },
    {
      id: 8,
      text: "I manage stress effectively and maintain a healthy work-life balance.",
      trait: "lifestyle",
    },
    {
      id: 9,
      text: "I am comfortable asking others for commitments and holding them accountable.",
      trait: "commitment",
    },
  ]

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }))
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion((c) => c + 1), 300)
    }
  }

  const handleShowResults = () => {
    // Calculate scores based on answers (1-5 scale)
    const calculateScore = (trait: string, min: number, max: number) => {
      const relevantAnswers = questions.filter((q) => q.trait === trait).map((q) => answers[q.id] || 3)
      const avg = relevantAnswers.reduce((a, b) => a + b, 0) / relevantAnswers.length
      return Math.round(min + ((avg - 1) / 4) * (max - min))
    }

    const scores: TraitScores = {
      enterprisingPotential: calculateScore("enterprising", -20, 80),
      achievementPotential: calculateScore("achievement", -40, 50),
      independencePotential: calculateScore("independence", -40, 50),
      comfortWithConflict: calculateScore("conflict", -40, 50),
      emotionalQuotient: calculateScore("eq", 40, 90),
      peopleOrientation: calculateScore("people", -40, 50),
      analyticalOrientation: calculateScore("analytical", -30, 30),
      selfDirected: calculateScore("selfDirected", 0, 60),
      lifestyleManagement: calculateScore("lifestyle", 0, 60),
      commitmentReluctance: calculateScore("commitment", 0, 60),
    }

    setCalculatedScores(scores)
    setShowResults(true)
  }

  const handleSaveResults = () => {
    if (calculatedScores) {
      onComplete(calculatedScores)
      setCurrentQuestion(0)
      setAnswers({})
      setShowResults(false)
      setCalculatedScores(null)
    }
  }

  const handleRetake = () => {
    setShowResults(false)
    setCurrentQuestion(0)
    setAnswers({})
    setCalculatedScores(null)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isComplete = Object.keys(answers).length === questions.length

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[10000] flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-3xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {showResults && calculatedScores ? (
              // Results Summary View
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Your Leadership Profile</h2>
                      <p className="text-sm text-neutral-400">Assessment Complete</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Summary of Scores */}
                <div className="space-y-6 mb-8">
                  {/* Orientation & Coaching Factors */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border border-white/10">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
                      Orientation & Coaching Factors
                    </h3>
                    <div className="space-y-4">
                      <ScoreDisplay
                        label="Enterprising Potential"
                        value={calculatedScores.enterprisingPotential}
                        min={-20}
                        max={80}
                        leftLabel="Responsive"
                        rightLabel="Proactive"
                      />
                      <ScoreDisplay
                        label="Achievement Potential"
                        value={calculatedScores.achievementPotential}
                        min={-40}
                        max={50}
                        leftLabel="Safety & Security"
                        rightLabel="$ and/or Challenge"
                      />
                      <ScoreDisplay
                        label="Independence Potential"
                        value={calculatedScores.independencePotential}
                        min={-40}
                        max={50}
                        leftLabel="Team-oriented"
                        rightLabel="Very Independent"
                      />
                      <ScoreDisplay
                        label="Comfort with Conflict"
                        value={calculatedScores.comfortWithConflict}
                        min={-40}
                        max={50}
                        leftLabel="Avoids Conflict"
                        rightLabel="Comfortable"
                      />
                    </div>
                  </div>

                  {/* Communication Style */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border border-white/10">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
                      Communication Style
                    </h3>
                    <div className="space-y-4">
                      <ScoreDisplay
                        label="People Orientation"
                        value={calculatedScores.peopleOrientation}
                        min={-40}
                        max={50}
                        leftLabel="Builds Gradually"
                        rightLabel="Outgoing"
                      />
                      <ScoreDisplay
                        label="Analytical Orientation"
                        value={calculatedScores.analyticalOrientation}
                        min={-30}
                        max={30}
                        leftLabel="Learns Essentials"
                        rightLabel="Highly Analytical"
                      />
                    </div>
                  </div>

                  {/* Attitude Survey */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border border-white/10">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
                      Attitude Survey
                    </h3>
                    <div className="space-y-4">
                      <ScoreDisplay
                        label="Self Directed"
                        value={calculatedScores.selfDirected}
                        min={0}
                        max={60}
                        leftLabel="External Focus"
                        rightLabel="Internal Focus"
                      />
                      <ScoreDisplay
                        label="Lifestyle Management"
                        value={calculatedScores.lifestyleManagement}
                        min={0}
                        max={60}
                        leftLabel="Growth Opportunity"
                        rightLabel="Well Managed"
                      />
                      <ScoreDisplay
                        label="Commitment Orientation"
                        value={calculatedScores.commitmentReluctance}
                        min={0}
                        max={60}
                        leftLabel="Might Avoid"
                        rightLabel="Strongly Pursues"
                      />
                    </div>
                  </div>

                  {/* Emotional Quotient */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-4">
                      Emotional Quotient
                    </h3>
                    <ScoreDisplay
                      label="Overall EQ"
                      value={calculatedScores.emotionalQuotient}
                      min={40}
                      max={90}
                      leftLabel="Relies on Non-Emotional Info"
                      rightLabel="Understands & Uses Emotional Info"
                      color="purple"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <button
                    onClick={handleRetake}
                    className="px-6 py-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-all text-sm font-medium text-white border border-neutral-700/50"
                  >
                    Retake Assessment
                  </button>
                  <button
                    onClick={handleSaveResults}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all text-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Results
                  </button>
                </div>
              </>
            ) : (
              // Questionnaire View
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Leadership Assessment</h2>
                      <p className="text-sm text-neutral-400">Discover your professional traits</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm text-neutral-400 mb-3">
                    <span>
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span className="text-white font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-neutral-800/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="mb-10 min-h-[80px] flex items-center justify-center">
                  <motion.p
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg text-white leading-relaxed text-center max-w-2xl"
                  >
                    {questions[currentQuestion].text}
                  </motion.p>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-5 gap-3 mb-8">
                  {[
                    {
                      value: 5,
                      label: "Strongly Agree",
                      color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
                    },
                    { value: 4, label: "Agree", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30" },
                    {
                      value: 3,
                      label: "Neutral",
                      color: "from-neutral-500/20 to-neutral-600/20 border-neutral-500/30",
                    },
                    { value: 2, label: "Disagree", color: "from-orange-500/20 to-amber-500/20 border-orange-500/30" },
                    {
                      value: 1,
                      label: "Strongly Disagree",
                      color: "from-red-500/20 to-rose-500/20 border-red-500/30",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`group relative py-4 px-3 rounded-2xl text-center transition-all duration-200 border ${
                        answers[currentQuestion] === option.value
                          ? `bg-gradient-to-br ${option.color} scale-105 shadow-lg`
                          : "bg-neutral-800/30 hover:bg-neutral-800/50 border-neutral-700/50 hover:border-neutral-600 hover:scale-105"
                      }`}
                    >
                      <div className="text-2xl font-bold text-white mb-1">{option.value}</div>
                      <div className="text-xs text-neutral-400 group-hover:text-neutral-300 leading-tight">
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <button
                    onClick={() => setCurrentQuestion((c) => Math.max(0, c - 1))}
                    disabled={currentQuestion === 0}
                    className="px-6 py-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium text-white border border-neutral-700/50"
                  >
                    Previous
                  </button>
                  {isComplete ? (
                    <button
                      onClick={handleShowResults}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all text-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
                    >
                      View Results
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestion((c) => Math.min(questions.length - 1, c + 1))}
                      disabled={currentQuestion === questions.length - 1}
                      className="px-6 py-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium text-white border border-neutral-700/50"
                    >
                      Next
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ScoreDisplay({
  label,
  value,
  min,
  max,
  leftLabel,
  rightLabel,
  color = "default",
}: {
  label: string
  value: number
  min: number
  max: number
  leftLabel: string
  rightLabel: string
  color?: "default" | "purple"
}) {
  const percentage = ((value - min) / (max - min)) * 100
  const gradientClass = color === "purple" ? "from-purple-500 to-pink-500" : "from-blue-500 to-cyan-500"

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-sm font-bold text-white px-2 py-0.5 rounded-md bg-white/10">{value}</span>
      </div>
      <div className="relative h-3 bg-neutral-800/50 rounded-full overflow-hidden mb-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${gradientClass} rounded-full`}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-neutral-500">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}

/** Small labeled field helper */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wide text-white/60 mb-1">{label}</div>
      {children}
    </label>
  )
}
