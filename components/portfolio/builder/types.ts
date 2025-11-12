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

export type WidgetPosition = {
  row: number
  col: number
  rowSpan: number
  colSpan: number
}

export type WidgetDef = {
  id: string
  type: string
  position?: WidgetPosition // Optional grid positioning
}

export type VerticalColumnLayout = {
  type: "vertical"
  widgets: string[] // Array of widget IDs in order
}

export type GridColumnLayout = {
  type: "grid"
  columns: number // Number of columns in the grid
  gap: number // Gap size in Tailwind units
  widgets: Array<{
    id: string
    row: number
    col: number
    rowSpan: number
    colSpan: number
  }>
}

export type ColumnLayout = VerticalColumnLayout | GridColumnLayout

export type PageLayout = {
  left: ColumnLayout
  right: ColumnLayout
}

export type Community = {
  id: string
  name: string
  code: string
  description?: string
  logo_url?: string
  settings?: Record<string, any>
}

export type PortfolioData = {
  id?: string
  user_id: string
  name: string
  slug: string
  description?: string
  theme_id?: string
  is_public: boolean
  community_id?: string // Link to community
  pages: Array<{
    id: string
    key: string
    title: string
    route: string
    layout: PageLayout
    widgets: Array<{
      id: string
      type: string
      props: Record<string, any>
      enabled: boolean
    }>
  }>
}
