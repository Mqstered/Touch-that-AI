import type { ApiResult, LearningModule } from '@/types';
import { learningModules } from '@/data/learning-modules';
import { ok } from '@/lib/utils';

export async function fetchRecommendations(
  _userId: string,
): Promise<ApiResult<LearningModule[]>> {
  const sorted = [...learningModules].sort((a, b) => a.mastery - b.mastery);
  return ok(sorted.slice(0, 3));
}
