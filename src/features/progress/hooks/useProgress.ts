import { useLearning } from '@/hooks/use-learning';

export function useProgress() {
  const { averageMastery, totalLessons } = useLearning();
  return { averageMastery, totalLessons };
}
