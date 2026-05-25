import { useLearning } from '@/hooks/use-learning';

export function useModules() {
  const { modules } = useLearning();
  return modules;
}
