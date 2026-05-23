import type { ApiResult, PracticeSession } from '@/types';
import { ok } from '@/lib/utils';

export async function startPracticeSession(moduleId: string): Promise<ApiResult<PracticeSession>> {
  const session: PracticeSession = {
    id: `session-${Date.now()}`,
    moduleId,
    startedAt: new Date().toISOString(),
  };
  return ok(session);
}

export async function completePracticeSession(
  sessionId: string,
  score: number,
): Promise<ApiResult<PracticeSession>> {
  const session: PracticeSession = {
    id: sessionId,
    moduleId: '',
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    score,
  };
  return ok(session);
}
