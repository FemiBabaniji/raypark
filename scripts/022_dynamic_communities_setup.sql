-- This script ensures communities can be accessed dynamically via /network/[code]
-- Instead of hardcoded /bea and /dmz routes

-- Update community codes to be simpler for routing (optional - keeps existing codes working)
-- The app will support both /network/bea and /network/bea-founders-connect

-- Add a function to lookup communities by short code OR full code
CREATE OR REPLACE FUNCTION public.get_community_by_slug(slug_input TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  code TEXT,
  description TEXT,
  logo_url TEXT,
  settings JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.code,
    c.description,
    c.logo_url,
    c.settings,
    c.created_at,
    c.updated_at
  FROM communities c
  WHERE c.code = slug_input 
     OR c.code = CASE 
         WHEN slug_input = 'bea' THEN 'bea-founders-connect'
         WHEN slug_input = 'dmz' THEN 'dmz-innovation-hub'
         ELSE slug_input
       END
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view that lists all available communities with stats
CREATE OR REPLACE VIEW public.community_stats AS
SELECT 
  c.id,
  c.name,
  c.code,
  c.description,
  c.logo_url,
  c.settings,
  COUNT(DISTINCT cm.user_id) as member_count,
  COUNT(DISTINCT p.id) as portfolio_count,
  c.created_at,
  c.updated_at
FROM communities c
LEFT JOIN community_members cm ON c.id = cm.community_id
LEFT JOIN portfolios p ON c.id = p.community_id
GROUP BY c.id, c.name, c.code, c.description, c.logo_url, c.settings, c.created_at, c.updated_at;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_community_by_slug TO authenticated, anon;
GRANT SELECT ON public.community_stats TO authenticated, anon;

-- Add index for faster lookups by code
CREATE INDEX IF NOT EXISTS idx_communities_code ON communities(code);

COMMENT ON FUNCTION public.get_community_by_slug IS 'Fetches community by short slug (bea, dmz) or full code for dynamic routing';
COMMENT ON VIEW public.community_stats IS 'Community overview with member and portfolio counts for listing pages';
