import type { LessonLevel, SkillType } from '@/types/database';

export type LearningGoalKey =
  | 'study'
  | 'daily_life'
  | 'work'
  | 'safety'
  | 'agents';

export const LEARNING_GOALS: { key: LearningGoalKey; label: string }[] = [
  { key: 'study', label: 'Study' },
  { key: 'daily_life', label: 'Daily life' },
  { key: 'work', label: 'Work' },
  { key: 'safety', label: 'Safety' },
  { key: 'agents', label: 'AI agents' },
];

export const LEARNING_SKILLS: { key: SkillType | 'any'; label: string }[] = [
  { key: 'any', label: 'Any skill' },
  { key: 'prompting', label: 'Prompting' },
  { key: 'context', label: 'Context' },
  { key: 'safety', label: 'Safety' },
  { key: 'reasoning', label: 'Reasoning' },
  { key: 'evaluation', label: 'Evaluation' },
];

export const LEARNING_LEVELS: { key: LessonLevel; label: string }[] = [
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
];
