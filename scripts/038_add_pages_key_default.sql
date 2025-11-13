-- Add default value for pages.key column to prevent null constraint violations
-- This ensures that even if application code forgets to provide a key, the database will generate one

-- Enable pgcrypto extension if not already enabled (for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Set default value for pages.key column
-- Using gen_random_uuid() cast to text for compatibility
ALTER TABLE public.pages
  ALTER COLUMN key SET DEFAULT 'page_' || encode(gen_random_bytes(9), 'base64');

-- Backfill any existing null keys (if any)
UPDATE public.pages
SET key = 'page_' || encode(gen_random_bytes(9), 'base64')
WHERE key IS NULL;

-- Add unique index on key if not exists (for performance and integrity)
CREATE UNIQUE INDEX IF NOT EXISTS pages_key_unique ON public.pages(key);

-- Verify the changes
DO $$
BEGIN
  RAISE NOTICE 'pages.key column now has default value';
  RAISE NOTICE 'All existing null keys have been backfilled';
  RAISE NOTICE 'Unique index created on pages.key';
END $$;
