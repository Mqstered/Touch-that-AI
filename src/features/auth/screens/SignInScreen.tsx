import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
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

import { EyeIcon } from '@/components/eye-icon';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTheme } from '@/hooks/use-theme';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const passwordInputRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    const errorMessage = await signIn(email.trim(), password);
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
        <Text style={[styles.title, { color: theme.text }]}>Sign in</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Welcome back to Touch That AI
        </Text>

        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          placeholder="Email"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={Platform.OS === 'web' ? () => passwordInputRef.current?.focus() : undefined}
          blurOnSubmit={false}
          returnKeyType="next"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            ref={passwordInputRef}
            style={[styles.input, styles.passwordInput, { color: theme.text, borderColor: theme.backgroundSelected }]}
            placeholder="Password"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={Platform.OS === 'web' ? handleSignIn : undefined}
            blurOnSubmit={true}
            returnKeyType="done"
          />
          <EyeIcon 
            visible={showPassword} 
            onPress={() => setShowPassword(!showPassword)} 
          />
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <Pressable
          style={[styles.button, { backgroundColor: theme.text }, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.background }]}>Sign in</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.push('/(auth)/sign-up' as never)} style={styles.link}>
          <Text style={[styles.linkText, { color: theme.textSecondary }]}>
            No account?{' '}
            <Text style={{ color: theme.text }}>Sign up</Text>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  passwordInput: {
    flex: 1,
    marginRight: Spacing.one,
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
