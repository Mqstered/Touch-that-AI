import React from 'react';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { LearningModule } from '@/types';

const PurpleTheme = {
  cardBg: 'rgba(232, 204, 255, 0.88)',
  cardBorder: '#6B21A8',
  textPrimary: '#7e22ce',
  textSecondary: '#a21caf',
  shadow: '#c084fc',
  accent: '#9333ea',
};

type PracticeCardProps = {
  module: LearningModule;
  onPractice: () => void;
};

export function PracticeCard({ module, onPractice }: PracticeCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={{ color: PurpleTheme.textPrimary }}>
          {module.title}
        </ThemedText>
        <ThemedText type="smallBold" style={{ color: PurpleTheme.accent }}>
          {module.mastery}%
        </ThemedText>
      </View>
      <ProgressBar
        value={module.progress}
        style={styles.progress}
        trackColor="rgba(255,255,255,0.7)"
        fillColor="#a855f7"
      />
      <ThemedText type="default" style={styles.focus}>
        {module.focus}
      </ThemedText>
      <PrimaryButton title="Practice now" onPress={onPractice} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    backgroundColor: PurpleTheme.cardBg,
    borderWidth: 1,
    borderColor: PurpleTheme.cardBorder,
    shadowColor: PurpleTheme.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
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
    color: PurpleTheme.textSecondary,
  },
});
