import { learningModules } from '@/data/learning-modules';
import { supabase } from '@/lib/supabase';
import { ok } from '@/lib/utils';
import type { ApiResult, LearningModule } from '@/types';

export type DbRecommendation = {
  lessonId: string;
  moduleSlug: string;
  lessonTitle: string;
  reason: string | null;
  priority: number;
};

/**
 * Fetch personalised lesson recommendations for a user.
 *
 * Strategy (in order):
 *  1. Query lesson_recommendations joined to lessons for this user.
 *  2. If the table is empty (no rows yet), fall back to the 3 lowest-mastery
 *     local modules so the UI always has something to show.
 */
export async function fetchRecommendations(
  userId: string,
): Promise<ApiResult<DbRecommendation[]>> {
  const { data: recRows, error: recError } = await supabase
    .from('lesson_recommendations')
    .select('lesson_id, priority, reason')
    .eq('user_id', userId)
    .order('priority', { ascending: true })
    .limit(5);

  if (recError || !recRows || recRows.length === 0) {
    return ok(await progressFallback(userId));
  }

  const lessonIds = recRows.map((r) => r.lesson_id);
  const { data: lessonRows, error: lessonError } = await supabase
    .from('lessons')
    .select('id, module_slug, title')
    .in('id', lessonIds);

  if (lessonError) return ok(await progressFallback(userId));

  const lessonMap = new Map(
    (lessonRows ?? []).map((l) => [l.id, { moduleSlug: l.module_slug, title: l.title }]),
  );

  const recs: DbRecommendation[] = recRows.map((row) => {
    const lesson = lessonMap.get(row.lesson_id);
    return {
      lessonId: row.lesson_id,
      moduleSlug: lesson?.moduleSlug ?? '',
      lessonTitle: lesson?.title ?? 'Lesson',
      reason: row.reason,
      priority: row.priority,
    };
  });

  return ok(recs);
}

/** Prefer Supabase user_progress; fall back to static module mastery. */
async function progressFallback(userId: string): Promise<DbRecommendation[]> {
  if (userId !== 'anonymous') {
    const { data: progressRows } = await supabase
      .from('user_progress')
      .select('module_slug, mastery')
      .eq('user_id', userId)
      .order('mastery', { ascending: true })
      .limit(3);

    if (progressRows && progressRows.length > 0) {
      const slugs = progressRows.map((r) => r.module_slug);
      const { data: lessonRows } = await supabase
        .from('lessons')
        .select('id, module_slug, title')
        .in('module_slug', slugs)
        .eq('sort_order', 0);

      const firstByModule = new Map(
        (lessonRows ?? []).map((l) => [l.module_slug, l]),
      );

      return progressRows.map((p, i) => {
        const lesson = firstByModule.get(p.module_slug);
        return {
          lessonId: lesson?.id ?? '',
          moduleSlug: p.module_slug,
          lessonTitle: lesson?.title ?? p.module_slug,
          reason: `Mastery ${p.mastery}% — keep practising this module.`,
          priority: i,
        };
      });
    }
  }

  return [...learningModules]
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3)
    .map((m, i) => ({
      lessonId: '',
      moduleSlug: m.id,
      lessonTitle: m.title,
      reason: 'Low mastery — practice this module to improve.',
      priority: i,
    }));
}

/**
 * Module-level view kept for backward compat with the legacy useRecommendations hook.
 */
export async function fetchRecommendedModules(
  _userId: string,
): Promise<ApiResult<LearningModule[]>> {
  const sorted = [...learningModules].sort((a, b) => a.mastery - b.mastery);
  return ok(sorted.slice(0, 3));
}
