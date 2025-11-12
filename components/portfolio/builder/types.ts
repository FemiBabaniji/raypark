export type ThemeIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type Identity = {
  id?: string
  name: string
  title: string
  subtitle?: string
  bio?: string
  handle: string
  avatarUrl?: string
  selectedColor: ThemeIndex
  initials?: string
  email?: string
  location?: string
  linkedin?: string
  dribbble?: string
  behance?: string
  twitter?: string
  unsplash?: string
  instagram?: string
}

export type WidgetDef = { id: string; type: string }
