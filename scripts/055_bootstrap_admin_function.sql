-- =====================================================
-- Script 055: Bootstrap Admin Creation Function
-- Description: Automatic admin assignment when user creates or joins community
-- Dependencies: RBAC tables (script 052)
-- =====================================================

-- Update join_community function to auto-assign first member as admin
CREATE OR REPLACE FUNCTION public.join_community(
  p_community_code TEXT,
  p_user_id UUID,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_community_id UUID;
  v_member_id UUID;
  v_member_count INTEGER;
  v_is_first_member BOOLEAN;
BEGIN
  -- Get community ID
  SELECT id INTO v_community_id
  FROM public.communities
  WHERE code = p_community_code;

  IF v_community_id IS NULL THEN
    RAISE EXCEPTION 'Community with code % not found', p_community_code;
  END IF;

  -- Check if this is the first member
  SELECT COUNT(*) INTO v_member_count
  FROM public.community_members
  WHERE community_id = v_community_id;

  v_is_first_member := (v_member_count = 0);

  -- Insert or update membership
  INSERT INTO public.community_members (community_id, user_id, metadata, lifecycle_stage)
  VALUES (v_community_id, p_user_id, p_metadata, 'new')
  ON CONFLICT (community_id, user_id)
  DO UPDATE SET 
    metadata = EXCLUDED.metadata,
    joined_at = NOW()
  RETURNING id INTO v_member_id;

  -- Auto-assign first member as community admin
  IF v_is_first_member THEN
    INSERT INTO public.user_community_roles (
      user_id,
      community_id,
      role,
      assigned_at,
      notes
    )
    VALUES (
      p_user_id,
      v_community_id,
      'community_admin',
      NOW(),
      'Bootstrap: First member auto-promoted to community admin'
    )
    ON CONFLICT (user_id, community_id, role) DO NOTHING;

    RAISE NOTICE 'User % auto-assigned as community admin for %', p_user_id, p_community_code;
  END IF;

  RETURN v_member_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.join_community IS 'Join community with auto-admin assignment for first member';
