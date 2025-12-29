export type ThemeIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type Identity = {
  id?: string
  name: string
  firstName?: string
  lastName?: string
  profileName?: string // Username for slug generation
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
  youtube?: string
  tiktok?: string
  website?: string
  skills?: string[]
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

export type ProjectItem = {
  id: string
  name: string
  description: string
  year: string
  tags: string[]
}

export type EducationItem = {
  id: string
  degree: string
  school: string
  year: string
  description?: string
  certified?: boolean
}

export type Community = {
  id: string
  name: string
  code: string
  description?: string
  logo_url?: string
  settings?: Record<string, any>
}

export type WidgetStyle = {
  bg?: string // tailwind class OR theme token
  accent?: ThemeIndex
}

export type WidgetInstance<T = any> = {
  id: string
  type:
    | "identity"
    | "education"
    | "projects"
    | "description"
    | "services"
    | "gallery"
    | "startup"
    | "meeting-scheduler"
    | "image"
    | "task-manager"
  enabled: boolean
  content: T
  style?: WidgetStyle
}

export type WidgetBaseProps<T> = {
  widgetId: string
  column: "left" | "right"
  isPreviewMode?: boolean
  content: T
  style?: WidgetStyle
  onDelete?: () => void
  onMove?: () => void
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
