-- Ensure both BEA and DMZ communities exist in the database
-- This script is idempotent and can be run multiple times safely

-- Insert BEA community
INSERT INTO public.communities (name, code, description, logo_url)
VALUES (
  'Black Entrepreneurship Alliance',
  'bea-founders-connect',
  'A community for Black entrepreneurs and founders',
  '/bea-logo.svg'
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  logo_url = EXCLUDED.logo_url,
  updated_at = NOW();

-- Insert DMZ community
INSERT INTO public.communities (name, code, description, logo_url)
VALUES (
  'DMZ Innovation Hub',
  'dmz-innovation-hub',
  'Canada''s leading business incubator and startup accelerator',
  '/dmz-logo-white.svg'
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  logo_url = EXCLUDED.logo_url,
  updated_at = NOW();

-- Verify communities exist
SELECT 
  id,
  name,
  code,
  description,
  created_at
FROM public.communities
WHERE code IN ('bea-founders-connect', 'dmz-innovation-hub')
ORDER BY name;
