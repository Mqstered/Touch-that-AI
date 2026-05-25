import type { LessonLevel, SkillType } from '@/types/database';

export type CriterionAverages = {
  clarity: number;
  context: number;
  constraints: number;
  outputFormat: number;
  safety: number;
};

export type LearnerBehaviorSummary = {
  total_attempts: number;
  avg_score_10: number;
  weak_criterion: string | null;
  weak_skill: SkillType | null;
  preferred_goal: string;
  suggested_level: LessonLevel;
  criterion_averages: CriterionAverages;
};

export type LearnerProfile = {
  userId: string;
  preferredGoal: string;
  suggestedLevel: LessonLevel;
  weakSkill: SkillType | null;
  weakCriterion: string | null;
  avgScore10: number;
  totalAttempts: number;
  insightText: string | null;
  behavior: LearnerBehaviorSummary | null;
};
