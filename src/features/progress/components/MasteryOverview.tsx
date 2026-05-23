import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type MasteryOverviewProps = {
  averageMastery: number;
  totalLessons: number;
};

export function MasteryOverview({ averageMastery, totalLessons }: MasteryOverviewProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.row}>
        <ThemedText type="smallBold">Overall Mastery</ThemedText>
        <ThemedText type="smallBold">{averageMastery}%</ThemedText>
      </View>
      <ProgressBar value={averageMastery} style={styles.bar} />
      <ThemedText type="small" themeColor="textSecondary">
        {totalLessons} lessons available
      </ThemedText>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  bar: {
    marginBottom: Spacing.two,
  },
});
