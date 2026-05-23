import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { User } from '@/types';

type ProfileCardProps = {
  user: User;
};

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.row}>
        <ThemedText type="smallBold">{user.displayName ?? user.email}</ThemedText>
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        {user.email}
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
    marginBottom: Spacing.one,
  },
});
