-- ============================================================
-- Phase 6: Normalize goal keys + additional lessons (20+ total)
-- ============================================================

alter table lessons
  add column if not exists goal_key text;

comment on column lessons.goal_key is
  'Structured learning goal: daily_life, study, work, safety, agents';

-- Backfill goal_key from module/skill heuristics
update lessons set goal_key = 'study'
where goal_key is null and (
  lower(goal) like '%study%' or lower(goal) like '%learn%'
  or 'study' = any (tags) or module_slug = 'knowledge-tracing'
);

update lessons set goal_key = 'safety'
where goal_key is null and (
  skill = 'safety' or module_slug = 'ai-safety'
);

update lessons set goal_key = 'work'
where goal_key is null and (
  lower(goal) like '%work%' or lower(goal) like '%professional%'
  or lower(goal) like '%board%' or lower(goal) like '%presentation%'
);

update lessons set goal_key = 'daily_life'
where goal_key is null and (
  lower(goal) like '%daily%' or 'daily' = any (tags)
);

update lessons set goal_key = 'study'
where goal_key is null;

-- Improve match_lessons to use goal_key
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
  v_goal_norm text := lower(trim(p_goal));
begin
  select lp.embedding into v_query_embedding
  from learning_profiles lp
  where lp.profile_key = v_goal_norm || ':' || p_level::text
      || ':' || coalesce(p_skill::text, 'any')
  limit 1;

  if v_query_embedding is null and p_skill is not null then
    select lp.embedding into v_query_embedding
    from learning_profiles lp
    where lp.goal = v_goal_norm and lp.level = p_level and lp.skill = p_skill
    limit 1;
  end if;

  if v_query_embedding is null then
    select lp.embedding into v_query_embedding
    from learning_profiles lp
    where lp.goal = v_goal_norm and lp.level = p_level
    limit 1;
  end if;

  return query
  select
    l.id, l.module_slug, l.title, l.level, l.goal, l.skill, l.tags,
    l.lesson_text, l.bad_prompt, l.good_prompt, l.practice_task, l.sort_order,
    case when v_query_embedding is not null
      then 1 - (le.embedding <=> v_query_embedding)
      else 0.5 end
  from lessons l
  inner join lesson_embeddings le on le.lesson_id = l.id
  where l.level = p_level
    and (p_skill is null or l.skill = p_skill)
    and (l.goal_key = v_goal_norm or l.goal_key is null)
  order by
    case when v_query_embedding is not null
      then le.embedding <=> v_query_embedding
      else l.sort_order end asc
  limit greatest(p_limit, 1);
end;
$$;

-- Additional lessons (bring total toward 25)
insert into lessons (module_slug, title, level, goal, goal_key, skill, tags, lesson_text, bad_prompt, good_prompt, practice_task, sort_order)
values
(
  'prompt-design',
  'Output Format',
  'beginner',
  'Ask AI for answers in a specific format like lists or tables.',
  'daily_life',
  'prompting',
  array['format', 'output', 'daily_life'],
  'Telling the AI exactly how to format the answer — bullet list, table, numbered steps, email draft — removes guesswork and gives you usable output on the first try.',
  'Give me tips for healthy eating.',
  'List 5 simple healthy lunch ideas for office workers. Format as a table with columns: Meal, Prep time (minutes), Key ingredients.',
  'Write a prompt asking for a weekly meal plan formatted as a table with at least three columns.',
  6
),
(
  'ai-safety',
  'Privacy Basics',
  'beginner',
  'Avoid sharing sensitive personal data in AI prompts.',
  'safety',
  'safety',
  array['privacy', 'safety', 'daily_life'],
  'Never paste passwords, ID numbers, medical records, or private details about others into AI tools. Treat every prompt as if it could be logged. Use placeholders like [CLIENT_NAME] when you need examples.',
  'Here is my social security number, help me with taxes.',
  'I need general guidance on what documents are typically required for filing taxes as a freelancer in the US. Do not ask for or store personal identifiers.',
  'Rewrite a prompt that accidentally shares too much personal information, using placeholders instead.',
  2
),
(
  'ai-safety',
  'Fact-Checking Outputs',
  'intermediate',
  'Verify important AI answers before acting on them.',
  'study',
  'safety',
  array['verification', 'hallucination', 'study'],
  'AI can sound confident while being wrong. For anything important — health, money, legal, news — cross-check with trusted sources. Ask the AI to cite limitations and flag uncertainty.',
  'Is this medical claim true?',
  'Summarise what reputable health organisations say about the benefits of daily walking for heart health. Clearly state when evidence is mixed and do not give personal medical advice.',
  'Write a prompt that asks for factual information on a study topic while explicitly requesting sources and uncertainty flags.',
  3
),
(
  'knowledge-tracing',
  'Spaced Review',
  'beginner',
  'Understand why revisiting skills improves long-term learning.',
  'study',
  'evaluation',
  array['spaced-repetition', 'study'],
  'Your brain retains skills better when you review them at increasing intervals — 1 day, 3 days, 7 days. This app uses your practice scores and last practice date to suggest when to review.',
  'Teach me everything at once.',
  'I learned about prompt context yesterday and scored 6/10. Give me one short review exercise focused only on adding context, not new topics.',
  'Write a prompt asking AI to create a short review quiz on a topic you studied recently, with difficulty matched to your level.',
  1
),
(
  'prompt-design',
  'Study Planning',
  'beginner',
  'Use AI to build realistic study schedules with constraints.',
  'study',
  'context',
  array['study', 'planning', 'context'],
  'Study prompts work best when you name the subject, deadline, available hours, and preferred format. The AI can then produce a timetable you can actually follow.',
  'Help me study.',
  'Create a 5-day revision plan for a biology exam on Friday. I have 2 hours per evening and struggle with cell division. Output as a day-by-day checklist.',
  'Write a prompt for a study plan that includes subject, deadline, time available, and output format.',
  7
),
(
  'prompt-design',
  'Work Email Drafting',
  'intermediate',
  'Draft professional messages with tone and context.',
  'work',
  'prompting',
  array['work', 'email', 'professional'],
  'Work prompts should specify recipient, relationship, purpose, tone, and length. This prevents overly casual or vague drafts.',
  'Write an email.',
  'Draft a polite follow-up email to a hiring manager after a final-round interview last Tuesday. Tone: professional and warm. Max 120 words. Include a clear subject line.',
  'Write a prompt asking AI to draft a professional work email. Include recipient context, purpose, tone, and length limit.',
  8
),
(
  'prompt-design',
  'AI Agents Intro',
  'intermediate',
  'Understand how AI agents handle multi-step tasks with goals and boundaries.',
  'agents',
  'reasoning',
  array['agents', 'multi-step', 'work'],
  'An AI agent breaks a goal into steps — research, draft, check, revise. Good agent prompts state the goal, success criteria, tools allowed, and when to stop and ask you.',
  'Do everything for my project.',
  'You are a research assistant. Goal: summarise three recent articles on remote work productivity. Steps: (1) list key findings per article, (2) compare agreements and conflicts, (3) stop before drafting final recommendations. Max 400 words total.',
  'Write a prompt for an AI agent with a clear goal, step boundaries, and a maximum output length.',
  9
)
on conflict (module_slug, sort_order) do nothing;

-- Metadata fallback respects goal_key
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
    and (l.goal_key = lower(trim(p_goal)) or l.goal_key is null)
  order by l.sort_order
  limit greatest(p_limit, 1);
$$;
