-- ============================================================
-- TOUCH THAT AI — Check for Orphaned Users
-- ============================================================
-- This script helps identify users who signed up but whose
-- profiles failed to create due to the missing INSERT policy.
-- ============================================================

-- 1. FIND AUTH USERS WITHOUT PROFILES (failed signups)
SELECT 
  u.id, 
  u.email, 
  u.created_at as auth_created_at,
  u.email_confirmed_at,
  u.last_sign_in_at,
  CASE 
    WHEN p.id IS NULL THEN 'FAILED - NO PROFILE' 
    ELSE 'OK - HAS PROFILE' 
  END as status,
  p.created_at as profile_created_at
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE u.created_at > NOW() - INTERVAL '30 days'  -- Adjust timeframe as needed
ORDER BY u.created_at DESC;

-- 2. COUNT OF FAILED VS SUCCESSFUL SIGNUPS
SELECT 
  CASE 
    WHEN p.id IS NULL THEN 'Failed Signups (No Profile)' 
    ELSE 'Successful Signups (Has Profile)' 
  END as signup_status,
  COUNT(*) as count,
  MIN(u.created_at) as earliest,
  MAX(u.created_at) as latest
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE u.created_at > NOW() - INTERVAL '30 days'
GROUP BY signup_status
ORDER BY count DESC;

-- 3. CHECK IF TRIGGER IS WORKING FOR NEW SIGNUPS
-- Run this after testing a new signup to verify the trigger fired
-- 
-- SELECT 
--   u.id,
--   u.email,
--   u.created_at as auth_time,
--   p.created_at as profile_time,
--   EXTRACT(MILLISECONDS FROM (p.created_at - u.created_at)) as delay_ms
-- FROM auth.users u
-- JOIN public.user_profiles p ON u.id = p.id
-- WHERE u.created_at > NOW() - INTERVAL '1 hour'
-- ORDER BY u.created_at DESC;
