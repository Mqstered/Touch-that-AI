import React from 'react';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

type PrimaryButtonProps = PressableProps & {
  title: string;
};

export function PrimaryButton({ title, style, ...props }: PrimaryButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.backgroundSelected, opacity: pressed ? 0.92 : 1 },
        style,
      ]}
      {...props}
    >
      <ThemedText type="smallBold" style={styles.buttonText}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    letterSpacing: 0.5,
  },
});
