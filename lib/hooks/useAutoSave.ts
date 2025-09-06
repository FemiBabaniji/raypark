"use client"
import { useEffect, useRef, useState } from "react"

type Status = "idle" | "dirty" | "saving" | "saved" | "error"

export function useAutoSave<T>({
  key,
  data,
  save,
  delay = 1200,
  enabled = true,
}: {
  key: string
  data: T
  save: (data: T, signal: AbortSignal) => Promise<void>
  delay?: number
  enabled?: boolean
}) {
  const [status, setStatus] = useState<Status>("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inFlight = useRef<AbortController | null>(null)
  const lastSent = useRef<string>("") // stable JSON snapshot to dedupe

  // mark dirty when data changes
  useEffect(() => {
    if (!enabled) return
    const snap = JSON.stringify(data)
    if (snap !== lastSent.current) setStatus((s) => (s === "saving" ? s : "dirty"))
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      if (snap === lastSent.current) return
      // cancel previous request
      inFlight.current?.abort()
      const ctrl = new AbortController()
      inFlight.current = ctrl
      setStatus("saving")
      try {
        await save(data, ctrl.signal)
        lastSent.current = snap
        setStatus("saved")
        setTimeout(() => setStatus("idle"), 1200)
      } catch (e) {
        if ((e as any).name === "AbortError") return
        console.error("[v0] Autosave error:", e)
        setStatus("error")
      }
    }, delay)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [data, delay, enabled, save])

  return { status }
}
