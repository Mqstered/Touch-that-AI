import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ModuleCard } from "@/components/module-card";
import { PromptPlayground } from "@/components/prompt-playground";
import { ScreenShell } from "@/components/screen-shell";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useLearning } from "@/hooks/use-learning";

export default function ExploreScreen() {
  const router = useRouter();
  const { modules, practiceModule } = useLearning();

  return (
    <ScreenShell>
      <View style={styles.hero}>
        <ThemedText type="title" style={styles.title}>
          Explore AI learning
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Review your modules, practice quickly, and experiment with AI prompts
          in one place.
        </ThemedText>
      </View>

      <ThemedView type="backgroundElement" style={styles.introCard}>
        <ThemedText type="smallBold">Knowledge tracing</ThemedText>
        <ThemedText type="default" style={styles.cardText}>
          Each module has a mastery score that improves when you practice. The
          app tracks progress across your learning path.
        </ThemedText>
      </ThemedView>

      <View style={styles.moduleList}>
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onPress={() => router.push(`/module/${module.id}`)}
            onPractice={() => practiceModule(module.id)}
          />
        ))}
      </View>

      <PromptPlayground />
    </ScreenShell>
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
    maxWidth: 760,
    lineHeight: 40,
  },
  introCard: {
    width: "100%",
    borderRadius: Spacing.four,
    padding: Spacing.four,
    marginBottom: Spacing.five,
  },
  cardText: {
    marginTop: Spacing.two,
    lineHeight: 22,
  },
  moduleList: {
    width: "100%",
    marginBottom: Spacing.five,
  },
});
