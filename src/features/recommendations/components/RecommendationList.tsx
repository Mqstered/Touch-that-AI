import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { LearningModule } from '@/types';

type RecommendationListProps = {
  modules: LearningModule[];
  onModulePress: (moduleId: string) => void;
};

export function RecommendationList({ modules, onModulePress }: RecommendationListProps) {
  if (modules.length === 0) return null;

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" style={styles.heading}>
        Recommended for you
      </ThemedText>
      {modules.map((module) => (
        <ThemedView
          key={module.id}
          type="backgroundElement"
          style={styles.card}
          onTouchEnd={() => onModulePress(module.id)}
        >
          <ThemedText type="smallBold">{module.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {module.mastery}% mastery · {module.category}
          </ThemedText>
        </ThemedView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  heading: {
    marginBottom: Spacing.two,
  },
  card: {
    width: '100%',
    borderRadius: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
});
