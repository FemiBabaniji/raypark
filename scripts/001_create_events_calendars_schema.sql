-- Create calendars table
CREATE TABLE IF NOT EXISTS calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL,
  public_url TEXT,
  cover_image_url TEXT,
  icon_emoji TEXT DEFAULT '📅',
  tint_color TEXT DEFAULT '#6B7280',
  location_type TEXT CHECK (location_type IN ('city', 'global')),
  location_city TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- Create calendar_admins table for team collaboration
CREATE TABLE IF NOT EXISTS calendar_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'editor')) DEFAULT 'editor',
  added_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID REFERENCES users(id),
  UNIQUE(calendar_id, user_id)
);

-- Create calendar_subscribers table
CREATE TABLE IF NOT EXISTS calendar_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  newsletter_enabled BOOLEAN DEFAULT true,
  UNIQUE(calendar_id, email)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  theme TEXT DEFAULT 'minimal',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'America/Toronto',
  location_type TEXT CHECK (location_type IN ('offline', 'virtual', 'tbd')),
  location_address TEXT,
  location_link TEXT,
  is_public BOOLEAN DEFAULT true,
  status TEXT CHECK (status IN ('draft', 'published', 'cancelled')) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create event_tickets table
CREATE TABLE IF NOT EXISTS event_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'General Admission',
  price_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  capacity INTEGER,
  require_approval BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES event_tickets(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')) DEFAULT 'approved',
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, email)
);

-- Create featured_events table (for cross-calendar highlights)
CREATE TABLE IF NOT EXISTS featured_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  featured_event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  featured_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(calendar_id, featured_event_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_calendars_user_id ON calendars(user_id);
CREATE INDEX IF NOT EXISTS idx_calendars_slug ON calendars(slug);
CREATE INDEX IF NOT EXISTS idx_calendar_admins_calendar_id ON calendar_admins(calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendar_admins_user_id ON calendar_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_subscribers_calendar_id ON calendar_subscribers(calendar_id);
CREATE INDEX IF NOT EXISTS idx_events_calendar_id ON events(calendar_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);

-- Enable Row Level Security
ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_events ENABLE ROW LEVEL SECURITY;

-- Calendars RLS Policies
CREATE POLICY "Public calendars are viewable by everyone"
  ON calendars FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own calendars"
  ON calendars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendars"
  ON calendars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendars"
  ON calendars FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendars"
  ON calendars FOR DELETE
  USING (auth.uid() = user_id);

-- Calendar Admins RLS Policies
CREATE POLICY "Calendar admins viewable by calendar members"
  ON calendar_admins FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM calendar_admins WHERE calendar_id = calendar_admins.calendar_id
    )
    OR
    auth.uid() IN (
      SELECT user_id FROM calendars WHERE id = calendar_admins.calendar_id
    )
  );

CREATE POLICY "Calendar owners can manage admins"
  ON calendar_admins FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM calendars WHERE id = calendar_admins.calendar_id
    )
  );

-- Calendar Subscribers RLS Policies
CREATE POLICY "Anyone can subscribe to public calendars"
  ON calendar_subscribers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM calendars WHERE id = calendar_subscribers.calendar_id AND is_public = true
    )
  );

CREATE POLICY "Users can view calendar subscribers if they're admins"
  ON calendar_subscribers FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM calendar_admins WHERE calendar_id = calendar_subscribers.calendar_id
    )
    OR
    auth.uid() IN (
      SELECT user_id FROM calendars WHERE id = calendar_subscribers.calendar_id
    )
  );

-- Events RLS Policies
CREATE POLICY "Public events are viewable by everyone"
  ON events FOR SELECT
  USING (
    is_public = true 
    AND status = 'published'
    AND EXISTS (
      SELECT 1 FROM calendars WHERE id = events.calendar_id AND is_public = true
    )
  );

CREATE POLICY "Calendar admins can view all calendar events"
  ON events FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM calendar_admins WHERE calendar_id = events.calendar_id
    )
    OR
    auth.uid() IN (
      SELECT user_id FROM calendars WHERE id = events.calendar_id
    )
  );

CREATE POLICY "Calendar admins can create events"
  ON events FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM calendar_admins WHERE calendar_id = events.calendar_id
    )
    OR
    auth.uid() IN (
      SELECT user_id FROM calendars WHERE id = events.calendar_id
    )
  );

CREATE POLICY "Calendar admins can update events"
  ON events FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM calendar_admins WHERE calendar_id = events.calendar_id
    )
    OR
    auth.uid() IN (
      SELECT user_id FROM calendars WHERE id = events.calendar_id
    )
  );

CREATE POLICY "Calendar admins can delete events"
  ON events FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM calendar_admins WHERE calendar_id = events.calendar_id
    )
    OR
    auth.uid() IN (
      SELECT user_id FROM calendars WHERE id = events.calendar_id
    )
  );

-- Event Tickets RLS Policies
CREATE POLICY "Public event tickets are viewable"
  ON event_tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_tickets.event_id AND is_public = true AND status = 'published'
    )
  );

CREATE POLICY "Calendar admins can manage event tickets"
  ON event_tickets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events e
      JOIN calendars c ON e.calendar_id = c.id
      WHERE e.id = event_tickets.event_id 
      AND (
        c.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM calendar_admins WHERE calendar_id = c.id AND user_id = auth.uid()
        )
      )
    )
  );

-- Event Registrations RLS Policies
CREATE POLICY "Anyone can register for public events"
  ON event_registrations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_registrations.event_id AND is_public = true AND status = 'published'
    )
  );

CREATE POLICY "Users can view their own registrations"
  ON event_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Calendar admins can view all registrations"
  ON event_registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events e
      JOIN calendars c ON e.calendar_id = c.id
      WHERE e.id = event_registrations.event_id 
      AND (
        c.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM calendar_admins WHERE calendar_id = c.id AND user_id = auth.uid()
        )
      )
    )
  );

-- Featured Events RLS Policies
CREATE POLICY "Featured events viewable by everyone"
  ON featured_events FOR SELECT
  USING (true);

CREATE POLICY "Calendar admins can manage featured events"
  ON featured_events FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM calendars WHERE id = featured_events.calendar_id
    )
    OR
    auth.uid() IN (
      SELECT user_id FROM calendar_admins WHERE calendar_id = featured_events.calendar_id
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_calendars_updated_at BEFORE UPDATE ON calendars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
