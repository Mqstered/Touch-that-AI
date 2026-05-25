import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { fetchPlaygroundResponse } from '@/services/ai.service';

const WEAK_EXAMPLE = 'Plan my day.';
const STRONG_EXAMPLE =
  'Plan my day. I work 9 AM–6 PM, want 30 minutes of exercise, and need 1 hour to study. Give it as a table.';

export function PromptPlayground() {
  const theme = useTheme();
  const [prompt, setPrompt] = useState('Explain why prompt structure matters');
  const [response, setResponse] = useState(
    'Enter a prompt and tap Generate to try the AI playground.',
  );
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'default' | 'weak' | 'strong'>('default');

  const handleGenerate = async () => {
    setLoading(true);
    const text = await fetchPlaygroundResponse(prompt, mode);
    setResponse(text);
    setLoading(false);
  };

  const applyExample = (text: string, exampleMode: 'weak' | 'strong') => {
    setPrompt(text);
    setMode(exampleMode);
  };

  const helperText = useMemo(
    () => `Try: "${prompt ? prompt : 'Create a learning prompt...'}"`,
    [prompt],
  );

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold">AI prompt playground</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
        Test prompts with Gemini Flash (via secure backend). Compare weak vs strong examples.
      </ThemedText>

      <View style={styles.exampleRow}>
        <Pressable
          style={[styles.exampleBtn, { borderColor: theme.backgroundSelected }]}
          onPress={() => applyExample(WEAK_EXAMPLE, 'weak')}
        >
          <ThemedText type="small">Weak example</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.exampleBtn, { borderColor: theme.backgroundSelected }]}
          onPress={() => applyExample(STRONG_EXAMPLE, 'strong')}
        >
          <ThemedText type="small">Strong example</ThemedText>
        </Pressable>
      </View>

      <TextInput
        value={prompt}
        placeholder="Ask your AI coach..."
        placeholderTextColor={theme.textSecondary}
        onChangeText={(text) => {
          setPrompt(text);
          setMode('default');
        }}
        style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        multiline
      />

      <Pressable
        style={[styles.button, { backgroundColor: theme.text }]}
        onPress={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <ThemedText type="smallBold" style={styles.buttonText}>
            Generate
          </ThemedText>
        )}
      </Pressable>

      <ThemedView type="backgroundSelected" style={styles.responseCard}>
        <ThemedText type="smallBold">Response</ThemedText>
        <ThemedText type="default" style={styles.responseText}>
          {response}
        </ThemedText>
      </ThemedView>

      <ThemedText type="small" themeColor="textSecondary">
        {helperText}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: Spacing.four,
    padding: Spacing.four,
  },
  hint: {
    marginTop: Spacing.one,
    marginBottom: Spacing.two,
  },
  exampleRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  exampleBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    minHeight: 100,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  responseCard: {
    marginTop: Spacing.two,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  responseText: {
    marginTop: Spacing.one,
    lineHeight: 22,
  },
});
