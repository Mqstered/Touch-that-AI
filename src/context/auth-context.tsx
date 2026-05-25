import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { supabase } from '@/lib/supabase';
import * as authService from '@/services/auth.service';
import type { AuthSession, AuthState } from '@/types';

type AuthContextValue = {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    authService.getSession().then((result) => {
      if (result.ok && result.data) {
        setState({ status: 'authenticated', session: result.data });
      } else {
        setState({ status: 'unauthenticated' });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setState({ status: 'unauthenticated' });
        return;
      }

      const mapped: AuthSession = {
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

      setState({ status: 'authenticated', session: mapped });
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const result = await authService.signIn(email, password);
    return result.ok ? null : result.error;
  };

  const signUp = async (email: string, password: string): Promise<string | null> => {
    const result = await authService.signUp(email, password);
    return result.ok ? null : result.error;
  };

  const signOut = async (): Promise<void> => {
    await authService.signOut();
  };

  const value = useMemo(
    () => ({ state, signIn, signUp, signOut }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
