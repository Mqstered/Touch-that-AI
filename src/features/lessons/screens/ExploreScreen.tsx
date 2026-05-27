import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";

import { ModuleCard } from "@/components/module-card";
import { PromptLab } from "@/components/prompt-lab";
import { ScreenShell } from "@/components/screen-shell";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LessonFinder } from "@/features/lessons/components/LessonFinder";
import { PersonalizedPathCard } from "@/features/personalization/components/PersonalizedPathCard";
import { usePersonalizedLearning } from "@/features/personalization/hooks/usePersonalizedLearning";
import { MasteryOverview } from "@/features/progress/components/MasteryOverview";
import { useUserProgress } from "@/features/progress/hooks/useUserProgress";
import { RecommendationList } from "@/features/recommendations/components/RecommendationList";
import { useRecommendations } from "@/features/recommendations/hooks/useRecommendations";
import { useLearning } from "@/hooks/use-learning";
import { fetchNextPracticeLesson } from "@/services/lessons.service";

export default function ExploreScreen() {
  const router = useRouter();
  const { state } = useAuth();
  const { modules, totalLessons } = useLearning();
  const { progress, averageMastery } = useUserProgress();
  const { recommendations, refresh } = useRecommendations();
  const {
    profile,
    insight,
    loading: pathLoading,
    refreshing: pathRefreshing,
    refreshPath,
  } = usePersonalizedLearning();

  useFocusEffect(
    useCallback(() => {
      refreshPath().then(() => refresh());
    }, [refresh, refreshPath]),
  );

  return (
    <AuthGuard>
      <ScreenShell>
        <View style={styles.backgroundGlowLarge} />
        <View style={styles.backgroundGlowSmall} />

        <View style={styles.hero}>
          <ThemedText type="title" style={styles.title}>
            Let The Unicorn Guide You
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Play Around And Find Out
          </ThemedText>
        </View>

        <ThemedView type="backgroundElement" style={styles.introCard}>
          <ThemedText type="smallBold" style={styles.cardHeading}>
            Your Growth, Your Way
          </ThemedText>
          <ThemedText type="default" style={styles.cardText}>
            Every challenge is an opportunity
          </ThemedText>
        </ThemedView>

        <MasteryOverview
          averageMastery={averageMastery}
          totalLessons={totalLessons}
        />

        <LessonFinder />

        <PersonalizedPathCard
          profile={profile}
          insight={insight}
          loading={pathLoading}
          refreshing={pathRefreshing}
          onRefresh={refreshPath}
        />

        <View style={styles.moduleList}>
          {modules.map((module) => {
            const moduleProgress =
              progress.find((p) => p.moduleId === module.id) || null;
            return (
              <ModuleCard
                key={module.id}
                module={module}
                progress={moduleProgress}
                onPress={() =>
                  router.push({
                    pathname: "/lesson/[moduleSlug]",
                    params: { moduleSlug: module.id },
                  })
                }
                onPractice={async () => {
                  if (state.status === "authenticated") {
                    const next = await fetchNextPracticeLesson(
                      state.session.user.id,
                      module.id,
                    );
                    if (next.ok && next.data) {
                      router.push({
                        pathname: "/lesson/practice",
                        params: {
                          lessonId: next.data.id,
                          moduleSlug: module.id,
                        },
                      });
                      return;
                    }
                  }
                  router.push({
                    pathname: "/lesson/[moduleSlug]",
                    params: { moduleSlug: module.id },
                  });
                }}
              />
            );
          })}
        </View>

        <RecommendationList
          recommendations={recommendations}
          onModulePress={(slug, lessonId) => {
            router.push({
              pathname: "/lesson/[moduleSlug]",
              params: lessonId
                ? { moduleSlug: slug, lessonId }
                : { moduleSlug: slug },
            });
          }}
        />

        <View style={styles.playgroundWrapper}>
          <PromptLab />
        </View>
      </ScreenShell>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: Spacing.six,
    position: "relative",
    zIndex: 2,
  },
  title: {
    marginBottom: Spacing.two,
    color: "#c493f9",
    textShadowColor: "rgba(168, 85, 247, 0.5)",
    textShadowRadius: 16,
  },
  subtitle: {
    maxWidth: 760,
    lineHeight: 36,
    color: "#f9a8d4",
  },
  introCard: {
    width: "100%",
    borderRadius: 28,
    padding: Spacing.four,
    marginBottom: Spacing.five,
    backgroundColor: "rgba(30, 30, 40, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
    shadowColor: "#9333ea",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  cardHeading: {
    color: "#e9d5ff",
  },
  cardText: {
    marginTop: Spacing.two,
    lineHeight: 24,
    color: "#d8b4fe",
  },
  moduleList: {
    width: "100%",
    marginBottom: Spacing.five,
    zIndex: 2,
  },
  playgroundWrapper: {
    width: "100%",
    zIndex: 2,
  },
  backgroundGlowLarge: {
    position: "absolute",
    width: 370,
    height: 370,
    borderRadius: 999,
    backgroundColor: "rgba(152, 41, 255, 0.12)",
    top: 40,
    right: -120,
  },
  backgroundGlowSmall: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(219,39,119,0.2)",
    bottom: 80,
    left: -80,
  },
});
