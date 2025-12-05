-- =====================================================
-- Script 060: Enhanced RLS Policies with RBAC Integration
-- =====================================================
-- Purpose: Implement comprehensive Row-Level Security policies
-- that integrate with the new RBAC system (user_community_roles,
-- user_cohort_roles) and fix migration issues from old role field.
--
-- Dependencies: 
--   - Scripts 050-054 (cohorts, RBAC tables, permission functions)
--
-- Security Model:
--   - Community Admins: Full access to all community data
--   - Moderators: Read-only access to community data
--   - Cohort Admins: Full access to cohort-scoped data
--   - Members: Access to own data + cohort-mate data (if enabled)
--   - Public: Access to public portfolios only
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: DROP CONFLICTING OLD POLICIES
-- =====================================================
-- These policies reference the old community_members.role field
-- which has been migrated to user_community_roles table

DO $$ 
BEGIN
  -- Drop old template policies that reference deprecated role field
  DROP POLICY IF EXISTS "templates_community_read" ON portfolio_templates;
  DROP POLICY IF EXISTS "templates_community_write" ON portfolio_templates;
  DROP POLICY IF EXISTS "Anyone can view active global templates" ON portfolio_templates;
  DROP POLICY IF EXISTS "Admins and moderators can manage community templates" ON portfolio_templates;
  
  -- Drop basic cohort policies to replace with RBAC-aware ones
  DROP POLICY IF EXISTS "cohorts_view_own" ON cohorts;
  DROP POLICY IF EXISTS "cohorts_manage_admins" ON cohorts;
  DROP POLICY IF EXISTS "cohort_members_view_own" ON cohort_members;
  DROP POLICY IF EXISTS "cohort_members_manage_admins" ON cohort_members;
  
  -- Drop basic role table policies to add granular control
  DROP POLICY IF EXISTS "roles_view_own_community" ON user_community_roles;
  DROP POLICY IF EXISTS "roles_view_all_community_admins" ON user_community_roles;
  DROP POLICY IF EXISTS "roles_view_own_cohort" ON user_cohort_roles;
  DROP POLICY IF EXISTS "roles_view_all_cohort_admins" ON user_cohort_roles;
END $$;

-- ============================================================================
-- PORTFOLIOS: Community Admin + Moderator + Cohort Member Access
-- ============================================================================

DROP POLICY IF EXISTS "portfolios_community_admin_select" ON portfolios;
CREATE POLICY "portfolios_community_admin_select" ON portfolios FOR SELECT USING (
  auth.uid() = portfolios.user_id 
  OR portfolios.is_public = true 
  OR portfolios.is_demo = true 
  OR (portfolios.community_id IS NOT NULL AND is_community_admin(auth.uid(), portfolios.community_id))
);

DROP POLICY IF EXISTS "portfolios_moderator_select" ON portfolios;
CREATE POLICY "portfolios_moderator_select" ON portfolios FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_community_roles ucr
    WHERE ucr.user_id = auth.uid() 
      AND ucr.community_id = portfolios.community_id 
      AND ucr.role = 'moderator' 
      AND (ucr.expires_at IS NULL OR ucr.expires_at > NOW())
  )
);

DROP POLICY IF EXISTS "portfolios_cohort_member_select" ON portfolios;
CREATE POLICY "portfolios_cohort_member_select" ON portfolios FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cohort_members cm1
    JOIN cohort_members cm2 ON cm1.cohort_id = cm2.cohort_id
    WHERE cm1.user_id = auth.uid() 
      AND cm2.user_id = portfolios.user_id 
      AND cm1.cohort_id IN (
        SELECT c.id FROM cohorts c WHERE c.community_id = portfolios.community_id
      )
  )
);

DROP POLICY IF EXISTS "portfolios_community_admin_update" ON portfolios;
CREATE POLICY "portfolios_community_admin_update" ON portfolios FOR UPDATE USING (
  auth.uid() = portfolios.user_id 
  OR (portfolios.community_id IS NOT NULL AND is_community_admin(auth.uid(), portfolios.community_id))
) WITH CHECK (
  auth.uid() = portfolios.user_id 
  OR (portfolios.community_id IS NOT NULL AND is_community_admin(auth.uid(), portfolios.community_id))
);

-- ============================================================================
-- COMMUNITY MEMBERS: Admin Control + Lifecycle Protection
-- ============================================================================

