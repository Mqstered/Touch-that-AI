import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { LearningModule } from '@/data/learning-modules';
import type { ProgressEntry } from '@/types';

type ModuleCardProps = {
  module: LearningModule;
  progress?: ProgressEntry | null;
  onPress: () => void;
  onPractice: () => void;
};

export function ModuleCard({ module, progress, onPress, onPractice }: ModuleCardProps) {
  // Calculate real progress percentage from user data
  const progressPercentage = progress 
    ? Math.round((progress.completedLessons / module.lessons) * 100)
    : 0;

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.pressable}>
        <View style={styles.header}>
          <ThemedText type="smallBold" style={{ color: '#e9d5ff' }}>{module.title}</ThemedText>
          <ThemedText type="small" style={{ color: '#d8b4fe' }}>
            {module.category}
          </ThemedText>
        </View>
        <ThemedText type="default" style={[styles.description, { color: '#f9a8d4' }]}>
          {module.subtitle}
        </ThemedText>

        <View style={styles.progressRow}>
          <ProgressBar value={progressPercentage} style={styles.progress} />
          <ThemedText type="smallBold" style={{ color: '#e9d5ff' }}>{progressPercentage}%</ThemedText>
        </View>
      </Pressable>

      <Pressable style={styles.practiceButton} onPress={onPractice}>
        <ThemedText type="smallBold" style={{ color: '#ffffff' }}>Practice</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    backgroundColor: 'rgba(30, 30, 40, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    shadowColor: '#9333ea',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
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
    backgroundColor: '#9333ea',
    borderWidth: 1,
    borderColor: '#a855f7',
  },
});
