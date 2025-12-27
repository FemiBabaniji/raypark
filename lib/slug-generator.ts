/**
 * Generates user-friendly portfolio slugs using preset adjective-noun combinations
 * instead of random timestamps or numbers
 */

const ADJECTIVES = [
  "creative",
  "modern",
  "bold",
  "elegant",
  "minimal",
  "vibrant",
  "sleek",
  "dynamic",
  "polished",
  "innovative",
  "artistic",
  "professional",
  "clever",
  "unique",
  "bright",
  "fresh",
  "smart",
  "swift",
  "cosmic",
  "digital",
  "stellar",
  "vivid",
  "urban",
  "serene",
  "radiant",
  "quantum",
  "nexus",
  "prime",
  "apex",
  "fusion",
] as const

const NOUNS = [
  "studio",
  "portfolio",
  "showcase",
  "gallery",
  "space",
  "works",
  "labs",
  "design",
  "creative",
  "hub",
  "project",
  "collection",
  "archive",
  "profile",
  "realm",
  "vision",
  "craft",
  "canvas",
  "forge",
  "atelier",
  "workshop",
  "vault",
  "sphere",
  "nexus",
  "core",
  "base",
  "zone",
  "deck",
  "grid",
  "matrix",
] as const

/**
 * Generates a random user-friendly slug from preset combinations
 * @returns A slug in format: adjective-noun (e.g., "creative-studio")
 */
export function generateFriendlySlug(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return `${adjective}-${noun}`
}

/**
 * Generates a slug with a numeric suffix if needed
 * @param baseSlug The base slug to append a number to
 * @param attempt The attempt number (0 for first try)
 * @returns A slug with optional numeric suffix
 */
export function generateSlugWithSuffix(baseSlug: string, attempt: number): string {
  if (attempt === 0) return baseSlug
  return `${baseSlug}-${attempt}`
}

/**
 * Creates a base slug from a name, falling back to friendly preset if name is generic
 * @param name The portfolio name
 * @returns A slug based on the name or a friendly preset
 */
export function createBaseSlug(name: string): string {
  const trimmedName = name?.trim() || ""

  // If name is generic (like "New Portfolio", "Untitled", etc.), use a friendly preset
  const genericNames = ["new portfolio", "untitled", "portfolio", "my portfolio", "untitled portfolio"]
  const isGeneric = genericNames.includes(trimmedName.toLowerCase())

  if (isGeneric || !trimmedName) {
    return generateFriendlySlug()
  }

  // Otherwise, create slug from the actual name
  return trimmedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64)
}
