-- ========================================================
-- Schema Migration V2: Global Cities and Nomad Amenities
-- ========================================================

-- 1. Enable PostGIS extension for geospatial features
create extension if not exists postgis;

-- 2. Create the countries table
create table if not exists public.countries (
    id uuid default gen_random_uuid() primary key,
    name text not null unique,
    code text not null unique, -- ISO code, e.g., 'IN', 'US'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create the cities table
create table if not exists public.cities (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    country_id uuid references public.countries(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (country_id, name)
);

-- 4. Alter the cafes table to add nomad amenities and city relationship
alter table public.cafes add column if not exists city_id uuid references public.cities(id) on delete set null;
alter table public.cafes add column if not exists specialty_focus text;
alter table public.cafes add column if not exists noise_level text check (noise_level in ('quiet', 'moderate', 'bustling'));
alter table public.cafes add column if not exists seating_capacity integer;
alter table public.cafes add column if not exists latitude double precision;
alter table public.cafes add column if not exists longitude double precision;
alter table public.cafes add column if not exists geom geography(Point, 4326);

-- 5. Create a trigger to synchronize geography (geom) coordinates from lat/lng
create or replace function public.update_cafe_geom()
returns trigger as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.geom := st_setsrid(st_makepoint(new.longitude, new.latitude), 4326)::geography;
  else
    new.geom := null;
  end if;
  return new;
end;
$$ language plpgsql;

create or replace trigger trigger_update_cafe_geom
before insert or update on public.cafes
for each row execute procedure public.update_cafe_geom();

-- 6. Enable Row Level Security (RLS) for countries and cities
alter table public.countries enable row level security;
alter table public.cities enable row level security;

-- 7. RLS Policies for countries
create policy "Allow public read access to countries" 
on public.countries for select using (true);

create policy "Allow admin changes to countries" 
on public.countries for all using (auth.role() = 'authenticated');

-- 8. RLS Policies for cities
create policy "Allow public read access to cities" 
on public.cities for select using (true);

create policy "Allow admin changes to cities" 
on public.cities for all using (auth.role() = 'authenticated');

-- ========================================================
-- Seed Initial Global Countries and Cities
-- ========================================================

-- Seed Countries
insert into public.countries (name, code)
values 
    ('India', 'IN'),
    ('USA', 'US')
on conflict (name) do update set code = excluded.code;

-- Seed Cities (mapping dynamically to country IDs via country codes)
insert into public.cities (name, slug, country_id)
values
    ('Bengaluru', 'bengaluru', (select id from public.countries where code = 'IN')),
    ('Haldwani', 'haldwani', (select id from public.countries where code = 'IN')),
    ('Seattle, WA', 'seattle', (select id from public.countries where code = 'US')),
    ('San Jose, CA', 'san-jose', (select id from public.countries where code = 'US')),
    ('San Francisco, CA', 'san-francisco', (select id from public.countries where code = 'US')),
    ('Bloomington, IN', 'bloomington', (select id from public.countries where code = 'US'))
on conflict (slug) do nothing;