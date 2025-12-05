-- =====================================================
-- Script 050: Create Cohorts Table
-- Description: Core cohorts table for grouping members
-- Dependencies: communities table must exist
-- =====================================================

-- Create cohorts table
CREATE TABLE IF NOT EXISTS cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  settings JSONB DEFAULT '{}'::jsonb,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Constraints
  CONSTRAINT cohort_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cohorts_community_id ON cohorts(community_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_created_by ON cohorts(created_by);
CREATE INDEX IF NOT EXISTS idx_cohorts_dates ON cohorts(start_date, end_date) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cohorts_archived ON cohorts(archived_at) WHERE archived_at IS NOT NULL;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_cohorts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_cohorts_updated_at ON cohorts;
CREATE TRIGGER set_cohorts_updated_at
  BEFORE UPDATE ON cohorts
  FOR EACH ROW
  EXECUTE FUNCTION update_cohorts_updated_at();

-- Enable RLS
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (will be enhanced in script 060)
-- Policy: Users can view cohorts in communities they belong to
CREATE POLICY "users_view_community_cohorts" ON cohorts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.community_id = cohorts.community_id
        AND cm.user_id = auth.uid()
    )
  );

-- Policy: Only authenticated users can view (temp - will be refined)
CREATE POLICY "authenticated_view_cohorts" ON cohorts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Add comment for documentation
COMMENT ON TABLE cohorts IS 'Cohorts are sub-groups within communities for organizing members by program, class, or time period';
COMMENT ON COLUMN cohorts.settings IS 'JSONB field for flexible cohort-specific configuration (e.g., {"auto_add_new_members": false, "requires_approval": true})';
COMMENT ON COLUMN cohorts.archived_at IS 'Soft delete timestamp - archived cohorts are hidden from most queries but preserved for historical data';
