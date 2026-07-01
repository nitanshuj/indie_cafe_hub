-- Enable UUID extension for secure, unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the approval status ENUM
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');

-- ==========================================
-- 1. PROFILES TABLE
-- ==========================================
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text NULL,
  avatar_url text NULL,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone ('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone ('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- ==========================================
-- 2. COUNTRIES TABLE
-- ==========================================
CREATE TABLE public.countries (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  name text NOT NULL,
  code text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone ('utc'::text, now()),
  CONSTRAINT countries_pkey PRIMARY KEY (id),
  CONSTRAINT countries_code_key UNIQUE (code),
  CONSTRAINT countries_name_key UNIQUE (name)
) TABLESPACE pg_default;

-- ==========================================
-- 3. CITIES TABLE
-- ==========================================
CREATE TABLE public.cities (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  name text NOT NULL,
  slug text NOT NULL,
  country_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone ('utc'::text, now()),
  CONSTRAINT cities_pkey PRIMARY KEY (id),
  CONSTRAINT cities_country_id_name_key UNIQUE (country_id, name),
  CONSTRAINT cities_slug_key UNIQUE (slug),
  CONSTRAINT cities_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- ==========================================
-- 4. CAFES TABLE
-- ==========================================
CREATE TABLE public.cafes (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  name text NOT NULL,
  slug text NOT NULL,
  description text NULL,
  neighborhood text NOT NULL,
  address text NOT NULL,
  google_maps_url text NULL,
  has_wifi boolean NOT NULL DEFAULT false,
  has_plug_points boolean NOT NULL DEFAULT false,
  has_ac boolean NOT NULL DEFAULT false,
  is_pet_friendly boolean NOT NULL DEFAULT false,
  hero_image_url text NULL,
  gallery_image_urls text[] NULL DEFAULT '{}'::text[],
  opening_hours jsonb NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone ('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone ('utc'::text, now()),
  city_id uuid NULL,
  specialty_focus text NULL,
  noise_level text NULL,
  created_by uuid NULL,
  is_featured boolean NOT NULL DEFAULT false,
  status public.approval_status NOT NULL DEFAULT 'pending',
  CONSTRAINT cafes_pkey PRIMARY KEY (id),
  CONSTRAINT cafes_slug_key UNIQUE (slug),
  CONSTRAINT cafes_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities (id) ON DELETE SET NULL,
  CONSTRAINT cafes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT cafes_noise_level_check CHECK (
    (
      noise_level = ANY (
        ARRAY['quiet'::text, 'moderate'::text, 'bustling'::text]
      )
    )
  )
) TABLESPACE pg_default;

-- ==========================================
-- 5. COMMENTS TABLE
-- ==========================================
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  cafe_id uuid NOT NULL,
  author_id uuid NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  is_guest boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone ('utc'::text, now()),
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT comments_cafe_id_fkey FOREIGN KEY (cafe_id) REFERENCES public.cafes (id) ON DELETE CASCADE,
  CONSTRAINT chk_comment_author CHECK (
    (
      (is_guest = false AND author_id IS NOT NULL) OR 
      (is_guest = true AND author_id IS NULL)
    )
  )
) TABLESPACE pg_default;

-- ==========================================
-- INDEX OPTIMIZATION
-- ==========================================
CREATE INDEX IF NOT EXISTS cafes_neighborhood_idx ON public.cafes USING btree (neighborhood) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS cafes_has_wifi_idx ON public.cafes USING btree (has_wifi) TABLESPACE pg_default WHERE (has_wifi = true);
CREATE INDEX IF NOT EXISTS cafes_status_idx ON public.cafes USING btree (status) TABLESPACE pg_default;

-- ==========================================
-- SEED DATA
-- ==========================================
INSERT INTO public.countries (name, code)
VALUES 
    ('India', 'IN'),
    ('USA', 'US')
ON CONFLICT (name) DO UPDATE SET code = EXCLUDED.code;

INSERT INTO public.cities (name, slug, country_id)
VALUES
    ('Bengaluru', 'bengaluru', (SELECT id FROM public.countries WHERE code = 'IN')),
    ('Haldwani', 'haldwani', (SELECT id FROM public.countries WHERE code = 'IN')),
    ('Seattle, WA', 'seattle', (SELECT id FROM public.countries WHERE code = 'US')),
    ('San Jose, CA', 'san-jose', (SELECT id FROM public.countries WHERE code = 'US')),
    ('San Francisco, CA', 'san-francisco', (SELECT id FROM public.countries WHERE code = 'US')),
    ('Bloomington, IN', 'bloomington', (SELECT id FROM public.countries WHERE code = 'US'))
ON CONFLICT (slug) DO NOTHING;