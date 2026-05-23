import type { ApiResult, Lesson, LearningModule } from '@/types';
import { learningModules } from '@/data/learning-modules';
import { ok } from '@/lib/utils';

export async function fetchModules(): Promise<ApiResult<LearningModule[]>> {
  return ok(learningModules);
}

export async function fetchModuleById(id: string): Promise<ApiResult<LearningModule | null>> {
  const module = learningModules.find((m) => m.id === id) ?? null;
  return ok(module);
}

export async function fetchLessonsForModule(_moduleId: string): Promise<ApiResult<Lesson[]>> {
  return ok([]);
}
