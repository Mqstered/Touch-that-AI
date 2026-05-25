import { learningModules } from '@/data/learning-modules';
import { supabase } from '@/lib/supabase';
import { err, ok } from '@/lib/utils';
import type { ApiResult, DbLesson, LearningModule } from '@/types';

export async function fetchModules(): Promise<ApiResult<LearningModule[]>> {
  return ok(learningModules);
}

export async function fetchModuleById(id: string): Promise<ApiResult<LearningModule | null>> {
  const module = learningModules.find((m) => m.id === id) ?? null;
  return ok(module);
}

export async function fetchLessonsForModule(moduleSlug: string): Promise<ApiResult<DbLesson[]>> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_slug', moduleSlug)
    .order('sort_order', { ascending: true });

  if (error) return err(error.message);

  const lessons: DbLesson[] = (data ?? []).map((row) => ({
    id: row.id,
    moduleSlug: row.module_slug,
    title: row.title,
    level: row.level,
    goal: row.goal,
    skill: row.skill,
    tags: row.tags,
    lessonText: row.lesson_text,
    badPrompt: row.bad_prompt,
    goodPrompt: row.good_prompt,
    practiceTask: row.practice_task,
    sortOrder: row.sort_order,
  }));

  return ok(lessons);
}

export async function fetchLessonById(lessonId: string): Promise<ApiResult<DbLesson | null>> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return ok(null);
    return err(error.message);
  }

  const lesson: DbLesson = {
    id: data.id,
    moduleSlug: data.module_slug,
    title: data.title,
    level: data.level,
    goal: data.goal,
    skill: data.skill,
    tags: data.tags,
    lessonText: data.lesson_text,
    badPrompt: data.bad_prompt,
    goodPrompt: data.good_prompt,
    practiceTask: data.practice_task,
    sortOrder: data.sort_order,
  };

  return ok(lesson);
}

const MASTERED_SCORE = 80;

/**
 * Next lesson in a module the user should practice (first not yet mastered).
 * Falls back to first lesson in module.
 */
export async function fetchNextPracticeLesson(
  userId: string,
  moduleSlug: string,
): Promise<ApiResult<DbLesson | null>> {
  const lessonsResult = await fetchLessonsForModule(moduleSlug);
  if (!lessonsResult.ok || lessonsResult.data.length === 0) {
    return lessonsResult.ok ? ok(null) : lessonsResult;
  }

  const { data: attempts } = await supabase
    .from('practice_attempts')
    .select('lesson_id, score')
    .eq('user_id', userId)
    .not('completed_at', 'is', null);

  const bestByLesson = new Map<string, number>();
  for (const row of attempts ?? []) {
    const prev = bestByLesson.get(row.lesson_id) ?? 0;
    bestByLesson.set(row.lesson_id, Math.max(prev, row.score ?? 0));
  }

  const next =
    lessonsResult.data.find((l) => (bestByLesson.get(l.id) ?? 0) < MASTERED_SCORE) ??
    lessonsResult.data[0];

  return ok(next);
}
