import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type ProgressBarProps = {
  value: number;
  style?: ViewStyle;
  trackColor?: string;
  fillColor?: string;
};

export function ProgressBar({ value, style, trackColor, fillColor }: ProgressBarProps) {
  const theme = useTheme();
  const progressWidth: `${number}%` =
    `${Math.min(100, Math.max(0, value))}%`;

  return (
    <View style={[styles.track, { backgroundColor: trackColor ?? theme.backgroundElement }, style]}>
      <View style={[styles.fill, { width: progressWidth, backgroundColor: fillColor ?? '#a855f7' }]} />
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
