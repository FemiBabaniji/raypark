-- Script 062: Add progressive admin access control
-- Adds per-community admin access restriction setting

-- Add admin_access_restricted column to communities table
ALTER TABLE communities 
ADD COLUMN IF NOT EXISTS admin_access_restricted BOOLEAN DEFAULT false;

-- Add comment explaining the feature
COMMENT ON COLUMN communities.admin_access_restricted IS 
'Controls admin access mode: false = everyone has admin access, true = only users with community_admin role';

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_communities_admin_restricted 
ON communities(admin_access_restricted) 
WHERE admin_access_restricted = true;
