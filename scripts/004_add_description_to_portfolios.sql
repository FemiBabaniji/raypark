-- Add description column to portfolios table
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS description TEXT;
