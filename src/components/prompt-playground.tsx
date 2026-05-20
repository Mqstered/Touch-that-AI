import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

function simulateAiResponse(prompt: string) {
  const normalized = prompt.trim().toLowerCase();
  if (!normalized) {
    return 'Enter a prompt and tap Generate to see an AI-friendly learning answer.';
  }

  if (normalized.includes('prompt') || normalized.includes('instruction')) {
    return 'A strong AI prompt is clear, goal-oriented, and includes examples or formatting instructions. Focus on what you want, how you want it, and who it is for.';
  }

  if (normalized.includes('safety') || normalized.includes('ethical')) {
    return 'AI safety is about controlling bias, avoiding harmful content, and giving the model explicit guardrails. Use safe prompts and verify outputs carefully.';
  }

  if (normalized.includes('learn') || normalized.includes('study')) {
    return 'To learn effectively, break the topic into bite-sized steps, practice with examples, and revisit the hardest concepts until they feel comfortable.';
  }

  return 'This AI demo answer is based on your prompt. In a live integration, the model would return a detailed response tailored to your request.';
}

export function PromptPlayground() {
  const theme = useTheme();
  const [prompt, setPrompt] = useState('Explain why prompt structure matters');
  const [response, setResponse] = useState(simulateAiResponse(prompt));

  const handleGenerate = () => {
    setResponse(simulateAiResponse(prompt));
  };

  const helperText = useMemo(
    () => `Try: "${prompt ? prompt : 'Create a learning prompt...'}"`,
    [prompt],
  );

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold">AI prompt playground</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
        Use this demo to craft a learning-focused request and preview a simulated AI response.
      </ThemedText>

      <TextInput
        value={prompt}
        placeholder="Ask your AI coach..."
        placeholderTextColor={theme.textSecondary}
        onChangeText={setPrompt}
        style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        multiline
      />

      <Pressable style={[styles.button, { backgroundColor: theme.text }]} onPress={handleGenerate}>
        <ThemedText type="smallBold" style={styles.buttonText}>
          Generate
        </ThemedText>
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
