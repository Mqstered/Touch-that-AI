import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type ProgressBarProps = {
  value: number;
  style?: ViewStyle;
};

export function ProgressBar({ value, style }: ProgressBarProps) {
  const theme = useTheme();
  const progressWidth = `${Math.min(100, Math.max(0, value))}%`;

  return (
    <View style={[styles.track, { backgroundColor: theme.backgroundElement }, style]}>
      <View style={[styles.fill, { width: progressWidth, backgroundColor: theme.text }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
