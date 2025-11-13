-- Verify the current page_layouts → pages → portfolios relationship
SELECT 
  pl.id as layout_id,
  pl.page_id,
  p.portfolio_id,
  p.title as page_title,
  port.name as portfolio_name,
  port.user_id
FROM page_layouts pl
JOIN pages p ON pl.page_id = p.id
JOIN portfolios port ON p.portfolio_id = port.id
WHERE pl.id = '34c5e57b-6ee3-482b-8740-63817f95f6c7';

-- Add denormalized portfolio_id column to page_layouts for easier querying
-- This is optional but recommended for performance
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'page_layouts' 
    AND column_name = 'portfolio_id'
  ) THEN
    -- Add the column
    ALTER TABLE page_layouts 
    ADD COLUMN portfolio_id uuid REFERENCES portfolios(id) ON DELETE CASCADE;
    
    -- Backfill existing rows
    UPDATE page_layouts pl
    SET portfolio_id = p.portfolio_id
    FROM pages p
    WHERE pl.page_id = p.id;
    
    -- Add index for performance
    CREATE INDEX IF NOT EXISTS idx_page_layouts_portfolio_id 
    ON page_layouts(portfolio_id);
    
    RAISE NOTICE 'Added portfolio_id column to page_layouts and backfilled data';
  ELSE
    RAISE NOTICE 'portfolio_id column already exists in page_layouts';
  END IF;
END $$;

-- Create trigger to auto-set portfolio_id when page_layouts are inserted/updated
CREATE OR REPLACE FUNCTION sync_page_layouts_portfolio_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-set portfolio_id from the linked page
  SELECT portfolio_id INTO NEW.portfolio_id
  FROM pages
  WHERE id = NEW.page_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_page_layouts_portfolio_id ON page_layouts;
CREATE TRIGGER trg_sync_page_layouts_portfolio_id
  BEFORE INSERT OR UPDATE ON page_layouts
  FOR EACH ROW
  EXECUTE FUNCTION sync_page_layouts_portfolio_id();
