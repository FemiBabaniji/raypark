-- Create meetings table for storing Google Calendar events
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  
  -- Meeting details
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  
  -- Google Calendar integration
  google_calendar_event_id TEXT UNIQUE,
  google_meet_link TEXT,
  
  -- Additional fields
  location TEXT,
  cover_image_url TEXT,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  max_attendees INTEGER,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meeting attendees table
CREATE TABLE IF NOT EXISTS meeting_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'confirmed', 'declined')),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(meeting_id, email)
);

-- Create meeting settings table
CREATE TABLE IF NOT EXISTS meeting_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE UNIQUE,
  reminder_minutes INTEGER DEFAULT 30,
  allow_guests BOOLEAN DEFAULT true,
  require_approval BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create google_calendar_tokens table for OAuth
CREATE TABLE IF NOT EXISTS google_calendar_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_calendar_tokens ENABLE ROW LEVEL SECURITY;

-- Meetings policies
CREATE POLICY "Users can view public meetings" ON meetings
  FOR SELECT USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Users can create own meetings" ON meetings
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own meetings" ON meetings
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own meetings" ON meetings
  FOR DELETE USING (user_id = auth.uid());

-- Attendees policies
CREATE POLICY "Anyone can view meeting attendees" ON meeting_attendees
  FOR SELECT USING (true);

CREATE POLICY "Meeting owners can manage attendees" ON meeting_attendees
  FOR ALL USING (
    meeting_id IN (SELECT id FROM meetings WHERE user_id = auth.uid())
  );

-- Settings policies
CREATE POLICY "Meeting owners can manage settings" ON meeting_settings
  FOR ALL USING (
    meeting_id IN (SELECT id FROM meetings WHERE user_id = auth.uid())
  );

-- Tokens policies (strict - only own tokens)
CREATE POLICY "Users can manage own tokens" ON google_calendar_tokens
  FOR ALL USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_meetings_user_id ON meetings(user_id);
CREATE INDEX idx_meetings_start_time ON meetings(start_time);
CREATE INDEX idx_meeting_attendees_meeting_id ON meeting_attendees(meeting_id);
CREATE INDEX idx_meeting_attendees_email ON meeting_attendees(email);