DROP POLICY IF EXISTS "community_members_admin_select" ON community_members;
CREATE POLICY "community_members_admin_select" ON community_members FOR SELECT USING (
  auth.uid() = community_members.user_id 
  OR is_community_admin(auth.uid(), community_members.community_id)
);

DROP POLICY IF EXISTS "community_members_admin_insert" ON community_members;
CREATE POLICY "community_members_admin_insert" ON community_members FOR INSERT WITH CHECK (
  is_community_admin(auth.uid(), community_members.community_id)
);

DROP POLICY IF EXISTS "community_members_admin_update" ON community_members;
CREATE POLICY "community_members_admin_update" ON community_members FOR UPDATE USING (
  auth.uid() = community_members.user_id 
  OR is_community_admin(auth.uid(), community_members.community_id)
) WITH CHECK (
  auth.uid() = community_members.user_id 
  OR is_community_admin(auth.uid(), community_members.community_id)
);

DROP POLICY IF EXISTS "community_members_admin_delete" ON community_members;
CREATE POLICY "community_members_admin_delete" ON community_members FOR DELETE USING (
  is_community_admin(auth.uid(), community_members.community_id)
);

-- Lifecycle Stage Protection: Only admins can change lifecycle_stage
CREATE OR REPLACE FUNCTION enforce_lifecycle_stage_admin_only()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lifecycle_stage IS DISTINCT FROM OLD.lifecycle_stage THEN
    IF NOT is_community_admin(auth.uid(), NEW.community_id) THEN
      RAISE EXCEPTION 'Only community admins can change lifecycle_stage';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_lifecycle_stage_admin_only ON community_members;
CREATE TRIGGER trg_enforce_lifecycle_stage_admin_only 
  BEFORE UPDATE ON community_members 
  FOR EACH ROW 
  EXECUTE FUNCTION enforce_lifecycle_stage_admin_only();

-- ============================================================================
-- TEMPLATES: Global + Community Scoping
-- ============================================================================

DROP POLICY IF EXISTS "templates_global_select" ON portfolio_templates;
CREATE POLICY "templates_global_select" ON portfolio_templates FOR SELECT USING (
  portfolio_templates.community_id IS NULL 
  AND portfolio_templates.is_active = true
);

