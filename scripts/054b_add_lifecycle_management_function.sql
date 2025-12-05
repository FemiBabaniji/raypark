-- =====================================================
-- Script 054b: Add Lifecycle Stage Management Function
-- =====================================================
-- Purpose: Add missing update_lifecycle_stage function
-- that is referenced in lib/permissions.ts but was not
-- created in script 054.
--
-- This function provides a safe, auditable way to update
-- member lifecycle stages while automatically logging
-- changes to the history table.
-- =====================================================

-- Function to update lifecycle stage with automatic history logging
CREATE OR REPLACE FUNCTION update_lifecycle_stage(
  p_user_id UUID,
  p_community_id UUID,
  p_new_stage lifecycle_stage,
  p_changed_by UUID DEFAULT NULL,
  p_reason TEXT DEFAULT NULL,
  p_automated BOOLEAN DEFAULT FALSE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old_stage lifecycle_stage;
  v_member_exists BOOLEAN;
BEGIN
  -- Check if member exists
  SELECT lifecycle_stage INTO v_old_stage
  FROM community_members
  WHERE user_id = p_user_id AND community_id = p_community_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member not found in community';
  END IF;

  -- Don't update if stage hasn't changed
  IF v_old_stage = p_new_stage THEN
    RETURN TRUE;
  END IF;

  -- Update the lifecycle stage
  UPDATE community_members
  SET 
    lifecycle_stage = p_new_stage,
    stage_updated_at = now(),
    at_risk = CASE 
      -- Clear at_risk flag when moving to active
      WHEN p_new_stage = 'active' THEN false
      -- Keep existing at_risk value for other transitions
      ELSE at_risk
    END
  WHERE user_id = p_user_id AND community_id = p_community_id;

  -- Log the change to history
  INSERT INTO user_lifecycle_history (
    user_id,
    community_id,
    from_stage,
    to_stage,
    changed_by,
    change_reason,
    automated,
    changed_at
  ) VALUES (
    p_user_id,
    p_community_id,
    v_old_stage,
    p_new_stage,
    COALESCE(p_changed_by, auth.uid()),
    p_reason,
    p_automated,
    now()
  );

  -- Log to activity log for cross-platform tracking
  INSERT INTO activity_log (
    user_id,
    community_id,
    event_type,
    event_data,
    timestamp
  ) VALUES (
    p_user_id,
    p_community_id,
    'lifecycle.stage_changed',
    jsonb_build_object(
      'from_stage', v_old_stage,
      'to_stage', p_new_stage,
      'changed_by', COALESCE(p_changed_by, auth.uid()),
      'reason', p_reason,
      'automated', p_automated
    ),
    now()
  );

  RETURN TRUE;

EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't expose details to client
    RAISE WARNING 'Error updating lifecycle stage: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_lifecycle_stage TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION update_lifecycle_stage IS 
  'Updates a member lifecycle stage with automatic history logging. ' ||
  'Returns TRUE on success, FALSE on failure. Automatically logs to ' ||
  'user_lifecycle_history and activity_log tables.';

-- Function to mark member as at-risk
CREATE OR REPLACE FUNCTION mark_member_at_risk(
  p_user_id UUID,
  p_community_id UUID,
  p_at_risk BOOLEAN,
  p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update at_risk flag
  UPDATE community_members
  SET at_risk = p_at_risk
  WHERE user_id = p_user_id AND community_id = p_community_id;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Log to activity log
  INSERT INTO activity_log (
    user_id,
    community_id,
    event_type,
    event_data,
    timestamp
  ) VALUES (
    p_user_id,
    p_community_id,
    'lifecycle.at_risk_changed',
    jsonb_build_object(
      'at_risk', p_at_risk,
      'reason', p_reason,
      'changed_by', auth.uid()
    ),
    now()
  );

  RETURN TRUE;

EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error marking member at risk: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION mark_member_at_risk TO authenticated;

COMMENT ON FUNCTION mark_member_at_risk IS 
  'Marks a member as at-risk (declining engagement). Used by automation ' ||
  'systems to flag members who need re-engagement campaigns.';
