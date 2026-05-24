import { supabase } from '@/lib/supabase';
import { err, ok } from '@/lib/utils';
import type { ApiResult, ProgressEntry } from '@/types';

/**
 * Fetch all progress rows for a user.
 * Each row covers one module_slug.
 * totalLessons is resolved by the caller from local module data.
 */
export async function fetchProgress(userId: string): Promise<ApiResult<ProgressEntry[]>> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('module_slug, mastery, completed_lessons, last_practiced_at')
    .eq('user_id', userId);

  if (error) return err(error.message);

  const entries: ProgressEntry[] = (data ?? []).map((row) => ({
    moduleId: row.module_slug,
    mastery: row.mastery,
    completedLessons: row.completed_lessons,
    totalLessons: 0,
    lastActivity: row.last_practiced_at ?? new Date().toISOString(),
  }));

  return ok(entries);
}

/**
 * Fetch progress for a single module.
 * Returns null if the user hasn't attempted any lessons in that module yet.
 */
export async function fetchProgressForModule(
  userId: string,
  moduleSlug: string,
): Promise<ApiResult<ProgressEntry | null>> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('module_slug, mastery, completed_lessons, last_practiced_at')
    .eq('user_id', userId)
    .eq('module_slug', moduleSlug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return ok(null);
    return err(error.message);
  }

  return ok({
    moduleId: data.module_slug,
    mastery: data.mastery,
    completedLessons: data.completed_lessons,
    totalLessons: 0,
    lastActivity: data.last_practiced_at ?? new Date().toISOString(),
  });
}

export async function updateProgress(
  _userId: string,
  entry: ProgressEntry,
): Promise<ApiResult<ProgressEntry>> {
  return ok(entry);
}
