# Practice tracking, Prompt Lab, and playground fixes

## Issue 1: Same practice task every time

### What was wrong

- Opening a **module** without a `lessonId` always started at **lesson 1** in the carousel.
- The module **Practice** button only bumped local mastery — it did not open a real lesson practice.
- Practice screen did not show **which lesson** you were on, so different tasks were easy to miss.

### What we fixed

| Change | Effect |
|--------|--------|
| `fetchNextPracticeLesson()` | Picks the first lesson in a module you have not scored ≥ 80 on yet |
| Module **Practice** button | Goes directly to `/lesson/practice` for that next lesson |
| **Lesson screen** without `lessonId` | Jumps to your next incomplete lesson when signed in |
| **Practice screen** | Shows lesson **title**, module, skill, level |
| **Score screen** | Shows lesson title |
| Resets text input when `lessonId` changes | New task when you switch lessons |

### How to verify tracking works

1. Sign in.
2. Complete practice for **Adding Context** (note the task text).
3. Back to Explore → open same module → **Practice** again.
4. You should get the **next** lesson’s task (or repeat if score was low).
5. In Supabase:

```sql
select l.title, pa.score, pa.score_breakdown, pa.completed_at
from practice_attempts pa
join lessons l on l.id = pa.lesson_id
where pa.user_id = '<your-uuid>'
order by pa.completed_at desc;
```

Each row should have a **different** `lesson_id` and `score_breakdown` JSON as you progress.

---

## Issue 2: Playground “Could not reach the AI service”

### Likely causes

1. **`playground-complete` not deployed** (only `learning-path-insight` was deployed in your terminal log).
2. **`GEMINI_API_KEY` not set** in Supabase Edge Function secrets.
3. Gemini model/API error (now handled with **fallback models**).

### Fix — run these commands

```bash
supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here
supabase functions deploy playground-complete
supabase functions deploy enhance-feedback
supabase functions deploy learning-path-insight
```

### Code improvements

- Shared [`supabase/functions/_shared/gemini.ts`](../supabase/functions/_shared/gemini.ts) tries `gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-2.5-flash`.
- Errors now return a **clear message** (missing secret vs API failure) instead of a generic line only.

---

## Issue 3: Prompt Lab (replaces basic playground)

### What makes it different

**Prompt Lab — A/B Compare** is not a single chat box. It:

1. Shows **weak** and **strong** prompts side by side.
2. Runs **both** through Gemini in one tap (**Compare with AI**).
3. Displays **two answers** so users see quality difference visually.
4. Shows a **live rubric score** (0–10) on the strong prompt as they type — same rules as real practice.

This ties the playground to what the app teaches: structure matters.

### Where to find it

Explore → scroll to **Prompt Lab — A/B Compare**.

### How to test

1. Deploy `playground-complete` (see above).
2. Tap **Compare with AI**.
3. Weak column should be vaguer; strong column more useful.
4. Edit the strong prompt — watch **Live prompt score** change.

---

## Quick test checklist

- [ ] Different lesson titles on practice after multiple modules/lessons  
- [ ] `practice_attempts` rows differ by `lesson_id` in Supabase  
- [ ] Prompt Lab compare returns two columns of text  
- [ ] Score breakdown updates per attempt  
