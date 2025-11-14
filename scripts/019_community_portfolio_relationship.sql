-- Create communities table
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL, -- e.g., "bea-founders-connect"
  description TEXT,
  logo_url TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add community_id to portfolios table to link portfolios to communities
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL;

-- Create index for faster community portfolio lookups
CREATE INDEX IF NOT EXISTS idx_portfolios_community_id ON public.portfolios(community_id);

-- Create community_members table to track user membership in communities
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'member', 'admin', 'moderator'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(community_id, user_id)
);

-- Create index for member lookups
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON public.community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON public.community_members(community_id);

-- Enable RLS on communities table
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- Public can read all communities
CREATE POLICY "public can read communities"
  ON public.communities
  FOR SELECT
  TO public
  USING (true);

-- Enable RLS on community_members table
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Users can read community memberships
CREATE POLICY "users can read community members"
  ON public.community_members
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can read their own memberships
CREATE POLICY "users can read own memberships"
  ON public.community_members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert BEA community
INSERT INTO public.communities (name, code, description)
VALUES (
  'Black Entrepreneurship Alliance',
  'bea-founders-connect',
  'A community for Black entrepreneurs and founders'
)
ON CONFLICT (code) DO NOTHING;

-- Create function to get community by code
CREATE OR REPLACE FUNCTION public.get_community_by_code(community_code TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  code TEXT,
  description TEXT,
  logo_url TEXT,
  settings JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.name, c.code, c.description, c.logo_url, c.settings
  FROM public.communities c
  WHERE c.code = community_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to join user to community
CREATE OR REPLACE FUNCTION public.join_community(
  p_community_code TEXT,
  p_user_id UUID,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_community_id UUID;
  v_member_id UUID;
BEGIN
  -- Get community ID
  SELECT id INTO v_community_id
  FROM public.communities
  WHERE code = p_community_code;

  IF v_community_id IS NULL THEN
    RAISE EXCEPTION 'Community with code % not found', p_community_code;
  END IF;

  -- Insert or update membership
  INSERT INTO public.community_members (community_id, user_id, metadata)
  VALUES (v_community_id, p_user_id, p_metadata)
  ON CONFLICT (community_id, user_id)
  DO UPDATE SET metadata = EXCLUDED.metadata, joined_at = NOW()
  RETURNING id INTO v_member_id;

  RETURN v_member_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for community portfolios
CREATE OR REPLACE VIEW public.community_portfolios AS
SELECT
  p.id AS portfolio_id,
  p.name AS portfolio_name,
  p.slug,
  p.is_public,
  p.user_id,
  p.community_id,
  c.name AS community_name,
  c.code AS community_code,
  u.full_name AS user_name,
  u.avatar_url AS user_avatar,
  p.created_at,
  p.updated_at
FROM public.portfolios p
LEFT JOIN public.communities c ON p.community_id = c.id
LEFT JOIN public.users u ON p.user_id = u.id;

-- Grant access to view
GRANT SELECT ON public.community_portfolios TO authenticated, anon;

COMMENT ON TABLE public.communities IS 'Communities that users and portfolios can belong to';
COMMENT ON TABLE public.community_members IS 'User memberships in communities';
COMMENT ON COLUMN public.portfolios.community_id IS 'Optional community association for portfolio';
