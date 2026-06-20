-- ========================================================
-- Consolidated Database Schema & Seeding Script (Indie Coffee Hub)
-- ========================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";

-- 2. Drop existing triggers and tables to ensure clean installation (in correct dependency order)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;

drop table if exists public.comments cascade;
drop table if exists public.cafes cascade;
drop table if exists public.cities cascade;
drop table if exists public.countries cascade;
drop table if exists public.profiles cascade;

-- ========================================================
-- Tables Creation
-- ========================================================

-- 1. Profiles Table (Extends Supabase Auth users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    avatar_url text,
    is_admin boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Countries Table
create table public.countries (
    id uuid default gen_random_uuid() primary key,
    name text not null unique,
    code text not null unique, -- ISO code, e.g., 'IN', 'US'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Cities Table
create table public.cities (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    country_id uuid references public.countries(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (country_id, name)
);

-- 4. Cafes Table (with nomad amenities and city relationship)
create table public.cafes (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    description text,
    neighborhood text not null,
    address text not null,
    google_maps_url text,
    
    -- Amenities
    has_wifi boolean default false not null,
    has_plug_points boolean default false not null,
    has_ac boolean default false not null,
    is_pet_friendly boolean default false not null,
    
    -- Media (Cloudinary URLs)
    hero_image_url text not null,
    gallery_image_urls text[] default '{}'::text[],
    
    -- Operational & Nomad details
    opening_hours jsonb,
    specialty_focus text,
    noise_level text check (noise_level in ('quiet', 'moderate', 'bustling')),
    
    -- Relations
    city_id uuid references public.cities(id) on delete set null,
    
    -- Metadata
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Comments Table
create table public.comments (
    id uuid default gen_random_uuid() primary key,
    cafe_id uuid references public.cafes(id) on delete cascade not null,
    author_id uuid references auth.users(id) on delete set null,
    author_name text not null,
    content text not null,
    is_guest boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
