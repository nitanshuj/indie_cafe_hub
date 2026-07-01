-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- PROFILES POLICIES
-- ==========================================
CREATE POLICY "Allow public read access to profiles"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- COUNTRIES & CITIES POLICIES
-- ==========================================
CREATE POLICY "Allow public read access to countries" 
  ON public.countries FOR SELECT USING (true);

CREATE POLICY "Allow admin changes to countries" 
  ON public.countries FOR ALL USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "Allow public read access to cities" 
  ON public.cities FOR SELECT USING (true);

CREATE POLICY "Allow admin changes to cities" 
  ON public.cities FOR ALL USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "Members can insert cities" 
  ON public.cities FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- ==========================================
-- CAFES POLICIES
-- ==========================================
CREATE POLICY "Public can view approved cafes" 
  ON public.cafes FOR SELECT USING (status = 'approved');

CREATE POLICY "Admins can view all cafes" 
  ON public.cafes FOR SELECT USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "Users can view their own submissions"
  ON public.cafes FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Members can submit pending cafes" 
  ON public.cafes FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND status = 'pending' AND created_by = auth.uid()
  );

CREATE POLICY "Only admins can update cafes" 
  ON public.cafes FOR UPDATE USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "Users can update their own submissions"
  ON public.cafes FOR UPDATE USING (auth.uid() = created_by)
  WITH CHECK (status = 'pending' AND created_by = auth.uid());

CREATE POLICY "Allow admin delete access to cafes" 
  ON public.cafes FOR DELETE USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- ==========================================
-- COMMENTS POLICIES
-- ==========================================
CREATE POLICY "Public can view comments" 
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Anyone can insert comments" 
  ON public.comments FOR INSERT WITH CHECK (
    (is_guest = true AND author_id IS NULL) OR 
    (is_guest = false AND author_id = auth.uid())
  );

CREATE POLICY "Authors and admins can delete comments" 
  ON public.comments FOR DELETE USING (
    auth.uid() = author_id OR 
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );