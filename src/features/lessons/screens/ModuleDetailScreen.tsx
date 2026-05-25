import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ProgressBar } from '@/components/progress-bar';
import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { useLearning } from '@/hooks/use-learning';

export default function ModuleDetailScreen() {
  const router = useRouter();
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const { modules, practiceModule } = useLearning();

  const module = modules.find((item) => item.id === moduleId);

  if (!module) {
    return (
      <ScreenShell>
        <ThemedText type="title">Module not found</ThemedText>
        <PrimaryButton title="Go back" onPress={() => router.back()} />
      </ScreenShell>
    );
  }

  return (
    <AuthGuard>
    <ScreenShell>
      <View style={styles.hero}>
        <ThemedText type="title" style={styles.title}>
          {module.title}
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          {module.subtitle}
        </ThemedText>
      </View>

      <ThemedView type="backgroundElement" style={styles.card}>
        <View style={styles.metricRow}>
          <ThemedText type="smallBold">Mastery</ThemedText>
          <ThemedText type="smallBold">{module.mastery}%</ThemedText>
        </View>
        <ProgressBar value={module.progress} style={styles.progress} />
        <ThemedText type="default" style={styles.bodyText}>
          {module.description}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Last update: {module.updatedAt}
        </ThemedText>
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold">Practice brief</ThemedText>
        <ThemedText type="default" style={styles.bodyText}>
          {module.focus} Use the button below to mark a short review session complete and improve
          your mastery score.
        </ThemedText>
        <PrimaryButton
          title="Review this module"
          onPress={() => practiceModule(module.id)}
        />
      </ThemedView>

      <Pressable onPress={() => router.back()} style={styles.linkRow}>
        <ThemedText type="link">Back to explore</ThemedText>
      </Pressable>
    </ScreenShell>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: Spacing.six,
  },
  title: {
    marginBottom: Spacing.two,
  },
  subtitle: {
    maxWidth: 720,
    lineHeight: 40,
  },
  card: {
    width: '100%',
    borderRadius: Spacing.four,
    padding: Spacing.four,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progress: {
    marginVertical: Spacing.two,
  },
  bodyText: {
    marginBottom: Spacing.two,
  },
  linkRow: {
    marginTop: Spacing.two,
  },
});