DROP POLICY IF EXISTS "templates_community_member_select" ON portfolio_templates;
CREATE POLICY "templates_community_member_select" ON portfolio_templates FOR SELECT USING (
  portfolio_templates.community_id IS NOT NULL 
  AND portfolio_templates.is_active = true 
  AND EXISTS (
    SELECT 1 FROM community_members cm 
    WHERE cm.community_id = portfolio_templates.community_id 
      AND cm.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "templates_community_admin_manage" ON portfolio_templates;
CREATE POLICY "templates_community_admin_manage" ON portfolio_templates FOR ALL USING (
  portfolio_templates.community_id IS NOT NULL 
  AND is_community_admin(auth.uid(), portfolio_templates.community_id)
) WITH CHECK (
  portfolio_templates.community_id IS NOT NULL 
  AND is_community_admin(auth.uid(), portfolio_templates.community_id)
);

-- ============================================================================
-- COHORTS: Community Admin + Cohort Admin Management
-- ============================================================================

DROP POLICY IF EXISTS "cohorts_member_select" ON cohorts;
CREATE POLICY "cohorts_member_select" ON cohorts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM community_members cm 
    WHERE cm.community_id = cohorts.community_id 
      AND cm.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "cohorts_community_admin_manage" ON cohorts;
CREATE POLICY "cohorts_community_admin_manage" ON cohorts FOR ALL USING (
  is_community_admin(auth.uid(), cohorts.community_id)
) WITH CHECK (
  is_community_admin(auth.uid(), cohorts.community_id)
);

DROP POLICY IF EXISTS "cohorts_cohort_admin_update" ON cohorts;
CREATE POLICY "cohorts_cohort_admin_update" ON cohorts FOR UPDATE USING (
  is_cohort_admin(auth.uid(), cohorts.id)
) WITH CHECK (
  is_cohort_admin(auth.uid(), cohorts.id)
);

-- ============================================================================
-- COHORT MEMBERS: Admin Management + Self-Remove
-- ============================================================================

DROP POLICY IF EXISTS "cohort_members_view" ON cohort_members;
CREATE POLICY "cohort_members_view" ON cohort_members FOR SELECT USING (
  cohort_members.user_id = auth.uid() 
  OR is_cohort_admin(auth.uid(), cohort_members.cohort_id) 
  OR EXISTS (
    SELECT 1 FROM cohorts c 
    WHERE c.id = cohort_members.cohort_id 
      AND is_community_admin(auth.uid(), c.community_id)
  )
);

DROP POLICY IF EXISTS "cohort_members_admin_insert" ON cohort_members;
CREATE POLICY "cohort_members_admin_insert" ON cohort_members FOR INSERT WITH CHECK (
  is_cohort_admin(auth.uid(), cohort_members.cohort_id) 
  OR EXISTS (
    SELECT 1 FROM cohorts c 
    WHERE c.id = cohort_members.cohort_id 
      AND is_community_admin(auth.uid(), c.community_id)
  )
);

DROP POLICY IF EXISTS "cohort_members_admin_delete" ON cohort_members;
CREATE POLICY "cohort_members_admin_delete" ON cohort_members FOR DELETE USING (
  is_cohort_admin(auth.uid(), cohort_members.cohort_id) 
  OR EXISTS (
    SELECT 1 FROM cohorts c 
    WHERE c.id = cohort_members.cohort_id 
      AND is_community_admin(auth.uid(), c.community_id)
  )
);

DROP POLICY IF EXISTS "cohort_members_self_remove" ON cohort_members;
CREATE POLICY "cohort_members_self_remove" ON cohort_members FOR DELETE USING (
  cohort_members.user_id = auth.uid()
);

-- ============================================================================
-- USER COMMUNITY ROLES: Role Assignment Protection
-- ============================================================================

DROP POLICY IF EXISTS "community_roles_view_own" ON user_community_roles;
CREATE POLICY "community_roles_view_own" ON user_community_roles FOR SELECT USING (
  user_community_roles.user_id = auth.uid()
);

DROP POLICY IF EXISTS "community_roles_admin_view" ON user_community_roles;
CREATE POLICY "community_roles_admin_view" ON user_community_roles FOR SELECT USING (
  is_community_admin(auth.uid(), user_community_roles.community_id)
);

DROP POLICY IF EXISTS "community_roles_admin_assign" ON user_community_roles;
CREATE POLICY "community_roles_admin_assign" ON user_community_roles FOR INSERT WITH CHECK (
  is_community_admin(auth.uid(), user_community_roles.community_id) 
  AND user_community_roles.assigned_by = auth.uid()
);

DROP POLICY IF EXISTS "community_roles_admin_update" ON user_community_roles;
CREATE POLICY "community_roles_admin_update" ON user_community_roles FOR UPDATE USING (
  is_community_admin(auth.uid(), user_community_roles.community_id)
) WITH CHECK (
  is_community_admin(auth.uid(), user_community_roles.community_id)
);

DROP POLICY IF EXISTS "community_roles_admin_revoke" ON user_community_roles;
CREATE POLICY "community_roles_admin_revoke" ON user_community_roles FOR DELETE USING (
  is_community_admin(auth.uid(), user_community_roles.community_id)
);

DROP POLICY IF EXISTS "community_roles_view_expired_own" ON user_community_roles;
CREATE POLICY "community_roles_view_expired_own" ON user_community_roles FOR SELECT USING (
  user_community_roles.user_id = auth.uid() 
  AND user_community_roles.expires_at < NOW()
);

-- ============================================================================
-- USER COHORT ROLES: Cohort Admin Assignment (Cannot Escalate to Community Admin)
-- ============================================================================

DROP POLICY IF EXISTS "cohort_roles_view_own" ON user_cohort_roles;
CREATE POLICY "cohort_roles_view_own" ON user_cohort_roles FOR SELECT USING (
  user_cohort_roles.user_id = auth.uid()
);

DROP POLICY IF EXISTS "cohort_roles_admin_view" ON user_cohort_roles;
CREATE POLICY "cohort_roles_admin_view" ON user_cohort_roles FOR SELECT USING (
  is_cohort_admin(auth.uid(), user_cohort_roles.cohort_id) 
  OR EXISTS (
    SELECT 1 FROM cohorts c 
    WHERE c.id = user_cohort_roles.cohort_id 
      AND is_community_admin(auth.uid(), c.community_id)
  )
);

DROP POLICY IF EXISTS "cohort_roles_admin_update" ON user_cohort_roles;
CREATE POLICY "cohort_roles_admin_update" ON user_cohort_roles FOR UPDATE USING (
  is_cohort_admin(auth.uid(), user_cohort_roles.cohort_id) 
  OR EXISTS (
    SELECT 1 FROM cohorts c 
    WHERE c.id = user_cohort_roles.cohort_id 
      AND is_community_admin(auth.uid(), c.community_id)
  )
) WITH CHECK (
  is_cohort_admin(auth.uid(), user_cohort_roles.cohort_id) 
  OR EXISTS (
    SELECT 1 FROM cohorts c 
    WHERE c.id = user_cohort_roles.cohort_id 
      AND is_community_admin(auth.uid(), c.community_id)
  )
);

DROP POLICY IF EXISTS "cohort_roles_admin_revoke" ON user_cohort_roles;
CREATE POLICY "cohort_roles_admin_revoke" ON user_cohort_roles FOR DELETE USING (
  is_cohort_admin(auth.uid(), user_cohort_roles.cohort_id) 
  OR EXISTS (
    SELECT 1 FROM cohorts c 
    WHERE c.id = user_cohort_roles.cohort_id 
      AND is_community_admin(auth.uid(), c.community_id)
  )
);

-- ============================================================================
-- LIFECYCLE HISTORY: Audit Trail Access
-- ============================================================================

DROP POLICY IF EXISTS "lifecycle_history_view_own" ON user_lifecycle_history;
CREATE POLICY "lifecycle_history_view_own" ON user_lifecycle_history FOR SELECT USING (
  user_lifecycle_history.user_id = auth.uid()
);

DROP POLICY IF EXISTS "lifecycle_history_admin_view" ON user_lifecycle_history;
CREATE POLICY "lifecycle_history_admin_view" ON user_lifecycle_history FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM community_members cm 
    WHERE cm.user_id = user_lifecycle_history.user_id 
      AND is_community_admin(auth.uid(), cm.community_id)
  )
);

