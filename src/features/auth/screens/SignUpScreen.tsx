import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const errorMessage = await signUp(email.trim(), password);
    setLoading(false);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      router.replace('/explore');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={[styles.title, { color: theme.text }]}>Create account</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Start your AI learning journey
        </Text>

        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          placeholder="Email"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          placeholder="Password"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          placeholder="Confirm password"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <Pressable
          style={[styles.button, { backgroundColor: theme.text }, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.background }]}>Create account</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.link}>
          <Text style={[styles.linkText, { color: theme.textSecondary }]}>
            Already have an account?{' '}
            <Text style={{ color: theme.text }}>Sign in</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: Spacing.five,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    marginBottom: Spacing.three,
  },
  button: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: Spacing.two,
  },
  link: {
    marginTop: Spacing.four,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
});
