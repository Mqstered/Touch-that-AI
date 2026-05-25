import { useEffect, useState } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import {
    fetchRecommendations,
    type DbRecommendation,
} from '@/services/recommendations.service';

type UseRecommendationsResult = {
  recommendations: DbRecommendation[];
  loading: boolean;
  refresh: () => void;
};

/**
 * Returns personalised lesson recommendations for the current user.
 *
 * - Fetches from lesson_recommendations (joined to lessons) via Supabase.
 * - Falls back to lowest-mastery local modules when unauthenticated or DB empty.
 * - Lightweight: no refresh needed — recommendations are pre-computed server-side.
 */
export function useRecommendations(): UseRecommendationsResult {
  const { state } = useAuth();
  const [recommendations, setRecommendations] = useState<DbRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  const userId =
    state.status === 'authenticated' ? state.session.user.id : 'anonymous';

  useEffect(() => {
    setLoading(true);
    fetchRecommendations(userId).then((result) => {
      setLoading(false);
      if (result.ok) setRecommendations(result.data);
    });
  }, [userId, tick]);

  const refresh = () => setTick((t) => t + 1);

  return { recommendations, loading, refresh };
}
