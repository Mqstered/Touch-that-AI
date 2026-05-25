import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

function getInitials(email: string): string {
  return email.slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const { state, signOut } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  if (state.status !== 'authenticated') return null;

  const { user } = state.session;
  const label = user.displayName ?? user.email;
  const initials = getInitials(user.displayName ?? user.email);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.avatar, { backgroundColor: '#9333ea' }]}
        accessibilityLabel="Open user menu"
        accessibilityRole="button"
      >
        <Text style={styles.avatarText}>{initials}</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.dropdown, { backgroundColor: theme.background, borderColor: theme.backgroundSelected }]}>
                <View style={styles.dropdownHeader}>
                  <View style={[styles.avatarLarge, { backgroundColor: '#9333ea' }]}>
                    <Text style={styles.avatarLargeText}>{initials}</Text>
                  </View>
                  <View style={styles.dropdownInfo}>
                    {user.displayName ? (
                      <Text style={[styles.displayName, { color: theme.text }]} numberOfLines={1}>
                        {user.displayName}
                      </Text>
                    ) : null}
                    <Text style={[styles.email, { color: theme.textSecondary }]} numberOfLines={1}>
                      {user.email}
                    </Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.backgroundSelected }]} />

                <Pressable
                  onPress={handleSignOut}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && { backgroundColor: theme.backgroundElement },
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={[styles.menuItemText, { color: '#ef4444' }]}>Sign out</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: Spacing.four,
  },
  dropdown: {
    width: 240,
    borderRadius: Spacing.three,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.two,
  },
  avatarLarge: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarLargeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  dropdownInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.three,
  },
  menuItem: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
