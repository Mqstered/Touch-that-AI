# Supabase Signup Fix — Testing Guide

## Problem Summary
- **Issue**: New user signup fails with "Database error saving new user"
- **Root Cause**: Missing INSERT RLS policy on `user_profiles` table
- **Impact**: Existing users can log in, but new signups fail

## Fix Applied
1. Added missing INSERT policy: `"users can insert own profile"`
2. Verified trigger function `handle_new_user()` is correct
3. Updated main `schema.sql` to prevent regression

## How to Apply the Fix

### Step 1: Apply the Fix
Run this in Supabase Dashboard → SQL Editor:
```sql
-- Run the fix script
-- (Copy contents of supabase/fix-signup-trigger.sql)
```

### Step 2: Verify the Fix
```sql
-- Check the new policy exists
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'user_profiles' AND cmd = 'INSERT';

-- Check trigger exists
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_name = 'trg_on_auth_user_created';
```

## Testing the Signup Flow

### 1. Test New User Signup
1. Clear app data or use incognito browser
2. Sign up with a **new email** that hasn't been used before
3. Expected: Success → User redirected to onboarding/home
4. If still failing, check Supabase Dashboard → Logs → Auth

### 2. Verify Profile Creation
After successful signup, run:
```sql
-- Check if profile was created
SELECT id, email, display_name, created_at 
FROM user_profiles 
WHERE email = 'your-test-email@example.com';
```

### 3. Check for Orphaned Users
Run the orphaned users script:
```sql
-- (Copy contents of supabase/check-orphaned-users.sql)
```

## Expected Behavior After Fix

✅ **New user signs up** → `auth.users` row created → Trigger fires → `user_profiles` row created → User logged in

✅ **Existing user logs in** → Works as before (no change)

✅ **Profile updates** → Works as before (no change)

## Troubleshooting

### If signup still fails:
1. **Check Auth Logs**: Supabase Dashboard → Logs → Auth
2. **Check Database Logs**: Supabase Dashboard → Logs → Database  
3. **Verify trigger**: Run the verification queries above
4. **Check RLS**: Ensure all policies exist

### Common Issues:
- **Email already exists**: Use a truly new email address
- **Network issues**: Check your `.env` Supabase URL/keys
- **CORS issues**: Ensure your app domain is in Supabase settings

## Cleanup (Optional)

If you have orphaned users from before the fix:
```sql
-- Manually create profiles for orphaned users
INSERT INTO user_profiles (id, email, display_name)
SELECT u.id, u.email, u.raw_user_meta_data ->> 'display_name'
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE p.id IS NULL
AND u.created_at > NOW() - INTERVAL '7 days';  -- Adjust as needed
```

## Architecture Notes

- **Trigger**: `handle_new_user()` runs with `security definer` (bypasses RLS)
- **Policy**: INSERT policy allows the trigger to work and future direct inserts
- **No changes needed** to your React Native auth code
- **Preserves existing** auth flow and user experience
