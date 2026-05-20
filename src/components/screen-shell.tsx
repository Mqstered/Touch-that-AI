import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, type ViewProps } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export function ScreenShell({ style, ...props }: ViewProps) {
  return (
    <ThemedView style={[styles.container, style]} {...props}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          {props.children}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
});
