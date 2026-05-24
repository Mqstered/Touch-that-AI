import { supabase } from '@/lib/supabase';
import { err, ok } from '@/lib/utils';
import type { ApiResult, AuthSession } from '@/types';

function mapSession(session: NonNullable<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>): AuthSession {
  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? '',
      displayName: session.user.user_metadata?.display_name as string | undefined,
      avatarUrl: session.user.user_metadata?.avatar_url as string | undefined,
      createdAt: session.user.created_at,
    },
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ?? 0,
  };
}

export async function signUp(
  email: string,
  password: string,
): Promise<ApiResult<AuthSession>> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return err(error.message);
  if (!data.session) return err('Check your email to confirm your account.');
  return ok(mapSession(data.session));
}

export async function signIn(
  email: string,
  password: string,
): Promise<ApiResult<AuthSession>> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return err(error.message);
  return ok(mapSession(data.session));
}

export async function signOut(): Promise<ApiResult<void>> {
  const { error } = await supabase.auth.signOut();
  if (error) return err(error.message);
  return ok(undefined);
}

export async function getSession(): Promise<ApiResult<AuthSession | null>> {
  const { data, error } = await supabase.auth.getSession();
  if (error) return err(error.message);
  if (!data.session) return ok(null);
  return ok(mapSession(data.session));
}
