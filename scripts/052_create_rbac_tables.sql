-- =====================================================
-- Script 052: Create RBAC (Role-Based Access Control) Tables
-- Description: Multi-tier admin role system
-- Dependencies: cohorts table (script 050)
-- =====================================================

-- Create enum types for roles
DO $$ BEGIN
  CREATE TYPE community_role AS ENUM ('community_admin', 'moderator', 'content_manager');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE cohort_role AS ENUM ('cohort_admin', 'moderator', 'event_coordinator');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_community_roles table
CREATE TABLE IF NOT EXISTS user_community_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  role community_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  notes TEXT,
  
  -- Prevent duplicate role assignments
  CONSTRAINT unique_community_role UNIQUE(user_id, community_id, role)
);

-- Create user_cohort_roles table
CREATE TABLE IF NOT EXISTS user_cohort_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  role cohort_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  notes TEXT,
  
  -- Prevent duplicate role assignments
  CONSTRAINT unique_cohort_role UNIQUE(user_id, cohort_id, role)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_community_roles_user ON user_community_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_community_roles_community ON user_community_roles(community_id);
CREATE INDEX IF NOT EXISTS idx_user_community_roles_expires ON user_community_roles(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_cohort_roles_user ON user_cohort_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cohort_roles_cohort ON user_cohort_roles(cohort_id);
CREATE INDEX IF NOT EXISTS idx_user_cohort_roles_expires ON user_cohort_roles(expires_at) WHERE expires_at IS NOT NULL;

-- Enable RLS
ALTER TABLE user_community_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cohort_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "users_view_own_community_roles" ON user_community_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_view_own_cohort_roles" ON user_cohort_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Community members can view who has roles in their community
CREATE POLICY "members_view_community_roles" ON user_community_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.community_id = user_community_roles.community_id
        AND cm.user_id = auth.uid()
    )
  );

-- Policy: Cohort members can view who has roles in their cohort
CREATE POLICY "members_view_cohort_roles" ON user_cohort_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cohort_members cm
      WHERE cm.cohort_id = user_cohort_roles.cohort_id
        AND cm.user_id = auth.uid()
    )
  );

-- Migrate existing community_members.role data
-- This migration assumes 'admin' role in community_members should become 'community_admin'
DO $$
BEGIN
  -- Only run migration if community_members table exists and has role column
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_members' AND column_name = 'role'
  ) THEN
    -- Migrate admins
    INSERT INTO user_community_roles (user_id, community_id, role, assigned_at, notes)
    SELECT 
      user_id,
      community_id,
      'community_admin'::community_role,
      joined_at,
      'Migrated from community_members.role'
    FROM community_members
    WHERE role = 'admin'
    ON CONFLICT (user_id, community_id, role) DO NOTHING;
    
    RAISE NOTICE 'Migrated % community admin roles', (SELECT COUNT(*) FROM community_members WHERE role = 'admin');
  END IF;
END $$;

-- Add comments
COMMENT ON TABLE user_community_roles IS 'Community-level admin roles. Community admins can manage the entire community including all cohorts.';
COMMENT ON TABLE user_cohort_roles IS 'Cohort-level admin roles. Cohort admins can only manage their specific cohort(s).';
COMMENT ON COLUMN user_community_roles.expires_at IS 'Optional expiration date for temporary admin assignments';
COMMENT ON COLUMN user_cohort_roles.expires_at IS 'Optional expiration date for temporary admin assignments';
