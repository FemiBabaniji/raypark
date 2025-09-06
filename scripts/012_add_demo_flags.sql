-- Add demo flags to existing tables (safe, additive)
ALTER TABLE public.portfolios
  ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

-- Add route constraint for demo namespace
ALTER TABLE public.pages
  ADD CONSTRAINT pages_route_demo_ck
  CHECK (
    is_demo = false OR (route LIKE '/demo/%')
  ) NOT VALID;

-- Add helpful indexes for demo queries
CREATE INDEX IF NOT EXISTS pages_route_idx ON public.pages(route);
CREATE INDEX IF NOT EXISTS portfolios_is_demo_idx ON public.portfolios(is_demo);
CREATE INDEX IF NOT EXISTS pages_is_demo_idx ON public.pages(is_demo);
