-- =====================================================
-- Script 054: Add Lifecycle Stage Tracking
-- Description: Track member lifecycle stages (New, Active, Dormant, Alumni)
-- Dependencies: community_members table must exist
-- =====================================================

-- Create lifecycle_stage enum
DO $$ BEGIN
  CREATE TYPE lifecycle_stage AS ENUM ('new', 'active', 'dormant', 'alumni');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add lifecycle_stage column to community_members if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_members' AND column_name = 'lifecycle_stage'
  ) THEN
    ALTER TABLE community_members 
    ADD COLUMN lifecycle_stage lifecycle_stage DEFAULT 'new';
    
    ALTER TABLE community_members
    ADD COLUMN stage_updated_at TIMESTAMPTZ DEFAULT now();
    
    ALTER TABLE community_members
    ADD COLUMN at_risk BOOLEAN DEFAULT false;
    
    -- Create index for querying by lifecycle stage
    CREATE INDEX idx_community_members_lifecycle ON community_members(lifecycle_stage);
    CREATE INDEX idx_community_members_at_risk ON community_members(at_risk) WHERE at_risk = true;
  END IF;
END $$;

-- Create user_lifecycle_history table for audit trail
CREATE TABLE IF NOT EXISTS user_lifecycle_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  from_stage lifecycle_stage,
  to_stage lifecycle_stage NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT now(),
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  change_reason TEXT,
  automated BOOLEAN DEFAULT false,
  
  CONSTRAINT valid_stage_transition CHECK (from_stage IS NULL OR from_stage != to_stage)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lifecycle_history_user ON user_lifecycle_history(user_id);
CREATE INDEX IF NOT EXISTS idx_lifecycle_history_community ON user_lifecycle_history(community_id);
CREATE INDEX IF NOT EXISTS idx_lifecycle_history_changed_at ON user_lifecycle_history(changed_at DESC);

-- Enable RLS
ALTER TABLE user_lifecycle_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own history
CREATE POLICY "users_view_own_lifecycle_history" ON user_lifecycle_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Community admins can view all history in their community
CREATE POLICY "admins_view_community_lifecycle_history" ON user_lifecycle_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_community_roles ucr
      WHERE ucr.user_id = auth.uid()
        AND ucr.community_id = user_lifecycle_history.community_id
        AND ucr.role = 'community_admin'
        AND (ucr.expires_at IS NULL OR ucr.expires_at > now())
    )
  );

-- Function: Update lifecycle stage with history tracking
CREATE OR REPLACE FUNCTION update_lifecycle_stage(
  p_user_id UUID,
  p_community_id UUID,
  p_new_stage lifecycle_stage,
  p_changed_by UUID DEFAULT NULL,
  p_reason TEXT DEFAULT NULL,
  p_automated BOOLEAN DEFAULT false
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_stage lifecycle_stage;
BEGIN
  -- Get current stage
  SELECT lifecycle_stage INTO v_current_stage
  FROM community_members
  WHERE user_id = p_user_id AND community_id = p_community_id;
  
  -- Only proceed if stage is actually changing
  IF v_current_stage IS NULL OR v_current_stage = p_new_stage THEN
    RETURN FALSE;
  END IF;
  
  -- Update the stage
  UPDATE community_members
  SET 
    lifecycle_stage = p_new_stage,
    stage_updated_at = now()
  WHERE user_id = p_user_id AND community_id = p_community_id;
  
  -- Record in history
  INSERT INTO user_lifecycle_history (
    user_id,
    community_id,
    from_stage,
    to_stage,
    changed_by,
    change_reason,
    automated
  ) VALUES (
    p_user_id,
    p_community_id,
    v_current_stage,
    p_new_stage,
    p_changed_by,
    p_reason,
    p_automated
  );
  
  RETURN TRUE;
END;
$$;

-- Set default lifecycle stage for existing members
UPDATE community_members
SET 
  lifecycle_stage = 'new',
  stage_updated_at = joined_at
WHERE lifecycle_stage IS NULL;

-- Add comments
COMMENT ON COLUMN community_members.lifecycle_stage IS 'Current lifecycle stage: new (0-30 days), active (meeting activity thresholds), dormant (60+ days inactive), alumni (graduated/completed program)';
COMMENT ON COLUMN community_members.at_risk IS 'Flag indicating member is at risk of becoming dormant (declining activity trends)';
COMMENT ON TABLE user_lifecycle_history IS 'Audit trail of all lifecycle stage transitions for analytics and reporting';
COMMENT ON FUNCTION update_lifecycle_stage IS 'Updates member lifecycle stage and records change in history table. Returns true if stage changed.';
