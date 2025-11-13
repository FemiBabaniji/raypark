-- Delete all portfolios that have no pages (orphaned from failed creation)
DELETE FROM portfolios
WHERE id NOT IN (SELECT DISTINCT portfolio_id FROM pages);

-- Show remaining portfolios for verification
SELECT p.id, p.name, p.user_id, 
       (SELECT COUNT(*) FROM pages WHERE portfolio_id = p.id) as page_count
FROM portfolios p;