DROP POLICY IF EXISTS "lifecycle_history_system_insert" ON user_lifecycle_history;
CREATE POLICY "lifecycle_history_system_insert" ON user_lifecycle_history FOR INSERT WITH CHECK (
  (
    (user_lifecycle_history.changed_by IS NOT NULL 
     AND user_lifecycle_history.changed_by = auth.uid() 
     AND EXISTS (
       SELECT 1 FROM community_members cm 
       WHERE cm.user_id = user_lifecycle_history.user_id 
         AND is_community_admin(auth.uid(), cm.community_id)
     )
    ) 
    OR user_lifecycle_history.changed_by IS NULL
  )
);

-- ============================================================================
-- ACTIVITY LOG: Admin Access to Community Activity
-- ============================================================================

DROP POLICY IF EXISTS "activity_log_view_own" ON activity_log;
CREATE POLICY "activity_log_view_own" ON activity_log FOR SELECT USING (
  activity_log.user_id = auth.uid()
);

DROP POLICY IF EXISTS "activity_log_admin_view" ON activity_log;
CREATE POLICY "activity_log_admin_view" ON activity_log FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM community_members cm 
    WHERE cm.user_id = auth.uid() 
      AND is_community_admin(auth.uid(), cm.community_id)
  )
);

-- ============================================================================
-- AUDIT LOGGING TRIGGERS
-- ============================================================================

-- Log role assignments and revocations
CREATE OR REPLACE FUNCTION log_role_assignment()
RETURNS TRIGGER AS $$
DECLARE 
  ctx jsonb;
BEGIN
  IF TG_OP = 'INSERT' THEN
    ctx := jsonb_build_object(
      'target_user', NEW.user_id,
      'role', NEW.role,
      'scope', TG_TABLE_NAME,
      'scope_id', COALESCE(NEW.community_id::text, NEW.cohort_id::text),
      'community_id', CASE 
        WHEN TG_TABLE_NAME = 'user_community_roles' THEN NEW.community_id 
        ELSE (SELECT c.community_id FROM cohorts c WHERE c.id = NEW.cohort_id) 
      END
    );
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
      NEW.assigned_by, 
      TG_TABLE_NAME, 
      COALESCE(NEW.community_id, NEW.cohort_id), 
      'admin.role_assigned', 
      ctx
    );
  ELSIF TG_OP = 'DELETE' THEN
    ctx := jsonb_build_object(
      'target_user', OLD.user_id,
      'role', OLD.role,
      'scope', TG_TABLE_NAME,
      'scope_id', COALESCE(OLD.community_id::text, OLD.cohort_id::text),
      'community_id', CASE 
        WHEN TG_TABLE_NAME = 'user_community_roles' THEN OLD.community_id 
        ELSE (SELECT c.community_id FROM cohorts c WHERE c.id = OLD.cohort_id) 
      END
    );
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
      auth.uid(), 
      TG_TABLE_NAME, 
      COALESCE(OLD.community_id, OLD.cohort_id), 
      'admin.role_revoked', 
      ctx
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS log_community_role_changes ON user_community_roles;
CREATE TRIGGER log_community_role_changes 
  AFTER INSERT OR DELETE ON user_community_roles 
  FOR EACH ROW 
  EXECUTE FUNCTION log_role_assignment();

