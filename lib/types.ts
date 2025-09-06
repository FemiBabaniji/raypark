export interface Portfolio {
  id: string
  user_id: string
  title: string
  slug: string
  description?: string
  theme_id?: string
  is_published: boolean
  published_at?: string
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  portfolio_id: string
  title: string
  slug: string
  description?: string
  layout_id?: string
  is_published: boolean
  published_at?: string
  created_at: string
  updated_at: string
}

export interface WidgetInstance {
  id: string
  page_id: string
  widget_type_id: string
  props: Record<string, any>
  position: number
  column: "left" | "right" | "full"
  is_published: boolean
  published_at?: string
  created_at: string
  updated_at: string
}

export interface WidgetType {
  id: string
  name: string
  display_name: string
  description?: string
  category: string
  schema: Record<string, any>
  render_hints: Record<string, any>
  sample_data: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Theme {
  id: string
  name: string
  display_name: string
  config: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}
