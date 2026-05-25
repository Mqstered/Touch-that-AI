import { supabase } from '@/lib/supabase';
import { err, ok } from '@/lib/utils';
import type { ApiResult } from '@/types';
import type { LearnerBehaviorSummary, LearnerProfile } from '@/types/personalization';
import type { SkillType } from '@/types/database';

type BehaviorJson = {
  total_attempts?: number;
  avg_score_10?: number;
  weak_criterion?: string;
  weak_skill?: string;
  preferred_goal?: string;
  suggested_level?: string;
  criterion_averages?: Record<string, number>;
};

type ProfileRow = {
  user_id: string;
  preferred_goal: string;
  suggested_level: string;
  weak_skill: SkillType | null;
  weak_criterion: string | null;
  avg_score_10: number;
  total_attempts: number;
  insight_text: string | null;
};

function mapBehavior(raw: BehaviorJson | null): LearnerBehaviorSummary | null {
  if (!raw) return null;
  const ca = raw.criterion_averages ?? {};
  return {
    total_attempts: raw.total_attempts ?? 0,
    avg_score_10: Number(raw.avg_score_10 ?? 0),
    weak_criterion: raw.weak_criterion ?? null,
    weak_skill: (raw.weak_skill as SkillType) ?? null,
    preferred_goal: raw.preferred_goal ?? 'study',
    suggested_level: (raw.suggested_level as LearnerProfile['suggestedLevel']) ?? 'beginner',
    criterion_averages: {
      clarity: ca.clarity ?? 0,
      context: ca.context ?? 0,
      constraints: ca.constraints ?? 0,
      outputFormat: ca.outputFormat ?? 0,
      safety: ca.safety ?? 0,
    },
  };
}

function mapProfile(row: ProfileRow, behavior: LearnerBehaviorSummary | null): LearnerProfile {
  return {
    userId: row.user_id,
    preferredGoal: row.preferred_goal,
    suggestedLevel: row.suggested_level as LearnerProfile['suggestedLevel'],
    weakSkill: row.weak_skill,
    weakCriterion: row.weak_criterion,
    avgScore10: Number(row.avg_score_10),
    totalAttempts: row.total_attempts,
    insightText: row.insight_text,
    behavior,
  };
}

/** Rebuild recommendations + learner profile from all practice history. */
export async function refreshLearningPath(): Promise<ApiResult<LearnerBehaviorSummary | null>> {
  const { data, error } = await supabase.rpc('refresh_learning_path');
  if (error) return err(error.message);
  return ok(mapBehavior(data as BehaviorJson));
}

export async function fetchLearnerProfile(
  userId: string,
): Promise<ApiResult<LearnerProfile | null>> {
  const { data: rows, error } = await supabase.rpc('get_user_learner_profile', {
    p_user_id: userId,
  });

  if (error) return err(error.message);
  const row = (rows as ProfileRow[] | null)?.[0];
  if (!row) return ok(null);

  const { data: behaviorRaw } = await supabase.rpc('get_learner_behavior_summary', {
    p_user_id: userId,
  });

  return ok(mapProfile(row, mapBehavior(behaviorRaw as BehaviorJson)));
}

/** Gemini coach message explaining the personalized path. */
export async function fetchLearningPathInsight(
  profile: LearnerProfile,
): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke<{ insight: string | null }>(
    'learning-path-insight',
    {
      body: {
        profile: {
          preferred_goal: profile.preferredGoal,
          suggested_level: profile.suggestedLevel,
          weak_skill: profile.weakSkill,
          weak_criterion: profile.weakCriterion,
          avg_score_10: profile.avgScore10,
          total_attempts: profile.totalAttempts,
          criterion_averages: profile.behavior?.criterion_averages,
        },
      },
    },
  );

  if (error || !data?.insight) return null;
  return data.insight;
}

/** Local fallback when Gemini is unavailable. */
export function buildLocalPathInsight(profile: LearnerProfile): string {
  if (profile.totalAttempts === 0) {
    return `Welcome! Your path starts with ${profile.preferredGoal} lessons at ${profile.suggestedLevel} level. Complete practice tasks to unlock smarter recommendations.`;
  }
  const focus = profile.weakCriterion
    ? `Focus on improving ${profile.weakCriterion} in your prompts`
    : 'Keep practising structured prompts';
  const skill = profile.weakSkill ? ` in ${profile.weakSkill}` : '';
  return `Based on ${profile.totalAttempts} attempts (avg ${profile.avgScore10}/10), ${focus}${skill}. Your next steps are ordered below.`;
}
