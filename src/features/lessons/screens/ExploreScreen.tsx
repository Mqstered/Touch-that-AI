import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ModuleCard } from '@/components/module-card';
import { PromptPlayground } from '@/components/prompt-playground';
import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { MasteryOverview } from '@/features/progress/components/MasteryOverview';
import { useUserProgress } from '@/features/progress/hooks/useUserProgress';
import { RecommendationList } from '@/features/recommendations/components/RecommendationList';
import { useRecommendations } from '@/features/recommendations/hooks/useRecommendations';
import { useLearning } from '@/hooks/use-learning';

export default function ExploreScreen() {
  const router = useRouter();
  const { modules, practiceModule, totalLessons } = useLearning();
  const { averageMastery } = useUserProgress();
  const { recommendations } = useRecommendations();

  return (
    <AuthGuard>
    <ScreenShell>
      <View style={styles.backgroundGlowLarge} />
      <View style={styles.backgroundGlowSmall} />

      <View style={styles.hero}>
        <ThemedText type="title" style={styles.title}>
          Command Intelligence
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Experiment, improve, and unlock real-world AI abilities through interactive missions.
        </ThemedText>
      </View>

      <ThemedView type="backgroundElement" style={styles.introCard}>
        <ThemedText type="smallBold" style={styles.cardHeading}>
          Your AI Growth
        </ThemedText>
        <ThemedText type="default" style={styles.cardText}>
          Every challenge strengthens your prompting, creativity, and AI problem-solving skills.
        </ThemedText>
      </ThemedView>

      <MasteryOverview
        averageMastery={averageMastery}
        totalLessons={totalLessons}
      />

      <View style={styles.moduleList}>
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onPress={() => router.push(`/lesson/${module.id}`)}
            onPractice={() => practiceModule(module.id)}
          />
        ))}
      </View>

      <RecommendationList
        recommendations={recommendations}
        onModulePress={(id) => router.push(`/lesson/${id}`)}
      />

      <View style={styles.playgroundWrapper}>
        <PromptPlayground />
      </View>
    </ScreenShell>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: Spacing.six,
    position: 'relative',
    zIndex: 2,
  },
  title: {
    marginBottom: Spacing.two,
    color: '#6b21a8',
    textShadowColor: 'rgba(168, 85, 247, 0.35)',
    textShadowRadius: 16,
  },
  subtitle: {
    maxWidth: 760,
    lineHeight: 36,
    color: '#db2777',
  },
  introCard: {
    width: '100%',
    borderRadius: 28,
    padding: Spacing.four,
    marginBottom: Spacing.five,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.3)',
    shadowColor: '#c084fc',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  cardHeading: {
    color: '#7e22ce',
  },
  cardText: {
    marginTop: Spacing.two,
    lineHeight: 24,
    color: '#a21caf',
  },
  moduleList: {
    width: '100%',
    marginBottom: Spacing.five,
    zIndex: 2,
  },
  playgroundWrapper: {
    width: '100%',
    zIndex: 2,
  },
  backgroundGlowLarge: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: 'rgba(192,132,252,0.18)',
    top: -80,
    right: -120,
  },
  backgroundGlowSmall: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(236,72,153,0.14)',
    bottom: 80,
    left: -80,
  },
});
