import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { LearningModule } from '@/data/learning-modules';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProgressBar } from '@/components/progress-bar';
import { Spacing } from '@/constants/theme';

type ModuleCardProps = {
  module: LearningModule;
  onPress: () => void;
  onPractice: () => void;
};

export function ModuleCard({ module, onPress, onPractice }: ModuleCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <Pressable onPress={onPress} style={styles.pressable}>
        <View style={styles.header}>
          <ThemedText type="smallBold">{module.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {module.category}
          </ThemedText>
        </View>
        <ThemedText type="default" style={styles.description}>
          {module.subtitle}
        </ThemedText>

        <View style={styles.progressRow}>
          <ProgressBar value={module.progress} style={styles.progress} />
          <ThemedText type="smallBold">{module.progress}%</ThemedText>
        </View>
      </Pressable>

      <Pressable style={styles.practiceButton} onPress={onPractice}>
        <ThemedText type="smallBold">Practice</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    marginBottom: Spacing.three,
  },
  pressable: {
    marginBottom: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  progress: {
    flex: 1,
  },
  practiceButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
  },
});
