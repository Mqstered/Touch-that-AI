import { useEffect, useState } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import {
    fetchRecommendations,
    type DbRecommendation,
} from '@/services/recommendations.service';

type UseRecommendationsResult = {
  recommendations: DbRecommendation[];
  loading: boolean;
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

  useEffect(() => {
    const userId = state.status === 'authenticated' ? state.session.user.id : 'anonymous';
    setLoading(true);
    fetchRecommendations(userId).then((result) => {
      setLoading(false);
      if (result.ok) setRecommendations(result.data);
    });
  }, [state.status === 'authenticated' && state.session?.user.id]);

  return { recommendations, loading };
}
