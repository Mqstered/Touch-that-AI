import React, { type ReactNode } from 'react';

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  return <>{children}</>;
}
