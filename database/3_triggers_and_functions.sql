-- Trigger function to automatically insert a profile when a new user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    false -- Safely defaults to non-admin
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach the trigger to the auth.users table
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Utility function to allow a user to delete their own account
CREATE OR REPLACE FUNCTION public.delete_current_user()
RETURNS VOID AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to prevent users from escalating their own privileges
CREATE OR REPLACE FUNCTION public.prevent_self_privilege_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    ) THEN
      RAISE EXCEPTION 'Only administrators can modify the is_admin flag.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to public.profiles table
CREATE OR REPLACE TRIGGER tr_prevent_self_privilege_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_privilege_escalation();

-- Trigger function to automatically ensure profile exists when a cafe is inserted/updated
CREATE OR REPLACE FUNCTION public.ensure_profile_exists()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NOT NULL THEN
    INSERT INTO public.profiles (id, full_name, is_admin)
    SELECT 
      NEW.created_by,
      COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1), 'Member'),
      false
    FROM auth.users
    WHERE id = NEW.created_by
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to public.cafes table
CREATE OR REPLACE TRIGGER tr_ensure_profile_exists
  BEFORE INSERT OR UPDATE ON public.cafes
  FOR EACH ROW EXECUTE FUNCTION public.ensure_profile_exists();
