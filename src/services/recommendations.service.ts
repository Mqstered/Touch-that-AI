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

  if (recError || !recRows || recRows.length === 0) return ok(localFallback());

  const lessonIds = recRows.map((r) => r.lesson_id);
  const { data: lessonRows, error: lessonError } = await supabase
    .from('lessons')
    .select('id, module_slug, title')
    .in('id', lessonIds);

  if (lessonError) return ok(localFallback());

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

/**
 * Local fallback: convert lowest-mastery modules into DbRecommendation shape
 * so the UI contract is satisfied even before the DB has recommendation rows.
 */
function localFallback(): DbRecommendation[] {
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
