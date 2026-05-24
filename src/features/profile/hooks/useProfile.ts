import { useAuthContext } from '@/context/auth-context';
import type { User } from '@/types';

export function useProfile(): User | null {
  const { state } = useAuthContext();
  return state.status === 'authenticated' ? state.session.user : null;
}
