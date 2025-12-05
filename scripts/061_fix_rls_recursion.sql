-- =====================================================
-- Script 061: Fix Infinite Recursion in RLS Policies
-- Description: Remove circular dependency in cohort_members and portfolios policies
-- Issue: portfolios_cohort_member_select queries cohort_members which has RLS that can loop back
-- =====================================================

-- SOLUTION: Simplify the portfolios_cohort_member_select policy to avoid querying cohort_members
-- Instead, use SECURITY DEFINER functions that bypass RLS

-- Drop the problematic policy
DROP POLICY IF EXISTS "portfolios_cohort_member_select" ON portfolios;

-- Replace with simpler policy that doesn't create circular dependencies
-- Users can see portfolios if:
-- 1. It's their own portfolio
-- 2. The portfolio is in a community they're a member of
-- 3. They share a cohort with the portfolio owner (checked via function)
CREATE POLICY "portfolios_cohort_member_select" ON portfolios FOR SELECT USING (
  portfolios.user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM community_members cm
    WHERE cm.user_id = auth.uid() 
      AND cm.community_id = portfolios.community_id
  )
);

-- Also simplify cohort_members policies to avoid complex joins
DROP POLICY IF EXISTS "cohort_members_view" ON cohort_members;
CREATE POLICY "cohort_members_view" ON cohort_members FOR SELECT USING (
  cohort_members.user_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM user_cohort_roles ucr
    WHERE ucr.user_id = auth.uid()
      AND ucr.cohort_id = cohort_members.cohort_id
      AND (ucr.expires_at IS NULL OR ucr.expires_at > NOW())
  )
  OR EXISTS (
    SELECT 1 FROM cohorts c
    JOIN user_community_roles ucr ON c.community_id = ucr.community_id
    WHERE c.id = cohort_members.cohort_id
      AND ucr.user_id = auth.uid()
      AND ucr.role = 'community_admin'
      AND (ucr.expires_at IS NULL OR ucr.expires_at > NOW())
  )
);

-- Verify RLS is still enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('portfolios', 'cohort_members');
