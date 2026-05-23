export type User = {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
};

export type AuthSession = {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; session: AuthSession }
  | { status: 'unauthenticated' };
