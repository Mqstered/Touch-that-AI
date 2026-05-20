import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/primary-button';
import { ProgressBar } from '@/components/progress-bar';
import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLearning } from '@/hooks/use-learning';
import { Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { modules, averageMastery, totalLessons } = useLearning();

  const nextModule = modules.reduce((current, item) => {
    return item.mastery < current.mastery ? item : current;
  }, modules[0]);

  return (
    <ScreenShell>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Touch That AI
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          A clean AI learning demo with progress tracking and interactive practice.
        </ThemedText>
      </View>

      <ThemedView type="backgroundElement" style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View>
            <ThemedText type="smallBold">Overall mastery</ThemedText>
            <ThemedText type="title" style={styles.metricText}>
              {averageMastery}%
            </ThemedText>
          </View>
          <View>
            <ThemedText type="smallBold">Lessons</ThemedText>
            <ThemedText type="title" style={styles.metricText}>
              {totalLessons}
            </ThemedText>
          </View>
        </View>
        <ProgressBar value={averageMastery} style={styles.overallProgress} />
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.sectionCard}>
        <ThemedText type="smallBold">Next practice</ThemedText>
        <ThemedText type="default" style={styles.sectionText}>
          {nextModule.title} — {nextModule.subtitle}
        </ThemedText>
        <PrimaryButton title="Open Explore" onPress={() => router.push('/explore')} />
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.sectionCard}>
        <ThemedText type="smallBold">How it works</ThemedText>
        <ThemedText type="default" style={styles.sectionText}>
          Track module mastery, practice with short review sessions, and use the prompt playground to explore AI knowledge concepts.
        </ThemedText>
      </ThemedView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.six,
  },
  title: {
    marginBottom: Spacing.two,
  },
  subtitle: {
    maxWidth: 700,
    lineHeight: 40,
  },
  summaryCard: {
    width: '100%',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    marginBottom: Spacing.five,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  metricText: {
    marginTop: Spacing.one,
  },
  overallProgress: {
    marginTop: Spacing.four,
  },
  sectionCard: {
    width: '100%',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    marginBottom: Spacing.five,
  },
  sectionText: {
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
    lineHeight: 22,
  },
});
