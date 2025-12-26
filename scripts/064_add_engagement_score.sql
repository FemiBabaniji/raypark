-- =====================================================
-- Script 064: Add Engagement Score to Community Members
-- Description: Add engagement scoring field and helper functions
-- Dependencies: community_members table must exist
-- =====================================================

-- Add engagement_score column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_members' AND column_name = 'engagement_score'
  ) THEN
    ALTER TABLE community_members 
    ADD COLUMN engagement_score INTEGER DEFAULT 0;
    
    -- Create index for querying by engagement score
    CREATE INDEX idx_community_members_engagement ON community_members(engagement_score DESC);
    
    -- Add constraint to ensure score is non-negative
    ALTER TABLE community_members
    ADD CONSTRAINT engagement_score_non_negative CHECK (engagement_score >= 0);
  END IF;
END $$;

-- Add last_activity_at column for engagement tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_members' AND column_name = 'last_activity_at'
  ) THEN
    ALTER TABLE community_members 
    ADD COLUMN last_activity_at TIMESTAMPTZ DEFAULT now();
    
    CREATE INDEX idx_community_members_last_activity ON community_members(last_activity_at DESC);
  END IF;
END $$;

-- Function to calculate engagement score based on activity
CREATE OR REPLACE FUNCTION calculate_member_engagement_score(
  p_user_id UUID,
  p_community_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score INTEGER := 0;
  v_event_count INTEGER;
  v_profile_completion NUMERIC;
  v_days_since_join INTEGER;
  v_recent_activity_count INTEGER;
BEGIN
  -- Get days since joining
  SELECT EXTRACT(DAY FROM (now() - joined_at))::INTEGER
  INTO v_days_since_join
  FROM community_members
  WHERE user_id = p_user_id AND community_id = p_community_id;
  
  -- Base score for being a member (10 points)
  v_score := 10;
  
  -- Event attendance (10 points per event, up to 100 points)
  SELECT COUNT(*)
  INTO v_event_count
  FROM event_rsvps er
  JOIN events e ON e.id = er.event_id
  WHERE er.user_id = p_user_id
    AND e.community_id = p_community_id
    AND er.checked_in = true
    AND er.checked_in_at > now() - INTERVAL '90 days'; -- Last 90 days only
  
  v_score := v_score + LEAST(v_event_count * 10, 100);
  
  -- Profile completion (0-50 points)
  -- Check if user has portfolio in this community
  SELECT CASE
    WHEN COUNT(*) > 0 THEN 50
    ELSE 0
  END
  INTO v_profile_completion
  FROM portfolios p
  WHERE p.user_id = p_user_id
    AND p.community_id = p_community_id
    AND p.is_public = true;
  
  v_score := v_score + v_profile_completion::INTEGER;
  
  -- Recent activity bonus (activity in last 7 days = +20 points)
  SELECT COUNT(*)
  INTO v_recent_activity_count
  FROM activity_log al
  WHERE al.user_id = p_user_id
    AND al.created_at > now() - INTERVAL '7 days';
  
  IF v_recent_activity_count > 0 THEN
    v_score := v_score + 20;
  END IF;
  
  -- Tenure bonus (5 points per month, up to 40 points)
  v_score := v_score + LEAST((v_days_since_join / 30) * 5, 40);
  
  RETURN v_score;
END;
$$;

-- Function to update engagement scores for all members in a community
CREATE OR REPLACE FUNCTION update_community_engagement_scores(
  p_community_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated_count INTEGER := 0;
  v_member RECORD;
BEGIN
  FOR v_member IN 
    SELECT user_id FROM community_members WHERE community_id = p_community_id
  LOOP
    UPDATE community_members
    SET engagement_score = calculate_member_engagement_score(v_member.user_id, p_community_id)
    WHERE user_id = v_member.user_id AND community_id = p_community_id;
    
    v_updated_count := v_updated_count + 1;
  END LOOP;
  
  RETURN v_updated_count;
END;
$$;

-- Function to automatically update last_activity_at
CREATE OR REPLACE FUNCTION update_member_last_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update last_activity_at for the user
  UPDATE community_members
  SET last_activity_at = now()
  WHERE user_id = NEW.user_id
    AND community_id IN (
      SELECT community_id FROM portfolios WHERE user_id = NEW.user_id
      UNION
      SELECT community_id FROM events e 
      JOIN event_rsvps er ON er.event_id = e.id 
      WHERE er.user_id = NEW.user_id
    );
  
  RETURN NEW;
END;
$$;

-- Attach trigger to activity_log
DROP TRIGGER IF EXISTS trigger_update_member_last_activity ON activity_log;
CREATE TRIGGER trigger_update_member_last_activity
  AFTER INSERT ON activity_log
  FOR EACH ROW
  EXECUTE FUNCTION update_member_last_activity();

-- Initialize engagement scores for existing members
UPDATE community_members
SET engagement_score = 0
WHERE engagement_score IS NULL;

-- Add comments
COMMENT ON COLUMN community_members.engagement_score IS 'Calculated engagement score (0-200+): Base(10) + Events(0-100) + Profile(0-50) + Recent Activity(0-20) + Tenure(0-40)';
COMMENT ON COLUMN community_members.last_activity_at IS 'Timestamp of last recorded activity in the community';
COMMENT ON FUNCTION calculate_member_engagement_score IS 'Calculates engagement score for a member based on events, profile, activity, and tenure';
COMMENT ON FUNCTION update_community_engagement_scores IS 'Batch updates engagement scores for all members in a community. Returns count of updated members.';
