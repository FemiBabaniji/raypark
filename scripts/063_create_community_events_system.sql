-- =====================================================
-- Script 063: Create Community Events System
-- Description: Community-level events for tracking attendance, engagement
-- Dependencies: communities, cohorts, community_members tables
-- =====================================================

-- Create events table for community events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL,
  
  -- Event details
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  timezone TEXT DEFAULT 'UTC',
  location TEXT,
  
  -- Event configuration
  event_type TEXT DEFAULT 'general' CHECK (event_type IN ('general', 'workshop', 'networking', 'social', 'speaker', 'other')),
  capacity INTEGER,
  rsvp_required BOOLEAN DEFAULT true,
  rsvp_deadline TIMESTAMPTZ,
  
  -- Integration fields
  luma_event_id TEXT UNIQUE,
  google_calendar_id TEXT,
  virtual_meeting_link TEXT,
  
  -- Status and visibility
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled')),
  visibility TEXT DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'cohort', 'private')),
  
  -- Media
  cover_image_url TEXT,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT event_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT valid_event_dates CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT valid_rsvp_deadline CHECK (rsvp_deadline IS NULL OR rsvp_deadline <= start_date)
);

-- Create event_rsvps table
CREATE TABLE IF NOT EXISTS event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- RSVP status
  status TEXT DEFAULT 'yes' CHECK (status IN ('yes', 'no', 'maybe', 'waitlist')),
  rsvp_at TIMESTAMPTZ DEFAULT now(),
  
  -- Check-in tracking
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  check_in_method TEXT CHECK (check_in_method IS NULL OR check_in_method IN ('qr', 'manual', 'auto')),
  
  -- Additional info
  notes TEXT,
  guest_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(event_id, user_id)
);

-- Create event_attendance_stats view
CREATE OR REPLACE VIEW event_attendance_stats AS
SELECT 
  e.id as event_id,
  e.community_id,
  e.name as event_name,
  e.start_date,
  e.status,
  COUNT(r.id) as total_rsvps,
  COUNT(r.id) FILTER (WHERE r.status = 'yes') as confirmed_count,
  COUNT(r.id) FILTER (WHERE r.checked_in = true) as attended_count,
  CASE 
    WHEN COUNT(r.id) FILTER (WHERE r.status = 'yes') > 0 
    THEN ROUND((COUNT(r.id) FILTER (WHERE r.checked_in = true)::numeric / COUNT(r.id) FILTER (WHERE r.status = 'yes')::numeric) * 100, 1)
    ELSE 0
  END as attendance_rate,
  e.capacity,
  CASE 
    WHEN e.capacity IS NOT NULL 
    THEN e.capacity - COUNT(r.id) FILTER (WHERE r.status = 'yes')
    ELSE NULL
  END as spots_remaining
FROM events e
LEFT JOIN event_rsvps r ON e.id = r.event_id
GROUP BY e.id, e.community_id, e.name, e.start_date, e.status, e.capacity;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_community_id ON events(community_id);
CREATE INDEX IF NOT EXISTS idx_events_cohort_id ON events(cohort_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_event_id ON event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user_id ON event_rsvps(user_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_status ON event_rsvps(status);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_checked_in ON event_rsvps(checked_in) WHERE checked_in = true;

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_events_updated_at ON events;
CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_events_updated_at();

DROP TRIGGER IF EXISTS set_event_rsvps_updated_at ON event_rsvps;
CREATE TRIGGER set_event_rsvps_updated_at
  BEFORE UPDATE ON event_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_events_updated_at();

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
-- Community members can view events based on visibility
CREATE POLICY "members_view_community_events" ON events
  FOR SELECT
  USING (
    visibility = 'public' OR
    (visibility = 'members' AND EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.community_id = events.community_id
        AND cm.user_id = auth.uid()
    )) OR
    (visibility = 'cohort' AND EXISTS (
      SELECT 1 FROM cohort_members chm
      WHERE chm.cohort_id = events.cohort_id
        AND chm.user_id = auth.uid()
    )) OR
    created_by = auth.uid()
  );

-- Community admins can manage all events
CREATE POLICY "admins_manage_community_events" ON events
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_community_roles ucr
      WHERE ucr.user_id = auth.uid()
        AND ucr.community_id = events.community_id
        AND ucr.role = 'community_admin'
        AND (ucr.expires_at IS NULL OR ucr.expires_at > now())
    )
  );

