import type { AuthState } from '@/types';

export function useAuth(): AuthState {
  return { status: 'unauthenticated' };
}
