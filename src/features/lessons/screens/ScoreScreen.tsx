import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { PrimaryButton } from '@/components/primary-button';
import { ProgressBar } from '@/components/progress-bar';
import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { useUserProgress } from '@/features/progress/hooks/useUserProgress';

type Params = {
  lessonId: string;
  moduleSlug: string;
  lessonTitle?: string;
  total: string;
  clarity: string;
  context: string;
  constraints: string;
  outputFormat: string;
  safety: string;
  feedback: string;
};

const CRITERIA = [
  { key: 'clarity', label: 'Clarity' },
  { key: 'context', label: 'Context' },
  { key: 'constraints', label: 'Constraints' },
  { key: 'outputFormat', label: 'Output format' },
  { key: 'safety', label: 'Safety' },
] as const;

function scoreColor(score: number, max: number): string {
  const ratio = score / max;
  if (ratio >= 0.8) return '#22c55e';
  if (ratio >= 0.5) return '#f59e0b';
  return '#ef4444';
}

export default function ScoreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();
  const { refresh } = useUserProgress();

  const total = Number(params.total ?? 0);

  // Refresh progress data when screen comes into focus (after lesson completion)
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );
  const feedback: string[] = (() => {
    try { return JSON.parse(params.feedback ?? '[]') as string[]; }
    catch { return []; }
  })();

  const criteriaScores: Record<string, number> = {
    clarity: Number(params.clarity ?? 0),
    context: Number(params.context ?? 0),
    constraints: Number(params.constraints ?? 0),
    outputFormat: Number(params.outputFormat ?? 0),
    safety: Number(params.safety ?? 0),
  };

  const pct = Math.round((total / 10) * 100);

  const headline =
    total >= 9 ? 'Excellent prompt! 🎉' :
    total >= 7 ? 'Great work! 👍' :
    total >= 5 ? 'Good start. Keep refining.' :
    'Keep practising — you\'ll get there.';

  return (
    <AuthGuard>
      <ScreenShell>
        {/* Global back button */}
        <BackButton onPress={() => router.replace('/explore')} />
        
        {/* hero score */}
        <View style={styles.heroSection}>
          {params.lessonTitle ? (
            <ThemedText type="small" themeColor="textSecondary" style={styles.lessonLabel}>
              {params.lessonTitle}
            </ThemedText>
          ) : null}
          <ThemedText type="title" style={styles.scoreNumber}>
            {total}<ThemedText type="subtitle" style={styles.scoreMax}>/10</ThemedText>
          </ThemedText>
          <ThemedText type="subtitle" style={styles.headline}>
            {headline}
          </ThemedText>
          <ProgressBar value={pct} style={styles.heroBar} trackColor="rgba(255,255,255,0.7)" fillColor="#a855f7" />
        </View>

        {/* per-criterion breakdown */}
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold" style={styles.sectionLabel}>
            Score breakdown
          </ThemedText>
          {CRITERIA.map(({ key, label }) => {
            const s = criteriaScores[key] ?? 0;
            return (
              <View key={key} style={styles.criterionRow}>
                <ThemedText type="small" style={styles.criterionLabel}>
                  {label}
                </ThemedText>
                <View style={styles.criterionRight}>
                  <ThemedText
                    type="smallBold"
                    style={[styles.criterionScore, { color: scoreColor(s, 2) }]}
                  >
                    {s}/2
                  </ThemedText>
                  <ProgressBar value={(s / 2) * 100} style={styles.criterionBar} trackColor="rgba(255,255,255,0.7)" fillColor="#a855f7" />
                </View>
              </View>
            );
          })}
        </ThemedView>

        {/* feedback tips */}
        {feedback.length > 0 ? (
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold" style={styles.sectionLabel}>
              Feedback
            </ThemedText>
            {feedback.map((tip, i) => (
              <View key={i} style={styles.feedbackRow}>
                <ThemedText type="small" style={styles.bulletDot}>•</ThemedText>
                <ThemedText type="small" style={styles.feedbackText}>
                  {tip}
                </ThemedText>
              </View>
            ))}
          </ThemedView>
        ) : null}

        {/* actions */}
        <View style={styles.actions}>
          <PrimaryButton
            title="Try again"
            onPress={() => router.replace({
              pathname: '/lesson/practice',
              params: {
                lessonId: params.lessonId,
                moduleSlug: params.moduleSlug,
              },
            })}
            style={styles.secondaryBtn}
          />
          <PrimaryButton
            title="Back to explore"
            onPress={() => router.replace('/explore')}
            style={styles.primaryBtn}
          />
        </View>
      </ScreenShell>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.five,
    paddingTop: Spacing.three,
  },
  lessonLabel: {
    marginBottom: Spacing.two,
    textAlign: 'center',
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: '800',
    color: '#6b21a8',
    lineHeight: 80,
  },
  scoreMax: {
    fontSize: 28,
    color: '#a855f7',
  },
  headline: {
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
    color: '#7e22ce',
    textAlign: 'center',
  },
  heroBar: {
    width: '70%',
  },
  card: {
    width: '100%',
    borderRadius: Spacing.three,
    padding: Spacing.four,
    marginBottom: Spacing.three,
  },
  sectionLabel: {
    color: '#7e22ce',
    marginBottom: Spacing.three,
  },
  criterionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  criterionLabel: {
    width: 100,
  },
  criterionRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  criterionScore: {
    width: 28,
    textAlign: 'right',
  },
  criterionBar: {
    flex: 1,
  },
  feedbackRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.two,
    alignItems: 'flex-start',
  },
  bulletDot: {
    color: '#9333ea',
    lineHeight: 20,
  },
  feedbackText: {
    flex: 1,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
    width: '100%',
  },
  secondaryBtn: {
    flex: 1,
  },
  primaryBtn: {
    flex: 2,
  },
});
