import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
    LEARNING_GOALS,
    LEARNING_LEVELS,
    LEARNING_SKILLS,
    type LearningGoalKey,
} from '@/constants/learning-goals';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { findBestLesson } from '@/services/retrieval.service';
import type { LessonLevel, SkillType } from '@/types/database';

export function LessonFinder() {
  const router = useRouter();
  const theme = useTheme();
  const [goal, setGoal] = useState<LearningGoalKey>('study');
  const [level, setLevel] = useState<LessonLevel>('beginner');
  const [skill, setSkill] = useState<SkillType | 'any'>('any');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFind = async () => {
    setLoading(true);
    setError(null);
    const skillParam = skill === 'any' ? null : skill;
    const result = await findBestLesson(goal, level, skillParam);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (!result.data) {
      setError('No matching lesson found. Run migrations and embed_lessons.py first.');
      return;
    }

    const lesson = result.data;
    router.push({
      pathname: '/lesson/[moduleSlug]',
      params: { moduleSlug: lesson.moduleSlug, lessonId: lesson.id },
    });
  };

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold">Find a lesson</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
        Pick your goal — we retrieve the best matching lesson from the curriculum.
      </ThemedText>

      <ThemedText type="small" style={styles.label}>
        Goal
      </ThemedText>
      <View style={styles.chipRow}>
        {LEARNING_GOALS.map((g) => (
          <Chip
            key={g.key}
            label={g.label}
            selected={goal === g.key}
            onPress={() => setGoal(g.key)}
            theme={theme}
          />
        ))}
      </View>

      <ThemedText type="small" style={styles.label}>
        Level
      </ThemedText>
      <View style={styles.chipRow}>
        {LEARNING_LEVELS.map((l) => (
          <Chip
            key={l.key}
            label={l.label}
            selected={level === l.key}
            onPress={() => setLevel(l.key)}
            theme={theme}
          />
        ))}
      </View>

      <ThemedText type="small" style={styles.label}>
        Skill focus
      </ThemedText>
      <View style={styles.chipRow}>
        {LEARNING_SKILLS.map((s) => (
          <Chip
            key={s.key}
            label={s.label}
            selected={skill === s.key}
            onPress={() => setSkill(s.key)}
            theme={theme}
          />
        ))}
      </View>

      {error ? (
        <ThemedText type="small" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}

      <PrimaryButton
        title={loading ? 'Finding…' : 'Find lesson'}
        onPress={handleFind}
        disabled={loading}
        style={styles.button}
      />

      {loading ? (
        <ActivityIndicator size="small" style={styles.spinner} />
      ) : null}
    </ThemedView>
  );
}

function Chip({
  label,
  selected,
  onPress,
  theme,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? '#9333ea' : 'rgba(30, 30, 40, 0.8)',
          borderWidth: 1,
          borderColor: selected ? '#a855f7' : 'rgba(168, 85, 247, 0.3)',
        },
      ]}
    >
      <ThemedText
        type="small"
        style={{ color: selected ? '#ffffff' : '#d8b4fe' }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    marginBottom: Spacing.four,
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
    color: '#d8b4fe',
  },
  label: {
    marginBottom: Spacing.one,
    color: '#e9d5ff',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  button: {
    marginTop: Spacing.two,
  },
  spinner: {
    marginTop: Spacing.two,
  },
  error: {
    color: '#ef4444',
    marginTop: Spacing.two,
  },
});
