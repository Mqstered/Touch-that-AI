# Supabase Integration — Testing Guide

## 1. Apply schema and seed data

Run these two files **in order** in Supabase Dashboard → SQL Editor:

```
1. supabase/schema.sql   ← tables, indexes, RLS, triggers
2. supabase/seed.sql     ← 15 lessons across 4 modules
```

Verify in **Table Editor**:
- `lessons` → should have 15 rows
- `user_profiles`, `practice_attempts`, `user_progress`, `lesson_recommendations` → empty (correct)

---

## 2. Verify data is saving correctly

### After completing a practice attempt in the app:

**Check `practice_attempts`:**
```sql
select id, user_id, lesson_id, score, feedback, completed_at
from practice_attempts
order by completed_at desc
limit 5;
```
Expected: one new row with your user UUID, the lesson UUID, a score 0–100, and non-null `completed_at`.

**Check `user_progress` (auto-updated by trigger):**
```sql
select user_id, module_slug, mastery, completed_lessons, last_practiced_at
from user_progress
order by last_practiced_at desc;
```
Expected: one row per module you have practised, with `mastery` = average score across all your attempts in that module (0–100).

---

## 3. Inspect tables via SQL Editor

**All lessons for a module:**
```sql
select id, title, level, skill, sort_order
from lessons
where module_slug = 'prompt-design'
order by sort_order;
```

**A user's full progress summary:**
```sql
select module_slug, mastery, completed_lessons, last_practiced_at
from user_progress
where user_id = '<paste-your-user-uuid-here>';
```

**Find your user UUID:**
```sql
select id, email, created_at
from auth.users
order by created_at desc
limit 5;
```

---

## 4. Test RLS policies

### Test that users cannot read each other's data

Open two browser tabs. Sign in as two different users (User A and User B).

**SQL Editor — run as User A (service role — from Dashboard):**
```sql
-- This bypasses RLS (service role). Use only to confirm data exists.
select * from practice_attempts where user_id = '<user-b-uuid>';
```
Expected: rows visible (service role bypasses RLS — this is expected).

**From the app (RLS enforced):**
The app's Supabase client uses the anon key + JWT, so RLS is active.
User A will only ever see their own `practice_attempts`, `user_progress`, and `lesson_recommendations`.

**Quick RLS sanity check via SQL Editor using `set role`:**
```sql
-- Simulate querying as User A
set request.jwt.claims to '{"sub": "<user-a-uuid>", "role": "authenticated"}';
select * from practice_attempts;
-- Should only return User A's rows
```

---

## 5. Test authenticated queries from the app

### Confirm the session is active
In `src/features/auth/screens/SignInScreen.tsx`, after sign-in succeeds,
add a temporary `console.log` to print `state.session.user.id`.
This UUID should match what you see in `auth.users`.

### Confirm lesson fetch works
In `LessonScreen`, `fetchLessonsForModule` is called with the module slug.
Open the Expo logs while navigating to a module — add:
```ts
console.log('[lessons]', result);
```
Expected: `{ ok: true, data: [...] }` with lesson rows from Supabase.

### Confirm practice save works
After submitting a practice attempt, check `practice_attempts` in the Dashboard.
The row should appear within 1–2 seconds. If it doesn't:
- Check the Supabase project logs (Dashboard → Logs → API)
- Confirm your `.env` `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are correct

---

## 6. Verify the DB trigger fires

After a practice attempt is saved, the trigger `trg_update_progress_after_attempt`
should automatically upsert `user_progress`.

```sql
-- Check trigger exists
select trigger_name, event_manipulation, action_timing
from information_schema.triggers
where trigger_name = 'trg_update_progress_after_attempt';

-- Check trigger function
select prosrc
from pg_proc
where proname = 'update_user_progress_on_attempt';
```

If `user_progress` is NOT updating after a practice attempt:
1. Confirm `completed_at` is non-null in the `practice_attempts` row (trigger only fires when `completed_at IS NOT NULL`)
2. Confirm `score` is non-null
3. Re-run `schema.sql` to recreate the trigger if it was accidentally dropped

---

## 7. Seed lesson_recommendations manually (for testing)

The recommendations table is populated by server-side logic (future Edge Function).
For now, insert test rows manually:

```sql
-- Replace with real UUIDs from your lessons table
insert into lesson_recommendations (user_id, lesson_id, reason, priority)
values
  ('<your-user-uuid>', '<lesson-uuid-1>', 'You haven''t tried this skill yet.', 0),
  ('<your-user-uuid>', '<lesson-uuid-2>', 'Low mastery in this area.', 1);
```

Then reload the Explore screen in the app — the Recommended section should show these lessons.

---

## 8. Common issues

| Symptom | Likely cause | Fix |
|---|---|---|
| `lessons` table returns empty array | `.env` not set / wrong project URL | Check `.env` values match Dashboard → Settings → API |
| `practice_attempts` insert fails | RLS policy missing for insert | Re-run `schema.sql` — the insert policy should be present |
| `user_progress` not updating | `completed_at` is null in the attempt | Ensure `PracticeScreen` sets `completed_at` on submit |
| Auth redirects on every screen | Session not persisting | Check `expo-sqlite/localStorage/install` is imported in `supabase.ts` |
| TypeScript errors on `.from()` | Missing `Relationships: []` in `database.ts` | Already fixed — all tables have `Relationships: []` |
