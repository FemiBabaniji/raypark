export type ThemeIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type Identity = {
  id: string
  name: string
  handle: string
  avatarUrl?: string
  selectedColor: ThemeIndex
}

export type WidgetDef = { id: string; type: string }
