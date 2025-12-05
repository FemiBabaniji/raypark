-- Create a fresh test community for admin bootstrap testing
-- After executing this script, join this community and you'll automatically become admin

INSERT INTO public.communities (name, code, description, logo_url)
VALUES (
  'Test Admin Community',
  'test-admin-community',
  'Test community for admin role bootstrapping',
  '/placeholder.svg?height=100&width=100'
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Verify the community was created
SELECT 
  id,
  name,
  code,
  description,
  created_at
FROM public.communities
WHERE code = 'test-admin-community';
