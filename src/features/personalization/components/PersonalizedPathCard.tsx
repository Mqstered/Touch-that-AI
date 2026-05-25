import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { LearnerProfile } from '@/types/personalization';

type PersonalizedPathCardProps = {
  profile: LearnerProfile | null;
  insight: string | null;
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
};

const CRITERION_LABELS: Record<string, string> = {
  clarity: 'Clarity',
  context: 'Context',
  constraints: 'Constraints',
  outputFormat: 'Output format',
  safety: 'Safety',
};

export function PersonalizedPathCard({
  profile,
  insight,
  loading,
  refreshing,
  onRefresh,
}: PersonalizedPathCardProps) {
  if (loading && !profile) {
    return (
      <ThemedView type="backgroundElement" style={styles.container}>
        <ActivityIndicator size="small" />
        <ThemedText type="small" themeColor="textSecondary" style={styles.loadingText}>
          Building your learning path…
        </ThemedText>
      </ThemedView>
    );
  }

  if (!profile) return null;

  const weakLabel = profile.weakCriterion
    ? CRITERION_LABELS[profile.weakCriterion] ?? profile.weakCriterion
    : null;

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold" style={styles.heading}>
        Your personalized path
      </ThemedText>

      {insight ? (
        <ThemedText type="small" style={styles.insight}>
          {insight}
        </ThemedText>
      ) : null}

      <View style={styles.statsRow}>
        <StatChip label="Goal" value={profile.preferredGoal} />
        <StatChip label="Level" value={profile.suggestedLevel} />
        <StatChip
          label="Avg score"
          value={profile.totalAttempts > 0 ? `${profile.avgScore10}/10` : '—'}
        />
      </View>

      {(weakLabel || profile.weakSkill) ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.focusLine}>
          {weakLabel ? `Weakest area: ${weakLabel}` : ''}
          {weakLabel && profile.weakSkill ? ' · ' : ''}
          {profile.weakSkill ? `Skill focus: ${profile.weakSkill}` : ''}
        </ThemedText>
      ) : null}

      <PrimaryButton
        title={refreshing ? 'Updating path…' : 'Refresh my path'}
        onPress={onRefresh}
        disabled={refreshing}
        style={styles.refreshBtn}
      />
    </ThemedView>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.chip}>
      <ThemedText type="small">
        {label}
      </ThemedText>
      <ThemedText type="smallBold">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    marginBottom: Spacing.four,
    borderLeftWidth: 3,
    borderLeftColor: '#9333ea',
  },
  heading: {
    color: '#7e22ce',
    marginBottom: Spacing.two,
  },
  insight: {
    lineHeight: 20,
    marginBottom: Spacing.three,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(147,51,234,0.08)',
  },
  focusLine: {
    marginBottom: Spacing.two,
    lineHeight: 18,
  },
  refreshBtn: {
    marginTop: Spacing.two,
  },
  loadingText: {
    marginTop: Spacing.two,
  },
});
