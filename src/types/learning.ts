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
