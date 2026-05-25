import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface BackButtonProps {
  onPress?: () => void;
  themeColor?: 'text' | 'textSecondary';
  size?: 'small' | 'medium';
  showText?: boolean;
  text?: string;
}

export function BackButton({ 
  onPress, 
  themeColor = 'text', 
  size = 'medium',
  showText = true,
  text = 'Back'
}: BackButtonProps) {
  const router = useRouter();
  const theme = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  const fontSize = size === 'small' ? 14 : 16;
  const padding = size === 'small' ? Spacing.one : Spacing.two;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { 
          opacity: pressed ? 0.7 : 1,
          padding,
        }
      ]}
      onPress={handlePress}
    >
      <ThemedText 
        type="small" 
        themeColor={themeColor}
        style={[styles.text, { fontSize }]}
      >
        ← {showText ? text : ''}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 8,
    minWidth: 60,
  },
  text: {
    fontWeight: '500',
  },
});
