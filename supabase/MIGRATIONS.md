# Supabase migrations — apply in order

Run each file in **Supabase Dashboard → SQL Editor** (or via Supabase CLI):

| Order | File | Purpose |
|-------|------|---------|
| 1 | `schema.sql` | Base tables (if starting fresh) |
| 2 | `seed.sql` | Lesson content |
| 3 | `migrations/001_ai_ml_foundation.sql` | Embeddings tables, score_breakdown, review_due_at |
| 4 | `migrations/002_rag_and_recommendations.sql` | `match_lessons` RPC, recommendation trigger |
| 5 | `migrations/003_goal_keys_and_extra_lessons.sql` | goal_key column, extra lessons, metadata fallback |

Then generate embeddings locally:

```bash
pip install -r scripts/requirements-embeddings.txt
# Add SUPABASE_SERVICE_ROLE_KEY to .env
python scripts/embed_lessons.py
```

Deploy Edge Functions (requires [Supabase CLI](https://supabase.com/docs/guides/cli)):

```bash
supabase secrets set GEMINI_API_KEY=your-key
supabase functions deploy enhance-feedback
supabase functions deploy playground-complete
```

Verify:

```sql
select count(*) from lesson_embeddings;
select count(*) from learning_profiles;
select * from match_lessons('study', 'beginner', 'prompting', 1);
```
