-- ============================================================
-- Phase 2–3: RAG retrieval RPC + recommendation engine
-- ============================================================

-- ─── match_lessons: semantic retrieval with metadata filters ───

create or replace function match_lessons(
  p_goal   text,
  p_level  lesson_level default 'beginner',
  p_skill  skill_type default null,
  p_limit  int default 3
)
returns table (
  id            uuid,
  module_slug   text,
  title         text,
  level         lesson_level,
  goal          text,
  skill         skill_type,
  tags          text[],
  lesson_text   text,
  bad_prompt    text,
  good_prompt   text,
  practice_task text,
  sort_order    integer,
  similarity    float
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_query_embedding vector(384);
  v_profile_key text;
begin
  v_profile_key := lower(trim(p_goal)) || ':' || p_level::text
    || ':' || coalesce(p_skill::text, 'any');

  select lp.embedding into v_query_embedding
  from learning_profiles lp
  where lp.profile_key = v_profile_key
  limit 1;

  if v_query_embedding is null and p_skill is not null then
    select lp.embedding into v_query_embedding
    from learning_profiles lp
    where lp.goal = lower(trim(p_goal))
      and lp.level = p_level
      and lp.skill = p_skill
    limit 1;
  end if;

  if v_query_embedding is null then
    select lp.embedding into v_query_embedding
    from learning_profiles lp
    where lp.goal = lower(trim(p_goal))
      and lp.level = p_level
    order by lp.created_at
    limit 1;
  end if;

  return query
  select
    l.id,
    l.module_slug,
    l.title,
    l.level,
    l.goal,
    l.skill,
    l.tags,
    l.lesson_text,
    l.bad_prompt,
    l.good_prompt,
    l.practice_task,
    l.sort_order,
    case
      when v_query_embedding is not null then
        1 - (le.embedding <=> v_query_embedding)
      else 0.5
    end as similarity
  from lessons l
  inner join lesson_embeddings le on le.lesson_id = l.id
  where l.level = p_level
    and (p_skill is null or l.skill = p_skill)
    and (
      lower(l.goal) like '%' || lower(trim(p_goal)) || '%'
      or lower(trim(p_goal)) = any (select lower(unnest(l.tags)))
      or exists (
        select 1 from learning_profiles lp2
        where lp2.goal = lower(trim(p_goal))
          and lp2.level = p_level
      )
    )
  order by
    case when v_query_embedding is not null
      then le.embedding <=> v_query_embedding
      else l.sort_order
    end asc
  limit greatest(p_limit, 1);
end;
$$;

grant execute on function match_lessons(text, lesson_level, skill_type, int) to authenticated;
grant execute on function match_lessons(text, lesson_level, skill_type, int) to anon;

-- Fallback when no embeddings yet: metadata-only lesson search
create or replace function match_lessons_metadata(
  p_goal   text,
  p_level  lesson_level default 'beginner',
  p_skill  skill_type default null,
  p_limit  int default 3
)
returns setof lessons
language sql
stable
security definer
set search_path = public
as $$
  select l.*
  from lessons l
  where l.level = p_level
    and (p_skill is null or l.skill = p_skill)
  order by l.sort_order
  limit greatest(p_limit, 1);
$$;

grant execute on function match_lessons_metadata(text, lesson_level, skill_type, int) to authenticated;
grant execute on function match_lessons_metadata(text, lesson_level, skill_type, int) to anon;

-- ─── recompute_recommendations ───

create or replace function recompute_recommendations(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_last_attempt record;
  v_score_10 smallint;
  v_lesson record;
  v_next_lesson_id uuid;
  v_reason text;
  v_priority int := 0;
begin
  delete from lesson_recommendations
  where user_id = p_user_id
    and (expires_at is not null and expires_at < now());

  select
    pa.lesson_id,
    pa.score,
    pa.completed_at,
    l.module_slug,
    l.skill,
    l.sort_order,
    l.level,
    l.title
  into v_last_attempt
  from practice_attempts pa
  join lessons l on l.id = pa.lesson_id
  where pa.user_id = p_user_id
    and pa.completed_at is not null
    and pa.score is not null
  order by pa.completed_at desc
  limit 1;

  if not found then
    insert into lesson_recommendations (user_id, lesson_id, reason, priority)
    select p_user_id, l.id,
      'Start here — your first lesson in this module.',
      row_number() over (order by l.sort_order)::int - 1
    from lessons l
    where l.module_slug = 'prompt-design'
      and l.sort_order = 0
    on conflict (user_id, lesson_id) do update
      set reason = excluded.reason, priority = excluded.priority, created_at = now();
    return;
  end if;

  v_score_10 := (v_last_attempt.score / 10)::smallint;

  if v_score_10 >= 8 then
    select l.id into v_next_lesson_id
    from lessons l
    where l.module_slug = v_last_attempt.module_slug
      and l.sort_order > v_last_attempt.sort_order
    order by l.sort_order
    limit 1;

    if v_next_lesson_id is null then
      select l.id into v_next_lesson_id
      from lessons l
      where l.skill = v_last_attempt.skill
        and l.id != v_last_attempt.lesson_id
      order by l.sort_order
      limit 1;
    end if;

    select title into v_reason from lessons where id = v_next_lesson_id;
    v_reason := case
      when v_reason is not null then 'Great score! Continue with: ' || v_reason
      else 'Great score! Explore another lesson in this skill area.'
    end;
  elsif v_score_10 >= 5 then
    select l.id into v_next_lesson_id
    from lessons l
    where l.skill = v_last_attempt.skill
      and l.id != v_last_attempt.lesson_id
      and l.level <= v_last_attempt.level
    order by random()
    limit 1;

    v_reason := 'Good progress — practise more ' || v_last_attempt.skill::text || ' skills.';
  else
    v_next_lesson_id := v_last_attempt.lesson_id;
    v_reason := 'Let''s review this lesson — try the practice task again with more detail.';
  end if;

  if v_next_lesson_id is not null then
    insert into lesson_recommendations (user_id, lesson_id, reason, priority)
    values (p_user_id, v_next_lesson_id, v_reason, 0)
    on conflict (user_id, lesson_id) do update
      set reason = excluded.reason, priority = excluded.priority, created_at = now();
  end if;

  -- Stale skill review (not practised in 3+ days)
  insert into lesson_recommendations (user_id, lesson_id, reason, priority)
  select
    p_user_id,
    l.id,
    'Time for a review — you have not practised ' || up.module_slug || ' recently.',
    1
  from user_progress up
  join lessons l on l.module_slug = up.module_slug and l.sort_order = 0
  where up.user_id = p_user_id
    and up.last_practiced_at < now() - interval '3 days'
    and not exists (
      select 1 from lesson_recommendations lr
      where lr.user_id = p_user_id and lr.lesson_id = l.id
    )
  limit 2;

  -- Update review_due_at on progress (1 / 3 / 7 day schedule)
  update user_progress
  set review_due_at = case
    when v_score_10 >= 8 then now() + interval '7 days'
    when v_score_10 >= 5 then now() + interval '3 days'
    else now() + interval '1 day'
  end,
  updated_at = now()
  where user_id = p_user_id
    and module_slug = v_last_attempt.module_slug;
end;
$$;

-- Trigger: recompute recommendations after each completed practice attempt
create or replace function trigger_recompute_recommendations()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.completed_at is not null and new.score is not null then
    perform recompute_recommendations(new.user_id);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_recompute_recommendations on practice_attempts;

create trigger trg_recompute_recommendations
  after insert on practice_attempts
  for each row
  execute function trigger_recompute_recommendations();

-- Allow recommendation writes from security definer functions only (no direct user insert policy needed)
