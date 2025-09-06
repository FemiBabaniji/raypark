-- Enhanced core schema migration for portfolio platform
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing tables to recreate with enhanced structure
DROP TABLE IF EXISTS education_widgets CASCADE;
DROP TABLE IF EXISTS profile_widgets CASCADE;
DROP TABLE IF EXISTS project_widgets CASCADE;
DROP TABLE IF EXISTS skills_widgets CASCADE;
DROP TABLE IF EXISTS work_experience_widgets CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create public.users table that extends auth.users
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text,
    full_name text,
    avatar_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Keep portfolios table but enhance it
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS theme_id uuid,
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true;

-- Add unique constraint on slug
CREATE UNIQUE INDEX IF NOT EXISTS portfolios_slug_idx ON portfolios(slug);

-- Create themes table
CREATE TABLE IF NOT EXISTS themes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    tokens jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id uuid NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    key text NOT NULL,
    title text,
    route text UNIQUE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create widget_types catalog
CREATE TABLE IF NOT EXISTS widget_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    name text NOT NULL,
    schema jsonb NOT NULL DEFAULT '{}'::jsonb,
    render_hint jsonb DEFAULT '{}'::jsonb,
    semver text DEFAULT '1.0.0',
    created_at timestamptz DEFAULT now()
);

-- Create widget_instances table
CREATE TABLE IF NOT EXISTS widget_instances (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    widget_type_id uuid NOT NULL REFERENCES widget_types(id),
    props jsonb NOT NULL DEFAULT '{}'::jsonb,
    enabled boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create page_layouts table
CREATE TABLE IF NOT EXISTS page_layouts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE UNIQUE,
    layout jsonb NOT NULL DEFAULT '{"left": [], "right": []}'::jsonb,
    updated_at timestamptz DEFAULT now()
);

-- Create page_versions table for draft/publish workflow
CREATE TABLE IF NOT EXISTS page_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    status text CHECK(status IN ('draft', 'published')) NOT NULL,
    snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_by uuid NOT NULL REFERENCES public.users(id),
    created_at timestamptz DEFAULT now(),
    published_at timestamptz
);

-- Create media_assets table
CREATE TABLE IF NOT EXISTS media_assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    page_id uuid REFERENCES pages(id) ON DELETE SET NULL,
    widget_instance_id uuid REFERENCES widget_instances(id) ON DELETE SET NULL,
    kind text CHECK(kind IN ('image', 'video')) NOT NULL,
    path text NOT NULL,
    variants jsonb DEFAULT '{}'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    entity_type text NOT NULL,
    entity_id uuid,
    action text NOT NULL,
    diff jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger for users table
DROP TRIGGER IF EXISTS set_updated_at_trigger ON public.users;
CREATE TRIGGER set_updated_at_trigger
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Add updated_at triggers
DROP TRIGGER IF EXISTS set_updated_at_trigger ON themes;
CREATE TRIGGER set_updated_at_trigger
    BEFORE UPDATE ON themes
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_trigger ON pages;
CREATE TRIGGER set_updated_at_trigger
    BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_trigger ON widget_instances;
CREATE TRIGGER set_updated_at_trigger
    BEFORE UPDATE ON widget_instances
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_trigger ON page_layouts;
CREATE TRIGGER set_updated_at_trigger
    BEFORE UPDATE ON page_layouts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS portfolios_user_id_idx ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS themes_user_id_idx ON themes(user_id);
CREATE INDEX IF NOT EXISTS pages_portfolio_id_idx ON pages(portfolio_id);
CREATE INDEX IF NOT EXISTS pages_route_idx ON pages(route);
CREATE INDEX IF NOT EXISTS widget_instances_page_id_idx ON widget_instances(page_id);
CREATE INDEX IF NOT EXISTS widget_instances_props_gin_idx ON widget_instances USING gin(props);
CREATE INDEX IF NOT EXISTS page_versions_page_id_status_idx ON page_versions(page_id, status);
CREATE INDEX IF NOT EXISTS page_versions_snapshot_gin_idx ON page_versions USING gin(snapshot);
CREATE INDEX IF NOT EXISTS media_assets_user_id_page_id_idx ON media_assets(user_id, page_id);
CREATE INDEX IF NOT EXISTS media_assets_metadata_gin_idx ON media_assets USING gin(metadata);
CREATE INDEX IF NOT EXISTS activity_log_user_id_idx ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS activity_log_entity_idx ON activity_log(entity_type, entity_id);
