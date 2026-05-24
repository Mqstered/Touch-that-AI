import { supabase } from '@/lib/supabase';
import { err, ok } from '@/lib/utils';
import type { ApiResult, ScoredAttempt } from '@/types';

export type SavedAttempt = {
  id: string;
  lessonId: string;
  score: number;
  feedback: string;
  completedAt: string;
};

/**
 * Save a completed practice attempt to Supabase.
 * The DB trigger `trg_update_progress_after_attempt` automatically
 * updates user_progress after this insert.
 */
export async function savePracticeAttempt(
  userId: string,
  attempt: ScoredAttempt,
  startedAt: string,
): Promise<ApiResult<SavedAttempt>> {
  const completedAt = new Date().toISOString();
  const feedbackText = attempt.feedback.join(' ');

  const { data, error } = await supabase
    .from('practice_attempts')
    .insert({
      user_id: userId,
      lesson_id: attempt.lessonId,
      user_response: attempt.userResponse,
      score: attempt.score.total * 10,
      feedback: feedbackText,
      time_spent_s: attempt.timeSpentSeconds,
      started_at: startedAt,
      completed_at: completedAt,
    })
    .select('id, lesson_id, score, feedback, completed_at')
    .single();

  if (error) return err(error.message);

  return ok({
    id: data.id,
    lessonId: data.lesson_id,
    score: data.score ?? 0,
    feedback: data.feedback ?? '',
    completedAt: data.completed_at ?? completedAt,
  });
}

/**
 * Fetch existing progress for a user+module, falls back to null if not yet started.
 */
export async function fetchUserProgress(
  userId: string,
  moduleSlug: string,
): Promise<ApiResult<{ mastery: number; completedLessons: number } | null>> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('mastery, completed_lessons')
    .eq('user_id', userId)
    .eq('module_slug', moduleSlug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return ok(null);
    return err(error.message);
  }

  return ok({ mastery: data.mastery, completedLessons: data.completed_lessons });
}
