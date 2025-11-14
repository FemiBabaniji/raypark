-- Insert sample calendar
INSERT INTO calendars (id, user_id, name, description, slug, public_url, tint_color, location_type, location_city, icon_emoji)
SELECT 
  gen_random_uuid(),
  id,
  'DMZ',
  'Toronto''s leading tech hub and startup accelerator',
  'dmz',
  'dmz',
  '#8B5CF6',
  'city',
  'Toronto',
  '🚀'
FROM users
LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO events (calendar_id, created_by, name, description, start_time, end_time, location_type, location_address, theme)
SELECT 
  c.id,
  c.user_id,
  'AI & Machine Learning Meetup',
  'Join us for an evening of AI innovation and networking with leading ML practitioners.',
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '7 days' + INTERVAL '2 hours',
  'offline',
  'DMZ at Ryerson University, 10 Dundas St E, Toronto',
  'minimal'
FROM calendars c
WHERE c.slug = 'dmz'
ON CONFLICT DO NOTHING;

INSERT INTO events (calendar_id, created_by, name, description, start_time, end_time, location_type, location_link, theme)
SELECT 
  c.id,
  c.user_id,
  'Startup Pitch Night',
  'Watch 10 startups pitch their ideas to investors and industry experts.',
  NOW() + INTERVAL '14 days',
  NOW() + INTERVAL '14 days' + INTERVAL '3 hours',
  'offline',
  'DMZ Event Space',
  'minimal'
FROM calendars c
WHERE c.slug = 'dmz'
ON CONFLICT DO NOTHING;

-- Insert sample tickets for events
INSERT INTO event_tickets (event_id, name, price_cents, capacity, require_approval)
SELECT 
  e.id,
  'General Admission',
  0,
  100,
  false
FROM events e
LIMIT 2
ON CONFLICT DO NOTHING;
