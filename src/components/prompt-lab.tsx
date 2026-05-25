import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { scorePrompt } from '@/lib/scoring';
import { fetchPromptCompare } from '@/services/ai.service';

const DEFAULT_WEAK = 'Plan my day.';
const DEFAULT_STRONG =
  'Plan my day. I work 9 AM–6 PM, want 30 minutes of exercise, and need 1 hour to study. Give it as a table.';

export function PromptLab() {
  const theme = useTheme();
  const [weakPrompt, setWeakPrompt] = useState(DEFAULT_WEAK);
  const [strongPrompt, setStrongPrompt] = useState(DEFAULT_STRONG);
  const [weakResponse, setWeakResponse] = useState<string | null>(null);
  const [strongResponse, setStrongResponse] = useState<string | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const liveScore = useMemo(() => scorePrompt(strongPrompt), [strongPrompt]);
  const scorePct = Math.round((liveScore.total / 10) * 100);

  const handleCompare = async () => {
    setLoading(true);
    setWeakResponse(null);
    setStrongResponse(null);
    setTip(null);

    const result = await fetchPromptCompare(weakPrompt, strongPrompt);
    setWeakResponse(result.weakText);
    setStrongResponse(result.strongText);
    setTip(result.comparisonTip);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" style={{ color: '#e9d5ff' }}>Prompt Lab — A/B Compare</ThemedText>
      <ThemedText type="small" style={[styles.hint, { color: '#d8b4fe' }]}>
        See how the same goal gets different AI answers when your prompt adds context,
        constraints, and format. Live rubric score updates as you edit the strong prompt.
      </ThemedText>

      <ThemedText type="smallBold" style={[styles.sectionLabel, { color: '#e9d5ff' }]}>
        Weak prompt
      </ThemedText>
      <TextInput
        value={weakPrompt}
        onChangeText={setWeakPrompt}
        style={[styles.input, { color: '#1f2937', borderColor: '#d8b4fe', backgroundColor: '#ffffff' }]}
        multiline
        placeholderTextColor="#9ca3af"
      />

      <ThemedText type="smallBold" style={[styles.sectionLabel, { color: '#e9d5ff' }]}>
        Strong prompt
      </ThemedText>
      <TextInput
        value={strongPrompt}
        onChangeText={setStrongPrompt}
        style={[styles.input, { color: '#1f2937', borderColor: '#22c55e', backgroundColor: '#ffffff' }]}
        multiline
        placeholderTextColor="#9ca3af"
      />

      <View style={styles.liveScoreRow}>
        <ThemedText type="small" style={{ color: '#d8b4fe' }}>Live prompt score</ThemedText>
        <ThemedText type="smallBold" style={{ color: scorePct >= 70 ? '#22c55e' : '#f59e0b' }}>
          {liveScore.total}/10
        </ThemedText>
      </View>
      <ProgressBar value={scorePct} style={styles.liveBar} />

      <Pressable
        style={[styles.button, { backgroundColor: '#9333ea' }]}
        onPress={handleCompare}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <ThemedText type="smallBold" style={styles.buttonText}>
            Compare with AI
          </ThemedText>
        )}
      </Pressable>

      {(weakResponse || strongResponse) ? (
        <View style={styles.compareRow}>
          <ThemedView type="backgroundSelected" style={[styles.responseCard, styles.weakCard]}>
            <ThemedText type="smallBold" style={styles.weakLabel}>
              ✗ Weak Prompt Response
            </ThemedText>
            <ThemedText type="small" style={styles.responseText}>
              {weakResponse}
            </ThemedText>
          </ThemedView>
          <ThemedView type="backgroundSelected" style={[styles.responseCard, styles.strongCard]}>
            <ThemedText type="smallBold" style={styles.strongLabel}>
              ✓ Strong Prompt Response
            </ThemedText>
            <ThemedText type="small" style={styles.responseText}>
              {strongResponse}
            </ThemedText>
          </ThemedView>
        </View>
      ) : null}

      {tip ? (
        <ThemedText type="small" style={[styles.tip, { color: '#d8b4fe' }]}>
          {tip}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    backgroundColor: 'rgba(30, 30, 40, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    shadowColor: '#9333ea',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  hint: {
    marginTop: Spacing.one,
    marginBottom: Spacing.three,
    lineHeight: 18,
  },
  sectionLabel: {
    marginBottom: Spacing.one,
  },
  input: {
    width: '100%',
    minHeight: 72,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    fontSize: 15,
    marginBottom: Spacing.three,
    textAlignVertical: 'top',
  },
  liveScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.one,
  },
  liveBar: {
    marginBottom: Spacing.three,
  },
  button: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  compareRow: {
    marginTop: Spacing.three,
    gap: Spacing.two,
    flexDirection: 'row',
  },
  responseCard: {
    flex: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    borderLeftWidth: 3,
    backgroundColor: 'rgba(30, 30, 40, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  weakCard: {
    borderLeftColor: '#ef4444',
  },
  strongCard: {
    borderLeftColor: '#22c55e',
  },
  weakLabel: {
    color: '#ef4444',
    marginBottom: Spacing.one,
  },
  strongLabel: {
    color: '#22c55e',
    marginBottom: Spacing.one,
  },
  responseText: {
    lineHeight: 20,
    color: '#d8b4fe',
  },
  tip: {
    marginTop: Spacing.two,
    lineHeight: 18,
    fontStyle: 'italic',
    color: '#d8b4fe',
  },
});
