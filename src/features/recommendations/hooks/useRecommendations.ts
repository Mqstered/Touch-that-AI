import { useMemo } from 'react';

import { useLearning } from '@/hooks/use-learning';
import type { LearningModule } from '@/types';

export function useRecommendations(): LearningModule[] {
  const { modules } = useLearning();

  return useMemo(
    () => [...modules].sort((a, b) => a.mastery - b.mastery).slice(0, 3),
    [modules],
  );
}
