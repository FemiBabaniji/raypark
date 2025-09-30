-- Add description column to portfolios table if it doesn't exist
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing portfolios to have a default description
UPDATE portfolios 
SET description = COALESCE(description, name || '''s portfolio')
WHERE description IS NULL;
