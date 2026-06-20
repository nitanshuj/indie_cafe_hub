-- ========================================================
-- Row Level Security (RLS) & Policies
-- ========================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.countries enable row level security;
alter table public.cities enable row level security;
alter table public.cafes enable row level security;
alter table public.comments enable row level security;

-- Admin helper check function to reduce redundancy in policies
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- 1. Profiles Policies
create policy "Allow public read access to profiles"
  on public.profiles for select using (true);

create policy "Allow users to update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- 2. Countries Policies
create policy "Allow public read access to countries" 
  on public.countries for select using (true);

create policy "Allow admin write access to countries" 
  on public.countries for all using (public.is_admin());

-- 3. Cities Policies
create policy "Allow public read access to cities" 
  on public.cities for select using (true);

create policy "Allow admin write access to cities" 
  on public.cities for all using (public.is_admin());

-- 4. Cafes Policies
create policy "Allow public read access to cafes" 
  on public.cafes for select using (true);

create policy "Allow admin write access to cafes" 
  on public.cafes for all using (public.is_admin());

-- 5. Comments Policies
create policy "Allow public read access to comments"
  on public.comments for select using (true);

create policy "Allow anyone to insert comments"
  on public.comments for insert with check (true);