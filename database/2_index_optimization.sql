-- ========================================================
-- Indexes Optimization
-- ========================================================
create index cafes_neighborhood_idx on public.cafes(neighborhood);
create index cafes_city_id_idx on public.cafes(city_id);
create index cafes_has_wifi_idx on public.cafes(has_wifi) where has_wifi = true;
create index cities_slug_idx on public.cities(slug);
create index comments_cafe_id_idx on public.comments(cafe_id);