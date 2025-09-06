"use client"

import { useCallback, useEffect, useRef } from "react"
import { updateWidgetProps } from "@/lib/supabase-server"

export function useAutosave(widgetId: string, props: any, delay = 1000) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const propsRef = useRef(props)

  // Update ref when props change
  useEffect(() => {
    propsRef.current = props
  }, [props])

  const save = useCallback(async () => {
    try {
      await updateWidgetProps(widgetId, propsRef.current)
      console.log("[v0] Autosaved widget props:", widgetId)
    } catch (error) {
      console.error("[v0] Autosave failed:", error)
    }
  }, [widgetId])

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(save, delay)
  }, [save, delay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedSave
}
