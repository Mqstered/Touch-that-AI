import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  buildLocalPathInsight,
  fetchLearnerProfile,
  fetchLearningPathInsight,
  refreshLearningPath,
} from '@/services/personalization.service';
import type { LearnerProfile } from '@/types/personalization';

type UsePersonalizedLearningResult = {
  profile: LearnerProfile | null;
  insight: string | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refreshPath: () => Promise<void>;
};

export function usePersonalizedLearning(): UsePersonalizedLearningResult {
  const { state } = useAuth();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const autoBuiltRef = useRef(false);

  const userId =
    state.status === 'authenticated' ? state.session.user.id : null;

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setInsight(null);
      return;
    }

    const result = await fetchLearnerProfile(userId);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (!result.data) {
      if (!autoBuiltRef.current) {
        autoBuiltRef.current = true;
        const built = await refreshLearningPath();
        if (built.ok) setTick((t) => t + 1);
      }
      return;
    }

    setProfile(result.data);
    const aiInsight = await fetchLearningPathInsight(result.data);
    setInsight(aiInsight ?? buildLocalPathInsight(result.data));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    loadProfile().finally(() => setLoading(false));
  }, [userId, tick, loadProfile]);

  const refreshPath = useCallback(async () => {
    if (!userId) return;
    setRefreshing(true);
    setError(null);
    const pathResult = await refreshLearningPath();
    if (!pathResult.ok) {
      setError(pathResult.error);
      setRefreshing(false);
      return;
    }
    setTick((t) => t + 1);
    setRefreshing(false);
  }, [userId]);

  return {
    profile,
    insight,
    loading,
    refreshing,
    error,
    refreshPath,
  };
}
