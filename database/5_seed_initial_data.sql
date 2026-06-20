






-- ========================================================
-- Seed Initial Data
-- ========================================================

-- Seed Countries
insert into public.countries (name, code)
values 
    ('India', 'IN'),
    ('USA', 'US')
on conflict (name) do update set code = excluded.code;

-- Seed Cities
insert into public.cities (name, slug, country_id)
values
    ('Bengaluru', 'bengaluru', (select id from public.countries where code = 'IN')),
    ('Haldwani', 'haldwani', (select id from public.countries where code = 'IN')),
    ('Seattle, WA', 'seattle', (select id from public.countries where code = 'US')),
    ('San Jose, CA', 'san-jose', (select id from public.countries where code = 'US')),
    ('San Francisco, CA', 'san-francisco', (select id from public.countries where code = 'US')),
    ('Bloomington, IN', 'bloomington', (select id from public.countries where code = 'US'))
on conflict (slug) do nothing;

-- Seed Cafes
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
    specialty_focus,
    noise_level,
    city_id
) values 
(
    'The Daily Roast',
    'the-daily-roast-indiranagar',
    'A sun-drenched sanctuary for remote workers and specialty coffee purists. Features artisanal pour-overs and ergonomic seating.',
    'Indiranagar',
    '12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, 560038',
    true,
    true,
    true,
    true,
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814',
    array['https://images.unsplash.com/photo-1613274554329-70f997f5789f', 'https://images.unsplash.com/photo-1583354608715-177553a4035e'],
    '{"weekday": "8:00 AM - 10:00 PM", "weekend": "9:00 AM - 11:00 PM"}'::jsonb,
    'Pour-overs & single origins',
    'quiet',
    (select id from public.cities where slug = 'bengaluru')
),
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
    'https://images.unsplash.com/photo-1613274554329-70f997f5789f',
    array['https://images.unsplash.com/photo-1495862433577-132cf20d7902'],
    '{"weekday": "7:00 AM - 11:00 PM", "weekend": "7:00 AM - 12:00 AM"}'::jsonb,
    'Espresso blends & cold brews',
    'moderate',
    (select id from public.cities where slug = 'bengaluru')
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
    'https://images.unsplash.com/photo-1583354608715-177553a4035e',
    array['https://images.unsplash.com/photo-1484788984921-03950022c9ef'],
    '{"weekday": "9:00 AM - 9:30 PM", "weekend": "8:30 AM - 10:00 PM"}'::jsonb,
    'Manual filter coffee & pastries',
    'quiet',
    (select id from public.cities where slug = 'bengaluru')
)
on conflict (slug) do nothing;
