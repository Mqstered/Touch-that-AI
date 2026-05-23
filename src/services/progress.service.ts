import type { ApiResult, ProgressEntry } from '@/types';
import { ok } from '@/lib/utils';

export async function fetchProgress(_userId: string): Promise<ApiResult<ProgressEntry[]>> {
  return ok([]);
}

export async function updateProgress(
  _userId: string,
  entry: ProgressEntry,
): Promise<ApiResult<ProgressEntry>> {
  return ok(entry);
}
