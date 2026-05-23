import type { ApiResult, AuthSession } from '@/types';
import { ok } from '@/lib/utils';

export async function signIn(
  _email: string,
  _password: string,
): Promise<ApiResult<AuthSession>> {
  throw new Error('signIn: Supabase integration not yet implemented.');
}

export async function signUp(
  _email: string,
  _password: string,
): Promise<ApiResult<AuthSession>> {
  throw new Error('signUp: Supabase integration not yet implemented.');
}

export async function signOut(): Promise<ApiResult<void>> {
  return ok(undefined);
}

export async function getSession(): Promise<ApiResult<AuthSession | null>> {
  return ok(null);
}
