"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"

type Step = 0 | 1 | 2 | 3

interface OnboardingOverlayProps {
  step: Step
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  onDone: () => void
}

export default function OnboardingOverlay({ step, onNext, onBack, onSkip, onDone }: OnboardingOverlayProps) {
  const steps = useMemo(
    () => [
      {
        key: "drag",
        title: "Move things around",
        body: "Grab the handle to drag widgets and reorder your layout. Try dragging any card up or down.",
        selector: "[data-coach='drag']",
        cta: "Got it",
      },
      {
        key: "edit-name",
        title: "Edit text in place",
        body: "Click your name or the About text to edit. Press Enter or click away to save.",
        selector: "[data-coach='edit-name']",
        cta: "Let me try",
      },
      {
        key: "palette",
        title: "Theme & widgets",
        body: 'Open the palette to change the card color. Use "Add widget" to insert Projects or Quick Start blocks.',
        selector: "[data-coach='palette'], [data-coach='add-widget']",
        cta: "Next",
      },
      {
        key: "preview",
        title: "Preview & next steps",
        body: "Switch to Preview to see it like visitors do. Add one project and a photo—then you're ready to share.",
        selector: null,
        cta: "Finish",
      },
    ],
    [],
  ) as const

  const target = useRef<HTMLElement | null>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const padding = 10 // spotlight padding in px
  const radius = 12 // spotlight corner radius

  useLayoutEffect(() => {
    const sel = steps[step].selector
    if (!sel) {
      target.current = null
      setRect(null)
      return
    }
    const el = document.querySelector(sel) as HTMLElement | null
    target.current = el
    if (!el) {
      setRect(null)
      return
    }
    setRect(el.getBoundingClientRect())
    // auto-scroll into view
    el.scrollIntoView({ block: "center", behavior: "smooth" })
  }, [step, steps])

  useEffect(() => {
    const el = target.current
    if (!el) return

    const update = () => {
      setRect(el.getBoundingClientRect())
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)

    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [target.current])

  const primaryBtnRef = useRef<HTMLButtonElement>(null)

  // Focus primary CTA
  useEffect(() => {
    const t = setTimeout(() => primaryBtnRef.current?.focus(), 0)
    return () => clearTimeout(t)
  }, [step])

  // Esc to skip / finish
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (step < 3) onSkip()
        else onDone()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [step, onSkip, onDone])

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const spot = rect
    ? {
        x: rect.left + window.scrollX - padding,
        y: rect.top + window.scrollY - padding,
        w: rect.width + padding * 2,
        h: rect.height + padding * 2,
      }
    : null

  const dialogPosition = rect
    ? (() => {
        const dialogWidth = 560
        const dialogHeight = 200 // approximate
        const gap = 16 // gap between element and dialog
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // Try to position below the element first
        let top = rect.bottom + gap
        let left = rect.left + rect.width / 2 - dialogWidth / 2

        // If dialog goes off bottom of screen, position above
        if (top + dialogHeight > viewportHeight - 20) {
          top = rect.top - dialogHeight - gap
        }

        // If dialog goes off right side, align to right edge
        if (left + dialogWidth > viewportWidth - 20) {
          left = viewportWidth - dialogWidth - 20
        }

        // If dialog goes off left side, align to left edge
        if (left < 20) {
          left = 20
        }

        return { top, left }
      })()
    : { top: window.innerHeight / 2, left: window.innerWidth / 2 - 280 }

  // Allow clicking the spotlighted element (pass-through)
  const spotlightPointerEvents = spot ? "none" : "auto"

  return createPortal(
    <div aria-live="polite" aria-modal="true" role="dialog" className="fixed inset-0 z-[1000]">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id="onboarding-cutout">
            {/* full canvas visible (white) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* cut-out (black) */}
            {spot ? (
              <rect x={spot.x} y={spot.y} width={spot.w} height={spot.h} rx={radius} ry={radius} fill="black" />
            ) : null}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.55)"
          mask="url(#onboarding-cutout)"
          style={{ transition: "all 200ms ease" }}
        />
      </svg>

      {/* Optional highlight ring (very soft) */}
      {spot && (
        <div
          className="absolute pointer-events-none ring-2 ring-white/80 rounded-xl"
          style={{
            top: spot.y,
            left: spot.x,
            width: spot.w,
            height: spot.h,
            transition: "all 200ms ease",
          }}
        />
      )}

      {spot && (
        <div
          className="absolute"
          style={{
            top: spot.y,
            left: spot.x,
            width: spot.w,
            height: spot.h,
            // let pointer events pass through to the underlying element
            pointerEvents: spotlightPointerEvents as any,
          }}
        />
      )}

      <div
        className="pointer-events-auto absolute w-[min(560px,92vw)]"
        style={{
          top: `${dialogPosition.top}px`,
          left: `${dialogPosition.left}px`,
          transition: "all 200ms ease",
        }}
      >
        <div className="bg-neutral-900/95 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-white">{steps[step].title}</h3>
            <button onClick={onSkip} className="text-white/70 hover:text-white text-sm">
              Skip
            </button>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">{steps[step].body}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1" aria-label="Progress">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`h-1.5 w-8 rounded-full ${i <= step ? "bg-white" : "bg-white/30"}`} />
              ))}
            </div>

            <div className="flex gap-2">
              {step > 0 && (
                <button
                  onClick={onBack}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 text-sm"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  ref={primaryBtnRef}
                  onClick={onNext}
                  className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-white/90 text-sm"
                >
                  {steps[step].cta}
                </button>
              ) : (
                <button
                  ref={primaryBtnRef}
                  onClick={onDone}
                  className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-white/90 text-sm"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
