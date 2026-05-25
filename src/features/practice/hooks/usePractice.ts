import { useLearning } from '@/hooks/use-learning';

export function usePractice() {
  const { modules, practiceModule } = useLearning();
  return { modules, practiceModule };
}
