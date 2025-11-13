-- Drop any old global unique constraint on pages.route
-- This allows multiple portfolios to have the same route names

DO $$ 
DECLARE
  constraint_name text;
BEGIN
  -- Find any unique constraint on just the route column
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.pages'::regclass
    AND contype = 'u'
    AND array_length(conkey, 1) = 1
    AND conkey[1] = (
      SELECT attnum FROM pg_attribute 
      WHERE attrelid = 'public.pages'::regclass 
      AND attname = 'route'
    );
  
  -- Drop it if found
  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.pages DROP CONSTRAINT %I', constraint_name);
    RAISE NOTICE 'Dropped old unique constraint: %', constraint_name;
  ELSE
    RAISE NOTICE 'No old global unique constraint on route column found';
  END IF;
END $$;
