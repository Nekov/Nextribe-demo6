
-- Seed Countries
INSERT INTO countries (id, name, status, progress, description, locations_proposed, locations_target)
VALUES
  ('GRC', 'Greece', 'development', 65, 'Beautiful Mediterranean landscapes.', 3, 5),
  ('ITA', 'Italy', 'ambassador', 30, 'Rich history and culture.', 2, 5),
  ('ESP', 'Spain', 'signed', 45, 'Sunny beaches and vibrant cities.', 4, 6),
  ('USA', 'United States of America', 'none', 0, 'Diverse landscapes.', 0, 10);

-- Seed Opportunities (Mock UUIDs for demo)
-- Note: In a real scenario, we'd need valid UUIDs or retrieve them after insert.
-- For this seed script, we'll rely on the default gen_random_uuid() or hardcode if needed for relationships.
-- Here we just insert sample data without hard relationships for simplicity in this initial seed.

INSERT INTO opportunities (title, location, country_id, capacity, total_price, available_shares_pct, expected_roi_pct, images, amenities)
VALUES
  ('Seaside Villa', 'Crete', 'GRC', 8, 450000, 40, 12.5, ARRAY['https://example.com/villa.jpg'], ARRAY['Pool', 'Wifi']),
  ('Mountain Cabin', 'Alps', 'ITA', 4, 250000, 60, 9.0, ARRAY['https://example.com/cabin.jpg'], ARRAY['Fireplace', 'Hiking']);
