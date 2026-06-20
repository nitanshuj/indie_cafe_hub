# Indie Coffee Hub Database Schema

This document details the database schema configuration for Supabase / PostgreSQL. The complete setup script is available in [queries_1.sql](file:///c:/Products-Projects/Indie-Cafe-Hub-Website/indie_cafe_hub/database/queries_1.sql).

---

## 1. Tables

### 1.1. `profiles`
Extends the core Supabase `auth.users` table with application-specific details.
* **Columns:**
  * `id` (`uuid`, Primary Key): Reference to `auth.users(id)` on delete cascade.
  * `full_name` (`text`): User's profile name.
  * `avatar_url` (`text`): User's profile avatar media link.
  * `is_admin` (`boolean`, Default: `false`): Sets administrator status.
  * `created_at` (`timestamp with time zone`, Default: `now()`).
  * `updated_at` (`timestamp with time zone`, Default: `now()`).

### 1.2. `countries`
* **Columns:**
  * `id` (`uuid`, Primary Key, Default: `gen_random_uuid()`).
  * `name` (`text`, Unique, Not Null): Country name (e.g. `India`).
  * `code` (`text`, Unique, Not Null): ISO code (e.g. `IN`).
  * `created_at` (`timestamp with time zone`, Default: `now()`).

### 1.3. `cities`
* **Columns:**
  * `id` (`uuid`, Primary Key, Default: `gen_random_uuid()`).
  * `name` (`text`, Not Null): City name (e.g. `Bengaluru`).
  * `slug` (`text`, Unique, Not Null): URL-friendly string identifier (e.g. `bengaluru`).
  * `country_id` (`uuid`, Foreign Key): Reference to `countries(id)` on delete cascade.
  * `created_at` (`timestamp with time zone`, Default: `now()`).
  * **Constraints:** Unique index on combination of `(country_id, name)`.

### 1.4. `cafes`
Main registry containing cafe details, nomad amenities, and city relationships.
* **Columns:**
  * `id` (`uuid`, Primary Key, Default: `gen_random_uuid()`).
  * `name` (`text`, Not Null): Cafe name.
  * `slug` (`text`, Unique, Not Null): URL identifier (e.g. `the-daily-roast-indiranagar`).
  * `description` (`text`): Description.
  * `neighborhood` (`text`, Not Null): Neighborhood name.
  * `address` (`text`, Not Null): Full street address.
  * `google_maps_url` (`text`): Google Maps URL.
  * `has_wifi` (`boolean`, Default: `false`).
  * `has_plug_points` (`boolean`, Default: `false`).
  * `has_ac` (`boolean`, Default: `false`).
  * `is_pet_friendly` (`boolean`, Default: `false`).
  * `hero_image_url` (`text`, Not Null): Cover photo URL.
  * `gallery_image_urls` (`text[]`, Default: `{}`): Gallery image URLs.
  * `opening_hours` (`jsonb`): JSON structured timing details.
  * `specialty_focus` (`text`): Manual filters, manual roast styles, etc.
  * `noise_level` (`text`): Must be one of `('quiet', 'moderate', 'bustling')`.
  * `city_id` (`uuid`, Foreign Key): Reference to `cities(id)` on delete set null.
  * `created_at` (`timestamp with time zone`, Default: `now()`).
  * `updated_at` (`timestamp with time zone`, Default: `now()`).

### 1.5. `comments`
* **Columns:**
  * `id` (`uuid`, Primary Key, Default: `gen_random_uuid()`).
  * `cafe_id` (`uuid`, Foreign Key): Reference to `cafes(id)` on delete cascade.
  * `author_id` (`uuid`, Foreign Key): Reference to `auth.users(id)` on delete set null.
  * `author_name` (`text`, Not Null).
  * `content` (`text`, Not Null).
  * `is_guest` (`boolean`, Default: `true`).
  * `created_at` (`timestamp with time zone`, Default: `now()`).

---

## 2. Row Level Security (RLS) Policies

All tables have RLS enabled. Admin checks are validated using helper function `public.is_admin()` which verifies `is_admin = true` on `public.profiles`.

| Table | Policy Name | Command | Criteria |
| :--- | :--- | :---: | :--- |
| `profiles` | "Allow public read access to profiles" | `SELECT` | `true` |
| `profiles` | "Allow users to update their own profile" | `UPDATE` | `auth.uid() = id` |
| `countries` | "Allow public read access to countries" | `SELECT` | `true` |
| `countries` | "Allow admin write access to countries" | `ALL` | `public.is_admin()` |
| `cities` | "Allow public read access to cities" | `SELECT` | `true` |
| `cities` | "Allow admin write access to cities" | `ALL` | `public.is_admin()` |
| `cafes` | "Allow public read access to cafes" | `SELECT` | `true` |
| `cafes` | "Allow admin write access to cafes" | `ALL` | `public.is_admin()` |
| `comments` | "Allow public read access to comments" | `SELECT` | `true` |
| `comments` | "Allow anyone to insert comments" | `INSERT` | `true` |

---

## 3. Triggers and Procedures

### 3.1. User Registration Trigger (`on_auth_user_created`)
* **Function:** `public.handle_new_user()`
* **Mechanism:** Fired `AFTER INSERT` on `auth.users`. Automatically synchronizes a profile record in `public.profiles`.

---

## 4. Indexes

* `cafes_neighborhood_idx` on `public.cafes(neighborhood)`
* `cafes_city_id_idx` on `public.cafes(city_id)`
* `cafes_has_wifi_idx` on `public.cafes(has_wifi)` where `has_wifi = true`
* `cities_slug_idx` on `public.cities(slug)`
* `comments_cafe_id_idx` on `public.comments(cafe_id)`
