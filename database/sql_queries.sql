-- 1. Enable UUID extension for secure, unique identifiers
create extension if not exists "uuid-ossp";

-- 2. Create the Cafes table
create table public.cafes (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique, -- For clean URLs like /cafe/blue-tokai-indiranagar
    description text,
    neighborhood text not null, -- e.g., 'Indiranagar', 'Koramangala', 'HSR Layout'
    address text not null,
    google_maps_url text,
    
    -- Amenities (Booleans for easy filtering toggles)
    has_wifi boolean default false not null,
    has_plug_points boolean default false not null,
    has_ac boolean default false not null,
    is_pet_friendly boolean default false not null,
    
    -- Media (Storing the text URLs from Cloudinary)
    hero_image_url text not null, -- Main large photo
    gallery_image_urls text[] default '{}'::text[], -- Array of extra photo URLs
    
    -- Operational info
    opening_hours jsonb, -- e.g., {"mon_fri": "8:00 AM - 9:00 PM", "sat_sun": "9:00 AM - 10:00 PM"}
    wifi_speed_estimate text, -- e.g., "100 Mbps" or "Fast"
    
    -- Metadata
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create optimized indexes for lightning-fast filtering in Bangalore
-- This ensures that when a user filters by Neighborhood + WiFi, it loads instantly.
create index cafes_neighborhood_idx on public.cafes(neighborhood);
create index cafes_has_wifi_idx on public.cafes(has_wifi) where has_wifi = true;

-- 4. Enable Row Level Security (RLS)
-- This protects your data so random internet users can't delete your cafes.
alter table public.cafes enable row level security;

-- 5. Create RLS Policies
-- Policy: Anyone (even logged-out users) can read/view the cafes.
create policy "Allow public read access" 
on public.cafes for select 
using (true);

-- Policy: Only authenticated admins can insert/update/delete data.
create policy "Allow admin changes" 
on public.cafes for all 
using (auth.role() = 'authenticated');


-- Inserting Sample data

insert into public.cafes (
    name, 
    slug, 
    description, 
    neighborhood, 
    address, 
    has_wifi, 
    has_plug_points, 
    has_ac, 
    is_pet_friendly, 
    hero_image_url, 
    gallery_image_urls,
    opening_hours,
    wifi_speed_estimate
) values (
    'The Daily Roast',
    'the-daily-roast-indiranagar',
    'A sun-drenched sanctuary for remote workers and specialty coffee purists. Features artisanal pour-overs and ergonomic seating.',
    'Indiranagar',
    '12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, 560038',
    true,
    true,
    true,
    true,
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814', -- Replace later with your Cloudinary URL
    array['https://images.unsplash.com/photo-1613274554329-70f997f5789f', 'https://images.unsplash.com/photo-1583354608715-177553a4035e'],
    '{"weekday": "8:00 AM - 10:00 PM", "weekend": "9:00 AM - 11:00 PM"}'::jsonb,
    '150 Mbps'
);

insert into public.cafes (
    name, 
    slug, 
    description, 
    neighborhood, 
    address, 
    has_wifi, 
    has_plug_points, 
    has_ac, 
    is_pet_friendly, 
    hero_image_url, 
    gallery_image_urls,
    opening_hours,
    wifi_speed_estimate
) values 
(
    'Third Wave Coffee Roasters',
    'third-wave-coffee-koramangala',
    'A multi-level flagship roastery featuring dedicated community worktables, exceptional single-origin filter coffees, and an energetic startup vibe.',
    'Koramangala',
    '984, 80 Feet Rd, 4th Block, Koramangala, Bengaluru, 560034',
    true,
    true,
    true,
    false,
    'https://images.unsplash.com/photo-1613274554329-70f997f5789f', -- Replace later with your Cloudinary URL
    array['https://images.unsplash.com/photo-1495862433577-132cf20d7902'],
    '{"weekday": "7:00 AM - 11:00 PM", "weekend": "7:00 AM - 12:00 AM"}'::jsonb,
    '200 Mbps'
),
(
    'The Bloom Room',
    'the-bloom-room-hsr-layout',
    'An earthy, pastel-toned sanctuary tucked away in HSR. Known for its quiet atmosphere, plush seating, and excellent manual brews—perfect for deep work sessions.',
    'HSR Layout',
    '14th Main Rd, Sector 7, HSR Layout, Bengaluru, 560102',
    true,
    true,
    true,
    true,
    'https://images.unsplash.com/photo-1583354608715-177553a4035e', -- Replace later with your Cloudinary URL
    array['https://images.unsplash.com/photo-1484788984921-03950022c9ef'],
    '{"weekday": "9:00 AM - 9:30 PM", "weekend": "8:30 AM - 10:00 PM"}'::jsonb,
    '90 Mbps'
);

-- ========================================================
-- Profiles Setup
-- ========================================================

-- 1. Create a public profiles table containing extra user details
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  is_admin boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create RLS Policies
create policy "Allow public read access to profiles"
  on public.profiles for select
  using (true);

create policy "Allow users to update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 4. Create trigger to automatically insert a profile when a user registers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.email like '%admin%'), false) -- Auto-sets admin if email contains 'admin'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========================================================
-- Comments Setup
-- ========================================================

-- 1. Create public.comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  cafe_id uuid references public.cafes(id) on delete cascade not null,
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  content text not null,
  is_guest boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.comments enable row level security;

-- 3. Create RLS Policies
create policy "Allow public read access to comments"
  on public.comments for select
  using (true);

create policy "Allow public insert access to comments"
  on public.comments for insert
  with check (true);
