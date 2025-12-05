-- Fix the log_role_assignment function to handle missing cohort_id column
-- in user_community_roles table

CREATE OR REPLACE FUNCTION log_role_assignment()
RETURNS TRIGGER AS $$
DECLARE 
  ctx jsonb;
  scope_id_value text;
  entity_id_value uuid;
BEGIN
  -- Determine scope_id and entity_id based on table name
  IF TG_TABLE_NAME = 'user_community_roles' THEN
    scope_id_value := NEW.community_id::text;
    entity_id_value := NEW.community_id;
  ELSE  -- user_cohort_roles
    scope_id_value := NEW.cohort_id::text;
    entity_id_value := NEW.cohort_id;
  END IF;

  IF TG_OP = 'INSERT' THEN
    ctx := jsonb_build_object(
      'target_user', NEW.user_id,
      'role', NEW.role,
      'scope', TG_TABLE_NAME,
      'scope_id', scope_id_value,
      'community_id', CASE 
        WHEN TG_TABLE_NAME = 'user_community_roles' THEN NEW.community_id 
        ELSE (SELECT c.community_id FROM cohorts c WHERE c.id = NEW.cohort_id) 
      END
    );
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
      NEW.assigned_by, 
      TG_TABLE_NAME, 
      entity_id_value, 
      'admin.role_assigned', 
      ctx
    );
  ELSIF TG_OP = 'DELETE' THEN
    -- Handle DELETE operation with table-specific column access
    IF TG_TABLE_NAME = 'user_community_roles' THEN
      scope_id_value := OLD.community_id::text;
      entity_id_value := OLD.community_id;
    ELSE  -- user_cohort_roles
      scope_id_value := OLD.cohort_id::text;
      entity_id_value := OLD.cohort_id;
    END IF;

    ctx := jsonb_build_object(
      'target_user', OLD.user_id,
      'role', OLD.role,
      'scope', TG_TABLE_NAME,
      'scope_id', scope_id_value,
      'community_id', CASE 
        WHEN TG_TABLE_NAME = 'user_community_roles' THEN OLD.community_id 
        ELSE (SELECT c.community_id FROM cohorts c WHERE c.id = OLD.cohort_id) 
      END
    );
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
      auth.uid(), 
      TG_TABLE_NAME, 
      entity_id_value, 
      'admin.role_revoked', 
      ctx
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
