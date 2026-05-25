import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import { Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTheme } from '@/hooks/use-theme';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const passwordInputRef = useRef<TextInput>(null);
  const confirmInputRef = useRef<TextInput>(null);

  // Floating particles animation
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize floating particles
  useEffect(() => {
    const createFloating = (anim: Animated.Value, duration: number) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -20, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 20, duration, useNativeDriver: true }),
        ]),
      );
      loop.start();
      return loop;
    };

    const l1 = createFloating(particle1, 4000);
    const l2 = createFloating(particle2, 5000);
    const l3 = createFloating(particle3, 6000);

    return () => { l1.stop(); l2.stop(); l3.stop(); };
  }, [particle1, particle2, particle3]);

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
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Floating particles */}
        <Animated.View
          style={[styles.particleLarge, { top: 120, left: 40, transform: [{ translateY: particle1 }] }]}
        />
        <Animated.View
          style={[styles.particleMedium, { bottom: 150, right: 60, transform: [{ translateY: particle2 }] }]}
        />
        <Animated.View
          style={[styles.particleSmall, { top: 250, right: 120, transform: [{ translateY: particle3 }] }]}
        />

        <View style={styles.inner}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Start your AI learning journey
          </Text>

        <TextInput
          style={[styles.input, { color: '#1f2937', borderColor: '#d8b4fe', backgroundColor: '#ffffff' }]}
          placeholder="Email"
          placeholderTextColor="#9ca3af"
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
            style={[styles.input, styles.passwordInput, { color: '#1f2937', borderColor: '#d8b4fe', backgroundColor: '#ffffff' }]}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={Platform.OS === 'web' ? () => confirmInputRef.current?.focus() : undefined}
            blurOnSubmit={false}
            returnKeyType="next"
          />
          <Pressable 
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.passwordToggleText}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            ref={confirmInputRef}
            style={[styles.input, styles.passwordInput, { color: '#1f2937', borderColor: '#d8b4fe', backgroundColor: '#ffffff' }]}
            placeholder="Confirm password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showConfirm}
            value={confirm}
            onChangeText={setConfirm}
            onSubmitEditing={Platform.OS === 'web' ? handleSignUp : undefined}
            blurOnSubmit={true}
            returnKeyType="done"
          />
          <Pressable 
            style={styles.passwordToggle}
            onPress={() => setShowConfirm(!showConfirm)}
          >
            <Text style={styles.passwordToggleText}>
              {showConfirm ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <Pressable
          style={[styles.button, { backgroundColor: '#9333ea' }, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Create account</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.link}>
          <Text style={styles.linkText}>
            Already have an account?{' '}
            <Text style={styles.linkTextHighlight}>Sign in</Text>
          </Text>
        </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f3e8ff',
    overflow: 'hidden',
  },
  keyboardView: {
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
    color: '#6b21a8',
    marginBottom: Spacing.two,
    textAlign: 'center',
    textShadowColor: 'rgba(107, 33, 168, 0.3)',
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#db2777',
    marginBottom: Spacing.five,
    textAlign: 'center',
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
    position: 'relative',
    marginBottom: Spacing.three,
  },
  passwordInput: {
    marginBottom: 0,
  },
  passwordToggle: {
    position: 'absolute',
    right: Spacing.three,
    top: Spacing.three,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  passwordToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7e22ce',
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
    color: '#ffffff',
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
    color: '#7e22ce',
  },
  linkTextHighlight: {
    color: '#6b21a8',
    fontWeight: '600',
  },
  // Floating particles
  particleLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(192, 132, 252, 0.18)',
  },
  particleMedium: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
  },
  particleSmall: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 999,
    backgroundColor: 'rgba(147, 51, 234, 0.12)',
  },
});
