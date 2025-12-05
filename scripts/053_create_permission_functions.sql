-- =====================================================
-- Script 053: Create Permission Helper Functions
-- Description: SQL functions for checking user permissions
-- Dependencies: RBAC tables (script 052)
-- =====================================================

-- Function: Check if user is a community admin
CREATE OR REPLACE FUNCTION is_community_admin(
  p_user_id UUID,
  p_community_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_community_roles
    WHERE user_id = p_user_id
      AND community_id = p_community_id
      AND role = 'community_admin'
      AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;

-- Function: Check if user is a cohort admin
CREATE OR REPLACE FUNCTION is_cohort_admin(
  p_user_id UUID,
  p_cohort_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_community_id UUID;
BEGIN
  -- Get the community_id for this cohort
  SELECT community_id INTO v_community_id
  FROM cohorts
  WHERE id = p_cohort_id;
  
  -- User is cohort admin if they have:
  -- 1. Direct cohort_admin role on this cohort, OR
  -- 2. Community admin role on the parent community
  RETURN EXISTS (
    SELECT 1 
    FROM user_cohort_roles
    WHERE user_id = p_user_id
      AND cohort_id = p_cohort_id
      AND (expires_at IS NULL OR expires_at > now())
  ) OR is_community_admin(p_user_id, v_community_id);
END;
$$;

-- Function: Get all cohort IDs user is admin of
CREATE OR REPLACE FUNCTION get_user_admin_cohorts(
  p_user_id UUID
)
RETURNS TABLE(cohort_id UUID, admin_type TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  -- Direct cohort admin roles
  SELECT 
    ucr.cohort_id,
    'cohort_admin'::TEXT as admin_type
  FROM user_cohort_roles ucr
  WHERE ucr.user_id = p_user_id
    AND (ucr.expires_at IS NULL OR ucr.expires_at > now())
  
  UNION
  
  -- All cohorts in communities where user is community admin
  SELECT 
    c.id as cohort_id,
    'community_admin'::TEXT as admin_type
  FROM cohorts c
  INNER JOIN user_community_roles ucr 
    ON c.community_id = ucr.community_id
  WHERE ucr.user_id = p_user_id
    AND ucr.role = 'community_admin'
    AND (ucr.expires_at IS NULL OR ucr.expires_at > now());
END;
$$;

-- Function: Get all cohorts a user belongs to
CREATE OR REPLACE FUNCTION get_user_cohorts(
  p_user_id UUID
)
RETURNS TABLE(cohort_id UUID, joined_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cm.cohort_id,
    cm.joined_at
  FROM cohort_members cm
  INNER JOIN cohorts c ON cm.cohort_id = c.id
  WHERE cm.user_id = p_user_id
    AND c.archived_at IS NULL
  ORDER BY cm.joined_at DESC;
END;
$$;

-- Function: Check if user can manage a specific cohort
CREATE OR REPLACE FUNCTION can_manage_cohort(
  p_user_id UUID,
  p_cohort_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN is_cohort_admin(p_user_id, p_cohort_id);
END;
$$;

-- Function: Generic permission check (extensible for future permissions)
CREATE OR REPLACE FUNCTION has_permission(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_community_id UUID;
BEGIN
  -- Handle cohort resources
  IF p_resource_type = 'cohort' THEN
    RETURN can_manage_cohort(p_user_id, p_resource_id);
  END IF;
  
  -- Handle community resources
  IF p_resource_type = 'community' THEN
    RETURN is_community_admin(p_user_id, p_resource_id);
  END IF;
  
  -- Handle event resources (check if user can manage the cohort or community)
  IF p_resource_type = 'event' THEN
    -- Get community_id and cohort_id from events table
    SELECT e.community_id INTO v_community_id
    FROM events e
    WHERE e.id = p_resource_id;
    
    IF v_community_id IS NOT NULL THEN
      RETURN is_community_admin(p_user_id, v_community_id);
    END IF;
  END IF;
  
  -- Default: no permission
  RETURN FALSE;
END;
$$;

-- Add comments
COMMENT ON FUNCTION is_community_admin IS 'Returns true if user has community_admin role in the specified community and role has not expired';
COMMENT ON FUNCTION is_cohort_admin IS 'Returns true if user has cohort_admin role for the cohort OR community_admin role for parent community';
COMMENT ON FUNCTION get_user_admin_cohorts IS 'Returns all cohorts the user has admin access to, either directly or via community admin role';
COMMENT ON FUNCTION get_user_cohorts IS 'Returns all cohorts the user is a member of (not admin, just membership)';
COMMENT ON FUNCTION has_permission IS 'Generic permission checker - extensible for different resource types and actions';
