"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Palette, Save, X, Bot, Send, Loader2 } from "lucide-react"
import { THEME_COLOR_OPTIONS, type ThemeIndex } from "@/lib/theme"

/** Types the side panel can use */
type IdentityShape = {
  name?: string
  title?: string
  subtitle?: string
  handle?: string
  email?: string
  location?: string
  avatarUrl?: string
  selectedColor?: ThemeIndex
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

  // Local editable copy so users can cancel or save
  const [draft, setDraft] = useState<IdentityShape>(() => identity ?? {})
  useEffect(() => setDraft(identity ?? {}), [identity])

  // theming for the little node graphic
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
    // Apply identity-affecting commands locally too (nice immediate feedback)
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
    <div className="fixed right-0 top-0 w-80 xl:w-96 h-screen bg-[#1f1f1f] text-white pt-20 sm:pt-24 px-4 xl:px-6 pb-4 xl:pb-6 space-y-4 xl:space-y-6 overflow-y-auto">
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
          <p className="text-neutral-300 text-xs mb-3 leading-relaxed line-clamp-2">
            {draft.subtitle || "short tagline"}
          </p>

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

          {/* Expandable editor */}
          {editOpen && (
            <div className="text-left mt-4 space-y-3">
              <Field label="Name">
                <input
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30"
                  value={draft.name ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                />
              </Field>
              <Field label="Title">
                <input
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30"
                  value={draft.title ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                />
              </Field>
              <Field label="Subtitle">
                <input
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30"
                  value={draft.subtitle ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, subtitle: e.target.value }))}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Handle">
                  <input
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30"
                    value={draft.handle ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, handle: e.target.value }))}
                  />
                </Field>
                <Field label="Avatar URL">
                  <input
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30"
                    value={draft.avatarUrl ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, avatarUrl: e.target.value }))}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Email">
                  <input
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30"
                    value={draft.email ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                  />
                </Field>
                <Field label="Location">
                  <input
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30"
                    value={draft.location ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                  />
                </Field>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20"
                  onClick={() => {
                    setDraft(identity ?? {})
                    setEditOpen(false)
                  }}
                >
                  <X className="w-4 h-4 inline mr-1" />
                  Cancel
                </button>
                <button
                  className="px-3 py-2 text-sm rounded-lg bg-white text-black hover:bg-white/90"
                  onClick={() => {
                    onIdentityChange?.(draft)
                    setEditOpen(false)
                  }}
                >
                  <Save className="w-4 h-4 inline mr-1" />
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
