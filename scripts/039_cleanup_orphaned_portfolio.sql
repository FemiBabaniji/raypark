-- Clean up the orphaned portfolio that has no pages or widgets
DELETE FROM portfolios 
WHERE id = '8cb29f96-fa31-44d1-95e6-ba8fa653064b'
AND NOT EXISTS (
  SELECT 1 FROM pages WHERE portfolio_id = portfolios.id
);
