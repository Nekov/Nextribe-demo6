
-- Clear existing data to avoid conflicts on re-seed
TRUNCATE TABLE investments CASCADE;
TRUNCATE TABLE opportunities CASCADE;
TRUNCATE TABLE countries CASCADE;
TRUNCATE TABLE profiles CASCADE;
-- Note: We generally don't truncate auth.users in a seed script as it might affect other things, 
-- but we will insert if not exists.

-- 0. Seed Auth Users (Required for Foreign Key in profiles)
INSERT INTO auth.users (id, aud, role, email, email_confirmed_at)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'authenticated', 'authenticated', 'admin@example.com', now()),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'authenticated', 'authenticated', 'elena@example.com', now()),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'authenticated', 'authenticated', 'marcus@example.com', now()),
  ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'authenticated', 'authenticated', 'sofia@example.com', now()),
  ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380e55', 'authenticated', 'authenticated', 'john@example.com', now()),
  ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380f66', 'authenticated', 'authenticated', 'ana@example.com', now())
ON CONFLICT (id) DO NOTHING;

-- 1. Seed Profiles (Users)
-- Admin User (matches MOCK_USER_PROFILE)
INSERT INTO profiles (id, name, avatar_url, level, total_points, next_level_points, total_invested, remaining_free_nights)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin User', 'https://picsum.photos/200/200?random=user', 'Visionary Investor', 12450, 15000, 85000, 14);

-- Leaderboard Users (matches MOCK_LEADERBOARD)
INSERT INTO profiles (id, name, avatar_url, total_points)
VALUES
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Elena Popova', 'https://picsum.photos/50/50?random=1', 4500),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Marcus Weber', 'https://picsum.photos/50/50?random=2', 4100),
  ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'Sofia Rossi', 'https://picsum.photos/50/50?random=3', 3850),
  ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380e55', 'John Smith', 'https://picsum.photos/50/50?random=4', 3200),
  ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380f66', 'Ana Silva', 'https://picsum.photos/50/50?random=5', 2900);


-- 2. Seed Countries (matches COUNTRY_STATUS_MAP and getMockCountryData logic)
INSERT INTO countries (id, name, status, progress, description, locations_proposed, locations_target)
VALUES
  ('BGR', 'Bulgaria', 'development', 65, 'Expanding to the stunning landscapes of Bulgaria with rich history and local charm.', 8, 10),
  ('AUT', 'Austria', 'signed', 30, 'Expanding to the stunning landscapes of Austria with rich history and local charm.', 5, 10),
  ('ROU', 'Romania', 'ambassador', 20, 'Expanding to the stunning landscapes of Romania with rich history and local charm.', 4, 10),
  ('ITA', 'Italy', 'ambassador', 20, 'Expanding to the stunning landscapes of Italy with rich history and local charm.', 7, 10),
  ('LTU', 'Lithuania', 'ambassador', 20, 'Expanding to the stunning landscapes of Lithuania with rich history and local charm.', 6, 10),
  ('CYP', 'Cyprus', 'ambassador', 20, 'Expanding to the stunning landscapes of Cyprus with rich history and local charm.', 4, 10),
  ('SVN', 'Slovenia', 'proposed', 15, 'Expanding to the stunning landscapes of Slovenia with rich history and local charm.', 3, 10),
  ('LVA', 'Latvia', 'proposed', 15, 'Expanding to the stunning landscapes of Latvia with rich history and local charm.', 3, 10),
  ('GRC', 'Greece', 'none', 0, 'Expanding to the stunning landscapes of Greece with rich history and local charm.', 0, 10),
  ('MYS', 'Malaysia', 'none', 0, 'Expanding to the stunning landscapes of Malaysia with rich history and local charm.', 0, 10),
  ('FRA', 'France', 'none', 0, 'Expanding to the stunning landscapes of France with rich history and local charm.', 0, 10),
  ('DEU', 'Germany', 'none', 0, 'Expanding to the stunning landscapes of Germany with rich history and local charm.', 0, 10),
  ('GBR', 'United Kingdom', 'none', 0, 'Expanding to the stunning landscapes of United Kingdom with rich history and local charm.', 0, 10),
  ('POL', 'Poland', 'none', 0, 'Expanding to the stunning landscapes of Poland with rich history and local charm.', 0, 10),
  ('JPN', 'Japan', 'none', 0, 'Expanding to the stunning landscapes of Japan with rich history and local charm.', 0, 10),
  ('USA', 'United States', 'none', 0, 'Expanding to the stunning landscapes of United States with rich history and local charm.', 0, 10),
  ('TUR', 'Turkey', 'none', 0, 'Expanding to the stunning landscapes of Turkey with rich history and local charm.', 0, 10),
  ('HRV', 'Croatia', 'none', 0, 'Expanding to the stunning landscapes of Croatia with rich history and local charm.', 0, 10),
  ('SVK', 'Slovakia', 'proposed', 10, 'Discover the hidden gems of the High Tatras and sustainable tourism in Slovakia.', 2, 10),
  ('FIN', 'Finland', 'proposed', 15, 'Experience the serenity of Nordic forests and lakes in Finland.', 3, 10),
  ('PRT', 'Portugal', 'proposed', 20, 'Enjoy the sunny coastlines and vibrant culture of Portugal.', 4, 10),
  ('CRI', 'Costa Rica', 'proposed', 25, 'Immerse yourself in the biodiversity and "Pura Vida" lifestyle of Costa Rica.', 5, 10);


