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
          <ThemedText type="smallBold" style={{ color: '#7e22ce' }}>{module.title}</ThemedText>
          <ThemedText type="small" style={{ color: '#a21caf' }}>
            {module.category}
          </ThemedText>
        </View>
        <ThemedText type="default" style={[styles.description, { color: '#9333ea' }]}>
          {module.subtitle}
        </ThemedText>

        <View style={styles.progressRow}>
          <ProgressBar value={progressPercentage} style={styles.progress} trackColor="rgba(255,255,255,0.7)" fillColor="#a855f7" />
          <ThemedText type="smallBold" style={{ color: '#7e22ce' }}>{progressPercentage}%</ThemedText>
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
    backgroundColor: 'rgba(232, 204, 255, 0.88)',
    borderWidth: 1,
    borderColor: '#6B21A8',
    shadowColor: '#c084fc',
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
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
