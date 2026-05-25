import { Stack } from 'expo-router';

import { AuthProvider } from '@/context/auth-context';
import { LearningProvider } from '@/context/learning-context';

export default function Layout() {
  return (
    <AuthProvider>
      <LearningProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </LearningProvider>
    </AuthProvider>
  );
}
