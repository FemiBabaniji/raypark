-- =====================================================
-- Script 051: Create Cohort Membership Table
-- Description: Many-to-many relationship between users and cohorts
-- Dependencies: cohorts table (script 050)
-- =====================================================

-- Create cohort_members junction table
CREATE TABLE IF NOT EXISTS cohort_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  
  -- Prevent duplicate memberships
  CONSTRAINT unique_cohort_membership UNIQUE(cohort_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cohort_members_cohort_id ON cohort_members(cohort_id);
CREATE INDEX IF NOT EXISTS idx_cohort_members_user_id ON cohort_members(user_id);
CREATE INDEX IF NOT EXISTS idx_cohort_members_joined_at ON cohort_members(joined_at);

-- Enable RLS
ALTER TABLE cohort_members ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own cohort memberships
CREATE POLICY "users_view_own_memberships" ON cohort_members
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can view memberships of cohorts they belong to
CREATE POLICY "users_view_cohort_member_list" ON cohort_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cohort_members cm
      WHERE cm.cohort_id = cohort_members.cohort_id
        AND cm.user_id = auth.uid()
    )
  );

-- Add comments
COMMENT ON TABLE cohort_members IS 'Junction table tracking which users belong to which cohorts. Users can belong to multiple cohorts.';
COMMENT ON COLUMN cohort_members.added_by IS 'The admin or system user who added this member to the cohort';
COMMENT ON COLUMN cohort_members.notes IS 'Optional notes about this membership (e.g., "Scholarship recipient", "Part-time participant")';