DROP TRIGGER IF EXISTS log_cohort_role_changes ON user_cohort_roles;
CREATE TRIGGER log_cohort_role_changes 
  AFTER INSERT OR DELETE ON user_cohort_roles 
  FOR EACH ROW 
  EXECUTE FUNCTION log_role_assignment();

-- Log cohort creation and deletion
CREATE OR REPLACE FUNCTION log_cohort_changes()
RETURNS TRIGGER AS $$
DECLARE 
  ctx jsonb;
BEGIN
  IF TG_OP = 'INSERT' THEN
    ctx := jsonb_build_object(
      'cohort_id', NEW.id,
      'cohort_name', NEW.name,
      'start_date', NEW.start_date,
      'end_date', NEW.end_date,
      'community_id', NEW.community_id
    );
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
      NEW.created_by, 
      'cohorts', 
      NEW.id, 
      'admin.cohort_created', 
      ctx
    );
  ELSIF TG_OP = 'DELETE' THEN
    ctx := jsonb_build_object(
      'cohort_id', OLD.id,
      'cohort_name', OLD.name,
      'archived', OLD.archived_at IS NOT NULL,
      'community_id', OLD.community_id
    );
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
      auth.uid(), 
      'cohorts', 
      OLD.id, 
      'admin.cohort_deleted', 
      ctx
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS log_cohort_lifecycle ON cohorts;
CREATE TRIGGER log_cohort_lifecycle 
  AFTER INSERT OR DELETE ON cohorts 
  FOR EACH ROW 
  EXECUTE FUNCTION log_cohort_changes();

-- ============================================================================
-- VERIFICATION: Ensure RLS is enabled on all critical tables
-- ============================================================================

DO $$
DECLARE 
  tbl text;
  res boolean;
  tables_to_check TEXT[] := ARRAY[
    'portfolios',
    'community_members',
    'portfolio_templates',
    'cohorts',
    'cohort_members',
    'user_community_roles',
    'user_cohort_roles',
    'user_lifecycle_history',
    'activity_log'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables_to_check LOOP
    SELECT c.relrowsecurity INTO res 
    FROM pg_class c 
    JOIN pg_namespace n ON n.oid = c.relnamespace 
    WHERE n.nspname = 'public' AND c.relname = tbl;
    
    IF res IS DISTINCT FROM TRUE THEN
      RAISE WARNING 'RLS NOT ENABLED on table: %', tbl;
    ELSE
      RAISE NOTICE 'RLS enabled on table: %', tbl;
    END IF;
  END LOOP;
END $$;

COMMIT;

-- =====================================================
-- POST-DEPLOYMENT TESTING QUERIES
-- =====================================================

-- Test 1: Verify community admin can see all portfolios
-- Run as community admin user:
-- SELECT COUNT(*) FROM portfolios WHERE community_id = '<your_community_id>';
-- Expected: See all community portfolios

-- Test 2: Verify moderator has read-only access
-- Run as moderator user:
-- UPDATE portfolios SET name = 'Test' WHERE community_id = '<your_community_id>';
-- Expected: Should fail (no UPDATE policy for moderators on portfolios)

-- Test 3: Verify cohort member can see cohort-mate portfolios
-- Run as cohort member:
-- SELECT COUNT(*) FROM portfolios WHERE user_id IN (
--   SELECT user_id FROM cohort_members WHERE cohort_id = '<your_cohort_id>'
-- );
-- Expected: See cohort-mate portfolios

-- Test 4: Verify role assignment works
-- Run as community admin:
-- INSERT INTO user_community_roles (user_id, community_id, role, assigned_by)
-- VALUES ('<member_id>', '<community_id>', 'moderator', auth.uid());
-- Expected: Success + audit log entry created

-- Test 5: Verify unauthorized role escalation fails
-- Run as regular member:
-- INSERT INTO user_community_roles (user_id, community_id, role, assigned_by)
-- VALUES (auth.uid(), '<community_id>', 'community_admin', auth.uid());
-- Expected: Permission denied
