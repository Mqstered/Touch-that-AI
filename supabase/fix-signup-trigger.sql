-- ============================================================
-- TOUCH THAT AI — Fix Signup Trigger Issue
-- ============================================================
-- Problem: New user signup fails with "Database error saving new user"
-- Root Cause: Missing INSERT policy on user_profiles table
-- Solution: Add INSERT policy and ensure trigger works correctly
-- ============================================================

-- 1. ADD MISSING INSERT POLICY for user_profiles
-- This allows the trigger (and any future direct inserts) to create profiles
create policy "users can insert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

-- 2. VERIFY TRIGGER FUNCTION EXISTS and is correct
-- This is the same function from schema.sql but included for completeness
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.user_profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'display_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 3. ENSURE TRIGGER IS PROPERLY ATTACHED
-- Drop and recreate to ensure it's working
drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();

-- 4. CLEANUP ANY ORPHANED AUTH USERS (optional)
-- Find auth users without profiles (these failed signups)
-- Uncomment if you want to see them:
-- 
-- SELECT 
--   u.id, 
--   u.email, 
--   u.created_at,
--   CASE WHEN p.id IS NULL THEN 'NO PROFILE' ELSE 'HAS PROFILE' END as status
-- FROM auth.users u
-- LEFT JOIN public.user_profiles p ON u.id = p.id
-- WHERE u.created_at > NOW() - INTERVAL '7 days'
-- ORDER BY u.created_at DESC;

-- 5. TEST VERIFICATION QUERIES
-- After running this, you can verify with:
-- 
-- -- Check trigger exists:
-- SELECT trigger_name, event_manipulation, action_timing 
-- FROM information_schema.triggers 
-- WHERE trigger_name = 'trg_on_auth_user_created';
--
-- -- Check policy exists:
-- SELECT policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'user_profiles';
