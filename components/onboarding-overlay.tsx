"use client"

import { useEffect } from "react"

type Step = 0 | 1 | 2 | 3

interface OnboardingOverlayProps {
  step: Step
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  onDone: () => void
}

export default function OnboardingOverlay({ step, onNext, onBack, onSkip, onDone }: OnboardingOverlayProps) {
  const steps = [
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
      selector: null, // no spotlight needed
      cta: "Finish",
    },
  ] as const

  // Find the highlighted element (if any)
  const item = steps[step]
  const el = item.selector ? (document.querySelector(item.selector) as HTMLElement | null) : null
  const rect = el?.getBoundingClientRect()

  // Auto-scroll spotlight into view
  useEffect(() => {
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }, [el])

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dimmer */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      {/* Spotlight ring (if we have a target) */}
      {rect && (
        <div
          className="absolute rounded-xl ring-4 ring-white/80 pointer-events-none transition-all duration-200"
          style={{
            top: rect.top + window.scrollY - 8,
            left: rect.left + window.scrollX - 8,
            width: rect.width + 16,
            height: rect.height + 16,
          }}
        />
      )}

      {/* Coach card */}
      <div className="pointer-events-auto fixed bottom-8 left-1/2 -translate-x-1/2 w-[min(560px,92vw)]">
        <div className="bg-neutral-900/95 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-white">{steps[step].title}</h3>
            <button onClick={onSkip} className="text-white/70 hover:text-white text-sm">
              Skip
            </button>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">{steps[step].body}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1">
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
                  onClick={onNext}
                  className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-white/90 text-sm"
                >
                  {steps[step].cta}
                </button>
              ) : (
                <button
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
    </div>
  )
}
