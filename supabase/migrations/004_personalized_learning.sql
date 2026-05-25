-- ============================================================
-- Personalized learning path from tracked behavior
-- ============================================================

create table if not exists user_learner_profile (
  user_id          uuid primary key references user_profiles (id) on delete cascade,
  preferred_goal   text not null default 'study',
  suggested_level  lesson_level not null default 'beginner',
  weak_skill       skill_type,
  weak_criterion   text,
  avg_score_10     numeric(4,1) not null default 0,
  total_attempts   integer not null default 0,
  insight_text     text,
  updated_at       timestamptz not null default now()
);

comment on table user_learner_profile is
  'Cached learner model derived from practice_attempts score_breakdown and progress.';

alter table user_learner_profile enable row level security;

create policy "users can view own learner profile"
  on user_learner_profile for select
  using (auth.uid() = user_id);

-- ─── Behavior summary from practice history ───

create or replace function get_learner_behavior_summary(p_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_result jsonb;
  v_avg_clarity numeric;
  v_avg_context numeric;
  v_avg_constraints numeric;
  v_avg_output numeric;
  v_avg_safety numeric;
  v_weak_criterion text;
  v_weak_skill skill_type;
  v_avg_score_10 numeric;
  v_total int;
  v_preferred_goal text;
  v_suggested_level lesson_level;
  v_min_criterion numeric;
begin
  select
    count(*),
    avg((pa.score_breakdown->>'clarity')::numeric),
    avg((pa.score_breakdown->>'context')::numeric),
    avg((pa.score_breakdown->>'constraints')::numeric),
    avg(coalesce((pa.score_breakdown->>'outputFormat')::numeric, (pa.score_breakdown->>'output_format')::numeric)),
    avg((pa.score_breakdown->>'safety')::numeric),
    avg(pa.score / 10.0)
  into v_total, v_avg_clarity, v_avg_context, v_avg_constraints, v_avg_output, v_avg_safety, v_avg_score_10
  from practice_attempts pa
  where pa.user_id = p_user_id
    and pa.score_breakdown is not null
    and pa.completed_at is not null;

  v_total := coalesce(v_total, 0);
  v_avg_score_10 := coalesce(v_avg_score_10, 0);

  v_min_criterion := least(
    coalesce(v_avg_clarity, 2),
    coalesce(v_avg_context, 2),
    coalesce(v_avg_constraints, 2),
    coalesce(v_avg_output, 2),
    coalesce(v_avg_safety, 2)
  );

  v_weak_criterion := case v_min_criterion
    when coalesce(v_avg_clarity, 2) then 'clarity'
    when coalesce(v_avg_context, 2) then 'context'
    when coalesce(v_avg_constraints, 2) then 'constraints'
    when coalesce(v_avg_output, 2) then 'outputFormat'
    else 'safety'
  end;

  select l.skill into v_weak_skill
  from practice_attempts pa
  join lessons l on l.id = pa.lesson_id
  where pa.user_id = p_user_id
    and pa.completed_at is not null
    and pa.score is not null
  group by l.skill
  order by avg(pa.score) asc
  limit 1;

  select l.goal_key into v_preferred_goal
  from practice_attempts pa
  join lessons l on l.id = pa.lesson_id
  where pa.user_id = p_user_id
    and l.goal_key is not null
  group by l.goal_key
  order by count(*) desc
  limit 1;

  v_preferred_goal := coalesce(v_preferred_goal, 'study');

  v_suggested_level := case
    when v_avg_score_10 >= 7.5 then 'intermediate'::lesson_level
    else 'beginner'::lesson_level
  end;

  v_result := jsonb_build_object(
    'total_attempts', v_total,
    'avg_score_10', round(v_avg_score_10::numeric, 1),
    'weak_criterion', v_weak_criterion,
    'weak_skill', v_weak_skill,
    'preferred_goal', v_preferred_goal,
    'suggested_level', v_suggested_level,
    'criterion_averages', jsonb_build_object(
      'clarity', round(coalesce(v_avg_clarity, 0)::numeric, 2),
      'context', round(coalesce(v_avg_context, 0)::numeric, 2),
      'constraints', round(coalesce(v_avg_constraints, 0)::numeric, 2),
      'outputFormat', round(coalesce(v_avg_output, 0)::numeric, 2),
      'safety', round(coalesce(v_avg_safety, 0)::numeric, 2)
    )
  );

  return v_result;
end;
$$;

grant execute on function get_learner_behavior_summary(uuid) to authenticated;

-- ─── Build full path: behavior + RAG + reviews ───

create or replace function build_personalized_learning_path(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_behavior jsonb;
  v_goal text;
  v_level lesson_level;
  v_skill skill_type;
  v_weak_criterion text;
  v_avg_score_10 numeric;
  v_priority int := 0;
  v_lesson record;
  v_last_attempt record;
  v_score_10 smallint;
  v_next_lesson_id uuid;
begin
  v_behavior := get_learner_behavior_summary(p_user_id);

  v_goal := coalesce(v_behavior->>'preferred_goal', 'study');
  v_level := coalesce((v_behavior->>'suggested_level')::lesson_level, 'beginner');
  v_weak_criterion := v_behavior->>'weak_criterion';
  v_avg_score_10 := coalesce((v_behavior->>'avg_score_10')::numeric, 0);

  if (v_behavior->>'weak_skill') is not null then
    v_skill := (v_behavior->>'weak_skill')::skill_type;
  end if;

  insert into user_learner_profile (
    user_id, preferred_goal, suggested_level, weak_skill, weak_criterion,
    avg_score_10, total_attempts, updated_at
  )
  values (
    p_user_id, v_goal, v_level, v_skill, v_weak_criterion,
    v_avg_score_10, coalesce((v_behavior->>'total_attempts')::int, 0), now()
  )
  on conflict (user_id) do update set
    preferred_goal = excluded.preferred_goal,
    suggested_level = excluded.suggested_level,
    weak_skill = excluded.weak_skill,
    weak_criterion = excluded.weak_criterion,
    avg_score_10 = excluded.avg_score_10,
    total_attempts = excluded.total_attempts,
    updated_at = now();

  delete from lesson_recommendations where user_id = p_user_id;

  -- New users: starter path via RAG
  if coalesce((v_behavior->>'total_attempts')::int, 0) = 0 then
    for v_lesson in
      select * from match_lessons(v_goal, 'beginner', coalesce(v_skill, 'prompting'::skill_type), 3)
    loop
      insert into lesson_recommendations (user_id, lesson_id, reason, priority)
      values (
        p_user_id, v_lesson.id,
        'Step ' || (v_priority + 1) || ': Start your ' || v_goal || ' learning path.',
        v_priority
      );
      v_priority := v_priority + 1;
    end loop;

    if v_priority = 0 then
      for v_lesson in
        select * from match_lessons_metadata(v_goal, 'beginner', null, 3)
      loop
        insert into lesson_recommendations (user_id, lesson_id, reason, priority)
        values (p_user_id, v_lesson.id, 'Step ' || (v_priority + 1) || ': Recommended starter lesson.', v_priority);
        v_priority := v_priority + 1;
      end loop;
    end if;

    return v_behavior;
  end if;

  -- Reviews due (spaced repetition)
  for v_lesson in
    select l.id, l.title, up.module_slug
    from user_progress up
    join lessons l on l.module_slug = up.module_slug and l.sort_order = 0
    where up.user_id = p_user_id
      and up.review_due_at is not null
      and up.review_due_at <= now()
    order by up.review_due_at
    limit 1
  loop
    insert into lesson_recommendations (user_id, lesson_id, reason, priority)
    values (
      p_user_id, v_lesson.id,
      'Review: revisit ' || v_lesson.module_slug || ' — scheduled refresh.',
      v_priority
    );
    v_priority := v_priority + 1;
  end loop;

  -- Last attempt: repeat or advance in module
  select pa.lesson_id, pa.score, l.module_slug, l.skill, l.sort_order, l.title
  into v_last_attempt
  from practice_attempts pa
  join lessons l on l.id = pa.lesson_id
  where pa.user_id = p_user_id and pa.completed_at is not null and pa.score is not null
  order by pa.completed_at desc
  limit 1;

  if found then
    v_score_10 := (v_last_attempt.score / 10)::smallint;

    if v_score_10 < 5 then
      insert into lesson_recommendations (user_id, lesson_id, reason, priority)
      values (
        p_user_id, v_last_attempt.lesson_id,
        'Repeat: strengthen ' || coalesce(v_weak_criterion, 'prompt') || ' (last score ' || v_score_10 || '/10).',
        v_priority
      );
      v_priority := v_priority + 1;
    elsif v_score_10 >= 8 then
      select l.id into v_next_lesson_id
      from lessons l
      where l.module_slug = v_last_attempt.module_slug
        and l.sort_order > v_last_attempt.sort_order
        and not exists (
          select 1 from practice_attempts pa2
          where pa2.user_id = p_user_id and pa2.lesson_id = l.id
            and pa2.score >= 80
        )
      order by l.sort_order
      limit 1;

      if v_next_lesson_id is not null then
        insert into lesson_recommendations (user_id, lesson_id, reason, priority)
        select p_user_id, l.id, 'Next in path: ' || l.title, v_priority
        from lessons l where l.id = v_next_lesson_id;
        v_priority := v_priority + 1;
      end if;
    end if;
  end if;

  -- RAG: lessons targeting weak skill, excluding mastered (score >= 80)
  for v_lesson in
    select m.id, m.title, m.module_slug, m.similarity
    from match_lessons(v_goal, v_level, v_skill, 5) m
    where not exists (
      select 1 from practice_attempts pa
      where pa.user_id = p_user_id and pa.lesson_id = m.id and pa.score >= 80
    )
    and not exists (
      select 1 from lesson_recommendations lr
      where lr.user_id = p_user_id and lr.lesson_id = m.id
    )
    limit 3
  loop
    insert into lesson_recommendations (user_id, lesson_id, reason, priority)
    values (
      p_user_id, v_lesson.id,
      'Personalized: builds your weak area (' || coalesce(v_skill::text, 'skills') ||
        case when v_weak_criterion is not null then ', focus on ' || v_weak_criterion else '' end || ').',
      v_priority
    );
    v_priority := v_priority + 1;
  end loop;

  if v_priority = 0 then
    for v_lesson in
      select * from match_lessons_metadata(v_goal, v_level, v_skill, 3)
    loop
      insert into lesson_recommendations (user_id, lesson_id, reason, priority)
      values (p_user_id, v_lesson.id, 'Explore: continue your ' || v_goal || ' path.', v_priority);
      v_priority := v_priority + 1;
    end loop;
  end if;

  return v_behavior;
end;
$$;

grant execute on function build_personalized_learning_path(uuid) to authenticated;

create or replace function get_user_learner_profile(p_user_id uuid)
returns setof user_learner_profile
language sql
stable
security definer
set search_path = public
as $$
  select * from user_learner_profile where user_id = p_user_id;
$$;

grant execute on function get_user_learner_profile(uuid) to authenticated;

-- Replace simple recompute with full personalized path
create or replace function recompute_recommendations(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform build_personalized_learning_path(p_user_id);
end;
$$;

-- Allow users to refresh their own path on demand
create or replace function refresh_learning_path()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  return build_personalized_learning_path(auth.uid());
end;
$$;

grant execute on function refresh_learning_path() to authenticated;
