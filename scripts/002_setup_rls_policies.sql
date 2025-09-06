-- Row Level Security policies for all tables
-- Enable RLS on all tables
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Portfolios policies
DROP POLICY IF EXISTS "owners can select own portfolios" ON portfolios;
CREATE POLICY "owners can select own portfolios"
ON portfolios FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owners can modify own portfolios" ON portfolios;
CREATE POLICY "owners can modify own portfolios"
ON portfolios FOR ALL
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "public can read public portfolios" ON portfolios;
CREATE POLICY "public can read public portfolios"
ON portfolios FOR SELECT
USING (is_public = true);

-- Themes policies
DROP POLICY IF EXISTS "owners can select own themes" ON themes;
CREATE POLICY "owners can select own themes"
ON themes FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owners can modify own themes" ON themes;
CREATE POLICY "owners can modify own themes"
ON themes FOR ALL
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Pages policies
DROP POLICY IF EXISTS "owners can select own pages" ON pages;
CREATE POLICY "owners can select own pages"
ON pages FOR SELECT
USING (
    auth.uid() = (SELECT user_id FROM portfolios WHERE portfolios.id = pages.portfolio_id)
);

DROP POLICY IF EXISTS "owners can modify own pages" ON pages;
CREATE POLICY "owners can modify own pages"
ON pages FOR ALL
USING (
    auth.uid() = (SELECT user_id FROM portfolios WHERE portfolios.id = pages.portfolio_id)
) WITH CHECK (
    auth.uid() = (SELECT user_id FROM portfolios WHERE portfolios.id = pages.portfolio_id)
);

DROP POLICY IF EXISTS "public can read published pages" ON pages;
CREATE POLICY "public can read published pages"
ON pages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM page_versions pv
        JOIN portfolios p ON p.id = pages.portfolio_id
        WHERE pv.page_id = pages.id 
        AND pv.status = 'published'
        AND p.is_public = true
    )
);

-- Widget types policies (public read, admin write)
DROP POLICY IF EXISTS "public can read widget types" ON widget_types;
CREATE POLICY "public can read widget types"
ON widget_types FOR SELECT
TO authenticated, anon
USING (true);

-- Widget instances policies
DROP POLICY IF EXISTS "owners can select own widget instances" ON widget_instances;
CREATE POLICY "owners can select own widget instances"
ON widget_instances FOR SELECT
USING (
    auth.uid() = (
        SELECT p.user_id FROM pages pg
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pg.id = widget_instances.page_id
    )
);

DROP POLICY IF EXISTS "owners can modify own widget instances" ON widget_instances;
CREATE POLICY "owners can modify own widget instances"
ON widget_instances FOR ALL
USING (
    auth.uid() = (
        SELECT p.user_id FROM pages pg
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pg.id = widget_instances.page_id
    )
) WITH CHECK (
    auth.uid() = (
        SELECT p.user_id FROM pages pg
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pg.id = widget_instances.page_id
    )
);

-- Page layouts policies
DROP POLICY IF EXISTS "owners can select own page layouts" ON page_layouts;
CREATE POLICY "owners can select own page layouts"
ON page_layouts FOR SELECT
USING (
    auth.uid() = (
        SELECT p.user_id FROM pages pg
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pg.id = page_layouts.page_id
    )
);

DROP POLICY IF EXISTS "owners can modify own page layouts" ON page_layouts;
CREATE POLICY "owners can modify own page layouts"
ON page_layouts FOR ALL
USING (
    auth.uid() = (
        SELECT p.user_id FROM pages pg
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pg.id = page_layouts.page_id
    )
) WITH CHECK (
    auth.uid() = (
        SELECT p.user_id FROM pages pg
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pg.id = page_layouts.page_id
    )
);

-- Page versions policies
DROP POLICY IF EXISTS "owners can select own page versions" ON page_versions;
CREATE POLICY "owners can select own page versions"
ON page_versions FOR SELECT
USING (
    auth.uid() = (
        SELECT p.user_id FROM pages pg
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pg.id = page_versions.page_id
    )
);

DROP POLICY IF EXISTS "owners can modify own page versions" ON page_versions;
CREATE POLICY "owners can modify own page versions"
ON page_versions FOR ALL
USING (
    auth.uid() = (
        SELECT p.user_id FROM pages pg
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pg.id = page_versions.page_id
    )
) WITH CHECK (
    auth.uid() = (
        SELECT p.user_id FROM pages pg
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pg.id = page_versions.page_id
    )
);

DROP POLICY IF EXISTS "public can read published page versions" ON page_versions;
CREATE POLICY "public can read published page versions"
ON page_versions FOR SELECT
USING (
    status = 'published' AND
    EXISTS (
        SELECT 1 FROM pages pg
        JOIN portfolios p ON p.id = pg.portfolio_id
        WHERE pg.id = page_versions.page_id
        AND p.is_public = true
    )
);

-- Media assets policies
DROP POLICY IF EXISTS "owners can select own media assets" ON media_assets;
CREATE POLICY "owners can select own media assets"
ON media_assets FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owners can modify own media assets" ON media_assets;
CREATE POLICY "owners can modify own media assets"
ON media_assets FOR ALL
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Activity log policies
DROP POLICY IF EXISTS "owners can select own activity log" ON activity_log;
CREATE POLICY "owners can select own activity log"
ON activity_log FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owners can insert own activity log" ON activity_log;
CREATE POLICY "owners can insert own activity log"
ON activity_log FOR INSERT
WITH CHECK (auth.uid() = user_id);
