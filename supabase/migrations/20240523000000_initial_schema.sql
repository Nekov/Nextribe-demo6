
-- Create profiles table
create table profiles (
  id uuid references auth.users not null primary key,
  name text,
  avatar_url text,
  level text default 'Explorer',
  total_points bigint default 0,
  next_level_points bigint default 1000,
  total_invested numeric default 0,
  remaining_free_nights int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create countries table
create table countries (
  id text primary key, -- ISO code
  name text not null,
  status text check (status in ('none', 'proposed', 'ambassador', 'signed', 'development', 'operating')) default 'none',
  progress int default 0,
  description text,
  locations_proposed int default 0,
  locations_target int default 0,
  ambassador_id uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create opportunities table
create table opportunities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  location text,
  country_id text references countries(id),
  capacity int,
  total_price numeric,
  available_shares_pct numeric,
  expected_roi_pct numeric,
  images text[],
  amenities text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create investments table
create table investments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  opportunity_id uuid references opportunities(id) not null,
  investment_size numeric not null,
  yearly_return_val numeric,
  yearly_return_pct numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table countries enable row level security;
alter table opportunities enable row level security;
alter table investments enable row level security;

-- Create policies
-- Profiles: Users can view their own profile and update it. Public read for leaderboards (simplified).
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Countries: Public read. Only admins (service role) can update for now.
create policy "Countries are viewable by everyone." on countries for select using (true);

-- Opportunities: Public read.
create policy "Opportunities are viewable by everyone." on opportunities for select using (true);

-- Investments: Users can view their own investments.
create policy "Users can view own investments." on investments for select using (auth.uid() = user_id);
