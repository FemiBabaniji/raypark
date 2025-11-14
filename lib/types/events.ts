export interface Calendar {
  id: string
  user_id: string
  name: string
  description: string | null
  slug: string
  public_url: string | null
  cover_image_url: string | null
  icon_emoji: string
  tint_color: string
  location_type: 'city' | 'global' | null
  location_city: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  calendar_id: string
  created_by: string
  name: string
  description: string | null
  cover_image_url: string | null
  theme: string
  start_time: string
  end_time: string
  timezone: string
  location_type: 'offline' | 'virtual' | 'tbd'
  location_address: string | null
  location_link: string | null
  is_public: boolean
  status: 'draft' | 'published' | 'cancelled'
  created_at: string
  updated_at: string
  calendar?: Calendar
  tickets?: EventTicket[]
  registration_count?: number
}

export interface EventTicket {
  id: string
  event_id: string
  name: string
  price_cents: number
  currency: string
  capacity: number | null
  require_approval: boolean
  created_at: string
}

export interface EventRegistration {
  id: string
  event_id: string
  ticket_id: string | null
  user_id: string | null
  email: string
  full_name: string | null
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  registered_at: string
}
