import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type MasteryOverviewProps = {
  averageMastery: number;
  totalLessons: number;
};

export function MasteryOverview({ averageMastery, totalLessons }: MasteryOverviewProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <ThemedText type="smallBold" style={{ color: '#e9d5ff' }}>Overall Mastery</ThemedText>
        <ThemedText type="smallBold" style={{ color: '#e9d5ff' }}>{averageMastery}%</ThemedText>
      </View>
      <ProgressBar value={averageMastery} style={styles.bar} />
      <ThemedText type="small" style={{ color: '#d8b4fe' }}>
        {totalLessons} lessons available
      </ThemedText>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  bar: {
    marginBottom: Spacing.two,
  },
});
