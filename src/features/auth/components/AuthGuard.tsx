import { useRouter } from 'expo-router';
import React, { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/features/auth/hooks/useAuth';

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.status === 'unauthenticated') {
      router.replace('/(auth)/sign-in');
    }
  }, [state.status]);

  if (state.status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (state.status === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