-- 3. Seed Opportunities (matches MOCK_OPPORTUNITIES)
-- We assign specific UUIDs so we can link investments to them
INSERT INTO opportunities (id, title, location, country_id, capacity, total_price, available_shares_pct, expected_roi_pct, images, amenities)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Forest Edge Eco-Cabin', 'Transylvania', 'ROU', 4, 120000, 60, 11.5, ARRAY['https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600&auto=format&fit=crop'], ARRAY['Hot Tub', 'Fireplace', 'Smart Home', 'EV Charger']),
  ('22222222-2222-2222-2222-222222222222', 'Lakeside Mirror House', 'Lake Bled', 'SVN', 2, 180000, 25, 9.8, ARRAY['https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop'], ARRAY['Private Dock', 'Sauna', 'Panorama Glass', 'Kayak']),
  ('33333333-3333-3333-3333-333333333333', 'River Canyon Lodge', 'Tara Canyon', 'MYS', 6, 145000, 85, 12.2, ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=600&auto=format&fit=crop'], ARRAY['Large Deck', 'BBQ Station', 'River Access', 'Starlink']),
  ('44444444-4444-4444-4444-444444444444', 'Tropical Jungle Dome', 'Ubud', 'MYS', 2, 95000, 40, 13.5, ARRAY['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f8e?q=80&w=600&auto=format&fit=crop'], ARRAY['Infinity Pool', 'Jungle View', 'Yoga Deck', 'Scooter Incl.']),
  ('55555555-5555-5555-5555-555555555555', 'Nordic Aurora Glass Igloo', 'Rovaniemi', 'LTU', 2, 165000, 15, 10.2, ARRAY['https://images.unsplash.com/photo-1518182170546-0766ca6fdd69?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1445548671936-e1ff8a6a6b20?q=80&w=600&auto=format&fit=crop'], ARRAY['Glass Roof', 'Private Sauna', 'Floor Heating', 'Reindeer Safari']),
  ('66666666-6666-6666-6666-666666666666', 'Desert Oasis Tiny Home', 'Joshua Tree', 'USA', 4, 135000, 70, 11.0, ARRAY['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1542324623-05c77e9b087d?q=80&w=600&auto=format&fit=crop'], ARRAY['Fire Pit', 'Stargazing Deck', 'Outdoor Shower', 'Solar Power']),
  ('77777777-7777-7777-7777-777777777777', 'High Tatras Eco Cabin', 'High Tatras', 'SVK', 4, 95000, 100, 12.5, ARRAY['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600&auto=format&fit=crop'], ARRAY['Mountain View', 'Hiking Trails', 'Sustainable Wood', 'Fireplace']),
  ('88888888-8888-8888-8888-888888888888', 'Nordic Forest Tiny House', 'Nuuksio National Park', 'FIN', 2, 85000, 100, 11.8, ARRAY['https://images.unsplash.com/photo-1504280506541-aca1d6d885b6?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?q=80&w=600&auto=format&fit=crop'], ARRAY['Forest Immersion', 'Berry Picking', 'Minimalist Design', 'Sauna']),
  ('99999999-9999-9999-9999-999999999999', 'Algarve Glamping Dome', 'Algarve', 'PRT', 2, 75000, 100, 14.0, ARRAY['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=600&auto=format&fit=crop'], ARRAY['Ocean Breeze', 'Stargazing', 'Outdoor Bath', 'Yoga Deck']),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Costa Rica Eco Lodge', 'Monteverde', 'CRI', 6, 180000, 100, 13.2, ARRAY['https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=600&auto=format&fit=crop'], ARRAY['Rainforest View', 'Wildlife Watching', 'Sustainable Materials', 'Hammocks']);

-- 4. Seed Investments (matches MOCK_USER_PROFILE.investments)
-- Linking Admin User to some opportunities
INSERT INTO investments (user_id, opportunity_id, investment_size, yearly_return_val, yearly_return_pct)
VALUES
  -- Investment 1: Alpine Retreat (Mapping to 'Lakeside Mirror House' for demo purposes as Alpine Retreat isn't in opportunities list exactly, but close enough)
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '22222222-2222-2222-2222-222222222222', 45000, 5400, 12.0),
  
  -- Investment 2: Coastal Tiny Home (Mapping to 'Forest Edge' for demo purposes)
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '11111111-1111-1111-1111-111111111111', 40000, 3950, 9.8);
