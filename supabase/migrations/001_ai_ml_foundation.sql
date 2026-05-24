-- ============================================================
-- Phase 0: AI/ML foundation tables and columns
-- Run in Supabase SQL Editor after schema.sql (or on existing project)
-- ============================================================

create extension if not exists "vector";

-- Per-lesson embeddings (MiniLM-L6-v2 = 384 dimensions)
create table if not exists lesson_embeddings (
  id          uuid primary key default uuid_generate_v4(),
  lesson_id   uuid not null references lessons (id) on delete cascade,
  content     text not null,
  embedding   vector(384) not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint lesson_embeddings_lesson_unique unique (lesson_id)
);

comment on table lesson_embeddings is
  'Semantic embeddings for RAG lesson retrieval (all-MiniLM-L6-v2, 384-dim).';

create index if not exists idx_lesson_embeddings_lesson_id
  on lesson_embeddings (lesson_id);

-- HNSW index for fast cosine similarity search
create index if not exists idx_lesson_embeddings_vector
  on lesson_embeddings using hnsw (embedding vector_cosine_ops);

-- Precomputed search profiles (goal + level + skill → query embedding)
create table if not exists learning_profiles (
  id          uuid primary key default uuid_generate_v4(),
  profile_key text not null unique,
  goal        text not null,
  level       lesson_level not null default 'beginner',
  skill       skill_type not null,
  query_text  text not null,
  embedding   vector(384) not null,
  created_at  timestamptz not null default now()
);

comment on table learning_profiles is
  'Precomputed query embeddings for zero-cost RAG retrieval at runtime.';

create index if not exists idx_learning_profiles_lookup
  on learning_profiles (goal, level, skill);

create index if not exists idx_learning_profiles_vector
  on learning_profiles using hnsw (embedding vector_cosine_ops);

-- Richer practice analytics
alter table practice_attempts
  add column if not exists score_breakdown jsonb;

comment on column practice_attempts.score_breakdown is
  'Per-criterion scores: clarity, context, constraints, outputFormat, safety (0-2 each).';

-- Spaced repetition (Phase 6)
alter table user_progress
  add column if not exists review_due_at timestamptz;

comment on column user_progress.review_due_at is
  'When this module/skill should be surfaced for review (1/3/7 day schedule).';

-- RLS for new tables
alter table lesson_embeddings enable row level security;
alter table learning_profiles enable row level security;

create policy "lesson_embeddings are publicly readable"
  on lesson_embeddings for select
  using (true);

create policy "learning_profiles are publicly readable"
  on learning_profiles for select
  using (true);

-- Service role / migrations insert embeddings; anon users only read
