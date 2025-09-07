import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeUUID(): string {
  const g: any = globalThis as any
  const c = g?.crypto

  if (c?.randomUUID) return c.randomUUID()

  if (c?.getRandomValues) {
    const bytes = new Uint8Array(16)
    c.getRandomValues(bytes)
    // RFC 4122 version 4
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const toHex = (n: number) => n.toString(16).padStart(2, "0")
    const hex = Array.from(bytes, toHex).join("")
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  // last-resort (non-cryptographic) fallback
  return `id-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}
