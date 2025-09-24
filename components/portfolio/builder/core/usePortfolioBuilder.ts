"use client"

import { useCallback, useMemo, useState } from "react"
import { nanoid } from "nanoid"
import type { ThemeIndex } from "@/lib/theme"
import type { PortfolioExportData } from "@/lib/portfolioExportData" // Import PortfolioExportData

/** ---------- Types ---------- */
export type Column = "left" | "right"
export type WidgetType = "identity" | "education" | "projects" | "description" | "services" | "gallery" | "startup"

export type WidgetDef = { id: string; type: WidgetType }

export type Identity = {
  id: string
  name: string
  handle: string
  avatarUrl?: string
  selectedColor: ThemeIndex
  title?: string
  subtitle?: string
  email?: string
  location?: string
}

export type WidgetContent = {
  education: {
    title: string
    items: Array<{ degree: string; school: string; year: string; description?: string; certified?: boolean }>
  }
  projects: {
    title: string
    items: Array<{ name: string; description: string; year: string; tags: string[] }>
  }
  services: {
    title: string
    items: string[]
  }
  description: {
    title: string
    content: string
  }
  // gallery keyed by widgetId -> per-widget groups
  gallery: Record<
    string,
    Array<{ id: string; name: string; description?: string; images: string[]; isVideo?: boolean }>
  >
  startup: {
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
}

/** ---------- Defaults ---------- */
const DEFAULT_IDENTITY = (overrides?: Partial<Identity>): Identity => ({
  id: overrides?.id ?? "me",
  name: overrides?.name ?? "your name",
  handle: overrides?.handle ?? "@you",
  avatarUrl: overrides?.avatarUrl,
  selectedColor: overrides?.selectedColor ?? (0 as ThemeIndex),
  title: overrides?.title ?? "is a digital product designer",
  subtitle: overrides?.subtitle ?? "currently designing at acme.",
  email: overrides?.email,
  location: overrides?.location,
})

const DEFAULT_CONTENT: WidgetContent = {
  education: {
    title: "Education",
    items: [
      { degree: "B.Sc. Computer Science", school: "State University", year: "2018 – 2022" },
      { degree: "Design Systems Certificate", school: "Coursera", year: "2023", certified: true },
    ],
  },
  projects: {
    title: "Featured Projects",
    items: [
      { name: "E-commerce Redesign", description: "Lifted CR by 18%", year: "2024", tags: ["UI/UX", "A/B"] },
      { name: "Mobile Banking", description: "4.8★ app rating", year: "2023", tags: ["iOS", "Android"] },
    ],
  },
  services: {
    title: "Services",
    items: ["Product Design", "User Research", "Prototyping", "Design Systems"],
  },
  description: {
    title: "About Me",
    content: "I build calm, pragmatic interfaces that convert and delight.",
  },
  gallery: {},
  startup: {
    name: "NexaAI",
    tagline: "AI mentor for student founders",
    stage: "Pilot",
    ask: "$50K seed + partnerships",
    problem: "Founders lack structured mentorship and visibility in their communities.",
    solution: "A portfolio-based app that syncs events, showcases startups, and provides AI co-pilot mentorship.",
    market: "University incubators, bootcamps, and entrepreneurship communities.",
    targetCustomer: "Student founders and early-stage entrepreneurs",
    marketSize: "$2.5B education/mentor SaaS market",
    traction: ["1,200 beta testers", "5 paid pilots", "1 community partner (BEA)"],
    team: [
      { name: "Jane Doe", role: "CEO", linkedin: "https://linkedin.com/in/janedoe" },
      { name: "John Smith", role: "CTO", linkedin: "https://linkedin.com/in/johnsmith" },
      { name: "Priya Patel", role: "Designer" },
    ],
    callToAction: {
      mentorship: true,
      pilotCustomers: true,
      funding: false,
      partnerships: true,
      hiring: false,
    },
    links: {
      github: "https://github.com/startup",
      website: "https://nexa.ai",
      demo: "https://figma.com/demo",
    },
  },
}

/** ---------- Hook ---------- */
export function usePortfolioBuilder(initial?: {
  identity?: Partial<Identity>
  left?: WidgetDef[]
  right?: WidgetDef[]
  content?: Partial<WidgetContent>
}) {
  // identity
  const [identity, setIdentity] = useState<Identity>(() => DEFAULT_IDENTITY(initial?.identity))

  // layout (keep identity pinned first in left)
  const [leftWidgets, setLeftWidgets] = useState<WidgetDef[]>(
    initial?.left ?? [
      { id: "identity", type: "identity" },
      { id: "education", type: "education" },
    ],
  )
  const [rightWidgets, setRightWidgets] = useState<WidgetDef[]>(
    initial?.right ?? [
      { id: "description", type: "description" },
      { id: "projects", type: "projects" },
      { id: "services", type: "services" },
    ],
  )

  // content
  const [widgetContent, setWidgetContent] = useState<WidgetContent>(() => ({
    ...DEFAULT_CONTENT,
    ...initial?.content,
    gallery: initial?.content?.gallery ?? {},
  }))

  /** ----- actions ----- */
  const addWidget = useCallback((type: WidgetType, column: Column) => {
    const id = `${type}-${nanoid(6)}`
    const def: WidgetDef = { id, type }
    if (column === "left") setLeftWidgets((p) => [...p, def])
    else setRightWidgets((p) => [...p, def])

    // initialize content for new widget types that are keyed by id (gallery)
    if (type === "gallery") {
      setWidgetContent((prev) => ({
        ...prev,
        gallery: { ...prev.gallery, [id]: [] },
      }))
    }
    return id
  }, [])

  const removeWidget = useCallback((id: string) => {
    if (id === "identity") return
    setLeftWidgets((p) => p.filter((w) => w.id !== id))
    setRightWidgets((p) => p.filter((w) => w.id !== id))
    setWidgetContent((prev) => {
      // clean gallery bucket if it existed
      if (prev.gallery[id]) {
        const { [id]: _, ...rest } = prev.gallery
        return { ...prev, gallery: rest }
      }
      return prev
    })
  }, [])

  const moveWidget = useCallback((id: string, to: Column) => {
    if (id === "identity") return
    // remove from both then append to target
    let moved: WidgetDef | undefined
    setLeftWidgets((p) => {
      const idx = p.findIndex((w) => w.id === id)
      if (idx >= 0) moved = p[idx]
      return p.filter((w) => w.id !== id)
    })
    setRightWidgets((p) => {
      const idx = p.findIndex((w) => w.id === id)
      if (idx >= 0) moved = p[idx]
      return p.filter((w) => w.id !== id)
    })
    if (moved) {
      if (to === "left") setLeftWidgets((p) => [...p, moved!])
      else setRightWidgets((p) => [...p, moved!])
    }
  }, [])

  const updateContent = useCallback(
    (section: keyof WidgetContent, value: any) => {
      setWidgetContent((prev) => ({ ...prev, [section]: value }))
    },
    [setWidgetContent],
  )

  const updateIdentity = useCallback((patch: Partial<Identity>) => {
    setIdentity((prev) => ({ ...prev, ...patch }))
  }, [])

  const setTheme = useCallback((colorIndex: ThemeIndex) => {
    setIdentity((prev) => ({ ...prev, selectedColor: colorIndex }))
  }, [])

  const exportData = useCallback((): PortfolioExportData => {
    return {
      identity,
      leftWidgets,
      rightWidgets,
      widgetContent,
      metadata: { createdAt: new Date().toISOString(), version: "1.0.0" },
    }
  }, [identity, leftWidgets, rightWidgets, widgetContent])

  /** handy summary string for your copilot/chat */
  const summary = useMemo(() => {
    const left = leftWidgets.map((w) => w.type).join(", ")
    const right = rightWidgets.map((w) => w.type).join(", ")
    return `Left: ${left} | Right: ${right}`
  }, [leftWidgets, rightWidgets])

  return {
    // state
    identity,
    leftWidgets,
    rightWidgets,
    widgetContent,
    // actions
    addWidget,
    removeWidget,
    moveWidget,
    updateContent,
    updateIdentity,
    setTheme,
    exportData,
    // helpers
    summary,
    setLeftWidgets,
    setRightWidgets,
  }
}
