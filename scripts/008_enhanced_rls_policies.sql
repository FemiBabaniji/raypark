-- Enhanced RLS policies and security measures

-- Additional security policies for edge cases and enhanced protection

-- Widget types - allow authenticated users to read, restrict writes to admins
DROP POLICY IF EXISTS "authenticated can read widget types" ON widget_types;
CREATE POLICY "authenticated can read widget types"
ON widget_types FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "anon can read widget types" ON widget_types;
CREATE POLICY "anon can read widget types"
ON widget_types FOR SELECT
TO anon
USING (true);

-- Enhanced pages policies with better public access control
DROP POLICY IF EXISTS "public can read published pages via route" ON pages;
CREATE POLICY "public can read published pages via route"
ON pages FOR SELECT
TO anon
USING (
    route IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM page_versions pv
        JOIN portfolios p ON p.id = pages.portfolio_id
        WHERE pv.page_id = pages.id 
        AND pv.status = 'published'
        AND p.is_public = true
    )
);

-- Enhanced widget instances policies for public reading of published content
DROP POLICY IF EXISTS "public can read published widget instances" ON widget_instances;
CREATE POLICY "public can read published widget instances"
ON widget_instances FOR SELECT
TO anon
USING (
    enabled = true
    AND EXISTS (
        SELECT 1 FROM page_versions pv
        JOIN pages pg ON pg.id = pv.page_id
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pv.page_id = widget_instances.page_id
        AND pv.status = 'published'
        AND p.is_public = true
    )
);

-- Enhanced page layouts policies for public reading
DROP POLICY IF EXISTS "public can read published page layouts" ON page_layouts;
CREATE POLICY "public can read published page layouts"
ON page_layouts FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1 FROM page_versions pv
        JOIN pages pg ON pg.id = pv.page_id
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pv.page_id = page_layouts.page_id
        AND pv.status = 'published'
        AND p.is_public = true
    )
);

-- Enhanced media assets policies
DROP POLICY IF EXISTS "public can read published media assets" ON media_assets;
CREATE POLICY "public can read published media assets"
ON media_assets FOR SELECT
TO anon
USING (
    page_id IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM page_versions pv
        JOIN pages pg ON pg.id = pv.page_id
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pv.page_id = media_assets.page_id
        AND pv.status = 'published'
        AND p.is_public = true
    )
);

-- Themes policies - only owners can access
DROP POLICY IF EXISTS "public cannot read themes" ON themes;
CREATE POLICY "public cannot read themes"
ON themes FOR SELECT
TO anon
USING (false); -- Explicitly deny public access to themes

-- Activity log policies - strict owner-only access
DROP POLICY IF EXISTS "strict owner activity log access" ON activity_log;
CREATE POLICY "strict owner activity log access"
ON activity_log FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Page versions - enhanced policies for draft protection
DROP POLICY IF EXISTS "no public access to drafts" ON page_versions;
CREATE POLICY "no public access to drafts"
ON page_versions FOR SELECT
TO anon
USING (
    status = 'published'
    AND EXISTS (
        SELECT 1 FROM pages pg
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pg.id = page_versions.page_id
        AND p.is_public = true
    )
);

-- Security function to check if user owns portfolio
CREATE OR REPLACE FUNCTION user_owns_portfolio(portfolio_uuid uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM portfolios
        WHERE id = portfolio_uuid
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Security function to check if page is published and public
CREATE OR REPLACE FUNCTION page_is_published_and_public(page_uuid uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM page_versions pv
        JOIN pages pg ON pg.id = pv.page_id
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pv.page_id = page_uuid
        AND pv.status = 'published'
        AND p.is_public = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Additional security constraints
ALTER TABLE portfolios ADD CONSTRAINT portfolios_user_id_not_null CHECK (user_id IS NOT NULL);
ALTER TABLE themes ADD CONSTRAINT themes_user_id_not_null CHECK (user_id IS NOT NULL);
ALTER TABLE media_assets ADD CONSTRAINT media_assets_user_id_not_null CHECK (user_id IS NOT NULL);
ALTER TABLE activity_log ADD CONSTRAINT activity_log_user_id_not_null CHECK (user_id IS NOT NULL);

-- Ensure page versions have valid status
ALTER TABLE page_versions ADD CONSTRAINT page_versions_valid_status 
CHECK (status IN ('draft', 'published'));

-- Ensure media assets have valid kind
ALTER TABLE media_assets ADD CONSTRAINT media_assets_valid_kind 
CHECK (kind IN ('image', 'video'));

-- Create security audit function
CREATE OR REPLACE FUNCTION audit_security_access()
RETURNS TRIGGER AS $$
BEGIN
    -- Log security-sensitive operations
    IF TG_OP = 'SELECT' AND auth.role() = 'anon' THEN
        -- Log anonymous access attempts to sensitive data
        INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
        VALUES (
            COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid),
            TG_TABLE_NAME,
            COALESCE(NEW.id, OLD.id),
            'anon_access_attempt',
            jsonb_build_object('timestamp', now(), 'table', TG_TABLE_NAME)
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers for sensitive tables (optional - can be enabled for monitoring)
-- CREATE TRIGGER audit_portfolios_access AFTER SELECT ON portfolios 
--     FOR EACH ROW EXECUTE FUNCTION audit_security_access();
