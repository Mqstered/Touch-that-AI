import React from 'react';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { LearningModule } from '@/types';

type PracticeCardProps = {
  module: LearningModule;
  onPractice: () => void;
};

export function PracticeCard({ module, onPractice }: PracticeCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="smallBold">{module.title}</ThemedText>
        <ThemedText type="smallBold">{module.mastery}%</ThemedText>
      </View>
      <ProgressBar value={module.progress} style={styles.progress} />
      <ThemedText type="default" style={styles.focus}>
        {module.focus}
      </ThemedText>
      <PrimaryButton title="Practice now" onPress={onPractice} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  progress: {
    marginBottom: Spacing.three,
  },
  focus: {
    marginBottom: Spacing.three,
  },
});
