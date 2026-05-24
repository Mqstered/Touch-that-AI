import { supabase } from '@/lib/supabase';
import { err, ok } from '@/lib/utils';
import type { ApiResult, DbLesson } from '@/types';
import type { LearningGoalKey } from '@/constants/learning-goals';
import type { Database, LessonLevel, SkillType } from '@/types/database';

type MatchLessonRow = {
  id: string;
  module_slug: string;
  title: string;
  level: LessonLevel;
  goal: string;
  skill: SkillType;
  tags: string[];
  lesson_text: string;
  bad_prompt: string | null;
  good_prompt: string | null;
  practice_task: string;
  sort_order: number;
  similarity: number;
};

function mapRow(row: MatchLessonRow): DbLesson {
  return {
    id: row.id,
    moduleSlug: row.module_slug,
    title: row.title,
    level: row.level,
    goal: row.goal,
    skill: row.skill,
    tags: row.tags ?? [],
    lessonText: row.lesson_text,
    badPrompt: row.bad_prompt,
    goodPrompt: row.good_prompt,
    practiceTask: row.practice_task,
    sortOrder: row.sort_order,
  };
}

/**
 * RAG lesson retrieval via Supabase RPC (pgvector + learning_profiles).
 * Falls back to metadata-only search when embeddings are not seeded yet.
 */
export async function matchLessons(
  goal: LearningGoalKey,
  level: LessonLevel = 'beginner',
  skill: SkillType | null = null,
  limit = 1,
): Promise<ApiResult<DbLesson[]>> {
  const skillParam = skill ?? undefined;

  const { data, error } = await supabase.rpc('match_lessons', {
    p_goal: goal,
    p_level: level,
    p_skill: skillParam,
    p_limit: limit,
  });

  if (!error && data && (data as MatchLessonRow[]).length > 0) {
    return ok((data as MatchLessonRow[]).map(mapRow));
  }

  const { data: metaRows, error: metaError } = await supabase.rpc(
    'match_lessons_metadata',
    {
      p_goal: goal,
      p_level: level,
      p_skill: skillParam,
      p_limit: limit,
    },
  );

  if (metaError) {
    return err(error?.message ?? metaError.message);
  }

  type LessonRow = Database['public']['Tables']['lessons']['Row'];
  const rows = (metaRows ?? []) as LessonRow[];
  return ok(
    rows.map((r) =>
      mapRow({
        id: r.id,
        module_slug: r.module_slug,
        title: r.title,
        level: r.level,
        goal: r.goal,
        skill: r.skill,
        tags: r.tags,
        lesson_text: r.lesson_text,
        bad_prompt: r.bad_prompt,
        good_prompt: r.good_prompt,
        practice_task: r.practice_task,
        sort_order: r.sort_order,
        similarity: 0,
      }),
    ),
  );
}

/** Top match for the lesson finder on Explore */
export async function findBestLesson(
  goal: LearningGoalKey,
  level: LessonLevel = 'beginner',
  skill: SkillType | null = null,
): Promise<ApiResult<DbLesson | null>> {
  const result = await matchLessons(goal, level, skill, 1);
  if (!result.ok) return result;
  return ok(result.data[0] ?? null);
}
