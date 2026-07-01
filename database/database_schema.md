# Database Schema

## ENUM Types
*   **`approval_status`**: `('pending', 'approved', 'rejected')`

## Tables

### 1. `profiles`
Stores extended user data linking to Supabase's internal `auth.users` table.
*   **`id`** *(uuid, PK)*: References `auth.users(id)`. Cascade delete.
*   **`full_name`** *(text, null)*: User's display name.
*   **`avatar_url`** *(text, null)*: Profile image URL.
*   **`is_admin`** *(boolean)*: RBAC flag. Defaults to `false`.
*   **`created_at`** *(timestamptz)*
*   **`updated_at`** *(timestamptz)*

### 2. `countries`
Lookup table for global countries.
*   **`id`** *(uuid, PK)*
*   **`name`** *(text)*: Unique country name.
*   **`code`** *(text)*: Unique ISO code (e.g., 'IN', 'US').
*   **`created_at`** *(timestamptz)*

### 3. `cities`
Lookup table for cities linked to a specific country.
*   **`id`** *(uuid, PK)*
*   **`name`** *(text)*: City name.
*   **`slug`** *(text)*: Unique URL-friendly slug.
*   **`country_id`** *(uuid, FK)*: References `countries(id)`. Cascade delete.
*   **`created_at`** *(timestamptz)*
*   *Note: Unique constraint on (`country_id`, `name`).*

### 4. `cafes`
The core entity storing all cafe-related data and workflow state.
*   **`id`** *(uuid, PK)*
*   **`name`** *(text)*
*   **`slug`** *(text, Unique)*
*   **`description`** *(text, null)*
*   **`neighborhood`** *(text)*: (Indexed for filtering)
*   **`address`** *(text)*
*   **`google_maps_url`** *(text, null)*
*   **`has_wifi`** *(boolean)*: (Indexed where true)
*   **`has_plug_points`** *(boolean)*
*   **`has_ac`** *(boolean)*
*   **`is_pet_friendly`** *(boolean)*
*   **`hero_image_url`** *(text, null)*
*   **`gallery_image_urls`** *(text[])*
*   **`opening_hours`** *(jsonb, null)*
*   **`city_id`** *(uuid, FK, null)*: References `cities(id)`.
*   **`specialty_focus`** *(text, null)*
*   **`noise_level`** *(text, null)*: Checks for `quiet`, `moderate`, `bustling`.
*   **`created_by`** *(uuid, FK, null)*: References `profiles(id)`.
*   **`is_featured`** *(boolean)*
*   **`status`** *(approval_status)*: Draft/Publish workflow. Defaults to `pending`. (Indexed)
*   **`created_at`** *(timestamptz)*
*   **`updated_at`** *(timestamptz)*

### 5. `comments`
Stores both authenticated and unauthenticated reviews/comments.
*   **`id`** *(uuid, PK)*
*   **`cafe_id`** *(uuid, FK)*: References `cafes(id)`. Cascade delete.
*   **`author_id`** *(uuid, FK, null)*: References `auth.users(id)`.
*   **`author_name`** *(text)*: Fallback display name or guest name.
*   **`content`** *(text)*
*   **`is_guest`** *(boolean)*: Defaults to `true`.
*   **`created_at`** *(timestamptz)*
*   *Note: Constraint enforces that if `is_guest` is true, `author_id` must be null, and vice versa.*