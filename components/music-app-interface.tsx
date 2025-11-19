"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Palette, Save, X, Bot, Send, Loader2, Plus, Tag, LinkIcon, ChevronRight, Upload, Sparkles, MessageCircle } from 'lucide-react'
import { THEME_COLOR_OPTIONS, type ThemeIndex } from "@/lib/theme"
import { useChat } from '@ai-sdk/react'

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
  firstName?: string
  lastName?: string
  profileName?: string // New field for slug generation
  title?: string
  subtitle?: string
  handle?: string
  email?: string
  location?: string
  avatarUrl?: string
  selectedColor?: ThemeIndex
  skills?: string[]
  bio?: string // Replacing individual fields with single bio
  socialLinks?: { platform: string; url: string }[]
  traitScores?: TraitScores
  
  // Social platform URLs
  linkedin?: string
  twitter?: string
  instagram?: string
  youtube?: string
  tiktok?: string
  website?: string
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
  const [traitsExpanded, setTraitsExpanded] = useState(false)

  const [chatMode, setChatMode] = useState<'commands' | 'ai'>('commands')

  // Local editable copy so users can cancel or save
  const [draft, setDraft] = useState<IdentityShape>(() => identity ?? {})
  useEffect(() => setDraft(identity ?? {}), [identity])

  const [skillInput, setSkillInput] = useState("")

  const gradient = useMemo(
    () => THEME_COLOR_OPTIONS[draft.selectedColor ?? 0]?.gradient ?? "from-neutral-500/40 to-neutral-700/60",
    [draft.selectedColor],
  )

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 64)
  }

  /** -------------------- Chat bot state -------------------- */
  type ChatMsg = { role: "assistant" | "user"; text: string }
  const [msgs, setMsgs] = useState<ChatMsg[]>(() => {
    const intro =
      "Hi! I'm your portfolio co-pilot. Ask me to add/remove/move widgets, change your theme, or rename your profile."
    const summary = getWidgetsSummary?.()
    return [{ role: "assistant", text: summary ? `${intro}\n\nCurrent layout: ${summary}` : intro }]
  })
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), [msgs, loading])

  const { messages: aiMessages, input: aiInput, handleInputChange: handleAiInputChange, handleSubmit: handleAiSubmit, isLoading: aiLoading } = useChat({
    api: '/api/portfolio-chat',
    body: {
      portfolio: draft,
      communityName: 'DMZ',
    }
  })

  const aiChatEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (chatMode === 'ai') {
      aiChatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [aiMessages, aiLoading, chatMode])

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

      <div className="fixed right-4 top-20 w-80 max-w-[360px] max-h-[85vh] overflow-y-auto bg-transparent text-white px-3 pr-8 pb-4 space-y-4">
        {editOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="backdrop-blur-xl rounded-2xl p-4 border border-white/5"
          >
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-semibold text-white">Your Profile</h2>
                <button
                  onClick={() => setEditOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-white/50">
                Choose how you are displayed as a host or guest.
              </p>
            </div>

            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {/* First Name + Last Name Row */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="First Name">
                  <input
                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/30 transition-colors"
                    value={draft.firstName ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, firstName: e.target.value }))}
                    placeholder="Oluwafemi"
                  />
                </Field>
                <Field label="Last Name">
                  <input
                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/30 transition-colors"
                    value={draft.lastName ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, lastName: e.target.value }))}
                    placeholder="Babaniji"
                  />
                </Field>
              </div>

              {/* Profile Name (for slug) */}
              <Field label="Profile Name">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">
                    @
                  </div>
                  <input
                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-white outline-none focus:border-white/30 transition-colors"
                    value={draft.profileName ?? ""}
                    onChange={(e) => {
                      const value = e.target.value
                      setDraft((d) => ({ ...d, profileName: value }))
                    }}
                    placeholder="username"
                  />
                </div>
                {draft.profileName && (
                  <p className="text-[10px] text-white/40 mt-1.5">
                    /portfolio/{generateSlug(draft.profileName)}
                  </p>
                )}
              </Field>

              {/* Profile Picture */}
              <Field label="Profile Picture">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-full bg-[#2a2a2a] overflow-hidden border-2 border-white/20 flex-shrink-0">
                    {draft.avatarUrl ? (
                      <img
                        src={draft.avatarUrl || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600" />
                      </div>
                    )}
                    <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <Upload className="w-3 h-3 text-black" />
                    </button>
                  </div>
                  <div className="flex-1 text-xs text-white/60">
                    Click to upload
                  </div>
                </div>
              </Field>

              {/* Bio */}
              <Field label="Bio">
                <textarea
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/30 transition-colors resize-none"
                  value={draft.bio ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                  placeholder="Share a little about your background and interests."
                  rows={3}
                />
              </Field>

              {/* Skills Section */}
              <div className="pt-3 border-t border-white/10">
                <Field label="Skills & Expertise">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        className="flex-1 bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/30 transition-colors"
                        placeholder="e.g. React, Design"
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
                        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
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
                            className="group px-2 py-1 rounded-md bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-300 border border-white/10 hover:border-red-500/30 transition-colors flex items-center gap-1.5"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            <span className="text-xs">{skill}</span>
                            <X className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Field>
              </div>

              {/* Social Links Section */}
              <div className="pt-3 border-t border-white/10">
                <div className="text-xs font-medium text-white mb-3">Social Links</div>
                <div className="space-y-2">
                  {/* Instagram */}
                  <SocialLinkField
                    icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>}
                    platform="instagram.com/"
                    value={draft.instagram ?? ""}
                    onChange={(v) => setDraft((d) => ({ ...d, instagram: v }))}
                    placeholder="username"
                  />
                  
                  {/* X/Twitter */}
                  <SocialLinkField
                    icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                    platform="x.com/"
                    value={draft.twitter ?? ""}
                    onChange={(v) => setDraft((d) => ({ ...d, twitter: v }))}
                    placeholder="username"
                  />
                  
                  {/* YouTube */}
                  <SocialLinkField
                    icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>}
                    platform="youtube.com/@"
                    value={draft.youtube ?? ""}
                    onChange={(v) => setDraft((d) => ({ ...d, youtube: v }))}
                    placeholder="username"
                  />
                  
                  {/* TikTok */}
                  <SocialLinkField
                    icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>}
                    platform="tiktok.com/@"
                    value={draft.tiktok ?? ""}
                    onChange={(v) => setDraft((d) => ({ ...d, tiktok: v }))}
                    placeholder="username"
                  />
                  
                  {/* LinkedIn */}
                  <SocialLinkField
                    icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
                    platform="linkedin.com"
                    value={draft.linkedin ?? ""}
                    onChange={(v) => setDraft((d) => ({ ...d, linkedin: v }))}
                    placeholder="/in/handle"
                  />
                  
                  {/* Website */}
                  <SocialLinkField
                    icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
                    platform="Your website"
                    value={draft.website ?? ""}
                    onChange={(v) => setDraft((d) => ({ ...d, website: v }))}
                    placeholder="yoursite.com"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  const fullName = [draft.firstName, draft.lastName].filter(Boolean).join(" ")
                  const updates: Partial<IdentityShape> = {
                    firstName: draft.firstName,
                    lastName: draft.lastName,
                    profileName: draft.profileName,
                    name: fullName || draft.name, // Full display name
                    handle: draft.profileName ? `@${draft.profileName}` : draft.handle,
                    bio: draft.bio,
                    skills: draft.skills,
                    avatarUrl: draft.avatarUrl,
                    // Social links
                    linkedin: draft.linkedin,
                    twitter: draft.twitter,
                    instagram: draft.instagram,
                    youtube: draft.youtube,
                    tiktok: draft.tiktok,
                    website: draft.website,
                  }
                  
                  console.log("[v0] 💾 Saving profile updates:", updates)
                  onIdentityChange?.(updates)
                  setEditOpen(false)
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-black hover:bg-white/90 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </motion.div>
        )}

        {/* Profile card (compact view when not editing) */}
        {!editOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-[#1a1a1a] backdrop-blur-xl rounded-2xl p-4 text-center border border-white/5">
              {/* Node graphic with theme gradient */}
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradient} border-2 border-white/30 mx-auto mb-2 relative overflow-hidden`}
              >
                {draft.avatarUrl ? (
                  <img
                    src={draft.avatarUrl || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-1 rounded-full bg-white/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white/90 rounded-full" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-60" />
                  </>
                )}
              </div>

              {/* Compact profile summary */}
              <h2 className="text-base font-medium text-white mb-0.5">{draft.name || draft.firstName || "your name"}</h2>
              <p className="text-neutral-400 text-xs mb-2">{draft.title || "your role"}</p>

              {draft.traitScores && (
                <div className="mb-2">
                  <button
                    onClick={() => setTraitsExpanded(!traitsExpanded)}
                    className="w-full py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[10px] text-white/70 hover:text-white/90 flex items-center justify-between"
                  >
                    <span>Leadership Profile</span>
                    <ChevronRight className={`w-2.5 h-2.5 transition-transform ${traitsExpanded ? "rotate-90" : ""}`} />
                  </button>

                  {traitsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1.5 p-2 rounded-lg bg-white/5 space-y-1.5 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                        <div className="text-center p-1 rounded bg-white/5">
                          <div className="text-white/40 mb-0.5">Enterprising</div>
                          <div className="text-white/90 font-bold text-[10px]">{draft.traitScores.enterprisingPotential}</div>
                        </div>
                        <div className="text-center p-1 rounded bg-white/5">
                          <div className="text-white/40 mb-0.5">EQ</div>
                          <div className="text-white/90 font-bold text-[10px]">{draft.traitScores.emotionalQuotient}</div>
                        </div>
                        <div className="text-center p-1 rounded bg-white/5">
                          <div className="text-white/40 mb-0.5">Independence</div>
                          <div className="text-white/90 font-bold text-[10px]">{draft.traitScores.independencePotential}</div>
                        </div>
                        <div className="text-center p-1 rounded bg-white/5">
                          <div className="text-white/40 mb-0.5">People</div>
                          <div className="text-white/90 font-bold text-[10px]">{draft.traitScores.peopleOrientation}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {draft.skills && draft.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mb-2">
                  {draft.skills.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10"
                    >
                      {skill}
                    </span>
                  ))}
                  {draft.skills.length > 4 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60">
                      +{draft.skills.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Action row */}
              <div className="flex items-center gap-2">
                <button
                  className="flex-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors"
                  onClick={() => setEditOpen((s) => !s)}
                >
                  edit profile
                </button>
                <div className="relative">
                  <button
                    className="py-1.5 px-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors"
                    onClick={() => setShowPalette((s) => !s)}
                    aria-label="Change theme color"
                  >
                    <Palette className="w-3.5 h-3.5" />
                  </button>
                  {showPalette && (
                    <div className="absolute right-0 mt-2 z-50 bg-[#1a1a1a]/95 border border-white/10 rounded-xl p-2 grid grid-cols-4 gap-1.5">
                      {THEME_COLOR_OPTIONS.map((c, idx) => (
                        <button
                          key={c.name}
                          onClick={() => {
                            setDraft((d) => ({ ...d, selectedColor: idx as ThemeIndex }))
                            onIdentityChange?.({ selectedColor: idx as ThemeIndex })
                            setShowPalette(false)
                          }}
                          className={`w-7 h-7 rounded-full bg-gradient-to-br ${c.gradient} ${
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
            </div>
          </motion.div>
        )}

        {/* Bot card */}
        {!editOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <div className="rounded-3xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-white">AI Assistant</h3>
              </div>

              <p className="text-sm mb-4 text-zinc-400">
                Get instant help with portfolio edits, widgets, and customization
              </p>

              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => {
                    setChatMode('commands')
                    if (msgs.length === 1) setLoading(true)
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    chatMode === 'commands'
                      ? 'bg-white text-zinc-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  Commands
                </button>
                <button
                  onClick={() => setChatMode('ai')}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    chatMode === 'ai'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Admin
                </button>
              </div>

              <button
                onClick={() => setShowTraitQuestionnaire(true)}
                className="w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-zinc-100 flex items-center justify-center gap-2 bg-white text-zinc-900"
              >
                Discover Your Traits
              </button>

              {chatMode === 'commands' && msgs.length > 1 && (
                <div className="mt-3 rounded-xl p-3 bg-zinc-800/40 border border-white/5">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {msgs.map((m, i) => (
                      <div
                        key={i}
                        className={`text-sm leading-relaxed ${
                          m.role === "assistant" ? "text-zinc-200" : "text-white"
                        }`}
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

                  <div className="mt-3 flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Try: add gallery right"
                      className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 bg-zinc-900/60 text-white border border-zinc-700 placeholder:text-zinc-500"
                    />
                    <button 
                      onClick={handleSend} 
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-zinc-700/60 bg-zinc-800/60 text-white"
                      aria-label="Send"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {chatMode === 'ai' && (
                <div className="mt-3 rounded-xl p-3 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20">
                  <div className="space-y-3 max-h-64 overflow-y-auto mb-3">
                    {aiMessages.length === 0 && (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm text-white/80 mb-1">DMZ Community Admin</p>
                        <p className="text-xs text-white/50">Ask me anything about building your portfolio!</p>
                      </div>
                    )}

                    {aiMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          {message.role === 'assistant' && (
                            <div className="flex items-center gap-1.5 mb-1">
                              <Sparkles className="w-3 h-3 text-purple-400" />
                              <span className="text-[10px] text-white/60 font-medium">Admin</span>
                            </div>
                          )}
                          <p className="leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    ))}

                    {aiLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 px-3 py-2 rounded-2xl">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={aiChatEndRef} />
                  </div>

                  <form onSubmit={handleAiSubmit} className="flex gap-2">
                    <input
                      value={aiInput}
                      onChange={handleAiInputChange}
                      placeholder="Ask the community admin..."
                      disabled={aiLoading}
                      className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-zinc-900/60 text-white border border-purple-500/30 placeholder:text-zinc-500 disabled:opacity-50"
                    />
                    <button 
                      type="submit"
                      disabled={aiLoading || !aiInput.trim()}
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Send"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        )}
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
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
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
    const newAnswers = { ...answers, [currentQuestion]: value }
    setAnswers(newAnswers)

    console.log("[v0] Question answered:", currentQuestion, "Value:", value)
    console.log("[v0] Total answers:", Object.keys(newAnswers).length, "of", questions.length)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion((c) => c + 1), 300)
    } else {
      console.log("[v0] All questions answered! Showing View Results button")
    }
  }

  const handleShowResults = () => {
    console.log("[v0] Calculating results...")
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

    console.log("[v0] Calculated scores:", scores)
    setCalculatedScores(scores)
    setShowResults(true)
  }

  const handleSaveResults = () => {
    console.log("[v0] Saving results...")
    if (calculatedScores) {
      onComplete(calculatedScores)
      setCurrentQuestion(0)
      setAnswers({})
      setShowResults(false)
      setCalculatedScores(null)
    }
  }

  const handleRetake = () => {
    console.log("[v0] Retaking assessment...")
    setShowResults(false)
    setCurrentQuestion(0)
    setAnswers({})
    setCalculatedScores(null)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isComplete = Object.keys(answers).length === questions.length

  console.log(
    "[v0] Questionnaire state - Current:",
    currentQuestion,
    "Answers:",
    Object.keys(answers).length,
    "Complete:",
    isComplete,
  )

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
            className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {showResults && calculatedScores ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Your Leadership Profile</h2>
                    <p className="text-sm text-neutral-400 mt-1">Assessment Complete</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-2xl text-neutral-400 hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {/* Summary of Scores */}
                <div className="space-y-6 mb-8">
                  {/* Orientation & Coaching Factors */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl">
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
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl">
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
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl">
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
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
                      Emotional Quotient
                    </h3>
                    <ScoreDisplay
                      label="Overall EQ"
                      value={calculatedScores.emotionalQuotient}
                      min={40}
                      max={90}
                      leftLabel="Relies on Non-Emotional Info"
                      rightLabel="Understands & Uses Emotional Info"
                      color="blue"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={handleRetake}
                    className="px-6 py-3 rounded-2xl bg-neutral-800/50 hover:bg-neutral-800 transition-all text-sm font-medium text-white"
                  >
                    Retake Assessment
                  </button>
                  <button
                    onClick={handleSaveResults}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold transition-all text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
                  >
                    Save Results
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Leadership Assessment</h2>
                    <p className="text-sm text-neutral-400 mt-1">Discover your professional traits</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-2xl text-neutral-400 hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    ×
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
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
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
                      color: "from-green-500/20 to-emerald-500/20",
                    },
                    { value: 4, label: "Agree", color: "from-blue-500/20 to-cyan-500/20" },
                    {
                      value: 3,
                      label: "Neutral",
                      color: "from-neutral-500/20 to-neutral-600/20",
                    },
                    { value: 2, label: "Disagree", color: "from-orange-500/20 to-amber-500/20" },
                    {
                      value: 1,
                      label: "Strongly Disagree",
                      color: "from-red-500/20 to-rose-500/20",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`group relative py-4 px-3 rounded-2xl text-center transition-all duration-200 ${
                        answers[currentQuestion] === option.value
                          ? `bg-gradient-to-br ${option.color} scale-105 shadow-lg`
                          : "bg-neutral-800/30 hover:bg-neutral-800/50 hover:scale-105"
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
                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentQuestion((c) => Math.max(0, c - 1))}
                    disabled={currentQuestion === 0}
                    className="px-6 py-3 rounded-2xl bg-neutral-800/50 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium text-white"
                  >
                    Previous
                  </button>
                  {isComplete ? (
                    <button
                      onClick={() => {
                        console.log("[v0] View Results button clicked!")
                        handleShowResults()
                      }}
                      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold transition-all text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
                    >
                      View Results
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestion((c) => Math.min(questions.length - 1, c + 1))}
                      disabled={currentQuestion === questions.length - 1}
                      className="px-6 py-3 rounded-2xl bg-neutral-800/50 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium text-white"
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
  color?: "default" | "blue"
}) {
  const percentage = ((value - min) / (max - min)) * 100
  const gradientClass = "from-blue-500 to-cyan-500"

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
      <div className="text-xs text-white/60 mb-1.5">{label}</div>
      {children}
    </label>
  )
}

function SocialLinkField({
  icon,
  platform,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode
  platform: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/60 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center bg-[#2a2a2a] border border-white/10 rounded-lg overflow-hidden">
          <span className="px-2 py-2 text-xs text-white/40 whitespace-nowrap">
            {platform}
          </span>
          <input
            className="flex-1 bg-transparent py-2 pr-2 text-sm text-white outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  )
}
