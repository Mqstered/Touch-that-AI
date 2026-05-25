export type LearningModule = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  focus: string;
  mastery: number;
  lessons: number;
  progress: number;
  updatedAt: string;
  category: string;
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
};

/** Full lesson row from Supabase — mirrors schema.sql `lessons` table */
export type DbLesson = {
  id: string;
  moduleSlug: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  skill: string;
  tags: string[];
  lessonText: string;
  badPrompt: string | null;
  goodPrompt: string | null;
  practiceTask: string;
  sortOrder: number;
};

/** Scores broken down by the five criteria used in rule-based scoring */
export type ScoreBreakdown = {
  clarity: number;      // 0–2
  context: number;      // 0–2
  constraints: number;  // 0–2
  outputFormat: number; // 0–2
  safety: number;       // 0–2
  total: number;        // 0–10
};

/** A single completed practice attempt with score and feedback */
export type ScoredAttempt = {
  lessonId: string;
  userResponse: string;
  score: ScoreBreakdown;
  feedback: string[];
  timeSpentSeconds: number;
};

export type PracticeSession = {
  id: string;
  moduleId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
};

export type ProgressEntry = {
  moduleId: string;
  mastery: number;
  completedLessons: number;
  totalLessons: number;
  lastActivity: string;
};