-- Cohort admins can manage cohort events
CREATE POLICY "cohort_admins_manage_cohort_events" ON events
  FOR ALL
  USING (
    events.cohort_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM user_cohort_roles uchr
      WHERE uchr.user_id = auth.uid()
        AND uchr.cohort_id = events.cohort_id
        AND uchr.role = 'cohort_admin'
        AND (uchr.expires_at IS NULL OR uchr.expires_at > now())
    )
  );

-- RLS Policies for event_rsvps
-- Users can view RSVPs for events they can see
CREATE POLICY "users_view_event_rsvps" ON event_rsvps
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = event_rsvps.event_id
        AND (
          e.visibility = 'public' OR
          (e.visibility = 'members' AND EXISTS (
            SELECT 1 FROM community_members cm
            WHERE cm.community_id = e.community_id
              AND cm.user_id = auth.uid()
          ))
        )
    )
  );

-- Users can manage their own RSVPs
CREATE POLICY "users_manage_own_rsvps" ON event_rsvps
  FOR ALL
  USING (user_id = auth.uid());

-- Community admins can manage all RSVPs in their community
CREATE POLICY "admins_manage_community_rsvps" ON event_rsvps
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events e
      JOIN user_community_roles ucr ON ucr.community_id = e.community_id
      WHERE e.id = event_rsvps.event_id
        AND ucr.user_id = auth.uid()
        AND ucr.role = 'community_admin'
        AND (ucr.expires_at IS NULL OR ucr.expires_at > now())
    )
  );

-- Helper function to auto-update event status
CREATE OR REPLACE FUNCTION auto_update_event_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Mark events as ongoing if they've started
  UPDATE events
  SET status = 'ongoing'
  WHERE status = 'upcoming'
    AND start_date <= now()
    AND (end_date IS NULL OR end_date >= now());
  
  -- Mark events as completed if they've ended
  UPDATE events
  SET status = 'completed'
  WHERE status IN ('upcoming', 'ongoing')
    AND end_date IS NOT NULL
    AND end_date < now();
END;
$$;

-- Function to track event attendance in engagement scoring
CREATE OR REPLACE FUNCTION log_event_attendance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If user just checked in, log activity
  IF NEW.checked_in = true AND (OLD.checked_in IS NULL OR OLD.checked_in = false) THEN
    -- Update engagement score (add 10 points for event attendance)
    UPDATE community_members cm
    SET engagement_score = COALESCE(engagement_score, 0) + 10
    FROM events e
    WHERE cm.user_id = NEW.user_id
      AND cm.community_id = e.community_id
      AND e.id = NEW.event_id;
    
    -- Log in activity_log
    INSERT INTO activity_log (
      user_id,
      action,
      entity_type,
      entity_id,
      diff
    ) VALUES (
      NEW.user_id,
      'attended_event',
      'event',
      NEW.event_id,
      jsonb_build_object(
        'event_id', NEW.event_id,
        'checked_in_at', NEW.checked_in_at,
        'check_in_method', NEW.check_in_method
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_log_event_attendance ON event_rsvps;
CREATE TRIGGER trigger_log_event_attendance
  AFTER UPDATE ON event_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION log_event_attendance();

-- Add comments
COMMENT ON TABLE events IS 'Community events for tracking attendance, RSVPs, and engagement';
COMMENT ON TABLE event_rsvps IS 'Event RSVP and check-in tracking for members';
COMMENT ON COLUMN events.luma_event_id IS 'Integration ID for Luma event management platform';
COMMENT ON COLUMN event_rsvps.check_in_method IS 'How the user checked in: qr (QR code scan), manual (admin marked), auto (automatic)';
COMMENT ON VIEW event_attendance_stats IS 'Aggregated statistics for event attendance and RSVP rates';
