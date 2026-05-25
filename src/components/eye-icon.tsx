import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type EyeIconProps = {
  visible: boolean;
  onPress: () => void;
};

export function EyeIcon({ visible, onPress }: EyeIconProps) {
  const theme = useTheme();
  
  return (
    <View style={styles.container} onTouchEnd={onPress}>
      <Text style={[styles.icon, { color: theme.textSecondary }]}>
        {visible ? '👁️' : '👁️‍🗨️'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    lineHeight: 18,
  },
});
