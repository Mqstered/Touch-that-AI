import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { fetchProgress } from '@/services/progress.service';
import type { ProgressEntry } from '@/types';

type UseUserProgressResult = {
  progress: ProgressEntry[];
  averageMastery: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

/**
 * Fetches the authenticated user's full progress from Supabase.
 *
 * - Returns all module progress rows as an array.
 * - Computes averageMastery across all rows (0 if none yet).
 * - Exposes refresh() so screens can trigger a reload after practice.
 * - Falls back to empty array when unauthenticated (no crash).
 */
export function useUserProgress(): UseUserProgressResult {
  const { state } = useAuth();
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (state.status !== 'authenticated') return;
    setLoading(true);
    setError(null);
    fetchProgress(state.session.user.id).then((result) => {
      setLoading(false);
      if (!result.ok) { setError(result.error); return; }
      setProgress(result.data);
    });
  }, [state.status === 'authenticated' && state.session?.user.id, tick]);

  const averageMastery =
    progress.length === 0
      ? 0
      : Math.round(progress.reduce((sum, e) => sum + e.mastery, 0) / progress.length);

  return { progress, averageMastery, loading, error, refresh };
}
