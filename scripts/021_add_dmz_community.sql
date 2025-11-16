-- Add DMZ Innovation Hub community
INSERT INTO public.communities (name, code, description, logo_url)
VALUES (
  'DMZ Innovation Hub',
  'dmz-innovation-hub',
  'Canada''s leading business incubator and startup accelerator',
  '/dmz-logo-white.svg'
)
ON CONFLICT (code) DO NOTHING;

-- Get the community IDs for reference
DO $$
DECLARE
  v_bea_id UUID;
  v_dmz_id UUID;
BEGIN
  SELECT id INTO v_bea_id FROM public.communities WHERE code = 'bea-founders-connect';
  SELECT id INTO v_dmz_id FROM public.communities WHERE code = 'dmz-innovation-hub';
  
  RAISE NOTICE 'BEA Community ID: %', v_bea_id;
  RAISE NOTICE 'DMZ Community ID: %', v_dmz_id;
END $$;
